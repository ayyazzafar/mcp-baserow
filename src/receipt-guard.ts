import type { ReceiptGate, RunResult } from '@emilia-protocol/require-receipt';

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

// All the hardening (per-target binding, verify, replay refusal, consume-after-
// success, sanitized {reason} rejections) now lives in the canonical
// makeReceiptGate. This file just builds one gate per irreversible action — each
// `action` is a function so the EXACT bound action string is derived here — and
// caches it across the async module load. NOTE: allowInlineKey accepts the
// receipt's own key (proves integrity, not trust); in production pin trustedKeys
// to the issuers you trust and drop allowInlineKey.
const gates = new Map<string, Promise<ReceiptGate>>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getGate(key: string, action: (target: any) => string): Promise<ReceiptGate> {
  let gate = gates.get(key);
  if (!gate) {
    gate = loadModule().then(({ makeReceiptGate }) =>
      makeReceiptGate({ action, allowInlineKey: true, maxAgeSec: 900 })
    );
    gates.set(key, gate);
  }
  return gate;
}

/**
 * Demand a verifiable EMILIA authorization receipt for a single-row delete,
 * bound to THIS exact table + row: a receipt approving `baserow.row.delete:5:11`
 * cannot delete row 99. gate.run verifies+reserves, runs `fn`, then consumes the
 * receipt only AFTER it succeeds — if `fn` throws the approval is released (stays
 * retryable) and the error propagates. Replay is refused; a verification failure
 * returns a sanitized Receipt Required challenge ({ rejected: { reason } }).
 */
export async function runDeleteRowGuarded(
  tableId: number | string,
  rowId: number | string,
  receipt: unknown,
  fn: () => Promise<void>
): Promise<RunResult> {
  const gate = await getGate(
    'delete_row',
    (t: { tableId: unknown; rowId: unknown }) => `baserow.row.delete:${t.tableId}:${t.rowId}`
  );
  return gate.run(receipt, { target: { tableId, rowId } }, fn);
}

/**
 * Same semantics for a batch-row delete, bound to THIS exact table + set of rows.
 * row ids are sorted numerically so the binding is order-independent: a receipt
 * approving {3,5,9} authorizes exactly {3,5,9}, never a different set.
 */
export async function runBatchDeleteRowsGuarded(
  tableId: number | string,
  rowIds: ReadonlyArray<number | string>,
  receipt: unknown,
  fn: () => Promise<void>
): Promise<RunResult> {
  const gate = await getGate('batch_delete_rows', (t: {
    tableId: unknown;
    rowIds: ReadonlyArray<number | string>;
  }) => {
    const sorted = [...t.rowIds].map(Number).sort((a, b) => a - b);
    return `baserow.rows.batch_delete:${t.tableId}:${sorted.join(',')}`;
  });
  return gate.run(receipt, { target: { tableId, rowIds } }, fn);
}
