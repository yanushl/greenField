# Tasks: Account Lead Capture Form

**Input**: Design documents from `/specs/002-lead-capture-form/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Includes Apex and LWC Jest tests per constitution and plan quality gates.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Each task includes an exact file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare local project dependencies and baseline metadata structure for feature work.

- [x] T001 Install and verify Node/SFDX project dependencies in `package.json` using `npm install`
- [x] T002 Verify Salesforce org authentication and target org access via `.sf/` project config
- [x] T003 [P] Confirm Jest/LWC test tooling configuration in `jest.config.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Deliver metadata and service foundations required by all user stories.

**⚠️ CRITICAL**: No user story work starts until this phase is complete.

- [x] T004 Create Lead custom field metadata `Source_Account__c` in `force-app/main/default/objects/Lead/fields/Source_Account__c.field-meta.xml`
- [x] T005 Create Lead custom field metadata `Capture_Notes__c` in `force-app/main/default/objects/Lead/fields/Capture_Notes__c.field-meta.xml`
- [x] T006 Create permission set metadata `Lead_Capture_Access` in `force-app/main/default/permissionsets/Lead_Capture_Access.permissionset-meta.xml`
- [x] T007 [P] Create Apex controller skeleton in `force-app/main/default/classes/LeadCaptureController.cls`
- [x] T008 [P] Create Apex test class skeleton in `force-app/main/default/classes/LeadCaptureControllerTest.cls`
- [x] T009 Create LWC scaffold files in `force-app/main/default/lwc/leadCaptureForm/`
- [x] T010 Configure component metadata exposure for Account Record Page in `force-app/main/default/lwc/leadCaptureForm/leadCaptureForm.js-meta.xml`

**Checkpoint**: Foundation ready - user story implementation can begin.

---

## Phase 3: User Story 1 - Capture Lead From Account Page (Priority: P1) 🎯 MVP

**Goal**: Allow users to create a lead from Account context with company default and source-account linkage.

**Independent Test**: From an Account record page, submit valid input and verify Lead creation with `Source_Account__c` populated.

### Tests for User Story 1

- [x] T011 [P] [US1] Add Apex success-path test for lead creation and account linkage in `force-app/main/default/classes/LeadCaptureControllerTest.cls`
- [x] T012 [P] [US1] Add LWC Jest test for company defaulting from account context in `force-app/main/default/lwc/leadCaptureForm/__tests__/leadCaptureForm.test.js`

### Implementation for User Story 1

- [x] T013 [US1] Implement Apex create method and DTO contract in `force-app/main/default/classes/LeadCaptureController.cls`
- [x] T014 [US1] Implement LWC form state and account-context initialization in `force-app/main/default/lwc/leadCaptureForm/leadCaptureForm.js`
- [x] T015 [US1] Implement form UI fields and submit action in `force-app/main/default/lwc/leadCaptureForm/leadCaptureForm.html`
- [x] T016 [US1] Wire imperative Apex call and payload mapping in `force-app/main/default/lwc/leadCaptureForm/leadCaptureForm.js`
- [x] T017 [US1] Add success toast and reset-to-default behavior in `force-app/main/default/lwc/leadCaptureForm/leadCaptureForm.js`

**Checkpoint**: User Story 1 is functional and independently testable.

---

## Phase 4: User Story 2 - Validate Data Before Submission (Priority: P2)

**Goal**: Prevent invalid submissions with clear client and server validation.

**Independent Test**: Attempt missing required fields, bad email, and over-limit notes; verify submission is blocked and reasons shown.

### Tests for User Story 2

- [x] T018 [P] [US2] Add Apex negative-path validation tests in `force-app/main/default/classes/LeadCaptureControllerTest.cls`
- [x] T019 [P] [US2] Add Jest tests for required fields, email format, and notes length in `force-app/main/default/lwc/leadCaptureForm/__tests__/leadCaptureForm.test.js`

### Implementation for User Story 2

- [x] T020 [US2] Add client-side required/format/length validation handlers in `force-app/main/default/lwc/leadCaptureForm/leadCaptureForm.js`
- [x] T021 [US2] Add server-side defensive validation and error shaping in `force-app/main/default/classes/LeadCaptureController.cls`
- [x] T022 [US2] Constrain Lead Source option set in UI to contract values in `force-app/main/default/lwc/leadCaptureForm/leadCaptureForm.html`

**Checkpoint**: User Story 2 is independently testable and stable with US1.

---

## Phase 5: User Story 3 - Clear Outcome Messaging (Priority: P3)

**Goal**: Provide deterministic success/error feedback and correction-friendly behavior.

**Independent Test**: Run one successful and one failed submission; verify success toast/reset and error toast/value preservation.

### Tests for User Story 3

- [x] T023 [P] [US3] Add Jest tests for success toast/reset and error toast/no-reset in `force-app/main/default/lwc/leadCaptureForm/__tests__/leadCaptureForm.test.js`
- [x] T024 [P] [US3] Add Apex error propagation test for user-visible failure reason in `force-app/main/default/classes/LeadCaptureControllerTest.cls`

### Implementation for User Story 3

- [x] T025 [US3] Implement standardized toast message builder for success/error outcomes in `force-app/main/default/lwc/leadCaptureForm/leadCaptureForm.js`
- [x] T026 [US3] Ensure error-path preserves user-entered form state in `force-app/main/default/lwc/leadCaptureForm/leadCaptureForm.js`
- [x] T027 [US3] Finalize controller exception handling for actionable messages in `force-app/main/default/classes/LeadCaptureController.cls`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Deploy integration, placement, and full verification across stories.

- [x] T028 Update Account record page metadata to include `leadCaptureForm` in `force-app/main/default/flexipages/Account_Record_Page.flexipage-meta.xml`
- [x] T029 [P] Run LWC lint and Jest suites from `package.json` scripts and fix issues in `force-app/main/default/lwc/leadCaptureForm/`
- [x] T030 Run Apex tests and validate deployment package for modified metadata under `force-app/main/default/`
- [x] T031 Execute end-to-end verification from `specs/002-lead-capture-form/quickstart.md` and record outcomes in `specs/002-lead-capture-form/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: starts immediately.
- **Phase 2 (Foundational)**: depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: depends on Phase 2 completion.
- **Phase 4 (US2)**: depends on Phase 2; can start after US1 foundation artifacts exist.
- **Phase 5 (US3)**: depends on Phases 3 and 4 behavior contracts.
- **Phase 6 (Polish)**: depends on completion of all user story phases.

### User Story Dependencies

- **US1 (P1)**: no dependency on other stories after foundation.
- **US2 (P2)**: builds on US1 component/controller structure but remains independently testable.
- **US3 (P3)**: depends on US1/US2 submit and validation flows for outcome messaging paths.

### Within Each User Story

- Tests are authored before implementation updates and validated during the same phase.
- LWC UI/state changes precede integration wiring.
- Server validation/error shaping completes before end-to-end verification.

### Parallel Opportunities

- T003 can run in parallel with T001/T002.
- T007 and T008 can run in parallel.
- Test tasks T011/T012, T018/T019, and T023/T024 can run in parallel per story.
- T029 can run in parallel with final metadata readiness checks before T031.

---

## Parallel Example: User Story 1

```bash
Task: "T011 [US1] Add Apex success-path test in force-app/main/default/classes/LeadCaptureControllerTest.cls"
Task: "T012 [US1] Add Jest default-company test in force-app/main/default/lwc/leadCaptureForm/__tests__/leadCaptureForm.test.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phases 1 and 2.
2. Deliver Phase 3 (US1) fully.
3. Validate independent US1 test criteria.
4. Demo/deploy MVP capture flow.

### Incremental Delivery

1. Add US2 validation hardening and retest.
2. Add US3 messaging/resilience behavior and retest.
3. Finish Phase 6 deployment and quickstart verification.

### Parallel Team Strategy

1. One stream handles Apex tasks while another handles LWC tasks during foundational and test creation phases.
2. Coordinate integration tasks (T016, T021, T027) after parallel work completes.

---

## Notes

- `[P]` tasks are isolated by file boundaries where possible.
- `[US#]` labels map directly to user stories in `spec.md`.
- Each story includes independent test criteria and verification path.
