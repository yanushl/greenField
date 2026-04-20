# GreenField Constitution

## Core Principles

### I. Code Quality Is Enforced
All production changes MUST be readable, modular, and maintainable. Each change MUST:
- follow established project linting/formatting rules with zero new warnings in changed files;
- avoid dead code, commented-out logic, and unnecessary abstractions;
- include clear naming and narrow function/component responsibilities;
- prefer explicit error handling over silent failure.

### II. Test-First Delivery Standard
Every behavior change MUST be backed by tests created before or alongside implementation. At minimum:
- unit tests cover happy path, validation failures, and edge cases;
- integration tests are required when data contracts, metadata, or cross-component flows change;
- bug fixes include a regression test that fails before the fix and passes after;
- pull requests are not merge-ready unless all required tests pass in CI.

### III. User Experience Consistency
User-facing behavior MUST remain consistent across LWC components and flows. Each feature MUST:
- use shared design tokens/styles and consistent interaction patterns;
- provide clear loading, success, and error states;
- preserve accessibility baselines (keyboard access, labels, semantic markup, focus management);
- keep labels and messaging concise, unambiguous, and action-oriented.

### IV. Performance Is a Requirement
Performance is a functional requirement, not a later optimization. Implementations MUST:
- minimize unnecessary rerenders, data fetches, and synchronous blocking work;
- lazy-load or defer non-critical resources where feasible;
- set measurable acceptance targets for new critical flows (e.g., render and interaction responsiveness);
- include performance checks in review when logic, rendering, or data volume changes.

### V. Small, Reviewable, Reversible Changes
Delivery MUST be incremental. Work is split into small commits/PRs with a clear rollback path. Each change SHOULD:
- be focused on one outcome;
- document assumptions and risks in the PR description;
- avoid mixing refactors with unrelated feature work unless explicitly justified.

## Engineering Standards

- **Branching**: `main` is the stable integration branch. All work is done in feature branches and merged via pull request.
- **Definition of Done**: Code, tests, and related metadata updates are complete; CI passes; reviewer feedback is resolved; documentation is updated when behavior changes.
- **Security and Data Safety**: Never commit secrets. Validate and sanitize all external/user-provided input.
- **LWC-Specific Discipline**: Keep component API contracts explicit (`@api`), isolate business logic from presentation when practical, and favor reusable utilities over duplicated logic.

## Delivery Workflow and Quality Gates

1. Create/refresh a feature branch from `main`.
2. Define acceptance criteria including testing and performance expectations.
3. Implement in small increments with local validation.
4. Run linting and test suites before requesting review.
5. Complete PR review with explicit checks against this constitution.
6. Merge only when all required checks pass.

## Governance

This constitution overrides conflicting local conventions for planning, implementation, and review.

Amendments require:
1. A documented rationale and impact statement.
2. Approval from project maintainers.
3. Any required migration tasks tracked in the relevant spec or backlog.

Compliance is verified in every pull request review. Exceptions must be explicitly documented and approved before merge.

**Version**: 1.0.0 | **Ratified**: 2026-04-20 | **Last Amended**: 2026-04-20
