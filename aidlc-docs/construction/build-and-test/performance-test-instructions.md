# Performance Test Instructions

## Applicability: N/A

Performance testing (load/stress/throughput/response-time under concurrent load) is not applicable to this project and was not executed.

**Rationale**:
- This project is a client-side UI component library (React components + a static HTML mirror), not a service with request/response latency, throughput, or concurrent-user characteristics.
- No performance-related NFRs were raised during Requirements Analysis or any per-unit NFR Requirements stage (all units after Unit 1 explicitly skipped NFR Requirements/Design with justification "tech stack already established, no new NFR concerns" — see `aidlc-docs/aidlc-state.md`'s Stage Progress).
- The Resiliency Baseline and Security Baseline extensions were both declined by the user at Requirements Analysis (`aidlc-docs/aidlc-state.md`'s Extension Configuration), and no separate performance-budget extension exists in this project's rule set.
- The `Table` component's external/server-side pagination design (Unit 6 — the user explicitly chose this over internal pagination specifically "大量データにも対応させたいので", to support large datasets) is the one place large-N behavior was a design concern, and it was addressed structurally (the component only ever receives one page of data at a time; the caller owns fetching/paging the full dataset) rather than through a load-testing NFR.

If a consuming application later wants to load-test its own usage of this library (e.g. large-`Table` render performance, many concurrent `Toast`s), that would be a performance test of the *consuming app*, not of this component library, and is out of scope here.
