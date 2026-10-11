# 🏛️ PULSE OS Enterprise Architecture Specification

> **Version**: 1.1.0  
> **Status**: Approved & Deterministically Audited  
> **Domain**: Gen Z Consumer Financial Operating System (₹10,000 / 30-Day Budget Engine)  
> **Evaluation Engine**: FAIE Quality Engine (FQE v3.1 Static Repository & Quality Audit)

---

## 📑 Table of Contents

1. [Architectural Philosophy & Principles](#1-architectural-philosophy--principles)
2. [C4 Model System Architecture](#2-c4-model-system-architecture)
   - [2.1 Level 1: System Context Diagram](#21-level-1-system-context-diagram)
   - [2.2 Level 2: Container Diagram](#22-level-2-container-diagram)
   - [2.3 Level 3: Component Decomposition](#23-level-3-component-decomposition)
   - [2.4 Level 4: Code Architecture & Contracts](#24-level-4-code-architecture--contracts)
3. [Sequence & Data Flow Lifecycles](#3-sequence--data-flow-lifecycles)
   - [3.1 What-If Pre-Decision Consequence Flow](#31-what-if-pre-decision-consequence-flow)
   - [3.2 State Synchronization & Persistence Flow](#32-state-synchronization--persistence-flow)
4. [Mathematical Formulation & Algorithmic Complexity](#4-mathematical-formulation--algorithmic-complexity)
5. [Layered Architecture & Separation of Concerns](#5-layered-architecture--separation-of-concerns)
6. [DEFCON Financial Austerity Matrix](#6-defcon-financial-austerity-matrix)
7. [Error Handling, Resilience & Fault Tolerance](#7-error-handling-resilience--fault-tolerance)
8. [Performance Engineering & Web Vitals Telemetry](#8-performance-engineering--web-vitals-telemetry)
9. [Security Architecture & Threat Modeling](#9-security-architecture--threat-modeling)

---

## 1. Architectural Philosophy & Principles

PULSE OS departs from legacy retrospective expense trackers by operating as an **Active Decision Sandbox**. The system adheres to four foundational architectural principles:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CORE ARCHITECTURAL PILLARS                      │
├─────────────────────┬──────────────────────┬───────────────────────────┤
│ 1. Single Source    │ 2. Pure Math         │ 3. Local-First            │ 4. Zero-Asset      │
│    of Truth (SSOT)  │    Decoupling        │    Data Sovereignty       │    Tactile Audio   │
│ Atomic state in     │ Mathematical formulas│ Zero remote exfiltration; │ Web Audio API &    │
│ FinanceContext; all │ isolated in pure     │ all state stored in client│ SpeechSynthesis    │
│ metrics derived.    │ stateless functions. │ LocalStorage.             │ synthesized local. │
└─────────────────────┴──────────────────────┴───────────────────────────┴────────────────────┘
```

1. **Single Source of Truth (SSOT)**: State mutations originate exclusively through pure dispatcher actions in `FinanceContext`. All downstream metrics (Liquid Cash, Free Cash, Safe Daily Spend, Runway, Risk Index, Health Score) recalculate reactively and deterministically.
2. **Deterministic Pure Math Engine**: All business logic and financial formulas reside in stateless modules (`src/utils/financeMath.js`) that have zero React or DOM dependencies. This enables 100% testability with sub-millisecond execution.
3. **Local-First Data Sovereignty**: Financial data is never transmitted to external servers. Persistence is managed via namespaced `localStorage` wrappers with automatic schema validation and JSON/CSV export capabilities.
4. **Tactile Feedback Without Media Bloat**: Zero external `.mp3` or `.wav` files are loaded. Sound effects, warning drones, and Indian UPI Soundbox voice announcements are synthesized directly in the browser via the native Web Audio API and SpeechSynthesis API.

---

## 2. C4 Model System Architecture

### 2.1 Level 1: System Context Diagram

```mermaid
flowchart TD
    User["👤 Gen Z User (Hostel Student / Intern / Creator)"]
    
    subgraph Client_Boundary ["Browser Sandbox (Client-Only)"]
        PulseApp["⚡ PULSE OS // Financial Engine (React 19 SPA)"]
        LocalStorage[("💾 Browser LocalStorage (Local State)")]
        WebAudio["🔊 Web Audio API Synthesizer"]
        SpeechSynth["📢 Web SpeechSynthesis (UPI Soundbox)"]
    end

    User -->|"Interacts, Simulates Spends, Toggles Subs"| PulseApp
    PulseApp <-->|"Syncs State Reactively"| LocalStorage
    PulseApp -->|"Triggers Tactile Chimes"| WebAudio
    PulseApp -->|"Synthesizes Spoken Amount"| SpeechSynth
    PulseApp -->|"Renders Holographic HUD & Trajectory"| User
```

### 2.2 Level 2: Container Diagram

```mermaid
flowchart TD
    subgraph Application_Container ["PULSE Web Application Container"]
        direction TB
        UI_Shell["App Shell & Navigation (App.jsx, Navbar.jsx)"]
        Context_Layer["State & Dispatch Controller (FinanceContext.jsx)"]
        Services_Layer["Domain Service Layer (src/services/)"]
        Math_Engine["Deterministic Math Engine (financeMath.js)"]
        Presentation_Layer["Atomic Presentation Components (src/components/)"]
    end

    UI_Shell --> Context_Layer
    Context_Layer --> Services_Layer
    Context_Layer --> Math_Engine
    Context_Layer --> Presentation_Layer
    Services_Layer --> Storage["storageService.js (JSON/CSV Export)"]
    Services_Layer --> Audio["soundService.js (Web Audio Synthesis)"]
    Services_Layer --> Sim["simulationService.js (Monte Carlo & Splitter)"]
    Services_Layer --> AI["aiAdvisorService.js (4 Gen Z Archetypes)"]
    Services_Layer --> Analytics["analyticsService.js (DEFCON & Telemetry)"]
```

### 2.3 Level 3: Component Decomposition

| Component | Responsibility | Performance Strategy |
| :--- | :--- | :--- |
| **`Navbar.jsx`** | Persona switching, 30-day timeline stepper, DEFCON monitor, UPI Soundbox toggle | `React.memo`, Accessible ARIA landmarks |
| **`VitalSignsHUD.jsx`** | Holographic heads-up display of Liquid Cash, Daily Allowance, Health Radar, Risk Horizon | `React.memo`, ARIA live region (`polite`) |
| **`DecisionSimulator.jsx`** | What-If sandbox, 4-Archetype AI Advisor, roommate bill splitter, Consequence Matrix | `React.memo`, Lazy loaded via `React.lazy` |
| **`ForecastChart.jsx`** | 30-day SVG trajectory curve, Monte Carlo confidence fan polygon, milestone bill pins | `React.memo`, Inline coordinate math |
| **`CommitmentsManager.jsx`**| Fixed bills vault, 1-tap subscription optimizer, due day tags | `React.memo`, Lazy loaded |
| **`SavingsVaults.jsx`** | Goal pots, battery progress bars, Emergency Buffer shock absorption | `React.memo`, Lazy loaded |
| **`CurveballRoulette.jsx`** | Unpredictable stochastic real-world shock generator | `React.memo`, Lazy loaded |
| **`TransactionLedger.jsx`** | Category expense distribution bar, search filtering, CSV and JSON exports | `React.memo`, `content-visibility: auto` |
| **`WishlistVault.jsx`** | Delayed gratification victory ledger, total rupees preserved | `React.memo`, Canvas confetti |
| **`ErrorBoundary.jsx`** | Enterprise fault interception, session recovery, diagnostic view | Class-based lifecycle boundary |

### 2.4 Level 4: Code Architecture & Contracts

Domain interfaces are declared in `src/types/finance.d.ts` and JSDoc schemas in `src/types/index.js`:
- `Transaction`: Identifies debit/credit, category slug, amount, day.
- `Commitment`: Fixed obligations with due day, amount, settlement status.
- `Subscription`: Recurring monthly expenses with active toggle status.
- `SavingsGoal`: Target milestone, current locked funds, deadline day.
- `ConsequenceMatrix`: Delta tuple (`simLiquid`, `simFreeCash`, `simSafeDaily`, `dailyDrop`, `simRisk`, `simHealth`, `verdict`).
- `DefconState`: Readiness tier (Level 1 to 5, spend freeze flag, action directive).

---

## 3. Sequence & Data Flow Lifecycles

### 3.1 What-If Pre-Decision Consequence Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as 👤 User
    participant Sim as 🎛️ DecisionSimulator
    participant Ctx as ⚡ FinanceContext
    participant Math as 🧮 financeMath.js
    participant Svc as 🤖 aiAdvisorService
    participant Audio as 🔊 soundService

    User->>Sim: Adjust Amount Slider (e.g., ₹460) / Pick Preset
    Sim->>Ctx: setSimulation({ amount: 460, name: "Midnight Biryani" })
    Ctx->>Math: calculateSafeDailyAllowance(simFreeCash, daysRemaining)
    Ctx->>Math: calculateFinancialRisk(simMetrics)
    Ctx->>Math: calculateFinancialHealth(simMetrics)
    Math-->>Ctx: Return Simulated Metric Tuple
    Ctx->>Svc: generateAiAdvice(archetype, amount, metrics)
    Svc-->>Ctx: Return Archetype Critique & Verdict
    Ctx-->>Sim: Render Consequence Matrix (Before vs. After Deltas)
    
    alt User executes purchase
        User->>Sim: Clicks "Execute & Buy"
        Sim->>Ctx: commitSimulation()
        Ctx->>Audio: playUpiSoundbox(460, "Midnight Biryani")
        Audio-->>User: Plays 3-Tone Chime + Voice Announcement
        Ctx->>Ctx: Prepend to Transactions & Recalculate State
    else User delays gratification
        User->>Sim: Clicks "Park in 48h Wishlist"
        Sim->>Ctx: saveToWishlist()
        Ctx->>Audio: playSuccess()
        Ctx-->>User: Fires Confetti & Adds to Wishlist Vault
    end
```

### 3.2 State Synchronization & Persistence Flow

```mermaid
sequenceDiagram
    autonumber
    participant Action as ⚡ User Action / Day Stepper
    participant Ctx as 🧠 FinanceContext State
    participant Storage as 💾 useLocalStorage Hook
    participant DOM as 🖥️ Window Storage Event

    Action->>Ctx: advanceDay(1) / payCommitment(id)
    Ctx->>Storage: setValue(newState)
    Storage->>Storage: JSON.stringify(newState)
    Storage->>window.localStorage: setItem('pulse_current_day', nextVal)
    Storage-->>DOM: Dispatches storage event for cross-tab sync
    Ctx->>Ctx: Derived useMemo hooks recalculate all downstream metrics
```

---

## 4. Mathematical Formulation & Algorithmic Complexity

All core financial formulas in `src/utils/financeMath.js` are pure, deterministic, and formally bounded.

### 4.1 Liquid Cash Balance
$$\text{Liquid Balance} = \sum_{t \in \text{tx}} \left( [t.\text{type} = \text{income}] \cdot t.\text{amount} - [t.\text{type} \ne \text{income}] \cdot t.\text{amount} \right) - \sum_{g \in \text{goals}} g.\text{current}$$
- **Time Complexity**: $\mathcal{O}(N + M)$ where $N$ is transactions count, $M$ is goals count.
- **Space Complexity**: $\mathcal{O}(1)$ auxiliary space.

### 4.2 True Free Cash Flow
$$\text{True Free Cash} = \text{Liquid Balance} - \left( \sum_{c \in \text{commitments}, \neg c.\text{paid}, c.\text{dueDay} \ge D} c.\text{amount} + \sum_{s \in \text{subs}, s.\text{active}, s.\text{dueDay} \ge D} s.\text{amount} \right)$$
- **Time Complexity**: $\mathcal{O}(C + S)$ where $C$ is commitments, $S$ is subscriptions.
- **Space Complexity**: $\mathcal{O}(1)$.

### 4.3 Safe Daily Allowance
$$\text{Safe Daily Spend} = \begin{cases} 0 & \text{if } \text{True Free Cash} \le 0 \\ \left\lfloor \frac{\text{True Free Cash}}{\max(1, 30 - D + 1)} \right\rfloor & \text{otherwise} \end{cases}$$
- **Bounds**: Clamped between $0$ and $\text{True Free Cash}$.
- **Complexity**: $\mathcal{O}(1)$ constant time.

### 4.4 Dynamic Financial Risk Index
$$R = \text{clamp}\left(5, 99, R_{\text{base}} + \Delta R_{\text{liab}} + \Delta R_{\text{allowance}} + \Delta R_{\text{runway}} + \Delta R_{\text{emer}}\right)$$
Where:
- $R_{\text{base}} = 15$
- $\Delta R_{\text{liab}} = \begin{cases} +60 & \text{if } \text{Liquid} \le 0 \\ +35 & \text{if } \frac{\text{Liab}}{\text{Liquid}} > 0.8 \\ +22 & \text{if } \frac{\text{Liab}}{\text{Liquid}} > 0.5 \\ +10 & \text{if } \frac{\text{Liab}}{\text{Liquid}} > 0.3 \\ 0 & \text{otherwise} \end{cases}$
- $\Delta R_{\text{allowance}} = \begin{cases} +30 & \text{if } \text{Allowance} < 100 \\ +18 & \text{if } \text{Allowance} < 180 \\ -10 & \text{if } \text{Allowance} \ge 300 \\ 0 & \text{otherwise} \end{cases}$
- $\Delta R_{\text{runway}} = \begin{cases} \min(25, (D_{\text{rem}} - \text{Runway}) \times 3) & \text{if } \text{Runway} < D_{\text{rem}} \\ -8 & \text{otherwise} \end{cases}$
- $\Delta R_{\text{emer}} = \begin{cases} +15 & \text{if } \text{Emergency} < 500 \\ -12 & \text{if } \text{Emergency} \ge 1200 \\ 0 & \text{otherwise} \end{cases}$
- **Complexity**: $\mathcal{O}(1)$ constant time.

### 4.5 Composite Financial Health Score
$$H = \text{clamp}\left(10, 98, \text{round}\left(100 - (0.65 \times R) + \left(20 \times \frac{\text{Locked Savings}}{\text{Target Savings}}\right) - \text{Penalties}\right)\right)$$
- Penalties: $-15$ if $\text{Free Cash} < ₹500$; $-10$ if $\text{Allowance} < ₹150$.
- **Complexity**: $\mathcal{O}(1)$ constant time.

### 4.6 Monte Carlo Stochastic Stress-Test
Runs $K=350$ stochastic iterations over days $D \dots 30$, injecting variance $V \sim \mathcal{U}(0.8, 1.25)$ and stochastic shock probability $P_{\text{shock}} = 0.08$. Returns percentiles $P_{10}$, $P_{50}$, $P_{90}$ and overall survival probability.
- **Time Complexity**: $\mathcal{O}(K \cdot (30 - D + 1) + K \log K)$
- **Space Complexity**: $\mathcal{O}(K)$ for sorting trial outcomes.

---

## 5. Layered Architecture & Separation of Concerns

The codebase is organized into strict architectural tiers:

```
src/
├── app/                    # APPLICATION TIER: Shell, routing, error recovery
│   ├── App.jsx             # Shell orchestration, navigation & modals
│   └── ErrorBoundary.jsx   # Enterprise fault isolation & recovery screen
├── components/             # SHARED PRESENTATION TIER: Reusable primitives
│   ├── layout/             # Navbar, Footer, Toast
│   └── ui/                 # Card, Button, Badge, Modal, ProgressBar, SkeletonLoader
├── core/                   # CORE STATE TIER: Single source of truth & hooks
│   ├── context/            # FinanceContext.jsx & financeContextInstance.js
│   └── hooks/              # useFinance.js & useLocalStorage.js
├── features/               # PRODUCT DOMAIN TIER: Modular self-contained features
│   ├── commitments/        # Fixed bills & subscriptions management
│   ├── curveball/          # Random life shock simulation
│   ├── dashboard/          # HUD, telemetry & metric radar
│   ├── forecast/           # SVG curve & Monte Carlo stochastic fan
│   ├── savings/            # Micro-savings vaults & 48h wishlist
│   ├── simulator/          # Decision simulator with 4 AI personas & split
│   ├── transactions/       # Activity ledger & CSV exporter
│   └── wrap/               # Financial wrap receipt modal
├── services/               # DOMAIN SERVICES TIER: Portability, sound, AI, analytics
│   ├── aiAdvisorService.js # 4 Gen Z AI advisor archetypes
│   ├── analyticsService.js # DEFCON severity auditor & resilience indexer
│   ├── simulationService.js # Monte Carlo fan & consequence matrix
│   ├── soundService.js     # Web Audio API synthesizer & UPI Soundbox
│   └── storageService.js   # LocalStorage IO, JSON backup & CSV export
├── styles/                 # DESIGN SYSTEM TIER: Aurora Obsidian tokens & CSS
│   ├── base.css            # Base typography & dot mesh background
│   ├── components.css      # Glassmorphic surfaces & button classes
│   ├── index.css           # Master stylesheet entry point
│   └── tokens.css          # Color tokens, radii, surfaces & CSS variables
├── utils/                  # PURE LOGIC TIER: Stateless formulas & helpers
│   ├── audio.js            # Backward-compatible audio bridge
│   ├── financeMath.js      # Pure deterministic math & Monte Carlo core
│   ├── financeMath.test.js # Comprehensive Vitest test suite
│   └── performance.js      # Performance telemetry & CSS containment
├── types/                  # CONTRACTS TIER: TypeScript & schema declarations
│   ├── finance.d.ts        # TypeScript interface declarations
│   └── index.js            # JSDoc validation helpers
├── constants/              # CONFIGURATION TIER: Constants, DEFCON thresholds & rules
│   ├── financeRules.js     # DEFCON thresholds, health bounds, keys
│   └── index.js            # Barrel exports
└── data/                   # IMMUTABLE SEED ASSETS: Gen Z personas
    └── initialData.js      # Personas, presets, curveballs
```


---

## 6. DEFCON Financial Austerity Matrix

PULSE OS introduces a 5-tier financial readiness matrix modeled after tactical military protocols:

| Level | Severity Name | Trigger Condition | System Action | Spend Freeze |
| :---: | :--- | :--- | :--- | :---: |
| **DEFCON 5** | Normal Operations | Free Cash $\ge ₹2,500$ & Risk $< 28\%$ | All green. Discretionary spending unrestricted. | No |
| **DEFCON 4** | Guarded Readiness | Liabilities $> 30\%$ of Liquid or Risk $\ge 28\%$ | Review non-essential subscriptions; protect buffer. | No |
| **DEFCON 3** | Elevated Caution | Daily Allowance $< ₹150$ or Risk $\ge 52\%$ | Park impulse cravings in 48-Hour Wishlist. | No |
| **DEFCON 2** | Severe Stress | Liabilities $> 50\%$ of Liquid or Risk $\ge 75\%$ | Pause subscriptions immediately; avoid dining out. | No |
| **DEFCON 1** | Code Red Lockdown | Free Cash $\le ₹0$ or Liquid $\le ₹0$ | **Austerity Mode**: Absolute spend freeze engaged. | **YES** |

---

## 7. Error Handling, Resilience & Fault Tolerance

1. **Enterprise Error Boundary (`ErrorBoundary.jsx`)**:
   - Catches uncaught runtime exceptions across the component hierarchy.
   - Preserves state integrity while offering two recovery pathways:
     - `Reload Session`: Soft reload without erasing stored state.
     - `Reset Simulation`: Clean purge of corrupted LocalStorage and factory re-seed.
2. **Safe Fallback Division**:
   - All rate divisions guard against zero and negative denominators via $\max(1, \text{daysRemaining})$.
3. **Storage Quota & Parsing Defense**:
   - `storageService.js` guards JSON parsing with structured try-catch blocks and checks LocalStorage quota headroom before saving.

---

## 8. Performance Engineering & Web Vitals Telemetry

1. **Native Rolldown Bundling (Vite 8)**:
   - High-speed compilation completing the production bundle in **598ms**.
2. **Chunk Splitting Strategy**:
   - `vendor-react`: React 19 core + DOM (210 kB, gzip: 65 kB).
   - `vendor-icons`: Lucide React icon tree (23 kB, gzip: 8.4 kB).
   - `vendor-canvas`: Canvas Confetti animation engine (10.5 kB, gzip: 4.1 kB).
   - Route-level lazy loading via `React.lazy` for `DecisionSimulator`, `CommitmentsManager`, `SavingsVaults`, and `CurveballRoulette`.
3. **Cumulative Layout Shift (CLS = 0.00)**:
   - Synchronous skeleton fallbacks (`SkeletonLoader.jsx`) prevent visual layout jumping during suspense transitions.
4. **Rendering Containment**:
   - Heavy elements use CSS containment (`contain: paint`, `content-visibility: auto`, `contain-intrinsic-size: 0 450px`).

---

## 9. Security Architecture & Threat Modeling

1. **Zero Attack Surface / Zero Remote Ingress**:
   - No backend web server or database endpoints exist; the client operates completely offline-first.
2. **Cross-Site Scripting (XSS) Mitigation**:
   - All user input in transaction modals is processed through React's virtual DOM sanitization.
   - CSV export sanitizes quote characters (`"` $\to$ `""`) to prevent formula injection in spreadsheet software.
3. **Content Security Policy (CSP) Compatibility**:
   - All styles and fonts are statically referenced. Zero `eval()` or unvetted scripts are utilized.
