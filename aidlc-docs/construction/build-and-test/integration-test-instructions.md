# Integration Test Instructions

## Purpose

This project is a single-package UI component library with no services, no network boundaries, and no separate deployable units — the 8 Units from Application Design (`aidlc-docs/inception/application-design/unit-of-work*.md`) are implementation-sequencing groupings within one codebase, not independently deployed services. Consequently "integration testing" here means **composed multi-component testing**: verifying that components correctly interoperate when used together in a realistic screen, as opposed to each component's own isolated unit test.

There is no separate integration test command — these tests are plain Vitest/RTL test files and run as part of `npm test` alongside every other test (see `unit-test-instructions.md`). This file documents which test files serve this integration role and what they cover.

## Test Scenarios

### Scenario 1: ListView (`examples/ListView/ListView.test.tsx`)

- **Description**: Composes `Table` (with external/server-side pagination, sorting, row selection), `AppShell`, `Dropdown` (row action menu), and sample user data (`examples/data/sampleUsers.ts`) into a full list screen.
- **Setup**: Rendered directly via RTL `render()`; no external services or mocks needed since data is static sample data.
- **Test Steps**: Render the view; interact with pagination controls, column sort, row selection, and the row-action dropdown.
- **Expected Results**: Table state (current page, sort, selection) updates correctly in response to user interaction, and the Dropdown correctly targets the row it was opened from.
- **Cleanup**: Automatic via the global `afterEach(cleanup())` in `vitest.setup.ts`.

### Scenario 2: DetailView (`examples/DetailView/DetailView.test.tsx`)

- **Description**: Composes `Badge`, `Avatar`, and the description-list CSS pattern (`.description-list` / `.description-list-term` / `.description-list-description`, established as a naming convention rather than a dedicated component — see Application Design's rejection of a standalone Description List component) to render a read-only detail screen.
- **Setup**: Rendered with a single sample user record.
- **Test Steps**: Render the view and assert the expected fields/labels are present.
- **Expected Results**: All fields render with correct term/description pairing and accessible structure.
- **Cleanup**: Automatic.

### Scenario 3: EditUserModal (`examples/EditUserModal/EditUserModal.test.tsx`)

- **Description**: Composes `Modal` (with `ModalStackProvider`/focus trap), `FormField`, `TextInput`, and `Select` into an edit form inside a dialog.
- **Setup**: Rendered inside `ModalStackProvider`, matching how a consuming app would need to wrap it (documented in `docs/integration-guide.md`).
- **Test Steps**: Open the modal, edit form fields, submit.
- **Expected Results**: Form field values propagate correctly through `FormField`'s context linkage into the underlying inputs and back out on submit; focus trap keeps focus inside the dialog; the modal closes and calls its callback on save.
- **Cleanup**: Automatic.

### Scenario 4: DeleteConfirmModal (`examples/DeleteConfirmModal/DeleteConfirmModal.test.tsx`)

- **Description**: Composes `Modal` and `Button` (danger variant) for a confirmation dialog.
- **Setup**: Rendered inside `ModalStackProvider`.
- **Test Steps**: Open the modal, confirm or cancel.
- **Expected Results**: The correct callback fires exactly once per action, and the modal closes afterward.
- **Cleanup**: Automatic.

## Setup Integration Test Environment

No external services, databases, or containers are needed — everything runs in-process under Vitest's jsdom environment.

### 1. Start Required Services

Not applicable — no backend/services exist in this project.

### 2. Configure Service Endpoints

Not applicable.

## Run Integration Tests

### 1. Execute Integration Test Suite

```bash
npm test
```

(same command as unit tests — see `unit-test-instructions.md`; to run only the composed-screen files: `npx vitest run examples`)

### 2. Verify Service Interactions

- **Test Scenarios**: the 4 listed above
- **Expected Results**: all pass as part of the overall 196/196 result (see `build-and-test-summary.md`)
- **Logs Location**: console output only

### 3. Cleanup

Not applicable — no persistent test environment is created.
