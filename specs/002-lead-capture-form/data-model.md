# Data Model: Account Lead Capture Form

## Entity: Lead (Existing Standard Object, Extended)

### Purpose
Stores prospect details captured from the Account record page flow.

### Field Mapping for Capture Flow

- `FirstName` (Text): optional input
- `LastName` (Text): required input
- `Email` (Email): required input, email format validated
- `Phone` (Phone): optional input
- `Company` (Text): required input, default from Account name
- `LeadSource` (Picklist): required input; allowed values in this flow:
  - `Web`
  - `Phone Inquiry`
  - `Partner Referral`
  - `Other`
- `Capture_Notes__c` (Long Text Area, 500): optional input from Notes field
- `Source_Account__c` (Lookup to Account): required by flow context; links created Lead to source Account

### Validation Rules in Flow

- `LastName`, `Email`, `Company`, and `LeadSource` must be populated before submit.
- `Email` must conform to valid email format.
- `Capture_Notes__c` content must be 500 characters or fewer.
- `Source_Account__c` must be populated from Account page context when lead is created.

## Entity: Account (Existing Standard Object, Reference Context)

### Purpose
Acts as parent context for the capture action.

### Usage in Flow

- Provides record id for Source Account linkage.
- Provides account name to prefill Company field in the form.

## Entity: Lead_Capture_Access (Permission Set)

### Purpose
Defines minimum permissions required to use capture workflow.

### Required Access Shape

- Object permissions on Lead: Read + Create
- Field-level access for:
  - `Lead.Source_Account__c`
  - `Lead.Capture_Notes__c`
- Apex class access: Lead capture controller class

## State Transitions

1. **Draft Input**: user edits form values on account page.
2. **Validated Input**: required fields and format constraints pass.
3. **Submit Requested**: form invokes server create operation.
4. **Created**: lead record is committed and success feedback shown.
5. **Failed**: create attempt fails and error feedback shown while user inputs remain available.
