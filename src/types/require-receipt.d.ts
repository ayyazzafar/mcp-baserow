// Minimal local type declarations for @emilia-protocol/require-receipt (^0.4.0).
// The published package ships no .d.ts, so we declare only the surface we use:
// the canonical hardened gate. See: https://www.emiliaprotocol.ai/agent-guard

declare module '@emilia-protocol/require-receipt' {
  /** Options for the canonical hardened gate (makeReceiptGate). */
  export interface ReceiptGateOptions {
    /** base action_type, or a fn deriving the fully-bound action from the target */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: string | ((target: any) => string);
    /** base64url SPKI-DER issuer keys you trust (recommended in production) */
    trustedKeys?: string[];
    /** also accept the receipt's own inline key (proves integrity, NOT trust) */
    allowInlineKey?: boolean;
    maxAgeSec?: number;
    allowedOutcomes?: string[];
    statusCode?: number;
    manifestUrl?: string;
    assuranceClass?: string;
    /** consumed-receipt store; defaults to in-memory (process-local) */
    store?: { has: (id: string) => boolean; add: (id: string) => void };
  }

  /** The resource the receipt must be bound to. */
  export interface GateContext {
    target?: unknown;
  }

  /** Verify+reserve result from gate.check (ok), else a Receipt Required 428 body. */
  export type CheckResult =
    | { ok: true; receiptId: string; outcome?: string; signer?: string; subject?: string; boundAction: string }
    | { ok: false; status: number; body: Record<string, unknown> };

  /** Result of gate.run: ok carries the fn result; rejection carries the 428 body. */
  export type RunResult<T = unknown> =
    | { ok: true; receiptId: string; outcome?: string; signer?: string; result: T }
    | { ok: false; status: number; body: Record<string, unknown> };

  /** The hardened Receipt-Required gate returned by makeReceiptGate. */
  export interface ReceiptGate {
    check(receipt: unknown, ctx?: GateContext): CheckResult;
    commit(receiptId: string): void;
    release(receiptId: string): void;
    run<T = unknown>(receipt: unknown, ctx: GateContext, fn: () => Promise<T> | T): Promise<RunResult<T>>;
    run<T = unknown>(receipt: unknown, fn: () => Promise<T> | T): Promise<RunResult<T>>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    boundActionFor(target: any): string;
  }

  export function makeReceiptGate(opts: ReceiptGateOptions): ReceiptGate;
}
