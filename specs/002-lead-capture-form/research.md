# Research: Account Lead Capture Form

## Decision 1: Use imperative Apex call for Lead creation

- **Decision**: Submit form data from the LWC to a dedicated Apex controller method that creates the Lead and returns the created Lead name/id.
- **Rationale**: Centralizes object create behavior, permission-aware error handling, and account-link assignment in one server boundary while keeping the LWC focused on UX and validation.
- **Alternatives considered**:
  - `lightning-record-edit-form`: rejected because the flow needs custom prefilled behavior and explicit cross-field mapping to custom fields with tailored toast outcomes.
  - UI API createRecord direct from LWC: rejected to keep custom error shaping and account-link logic centralized for maintainability.

## Decision 2: Validate in both client and server layers

- **Decision**: Enforce required fields, email format, and notes max length in LWC before submit, and repeat critical validation in Apex before DML.
- **Rationale**: Client validation improves UX speed; server validation protects data integrity and prevents bypass through altered clients.
- **Alternatives considered**:
  - Client-only validation: rejected because it is not sufficient for trusted data integrity.
  - Server-only validation: rejected due to weaker immediate UX feedback.

## Decision 3: Deploy in dependency-safe order

- **Decision**: Deploy custom fields first, then Apex class/tests, then permission set and flexipage updates (or deploy all metadata together with validation and targeted retries).
- **Rationale**: Prevents compilation and reference failures when downstream metadata references not-yet-deployed elements.
- **Alternatives considered**:
  - Single-shot deployment with no staged fallback: rejected because failures are harder to isolate in early iterations.

## Decision 4: Standardize success and error toasts

- **Decision**: On success show a toast with created Lead name and reset inputs; on error show a toast with actionable reason while preserving user input.
- **Rationale**: Matches user-story acceptance and improves correction speed after failures.
- **Alternatives considered**:
  - Inline-only status message: rejected because toast provides immediate platform-consistent feedback.

## Decision 5: Test strategy includes behavioral and metadata validation

- **Decision**: Use Apex tests for server create logic and permission-sensitive paths, plus LWC Jest tests for form validation and toast/reset behavior.
- **Rationale**: Covers both business logic and UX contract while aligning with constitution test-first quality gates.
- **Alternatives considered**:
  - Apex tests only: rejected because UI behavior would be under-tested.
  - Jest only: rejected because DML and Salesforce server behavior require org-side test coverage.
