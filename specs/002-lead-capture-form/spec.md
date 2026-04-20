# Feature Specification: Account Lead Capture Form

**Feature Branch**: `002-lead-capture-form`  
**Created**: 2026-04-20  
**Status**: Draft  
**Input**: User description: "Build a Lightning Web Component that captures lead information directly from an Account record page... (leadCaptureForm requirements)"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Capture Lead From Account Page (Priority: P1)

As a sales user viewing an account, I can submit lead details from an embedded capture form so I can create a related lead without leaving the account context.

**Why this priority**: Core business value is rapid lead capture during account work; without this story the feature has no value.

**Independent Test**: Open an account record page with the component, enter valid required details, submit, and verify a lead is created and linked to the same account.

**Acceptance Scenarios**:

1. **Given** I am on an account record page with access to the capture form, **When** I provide required lead details and submit, **Then** a new lead record is created and associated with that account through Source Account.
2. **Given** the account has a name, **When** the form loads, **Then** company is automatically prefilled with the account name and is included in the created lead unless changed before submit.

---

### User Story 2 - Validate Data Before Submission (Priority: P2)

As a sales user, I receive immediate validation feedback for incomplete or invalid input so I can correct issues before submission.

**Why this priority**: Preventing invalid submissions reduces failed attempts and improves data quality.

**Independent Test**: Attempt to submit missing required fields, invalid email values, and notes exceeding limit; verify submission is blocked and clear validation feedback is shown.

**Acceptance Scenarios**:

1. **Given** required fields are missing, **When** I attempt to submit, **Then** the form prevents submission and highlights missing required fields.
2. **Given** email format is invalid, **When** I attempt to submit, **Then** the form prevents submission and displays email validation feedback.
3. **Given** notes exceed 500 characters, **When** I attempt to submit, **Then** the form prevents submission and prompts correction.

---

### User Story 3 - Clear Outcome Messaging (Priority: P3)

As a sales user, I receive clear success or error notifications after submission so I immediately know whether the lead was created.

**Why this priority**: Explicit outcomes reduce uncertainty and speed follow-up actions.

**Independent Test**: Trigger one successful submission and one forced error path; verify success and error notifications display expected information.

**Acceptance Scenarios**:

1. **Given** submission succeeds, **When** the lead is created, **Then** I see a success toast containing the new lead name and the form resets.
2. **Given** submission fails, **When** the backend returns an error, **Then** I see an error toast with the failure reason and entered data remains available for correction.

---

### Edge Cases

- What happens when the account record has no name value available at form initialization?
- How does the form behave if the user lacks permission to create leads or write required fields?
- What happens when network or server failures occur after client-side validation passes?
- How does submission behave when concurrent updates modify account data during capture?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a lead capture form component (`leadCaptureForm`) on the Account record page.
- **FR-002**: The form MUST collect first name (optional), last name (required), email (required), phone (optional), company (required), lead source (required), and notes (optional, max 500 characters).
- **FR-003**: The company field MUST be auto-populated from the current account name when the component is loaded on an account record.
- **FR-004**: The lead source field MUST only allow the values Web, Phone Inquiry, Partner Referral, and Other.
- **FR-005**: The form MUST validate required fields, email format, and notes length before allowing submission.
- **FR-006**: On valid submission, the system MUST create a new lead record using entered values and set Source Account to the parent account context.
- **FR-007**: The system MUST store notes input in the Capture Notes field on the created lead.
- **FR-008**: On successful creation, the system MUST display a success message including the created lead name and clear the form.
- **FR-009**: On failed creation, the system MUST display an error message including the failure reason and preserve user-entered values.
- **FR-010**: The data model MUST include a lead field for Source Account that links each captured lead to an account.
- **FR-011**: The data model MUST include a lead field for Capture Notes with a maximum length of 500 characters.
- **FR-012**: The system MUST provide a permission set named Lead_Capture_Access with create/read lead permissions, field access to Source Account and Capture Notes, and execution access required for the server-side create operation.

### Key Entities *(include if feature involves data)*

- **Lead Capture Submission**: The set of user-provided field values entered in the account-page form.
- **Account Context**: The currently viewed account used to prefill company and to link Source Account on the created lead.
- **Lead Record**: The resulting lead created from submission values, including source account and capture notes.
- **Lead Capture Access Permission**: The access package that controls user rights for lead creation and required field/server execution permissions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95% or more of valid capture attempts result in a successfully created lead on first submit.
- **SC-002**: 100% of submissions missing required fields or containing invalid email/oversized notes are blocked before create action.
- **SC-003**: 100% of successful submissions display a success message with created lead name and clear form state.
- **SC-004**: 100% of failed submissions display an error message that helps users understand why creation failed.
- **SC-005**: 100% of leads created through the form include a source account link and preserve notes within the defined length constraint.

## Assumptions

- The component is intended for users operating on the Lightning Account record experience.
- Users assigned Lead_Capture_Access are the primary audience for lead capture.
- Existing organization settings allow lead creation for authorized users.
- The feature scope includes one form component flow and required metadata/security updates only.
