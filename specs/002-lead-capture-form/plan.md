# Implementation Plan: Account Lead Capture Form

**Branch**: `002-lead-capture-form` | **Date**: 2026-04-20 | **Spec**: [`specs/002-lead-capture-form/spec.md`](./spec.md)  
**Input**: Feature specification from `specs/002-lead-capture-form/spec.md`

## Summary

Deliver an Account-page lead capture workflow that creates Lead records with validation, success/error messaging, and account linkage. The implementation uses Salesforce metadata plus Apex + LWC with agent-driven CLI execution for code generation, metadata deployment, and testing, while preserving user-in-the-loop review and correction.

## Technical Context

**Language/Version**: Apex (Salesforce platform), JavaScript/HTML/CSS for LWC  
**Primary Dependencies**: Salesforce DX project, Lightning Web Components, Apex controller class, Lightning Data/Toast APIs  
**Storage**: Salesforce standard/custom object storage (Lead + custom fields)  
**Testing**: Apex unit tests, LWC Jest unit tests, deployment validation via Salesforce CLI  
**Target Platform**: Salesforce Lightning Experience (Account Record FlexiPage)  
**Project Type**: Salesforce metadata-driven application feature  
**Performance Goals**: Form initial readiness under 2 seconds in normal org conditions; submission feedback visible within 3 seconds for successful create operations  
**Constraints**: No manual code edits, no manual deployment, no manual org configuration; all actions must execute through agent commands  
**Scale/Scope**: Single component flow (`leadCaptureForm`), 2 custom Lead fields, 1 permission set, Account record page placement

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Code Quality (Pass)**: Planned implementation keeps UI, server logic, and metadata changes separated; lint/test gates remain required.
- **Test-First Delivery (Pass)**: Plan includes Apex and LWC tests before final validation and merge.
- **UX Consistency (Pass)**: Validation messaging, toast behavior, and field behavior are specified in acceptance scenarios.
- **Performance Requirement (Pass)**: Response-time targets and render responsiveness checks included in technical context and quickstart validation.
- **Small/Reversible Changes (Pass)**: Delivery decomposed into metadata, backend, frontend, and verification slices.

## Project Structure

### Documentation (this feature)

```text
specs/002-lead-capture-form/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── lead-capture-form-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
force-app/
└── main/
    └── default/
        ├── classes/
        │   ├── LeadCaptureController.cls
        │   ├── LeadCaptureController.cls-meta.xml
        │   └── LeadCaptureControllerTest.cls
        ├── lwc/
        │   └── leadCaptureForm/
        │       ├── leadCaptureForm.html
        │       ├── leadCaptureForm.js
        │       ├── leadCaptureForm.js-meta.xml
        │       ├── leadCaptureForm.css
        │       └── __tests__/
        │           └── leadCaptureForm.test.js
        ├── objects/
        │   └── Lead/
        │       └── fields/
        │           ├── Source_Account__c.field-meta.xml
        │           └── Capture_Notes__c.field-meta.xml
        ├── permissionsets/
        │   └── Lead_Capture_Access.permissionset-meta.xml
        └── flexipages/
            └── Account_Record_Page.flexipage-meta.xml
```

**Structure Decision**: Use standard Salesforce DX metadata layout under `force-app/main/default`, with tests colocated by technology (Apex test class and LWC Jest test folder).

## Phase 0 - Research Output

Research consolidates decisions for:
- server interaction pattern (Apex imperative call from LWC);
- field validation split (client-side required/format checks + server-side save guardrails);
- metadata deployment ordering to minimize permission and compile errors;
- toast/error conventions for actionable end-user feedback.

See `specs/002-lead-capture-form/research.md`.

## Phase 1 - Design Output

- Data entities and validation mapping: `specs/002-lead-capture-form/data-model.md`
- UI and service contract details: `specs/002-lead-capture-form/contracts/lead-capture-form-contract.md`
- Agent-executed runbook for implementation, deployment, and tests: `specs/002-lead-capture-form/quickstart.md`

## Post-Design Constitution Re-Check

- **Code Quality (Pass)**: Component API, controller contract, and metadata boundaries are explicit.
- **Test Standard (Pass)**: Contract requires Jest + Apex tests and negative-path validation coverage.
- **UX Consistency (Pass)**: Contract fixes deterministic success/error toast behavior and form reset rules.
- **Performance (Pass)**: Quickstart includes render/submission timing checks and regression verification.
- **Change Size (Pass)**: Tasks can be split into metadata, backend, frontend, and verification PR slices if needed.

## Complexity Tracking

No constitution violations identified; complexity exceptions are not required.
