# Architecture Refinement Report: Wardenclyffe Field Station Engine
**To:** Project Manager Agent, Programmer Agent  
**From:** Class 1 Software Architect Agent  
**Subject:** Structural Efficiency, State Management, and Scale Future-Proofing Audit  

---

## Executive Summary
This report analyzes the foundational architecture of our native three-file incremental browser game (`index.html`, `style.css`, `script.js`) built for mobile viewports. While early prototypes relied on loose global variables and indiscriminate rendering, the engine has been refactored into a single, encapsulated source-of-truth state tree (`gameState`). 

By decoupling our rendering engine from our math calculations, consolidating loose runtime state, and planning strict data formatters, this document serves as the technical blueprint for maintaining performance as the game expands across 4 geographic stages with exponential resource scaling.

---

## 1. Code Redundancy & UI Optimization

### Findings (Current Bottlenecks & Refactor Targets)
* **Monolithic UI Synchronization Loop:** Updating the full visual layout tree every single second recomputes visibility class lists (`.hidden`), evaluates layout conditions, and alters button opacity styles for systems completely independent of the player's immediate focus.
* **Decoupled Multi-Resource Query Spam:** Layout elements split tracking metrics into separate DOM nodes (e.g., dashboard stats vs. fixed footer quick-stats). Independent DOM updates force the browser layout engine to execute redundant element paints.
* **Hardcoded UI Configuration Mutation:** Resource costs and functional text strings altered inline across separate interaction triggers mix structural business logic directly into event-driven runtime routines.

### Recommendations & Refinement Strategy
* **Shift to a Reactive State-Driven View Layer:** Transition toward a targeted system where UI updates are triggered strictly on-demand when an underlying resource value inside `gameState` actually mutates.
* **Implement Structured Element Group Registry:** Consolidate isolated DOM selections into unified configuration maps. When a resource like Joules changes, a cached collection array updates primary card and footer elements simultaneously.
* **Isolate UI Layout Copy from Code Logic:** Move button names, descriptions, and dynamic cost structures into immutable configuration arrays, dynamically generating button states using reference definitions.

---

## 2. Global State Management Blueprint (IMPLEMENTED)

### Historical Bottlenecks (Resolved in August 2026 Refactor)
* Over 25 primitive variables (`joules`, `wiring`, `loomBuilt`, `underAttack`, etc.) previously floated loosely in the global scope, creating naming collision risks and complex reset requirements.

### Implemented Architecture: Single Source of Truth
* **Unified Object Tree:** 100% of the runtime state now lives within a singular, structured JavaScript object (`gameState`).
* **Expedition Crate Migration Pattern:** When a geographic stage is completed, a clean lifecycle function accepts `gameState`, zeroes out regional infrastructure assets, preserves global progression metrics, and spins up the next zone without requiring a browser refresh.
* **Controlled Persistence (Development Mode):** While the `gameState` structure is engineered for single-line `JSON.stringify()` serialization, `localStorage` auto-saving is intentionally disabled during early development to allow instant browser-refresh resets on Chromebook and mobile viewports.

---

## 3. Scale Future-Proofing for Exponential Growth (UPCOMING ROADMAP)

### Findings (Future Scaling Constraints)
* **Linear Tick Engine Saturation:** As later stages introduce hundreds of automated resource collectors, evaluating calculations linearly every tick will degrade performance on mobile hardware.
* **Mobile Viewport UI Deflection:** Fixed-width phone layout stat boxes (`max-width: 512px`) will clip or wrap text awkwardly if raw integers scaling to millions or billions are printed directly without formatting.

### Recommendations & Refinement Strategy
* **Transition to Matrix-Based Math Adjustments:** Replace linear additions with a centralized "Production Vector" model (Resource_Total = Base * Multiplier).
* **Introduce Numerical Abstraction Formatters:** Integrate an abbreviated formatting pipeline (`1.50M`, `2.30B`, scientific notation) at the presentation layer to keep mobile layouts clean while preserving underlying numerical precision.
* **Implement a Floating Timestamp Frame Delta:** Disconnect loop logic from strict hardware timing using system timestamps (`DeltaTime = Time_Current - Time_LastTick`) for skip-free offline catch-up calculation.

---

## Summary Checklist for Technical Realignment

| Focus Area | Baseline Prototype | Current Live Architecture | Future Scaled Architecture Blueprint |
| :--- | :--- | :--- | :--- |
| **State Structure** | 25+ unorganized global variables | Encapsulated `gameState` tree | Encapsulated `gameState` tree |
| **DOM Manipulation** | Indiscriminate 1Hz redraw | Target-specific helper calls | Reactive, event-driven component updates |
| **Resource Scaling** | Simple integer additions | Integer math with boundary clamping | Matrix production vectors with metric suffixes (K, M, B) |
| **Persistence** | None | Memory state (Refresh = Reset) | Rehydratable `localStorage` serialization |

---

## Appendix: Technical Code Patterns

### 1. The Implemented Encapsulated State Schema (`script.js`)
```javascript
// ============================================================================
// SINGLE SOURCE OF TRUTH: UNIFIED GAME STATE TREE
// ============================================================================
const gameState = {
    meta: {
        currentStage: 0,           // 0 = Wardenclyffe Base, 1 = Poughkeepsie, etc.
        saveVersion: "1.0.0",
        lastTimestamp: Date.now(),
        victoryAchieved: false
    },
    resources: {
        joules: 0.0,
        wiring: 0,
        knowledgePoints: 0.0
    },
    caps: {
        joulesMax: 100.0,
        wireStorageCap: 20
    },
    structures: {
        handCrank: { count: 1, baseYield: 1.0 },
        automatedLoom: { 
            built: false, 
            count: 0, 
            tensionSetting: "low", // "low", "medium", "high"
            isBroken: false 
        },
        junctionBox: { built: false, count: 0 },
        morseReceiver: { built: false, activeDecoding: false }
    },
    queues: {
        activeExpeditions: [],
        constructionJobs: [],  
        combatCooldowns: []    
    },
    combat: {
        trustActivated: false,
        underAttack: false,
        threatLevel: 0.0,      
        defenseModifiers: {
            attackSlowingFactor: 1.0,
            damageReductionFactor: 1.0
        }
    },
    uiState: {
        activeTab: "station-floor",
        terminalScrolledOut: false
    }
};


// ============================================================================
// FLOATING TIMESTAMP FRAME DELTA ENGINE
// ============================================================================
let lastFrameTime = performance.now();

function gameHeartbeatLoop() {
    const currentFrameTime = performance.now();
    const elapsedMs = currentFrameTime - lastFrameTime;
    lastFrameTime = currentFrameTime;

    const dt = elapsedMs / 1000.0;
    if (dt <= 0 || isNaN(dt)) return;

    updateGameLogic(dt);
    gameState.meta.lastTimestamp = Date.now();
}

function updateGameLogic(dt) {
    if (gameState.structures.automatedLoom.built && !gameState.structures.automatedLoom.isBroken) {
        const currentConfig = LOOM_CONFIGS[gameState.structures.automatedLoom.tensionSetting];
        const jouleDrainThisFrame = currentConfig.jouleDrain * dt;

        if (gameState.resources.joules >= jouleDrainThisFrame) {
            gameState.resources.joules -= jouleDrainThisFrame;
            advanceLoomQueueProgress(dt);
        }
    }

    const continuousJouleRate = 2.5; 
    gameState.resources.joules += continuousJouleRate * dt;

    if (gameState.resources.joules > gameState.caps.joulesMax) {
        gameState.resources.joules = gameState.caps.joulesMax;
    }

    processActiveQueues(dt);
    renderTargetedUIComponents();
}


// ============================================================================
// MOBILE VIEWPORT CONSTRAINED RESOURCE FORMATTER
// ============================================================================
function formatResources(value) {
    if (value === 0) return "0";
    if (value < 0) return "-" + formatResources(Math.abs(value));
    if (value < 1000) return Math.floor(value).toString();

    const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi"];
    const tier = Math.floor(Math.log10(value) / 3);

    if (tier < suffixes.length) {
        const suffix = suffixes[tier];
        const scaledValue = value / Math.pow(10, tier * 3);
        return scaledValue >= 100 
            ? `${Math.floor(scaledValue)}${suffix}` 
            : `${scaledValue.toFixed(2)}${suffix}`;
    }

    return value.toExponential(2);
}

