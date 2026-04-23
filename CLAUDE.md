# greenField Project

## Overview

Salesforce DX project demonstrating **agentic AI-driven development** using the [spec-kit pattern](https://spec-kit.dev). Features are built end-to-end through agent-executed commands without manual code editing.

**Stack**: Apex (backend) · Lightning Web Components/LWC (frontend) · Salesforce CLI · Jest (LWC tests) · Apex unit tests

**API Versions**: LWC 63.0 · Salesforce source 66.0

---

## Spec-Kit Workflow

This project uses **spec-kit 0.7.3** for structured feature development. Each feature lives in `specs/<number>-<name>/` and follows this lifecycle:

```
constitution → specify → clarify → plan → tasks → implement → checklist → analyze
```

Key spec files per feature:

- `spec.md` — user stories and acceptance criteria
- `plan.md` — implementation plan and architecture decisions
- `tasks.md` — task breakdown with completion status (`[x]` done, `[ ]` todo)
- `research.md` — technology decisions and alternatives considered
- `data-model.md` — data entities and field mapping
- `contracts/` — UI and service contracts
- `quickstart.md` — agent runbook for implementation and deployment

**Active feature**: `specs/002-lead-capture-form/` (all tasks complete as of 2026-04-20)

**Before making implementation changes**, read the active feature's `plan.md` for architecture context.

---

## Project Structure

```
greenField/
├── force-app/main/default/
│   ├── classes/              # Apex classes and tests
│   ├── lwc/                  # Lightning Web Components
│   ├── objects/Lead/fields/  # Custom field metadata
│   ├── permissionsets/       # Permission set metadata
│   └── flexipages/           # Record page layouts
├── specs/
│   ├── 001-agentic-lwc-workflow/
│   └── 002-lead-capture-form/   # Current feature (complete)
├── .specify/                    # Spec-kit configuration
├── scripts/apex/                # Anonymous Apex scripts
└── scripts/soql/                # SOQL query scripts
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Run LWC Jest unit tests
npm run test:unit

# Lint LWC/Aura JS
npm run lint

# Format code
npm run prettier -- --write "force-app/**/*.{cls,html,js,xml}"

# Deploy to default org
sf project deploy start --source-dir force-app

# Run Apex tests
sf apex run test --test-level RunLocalTests --output-dir test-results --result-format human

# Open default org
sf org open
```

---

## Implementation Constraints

- **No manual code edits outside of agent tasks** — all changes executed through CLI commands per the spec-kit pattern
- **Test-first**: Apex and LWC Jest tests are written before or alongside implementation
- **Small, reversible changes**: Each task targets specific files; avoid cross-cutting changes unless planned
- **No manual org configuration**: metadata deployed via `sf project deploy start`

---

## Completed Features

### 002 — Account Lead Capture Form (complete)

LWC component (`leadCaptureForm`) placed on Account record pages that creates Lead records with:

- Account name auto-populated as Company
- `Source_Account__c` lookup back to the Account
- `Capture_Notes__c` long text field (500 chars)
- Client-side and server-side validation
- Success/error toast notifications
- Permission set `Lead_Capture_Access`

Key files:

- [force-app/main/default/lwc/leadCaptureForm/](force-app/main/default/lwc/leadCaptureForm/)
- [force-app/main/default/classes/LeadCaptureController.cls](force-app/main/default/classes/LeadCaptureController.cls)
- [specs/002-lead-capture-form/plan.md](specs/002-lead-capture-form/plan.md)
