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
  | { ok: true; receiptId: string; commit: () => void }
  | { ok: false; challenge: Record<string, unknown> };

/**
 * Demand a verifiable EMILIA authorization receipt before an irreversible action.
 *
 * On success, returns the receipt id PLUS a `commit()` callback. The receipt is
 * NOT marked consumed until the caller invokes `commit()` — which the caller MUST
 * do only AFTER the irreversible action has actually succeeded. If the action
 * throws, `commit()` is never called and the approval stays retryable (it was
 * never spent on a delete that didn't happen). Replay protection is enforced at
 * verify time (not-already-consumed check below), so a receipt can never drive
 * two deletes even before commit.
 *
 * On failure, returns a machine-readable Receipt Required challenge (HTTP 428
 * shape) the agent can act on — the MCP tool-result equivalent of answering 428.
 * Rejection detail is sanitized to a minimal `{ rejected: { reason } }` shape so
 * no signer, subject, or library internals leak to the caller. This is portable
 * accountability evidence the service keeps for its own liability; it is not auth
 * or permissions.
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
        // Sanitized: never echo the full verified object (signer/subject/detail).
        rejected: { reason: verified.reason ?? 'receipt_invalid' }
      }
    };
  }

  if (consumedReceiptIds.has(verified.receipt_id)) {
    return {
      ok: false,
      challenge: {
        ...receiptChallenge(action, 'Receipt already consumed (replay refused).', challengeOpts),
        rejected: { reason: 'receipt_replayed' }
      }
    };
  }

  const receiptId = verified.receipt_id;
  return {
    ok: true,
    receiptId,
    // Consume-after-success: the caller commits ONLY after the irreversible
    // action succeeds. Idempotent — a double-commit is a no-op.
    commit: () => {
      consumedReceiptIds.add(receiptId);
    }
  };
}
