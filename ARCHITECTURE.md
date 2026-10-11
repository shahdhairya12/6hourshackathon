# 🏛️ PULSE Architecture Documentation

## 1. Architectural Philosophy
PULSE is architected around a **Single Source of Truth (SSOT)** model coupled with **Deterministic Formula Execution**. Unlike traditional finance trackers where state is fragmented across isolated expense logs, every financial variable in PULSE directly recalculates all downstream metrics.

```
State Change (Debit, Credit, Bill, Simulation, Goal Lock)
      │
      ▼
financeMath.js (Pure Deterministic Calculations)
      │
      ├───────────────────────┬──────────────────────┬──────────────────────┐
      ▼                       ▼                      ▼                      ▼
Liquid Balance        Safe Daily Allowance     Risk Index %          Health Score
```

---

## 2. Directory Hierarchy & Separation of Concerns

- **`src/context/FinanceContext.jsx`**: Manages state lifecycle, persistent synchronization via `useLocalStorage`, audio dispatch, and user interaction actions.
- **`src/utils/financeMath.js`**: Completely decoupled from React; contains pure mathematical functions. Easily unit-tested without DOM mocks.
- **`src/components/`**: Presentation layer adhering to atomic, reusable UI components. Split using `React.lazy()` for performance.
- **`src/data/initialData.js`**: Immutable persona configurations, curveball life events, and temptation presets.

---

## 3. Mathematical Formula Specifications

### 3.1 True Free Cash Flow
$$\text{Free Cash} = \text{Liquid Balance} - \left(\sum \text{Pending Commitments} + \sum \text{Active Subscriptions}\right)$$

### 3.2 Dynamic Safe Daily Allowance
$$\text{Safe Daily Allowance} = \max\left(0, \left\lfloor \frac{\text{Free Cash}}{\max(1, 30 - \text{Current Day} + 1)} \right\rfloor\right)$$

### 3.3 Financial Risk Model
The risk score $R \in [5, 99]$ is calculated dynamically:
- **Base Risk**: $15\%$
- **Liability Ratio Penalty**:
  - If $\frac{\text{Liabilities}}{\text{Liquid}} > 0.8 \implies +35\%$
  - If $\frac{\text{Liabilities}}{\text{Liquid}} > 0.5 \implies +22\%$
  - If $\frac{\text{Liabilities}}{\text{Liquid}} > 0.3 \implies +10\%$
- **Daily Allowance Stress**:
  - If $\text{Allowance} < 100 \implies +30\%$
  - If $\text{Allowance} < 180 \implies +18\%$
  - If $\text{Allowance} \ge 300 \implies -10\%$
- **Emergency Reserve Cushion**:
  - If $\text{Emergency Goal} < 500 \implies +15\%$
  - If $\text{Emergency Goal} \ge 1200 \implies -12\%$

---

## 4. Performance & Code-Splitting Strategy

1. **Route-Level Chunk Splitting**:
   - `DecisionSimulator`, `CommitmentsManager`, `SavingsVaults`, and `CurveballRoulette` are loaded on-demand via `React.lazy`.
2. **Rolldown Bundling**:
   - Utilizes Vite 8's native Rolldown bundler for high-speed compilation and tree-shaking.
3. **Zero Cumulative Layout Shift (CLS)**:
   - Dedicated `SkeletonLoader.jsx` prevents visual jumps when switching tabs.
