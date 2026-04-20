# Contract: leadCaptureForm

## 1) UI Contract

### Placement
- The component is available on Account Lightning Record pages.
- The component requires Account record context (record id).

### Input Fields
- First Name: optional text
- Last Name: required text
- Email: required email format
- Phone: optional phone
- Company: required text; defaults to current Account name
- Lead Source: required single-select with values:
  - Web
  - Phone Inquiry
  - Partner Referral
  - Other
- Notes: optional text area; max 500 characters

### Submission Behavior
- Submit is blocked until required-field and input-format validation passes.
- On success:
  - show success toast containing created Lead name;
  - clear form back to initial state (including company default from account context).
- On error:
  - show error toast containing failure reason;
  - keep user-entered values for correction and retry.

## 2) Service Contract (LWC -> Apex)

### Operation
- Create lead from validated form payload in account context.

### Request Shape
- accountId: string (required)
- firstName: string | null
- lastName: string (required)
- email: string (required)
- phone: string | null
- company: string (required)
- leadSource: string (required; constrained to allowed values)
- notes: string | null (max 500)

### Response Shape (Success)
- leadId: string
- leadName: string

### Response Shape (Failure)
- errorCode: string
- message: string

## 3) Metadata Contract

### Lead Object Extensions
- `Source_Account__c`: Lookup(Account)
- `Capture_Notes__c`: Long Text Area(500)

### Permission Set
- Name: `Lead_Capture_Access`
- Must include:
  - Lead object Read/Create
  - field-level permissions for `Source_Account__c` and `Capture_Notes__c`
  - access to Lead capture Apex controller class

## 4) Validation Contract

- Required fields must fail fast in UI before any create request.
- Server-side validation must reject malformed or missing required data even if client-side checks are bypassed.
- Notes length greater than 500 must never be persisted.

## 5) Testability Contract

- LWC unit tests cover:
  - required-field validation;
  - email validation;
  - notes length validation;
  - success toast + reset;
  - error toast + no reset.
- Apex tests cover:
  - successful lead create with account linkage;
  - failed create path with surfaced reason;
  - mapping of notes and custom fields.
