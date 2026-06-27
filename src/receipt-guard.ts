import type {
  VerifyResult,
  ChallengeOptions
} from '@emilia-protocol/require-receipt';

// @emilia-protocol/require-receipt is ESM-only while this server compiles to
// CommonJS, so load it via a real dynamic import() that tsc won't downlevel to
// require(). Cache the module after the first load.
type RequireReceiptModule = typeof import('@emilia-protocol/require-receipt');
const dynamicImport = new Function(
  'specifier',
  'return import(specifier)'
) as (specifier: string) => Promise<RequireReceiptModule>;

let modulePromise: Promise<RequireReceiptModule> | undefined;
function loadModule(): Promise<RequireReceiptModule> {
  if (!modulePromise) {
    modulePromise = dynamicImport('@emilia-protocol/require-receipt');
  }
  return modulePromise;
}

// One-time consumption: receipt_ids consumed by this process cannot be replayed.
const consumedReceiptIds = new Set<string>();

export type GuardResult =
  | { ok: true; receiptId: string }
  | { ok: false; challenge: Record<string, unknown> };

/**
 * Demand a verifiable EMILIA authorization receipt before an irreversible action.
 *
 * Returns the receipt id to record on success, or a machine-readable
 * Receipt Required challenge (HTTP 428 shape) the agent can act on — the MCP
 * tool-result equivalent of answering 428. This is portable accountability
 * evidence the service keeps for its own liability; it is not auth or permissions.
 */
export async function guardReceipt(
  action: string,
  receipt: unknown
): Promise<GuardResult> {
  const { verifyEmiliaReceipt, receiptChallenge, RECEIPT_REQUIRED_STATUS } =
    await loadModule();

  const challengeOpts: ChallengeOptions = {
    status: RECEIPT_REQUIRED_STATUS,
    maxAgeSec: 900
  };

  if (!receipt) {
    return {
      ok: false,
      challenge: receiptChallenge(action, 'No EMILIA receipt presented.', challengeOpts)
    };
  }

  // NOTE: allowInlineKey accepts the receipt's own key (proves integrity, not
  // trust). In production, pin trustedKeys to the issuers you trust and drop
  // allowInlineKey.
  const verified: VerifyResult = verifyEmiliaReceipt(receipt, {
    allowInlineKey: true,
    action,
    maxAgeSec: 900
  });

  if (!verified.ok || !verified.receipt_id) {
    return {
      ok: false,
      challenge: {
        ...receiptChallenge(action, `Receipt rejected: ${verified.reason}.`, challengeOpts),
        rejected: verified
      }
    };
  }

  if (consumedReceiptIds.has(verified.receipt_id)) {
    return {
      ok: false,
      challenge: {
        ...receiptChallenge(action, 'Receipt already consumed (replay refused).', challengeOpts),
        rejected: { ok: false, reason: 'receipt_replayed' }
      }
    };
  }

  consumedReceiptIds.add(verified.receipt_id);
  return { ok: true, receiptId: verified.receipt_id };
}
