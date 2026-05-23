# Wardenclyffe Field Station: Core Development Manual

This document serves as the master technical specification, algorithmic blueprint, and historical design record for **Wardenclyffe Field Station**. It consolidates the system architecture, mathematical game loops, user interface geometry, and technological progression logs into a single unified engineering manual.

---

## 1. TECHNICAL ARCHITECTURE & STATE MANAGEMENT

The game is engineered as a decoupled, state-driven client-side web application operating inside a standard single-page application (SPA) environment. It relies entirely on native browser web technologies (HTML5, CSS3, and ECMAScript 6+) without external framework dependencies.

### A. Data Layer & State Variables
The core engine state is maintained globally in memory using lightweight, primitive JavaScript variables. This state tracks live player progress and drives the interface rendering loop:

```javascript
// Current raw accumulated energy reserves available to spend on infrastructure
let joules = 0;             

// Current count of physical copper wire items bound to inventory spools
let wiring = 0;             

// Hard upper bound limit tracking how much wire the player can carry (Default: 20)
let wireStorageCap = INITIAL_WIRE_STORAGE_CAP; 

// Automation Trackers
let loomBuilt = false;      // Flag: True once Pneumatic Loom infrastructure is erected
let loomTension = "low";    // Active operational speed toggle ("low", "medium", "high")
let loomBroken = false;     // Safety flag: Set to true if a high-tension snap loop triggers
let loomProgressMs = 0;     // Internal clock accumulator tracing progress toward next wire spawn

// Technological Progression Branching
let morseTriggered = false; // Flag: Becomes true when player passes the 50 Joule threshold
let morseDecoded = false;   // Flag: True when the 30-second receiver log countdown concludes
let morseCountdown = 30;    // Remaining duration until Station Omaha's schematics land
let morseChoice = null;     // Permanent branch choice path: "A" (AC System) or "B" (DC System)

// Infrastructure Layout Inventory Registers
let teslaCoils = 0;         // Base automated energy stacks (+1 Joule/sec each)
let acGenerators = 0;       // Path A exclusive heavy industrial generators (+5 Joules/sec each)
let faradayCages = 0;       // Path A defensive shielding grids (Extends attack window delays)
let junctionBoxes = 0;      // Path B defensive iron isolated paths (Blunts incoming wire damage)

// Threat Loop & Emergency Trackers
let trustActivated = false; // Flag: Permanently summons the Edison Trust strike loop
let underAttack = false;    // Lockout state: Freezes generation and loom ticks for 10s
let attackCountdown = 0;    // Tracks remaining duration of current active raid freeze
let nextAttackTime = 0;     // Randomized variable counting down seconds to the next ambush
let capacitorOvercharged = false; // Track: True once the one-time power dump is consumed
let victoryAchieved = false; // Flag: Set to true when specific branch finish goals are hit
