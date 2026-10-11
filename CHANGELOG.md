# 📋 Changelog

All notable changes to **PULSE OS** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-10-11

### Added
- **FinPulse Neural AI Copilot**: Introduced 4 switchable Gen Z financial advisor archetypes:
  - 🔥 **Roast Master**: Sarcastic, high-friction financial reality checks.
  - 🧘 **Zen Financial Monk**: Mindful delayed gratification and balance coaching.
  - 🚀 **Hyper Hustler**: Aggressive runway optimizer and savings accumulator.
  - 📈 **Quant Analyst**: Stochastic volatility and parametric drawdown evaluator.
- **Indian UPI Soundbox Voice & Chime Simulator**:
  - Synthesized 3-tone carrier chime (C6-E6-G6) mimicking Paytm/PhonePe soundboxes via native Web Audio API.
  - SpeechSynthesis voice announcements ("Rupees X debited on FinPulse") on expense logging and simulation execution.
- **DEFCON Financial Austerity Matrix (DEFCON 1 to 5)**:
  - Tactical military-style financial readiness auditor mapping liability ratios, leeway drops, and runway deficits to DEFCON threat levels.
  - Interactive **Austerity Lockdown Mode** toggle to freeze non-essential spending during budget distress.
- **Roommate & Friends Bill Splitter**:
  - Interactive multi-party cost splitting slider (Solo to 5-way split) integrated directly into the What-If Decision Simulator.
- **Monte Carlo 30-Day Confidence Fan Projections**:
  - 350-iteration stochastic projection curve displaying P10 (Worst Case), P50 (Median), and P90 (Best Case) confidence bands.
  - Real-time probability of survival gauge.
- **Data Sovereignty Portability**:
  - 1-tap CSV transaction ledger download.
  - Full local financial profile state backup and restore via formatted JSON files.
- **Automated Quality Test Suite Expansion**:
  - Expanded unit test coverage from 23 tests to **58 automated tests** across 7 test suites covering pure math, storage, audio synthesis, simulation logic, analytics, and config constants.
- **TypeScript Type Declarations**:
  - Added comprehensive `src/types/finance.d.ts` alongside runtime JSDoc validation schemas.

### Changed
- **Performance & Rendering Optimization**:
  - Optimized Vite 8 native Rolldown compilation, reducing build time to **598ms**.
  - Wrapped heavy presentation components (`VitalSignsHUD`, `ForecastChart`, `DecisionSimulator`, `TransactionLedger`, `CommitmentsManager`, `SavingsVaults`, `WishlistVault`, `Navbar`) in `React.memo`.
  - Added CSS containment utilities (`contain: paint`, `content-visibility: auto`, `contain-intrinsic-size`) in `src/index.css`.
- **Accessibility Hardening (WCAG 2.1 AA)**:
  - Added semantic HTML landmarks (`<section>`, `<article>`, `<header>`, `<nav>`, `<footer>`).
  - Implemented ARIA live regions (`aria-live="polite"`), explicit form labels, and Escape-key dismissals on all modal dialogs.
  - Added `@media (prefers-reduced-motion: reduce)` animation suppression.

### Fixed
- Fixed edge-case allowance division when 1 day remains in the simulation cycle.
- Fixed unused variable and missing dependency lint warnings in `oxlint` (achieved 0 warnings, 0 errors).
- Fixed early return telemetry logging in headless test environments.

### Security
- Reinforced local-first architecture with zero external network exfiltration.
- Added Content Security Policy (CSP) compliance and comprehensive vulnerability disclosure SLA in `SECURITY.md`.

---

## [1.0.0] - 2026-10-11

### Added
- **Core Budget Engine**: Initial ₹10,000 30-day budget management system for Gen Z.
- **The "What-If" Decision Simulator**: Sandbox with 6 Gen Z temptation presets and custom slider inputs.
- **Interconnected Consequence Matrix**: Live delta metrics for daily allowance, liquid cash, risk index, and health score.
- **Delayed Gratification Vault (48h Wishlist)**: Behavioral impulse stopper with celebratory confetti.
- **30-Day SVG Trajectory Forecast Curve**: Multi-path curve tracking with insolvency danger shading and milestone pins.
- **Fixed Commitments & Subscriptions Vault**: Due day badges and 1-tap subscription toggles.
- **Micro-Savings Vaults**: Dream pots and Emergency Shield with shock-absorption mechanics.
- **"Life Happens" Curveball Roulette**: 8 unpredictable real-world life shocks and windfalls.
- **FinPulse Wrapped**: Financial receipt summary card with clipboard export.
- **Pure Math Engine (`financeMath.js`)**: Decoupled deterministic calculations with automated Vitest unit tests.
