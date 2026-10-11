# 🤝 Contributing to PULSE OS

Thank you for your interest in contributing to **PULSE OS**! We are committed to building an open, deterministic, and empowering personal finance platform for Gen Z.

Please read this document carefully before submitting code or proposals.

---

## 📑 Table of Contents

1. [Code of Conduct](#1-code-of-conduct)
2. [Development Environment Setup](#2-development-environment-setup)
3. [Branching Strategy](#3-branching-strategy)
4. [Conventional Commit Specifications](#4-conventional-commit-specifications)
5. [Architectural Principles & Separation of Concerns](#5-architectural-principles--separation-of-concerns)
6. [Code Style & Linting](#6-code-style--linting)
7. [Testing Requirements & Quality Gates](#7-testing-requirements--quality-gates)
8. [Pull Request Submission Checklist](#8-pull-request-submission-checklist)

---

## 1. Code of Conduct

All contributors and maintainers are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to `security@pulse-fintech.org`.

---

## 2. Development Environment Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher (LTS recommended)
- **npm**: `v9.0.0` or higher

### Steps

```bash
# 1. Clone your fork of the repository
git clone https://github.com/<your-username>/pulse-finance-os.git
cd pulse-finance-os

# 2. Install dependencies cleanly
npm install

# 3. Start the local Vite development server
npm run dev

# 4. Run automated test suite
npm test

# 5. Execute static analysis linter
npm run lint

# 6. Verify production build
npm run build
```

The application will be accessible at `http://localhost:5173/`.

---

## 3. Branching Strategy

We follow a structured Git branching model:

- `main`: Production-ready, stable codebase. All direct commits to `main` are restricted.
- `feature/<feature-name>`: New modules, UI components, or simulation features.
  - Example: `feature/upi-soundbox-voice`, `feature/defcon-austerity-matrix`
- `fix/<bug-description>`: Bug fixes and formula boundary corrections.
  - Example: `fix/allowance-day30-division`, `fix/local-storage-sync`
- `perf/<optimization>`: Performance optimizations, bundle tree-shaking, or render reductions.
  - Example: `perf/forecast-svg-memoization`
- `docs/<doc-title>`: Documentation updates, README additions, or architectural diagrams.
  - Example: `docs/c4-architecture-diagrams`

---

## 4. Conventional Commit Specifications

We strictly follow the [Conventional Commits v1.0.0](https://www.conventionalcommits.org/) specification:

```
<type>(<optional scope>): <description>

[optional body]

[optional footer(s)]
```

### Approved Commit Types:
- `feat`: A new user-facing feature or simulation module.
  - *Example*: `feat(simulator): add roommate bill splitting slider`
- `fix`: A bug fix or boundary condition repair.
  - *Example*: `fix(financeMath): clamp negative free cash allowance to ₹0`
- `perf`: A code change that improves performance or bundle size.
  - *Example*: `perf(chart): memoize SVG trajectory path calculations`
- `test`: Adding missing unit tests or refactoring existing test suites.
  - *Example*: `test(analytics): add unit tests for DEFCON severity auditor`
- `docs`: Documentation-only changes.
  - *Example*: `docs(architecture): add C4 container and component diagrams`
- `refactor`: A code change that neither fixes a bug nor adds a feature.
  - *Example*: `refactor(services): extract sound synthesis into dedicated service`
- `style`: Changes that do not affect code logic (formatting, semicolons).
- `chore`: Maintenance tasks, dependency updates, or config tweaks.

---

## 5. Architectural Principles & Separation of Concerns

When adding code to PULSE, you must adhere to our strict directory separation:

1. **Pure Mathematical Engine (`src/utils/financeMath.js`)**:
   - MUST be pure, deterministic functions without side effects or React dependencies.
   - MUST include JSDoc comments (`@param`, `@returns`, `@description`).
   - MUST have corresponding unit tests in `src/utils/financeMath.test.js`.
2. **Domain Service Layer (`src/services/`)**:
   - Encapsulates complex workflows (Web Audio, LocalStorage, Monte Carlo simulation, AI advising).
   - Re-exported cleanly via `src/services/index.js`.
3. **State Management (`src/context/`)**:
   - Single Source of Truth managed in `FinanceContext.jsx`.
   - All state mutations must be deterministic and synchronized with LocalStorage.
4. **Presentation Components (`src/components/`)**:
   - Must be decoupled, atomic, and wrapped in `React.memo` where appropriate.
   - Must adhere to WCAG 2.1 AA accessibility guidelines (ARIA landmarks, labels, keyboard navigation).
5. **Constants (`src/constants/`)**:
   - Magic numbers are strictly forbidden. All business constants must reside in `src/constants/financeRules.js`.

---

## 6. Code Style & Linting

We enforce strict static code quality via **oxlint**:

```bash
npm run lint
```

- Ensure 0 warnings and 0 errors before committing.
- Do not check in `console.log` statements in production code.
- Always use semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).

---

## 7. Testing Requirements & Quality Gates

All pull requests must maintain or improve our unit test coverage:

- We use **Vitest** for fast unit testing.
- Run tests locally with:
  ```bash
  npm test
  ```
- Any new mathematical formula or service method requires automated unit tests with boundary case verification (zero values, negative numbers, overflow limits).

---

## 8. Pull Request Submission Checklist

Before submitting your PR, verify the following checklist:

- [ ] Branch is rebased onto the latest `main`.
- [ ] `npm test` passes 100% of tests.
- [ ] `npm run lint` completes with 0 warnings and 0 errors.
- [ ] `npm run build` succeeds cleanly in under 1 second.
- [ ] PR title follows Conventional Commits format.
- [ ] Keyboard accessibility (Tab, Enter, Escape) has been manually validated.
