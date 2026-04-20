# Quickstart: Agent-Only Delivery

This runbook is intentionally agent-centric: the user issues instructions, the agent performs all code, metadata, deployment, and testing actions.

## Preconditions

- Active branch: `002-lead-capture-form`
- Salesforce CLI authenticated to target org
- Project dependencies installed (`npm install` where needed)

## Step 1: Generate Metadata and Source via Agent

Instruct the agent to create:

- Lead custom field metadata:
  - `Source_Account__c` (Lookup Account)
  - `Capture_Notes__c` (Long Text Area 500)
- Permission set metadata:
  - `Lead_Capture_Access`
- Apex controller + Apex tests
- LWC `leadCaptureForm` + Jest tests
- Account FlexiPage update to place component

## Step 2: Local Validation via Agent

Have the agent run:

- LWC linting (`npm run lint`)
- LWC Jest tests (`npm run test:unit`)
- Apex test execution in org (targeted and/or run-local-tests)

Expected result:

- All tests pass
- No new lint errors in changed files

## Step 3: Deployment via Agent

Have the agent deploy metadata through Salesforce CLI.

Expected result:

- Custom fields, permission set, Apex, LWC, and flexipage deploy successfully
- Deployment output logged and summarized by agent

## Step 4: Post-Deploy Verification via Agent

Have the agent verify:

- component visible on Account record page
- company defaults from Account name
- required validation blocks invalid submits
- success toast includes new Lead name and form clears
- error toast displays failure reason and preserves input
- created lead has `Source_Account__c` and `Capture_Notes__c` populated correctly

## Step 5: Correction Loop

If any check fails, instruct the agent to:

1. identify root cause,
2. modify metadata/code/tests,
3. re-run validation and deployment,
4. report final pass status.

No manual edits or manual deployment steps are performed in this process.

## Execution Notes

- 2026-04-20: `npm run lint` completed successfully.
- 2026-04-20: `npm run test:unit` completed successfully (3/3 tests passed).
- 2026-04-20: Deployed core metadata (objects, permissionset, Apex, LWC) successfully via `sf project deploy start`.
- 2026-04-20: Deployed `Account_Record_Page.flexipage-meta.xml` successfully.
- 2026-04-20: `sf apex run test --class-names LeadCaptureControllerTest` passed (4/4 tests).
