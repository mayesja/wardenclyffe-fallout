# Wardenclyffe Field Station: Master Development Manual

This master manual unifies the technical file architecture, layout specifications, mechanical engines, narrative walkthroughs, and current milestone logs for **Wardenclyffe Field Station**. It serves as the single source of truth for the project's technical framework, operational history, and ongoing gameplay experiments.

---

## 1. CODEBASE & INTERFACE ARCHITECTURE

### A. Three-File System Map
The codebase is intentionally separated into three clean, native standard files to optimize local execution and ease of management on Chromebook viewports:
1. **`index.html` (The Structure):** Defines the hard physical layout grid, structural buttons, text injection nodes, and hidden overlay panels.
2. **`style.css` (The Presentation):** Handles the terminal aesthetic, applying a 512px width constraint to emulate a phone screen, text glowing shadows, animation clocks, and color variables.
3. **`script.js` (The Logic):** Encapsulates the master `gameState` tree, hooks player button actions, tracks processing intervals, and manages the 1Hz heartbeat loop.

### B. Viewport Modules & Visual Geometry
The mobile interface divides the 512px application frame vertically into five distinct modules:
* **The Fixed Header HUD:** Contains the station visual banner and a live layout connector mapping `LOCAL GRID STATUS` (`OFFLINE`, `OPERATIONAL POWERED`, or `SABOTAGED LOCKOUT`). It includes the `#alert-banner` element which forces itself onto the top layer of the layout during decoding sequences (Cyan highlight) or attacks (Ember Red).
* **The Terminal Log Box (`#terminal-log`):** A fixed 160px high viewport window with a hidden scrolling layout. It continuously accepts stylized diagnostic logging text (`log-system`, `log-action`, `log-unlock`, `log-warning`) and automatically forces its scrollbar position downward to lock onto incoming entries.
* **The Resource Readout Dashboard (`.stats-grid`):** A CSS Grid module displaying primary player assets (Joules, Wiring, and a variable tracking element whose title changes text dynamically from `TURBINES` to `AC GENS` depending on technological branching alignment).
* **The Actions Panel (`.actions-panel`):** A linear vertical stack acting as the core control panel. Interactive elements, card grids, and speed selectors use the `.hidden` class utility properties to seamlessly toggle into and out of visibility depending on resource thresholds.
* **The Lower Quick-Stats Bar (`.game-footer`):** A fixed footer panel positioned at the bottom margin edge tracking raw integer readouts, generation scales, active threat warnings (`TRUST ⚠`), and defense infrastructure assets.

### C. Viewport Scroll Alert Banner Logic
* **Trigger Mechanics:** Evaluated inside the core `writeLog()` pipeline. If an incoming entry carries a high-priority structural class (`log-system`, `log-unlock`, `log-warning`) and the `#terminal-log` container is detected outside the active visual viewport boundaries, the `.scroll-alert-banner` is toggled into active visibility.
* **Exclusion Constraints:** Routine manual interaction events (e.g., direct kinetic cranking or manual wire forging) are strictly blacklisted from the trigger check to prevent banner notification spam during early game grinding.
* **Dismissal Loop:** Bound to a click event listener on the banner element. Clicking initiates a smooth scroll interpolation forcing the player's viewport back to the top terminal layout, instantly clearing the banner's active visibility state.

---

## 2. THE MECHANICAL ENGINE & BALANCE ARCHITECTURE

### A. The 1Hz Core Loop
The game relies completely on a single master background heartbeat loop (`setInterval`) running exactly every 1000 milliseconds to handle calculations. This single tick coordinates three main automated functions:
1. **Passive Generation:** Automatically computes current generator counts and injects extra power directly into core reserves (`gameState.resources.joules += generatedJoules`).
2. **Loom Timeline Tracking:** Advances processing clock metrics (`loomProgressMs += 1000`) if power supplies satisfy active consumption costs.
3. **Hostile Scheduler Tracking:** Decrements background encounter clocks and checks if countdown variables have cleared out.

### B. Boundary Conditions & Logistics Constraints
To prevent processing errors, the engine cross-checks and clamps variables using an explicit constraint block (`enforceBoundaries()`) before rendering the visual screen:
* **Joule Containment Ceiling:** Raw power cannot naturally pass its active storage array cap (initially 100 Joules, expanding to 150J via Path A or 200J via Path B Leyden Jars). Surplus power is vented.
* **Logistics Warehouse Cap:** Wire items cannot exceed active structural rack capabilities (initially 20 spools). When full, manual forging is blocked, automated loops halt tracking, and a bright flashing text alert (`#banner-logistics-blocked`) pops onto the dashboard screen.

### C. Automated Pneumatic Loom Metrics
Once built, the loom automates wire production by tracking progress intervals against a set power drain:
* **LOW Tension:** Drains `2 Joules/sec`. Spools `1 Wire every 10 seconds`. Features a 0% mechanical snap risk.
* **MED Tension:** Drains `5 Joules/sec`. Spools `1 Wire every 5 seconds`. Features a 0% mechanical snap risk.
* **HIGH Tension:** Drains `15 Joules/sec`. Spools `1 Wire every 2 seconds`. Carries a continuous **10% random chance to snap** on every 2-second completion check.
  * **The Snap Event:** If a failure occurs, the loom changes its visual text tracker to a red `BROKEN/HALT` and freezes all production progress indicators. It displays a `[ REPAIR LOOM ]` button, requiring a manual expenditure of 10 Joules to reset tracking clocks and re-thread the machinery.

### D. Stage 0 Mechanical Lifecycle
The primary gameplay loop transitions through four distinct execution states based on resource accumulation, ideological selection, and threat mitigation:
STATE 0: STATIC CHILL
│  (Manual Crank Dynamo ──► Generates Joules)
▼
STATE 1: THE SPARK-GAP RECEIVER
│  (Accumulate 10 Wiring ──► Build Bluff-Side Turbine ──► Passive Joule Gen)
│  (Reach 50 Joules ──► Trigger Morse Code Decryption Timer)
▼
STATE 2: THE IDEOLOGICAL FORK
├──► [PATHWAY A: ACCEPT POUGHKEEPSIE TERMS] (AC Grid Setup)
└──► [PATHWAY B: REJECT THE TERMS]          (DC Grid Isolation)
▼
STATE 3: DEFENSIVE ENGAGEMENT
│  (Automated Edison Trust Sabotage Events Trigger)
│  (Player builds Path-Specific defenses to maintain Grid Stability)
▼
STATE 4: REGIONAL STABILIZATION
│  (Fulfill Stage Win Requirements)
└──► [ACTIVATE EXPEDITION CRATE] ──► Migration Sequence to Stage 1

---

## 3. GAMEPLAY WALKTHROUGHS & REGIONAL LOOPS

### Stage 0: Wardenclyffe (The Reboot)
* **Theme:** Kinetic friction, dead silence, and awakening ancient technology.
* **Initial State:** The viewport renders a completely blank terminal window, a Status HUD showing `LOCAL GRID STATUS: OFFLINE`, and a single active button: `[ CRANK DYNAMO ]`. 

#### Phase 1: The First Spark
The player manually cranks the dynamo. Every tap increments `joules`. If clicked at or above the starting `100J` containment ceiling, a conditional gate blocks production text and logs: `\u26A0\uFE0F Joule containment ceiling reached. Excess energy vented.` At 20 Joules, `[ FORGE COPPER WIRING ]` unlocks. The player pieces together raw wire spools. At 10 Wiring, `[ ASSEMBLE BLUFF-SIDE TURBINE ]` unlocks, establishing the station's first passive 1Hz automated generation tick (+1 J/sec).

#### Phase 2: The Decryption Banner
The exact moment the station reaches **50 Joules**, the receiver triggers an intercept event. The top viewport panel overrides with a scrolling cyan alert: `\uD83D\uDCE1 ►NEW SIGNAL INCOMING`. A 30-second countdown initializes. The player is forced to monitor the feed while maintaining manual resource harvesting loops. When the timer hits zero, a high-priority blueprint choice card is presented.

#### Phase 3: The Ideological Divergence
* **PATHWAY A: Alternating Current (Accept Poughkeepsie's Terms)**
  * **Narrative:** The player signs a transmission pact with the distant Poughkeepsie Station Relay.
  * **Immediate Effect:** The baseline Joule storage capacity ceiling instantly scales from 100J up to **150J**, clearing physical limits to handle high-voltage distribution.
  * **Unlocks:** Access to the automated **Pneumatic Loom** (converts Joules to Wire) and the **Wire Spool Rack** upgrade (costs 80 Joules / 10 Wiring; expands wire storage cap by +20).
  * **The Threat:** Active **Edison Trust Sabotage Attacks** fire via the 1Hz loop, attempting to steal wire or force short circuits.
  * **Win Condition:** Stabilize **5 AC Generators** and accumulate **40 stored Copper Wires**.

* **PATHWAY B: Direct Current (Reject the Terms)**
  * **Narrative:** The player rejects external corporate and relay alliances, locking down the station into a highly insulated, self-reliant loop.
  * **Immediate Effect:** Unlocks immediate local storage expansions via the **Leyden Jar Battery** bank, scaling the Joule capacity dynamically (+100J per Leyden Jar) without relying on external network relays.
  * **Unlocks:** Access to the heavy-gauge **Manual Drawing Bench** and specialized **Insulated Ground Shields** to entirely nullify incoming espionage vectors.
  * **The Threat:** Intense **Grid Overload snaps**, causing structural wire degradation if passive automated generation loops run unmonitored.
  * **Win Condition:** Establish **4 DC Dynamo Shunts** and hold **35 Insulated Wires** inside stabilized local cells.

#### Phase 4: Regional Migration
Upon fulfilling the chosen pathway requirements, the main interaction panel switches to a single flashing interface link: `[ INITIALIZE EXPEDITION CRATE ]`. Clicking this button triggers the Migration Sequence: current local infrastructure variables are scuttled, specialized inventory data is packed into a transportable matrix state, and the viewport updates to load **Stage 1: Poughkeepsie (The Kinetic Generation)**.

---

## 4. MILESTONE LOGS & GAMEPLAY DESIGN TRACKS

### Milestone 1: Core Engine Porting & Mobile Validation (May 2026)
* **Operational Summary:** Successfully ported the game structure away from complex React framework wrappers and simplified it into clean native HTML/CSS/JS files. Verified layout scaling inside Chromebook local server viewports and mobile phone tunnels.
* **Observations on Initial Balance Math:**
  * Manual clicking ratios feel tight; requiring 10 clicks to forge a wire means early automation choices feel highly impactful.
  * High-tension loom adjustments require active screen attention due to the sudden 10% snap lottery. This introduces a great risk-vs-reward loop before automation takes over.
* **Resolved Structural Syntax Errors:** Cleared up a series of open bracket errors inside the main user interface renderer and synchronized caching selector names (`elJoules`, `elWiring`) across files to protect script loading. Cleaned corrupt character symbols out of background logs to ensure clean unicode display on mobile web layers.

### Milestone 2: Balance Pass & Tech Refinement (May 2026)
* **Operational Summary:** Standardized the early progression timeline. Re-anchored the spark-gap receiver sequence to execute immediately upon crossing the 50 Joule landmark.
* **Cleaned Redundancies:** Stripped out repetitive walkthrough rules from historic logs to make documentation completely streamlined and lightweight.

### Milestone 3: Path B Requirements & UI Improvements (May 2026)
* **Operational Summary:** Path B (the DC technology) creates the initial Leyden Jar and increases max Joules to 200J. Subsequent Leyden Jars increase max Joules by +100J for each additional jar.
* **User Interface Improvements:** Buttons for technology that has been unlocked, but lacks required resources are dimmed. When resources become available, the button displays normally and activates with a visual fading effect.

### Milestone 4: The New York State Expansion Blueprint (June 2026)
* **Operational Summary:** Officially decoupled the core engine from a single-site design and mapped out a multi-stage regional progression framework across four New York locations. 
* **Design Breakthroughs:** Established a definitive 8-step regional gameplay loop (Arrive, Build, Decrypt, Branch, Survive, Monolith, Stabilize, Migrate) and structured a 3-fork ideological narrative tree yielding 8 distinct endpoints.
* **Architectural Impact:** Planned 1Hz loop modifications to act as a regional state machine, dynamically swapping resource labels (e.g., Hydro-Buoys vs. Vault Banks) based on player tech-branching decisions.

### Milestone 5: UI Viewport Tracking & Capacitor Logic Tuning (June 2026)
* **Operational Summary:** Successfully designed and deployed a live viewport-tracking notification banner for mobile/Chromebook screen optimization. Restructured Path A execution sequences to allow safe inventory capacity overshoots during high-energy discharges.
* **Resolved Structural Syntax Errors:** 
  * Fixed an issue where the global `enforceBoundaries()` loop prematurely clipped inventory gains back down to the baseline warehouse cap. Updated `btnOvercharge` to dynamically expand `wireStorageCap` at the moment of discharge.
  * Corrected an AI reference drift loop during the sandbox session by enforcing a strict script re-upload check, validating variable alignment before finalizing code injection blocks.

### Milestone 6: Poughkeepsie Tech Alignment & Kinetic Overflow Fix (June 2026)
* **Poughkeepsie Narrative Integration:** Updated early-stage Morse reception logs, transitioning text references from "Station Omaha" to "Poughkeepsie Station" to bridge Stage 0 with the regional New York State expansion.
* **Encoding Stabilization:** Standardized all narrative script event logs to utilize native 16-bit JavaScript Unicode escape sequences (`\uD83D\uDCE1` for Radio Towers, `\u26A1` for High Voltage, `\u26A0\uFE0F` for Warning Signs) rather than raw graphical emojis, preventing paste corruption inside VS Code.
* **AC Path Economic Balance:** Resolved Stage 0 structural soft-locks by lowering purchase thresholds for `Build Wire Spool Rack` to 80 Joules and 10 Wiring. Patched Alternating Current (AC) tech branch selection to instantly scale base Joule storage to 150 Joules upon choice confirmation.
* **Kinetic Crank Gatekeeper Bugfix:** Corrected an issue where manual dynamo clicks blindly reported energy production at max capacity. Built a conditional gate checking current resource ceilings before logging text; clicking at or above capacity now blocks standard output and triggers a distinct warning: `\u26A0\uFE0F Joule containment ceiling reached. Excess energy vented.`

### Milestone 7: Asynchronous Construction Queues & Scalable Engine Core (June 2026)
* **Global Construction Cooldown:** Implemented a global 5-second structural queue lockout to simulate construction assembly times for advanced layout items (e.g., AC Generators and Leyden Jar Batteries). Integrated tracking state into the 1Hz heartbeat loop, forcing affected button labels to dynamically render live countdown strings (e.g., `[ Assembling... 5s ]`) and dimming opacity to `0.35` during construction.
* **Asynchronous Resource Yield Modification:** Patched an exploitation vector where permanent structural state modifications applied instantly at the start of a countdown. Restructured click handlers to execute resource cost deductions upfront, while deferring structural state rewards until the master countdown explicitly completes at zero.
* **Object-Oriented Callback Architecture:** Future-proofed the 1Hz master engine loop for upcoming multi-stage progression (Stages 1–4) by eliminating rigid, hardcoded string-matching tags. Transitioned the build queue state to accept an object-oriented payload containing an executable anonymous completion function (`onComplete`).

### Milestone 8: Full State Encapsulation Refactor (August 2026)
* **Operational Summary:** Completed a comprehensive 3-step engine refactor, eliminating over 25 loose global variables in favor of a single, deeply nested `gameState` source-of-truth object tree (`gameState.resources`, `gameState.caps`, `gameState.structures`, `gameState.queues`, `gameState.combat`, `gameState.meta`, `gameState.uiState`).
* **Architectural Breakthroughs:**
  * **Unified State Management:** Bound all early-game mechanics—including the Pneumatic Loom (tension settings and 10% snap lottery), Bluff-side Turbines, 50-Joule Morse code intercept, and Path A/B branching—directly to the encapsulated state tree.
  * **Asynchronous Queue Synchronization:** Standardized global build queues to execute callbacks using structural payload references, ensuring UI rendering updates cleanly across tick intervals.
  * **Zero Global Pollution & Controlled Persistence:** Cleaned the global scope in `script.js` to ensure 100% data encapsulation. While `gameState` is engineered for instant `JSON.stringify()` serialization, `localStorage` auto-saving is intentionally kept disabled during development to allow instant browser-refresh resets on mobile/Chromebook viewports without DevTools.

---

## 5. TODO's & FUTURE DESIGN EXPERIMENTS

### A. User Interface Concepts
* **Button State Dimming:** (Implemented in Milestone 3) Button labels dim when resources are insufficient.
* **Top Viewport Scroll Alert Banner:** (Implemented in Milestone 5) Alerts players to unread system notices when scrolled out of view.
* **Breakthrough Modals (Unlock Splash Screens):** (Planned) Inserting visual text banners displaying full-screen lore snapshots when Path A or Path B is signed or when major technologies are first unlocked.
* **Acoustic Landscape (HTML5 Audio API):** (Planned) Integrating raw, low-frequency synthetic synthesizer oscillators natively inside JavaScript:
  * Electro-mechanical clicks when starting generator machinery.
  * High-to-low slide when a loom snaps under high tension.
  * Low-to-high siren slide during Edison Trust sabotage events.

### B. Mechanics & Balance Experiments
* **Asynchronous Build Timers:** (Implemented in Milestone 7) Applied 5-second assembly countdowns to advanced structures.
* **Pneumatic Loom Power Switch:** (Planned) Add an ON/OFF toggle for the Pneumatic Loom to prevent unintended early-game resource draining races against manual dynamo cranking.
* **Schematic Assembly (Component Combination):** (Planned) Combining specific configurations of components and energy to unlock new technologies (fixed recipes vs. open player experimentation).
* **Component Optimization (Vertical Upgrades):** (Planned) Spending extra Joules and Wire to permanently improve existing structure yields (e.g., Level 1 AC Gen + 20 Wires ──► Level 2 AC Gen).
* **Pacing Dial Options to Benchmark:**
  1. *Fixed Cooldown (Dial A):* Standardized 5-second lockout for predictable pacing.
  2. *Instant Gratification (Dial B):* No cooldown limits; rewards strategic inventory dumps.
  3. *Escalating High-Stakes Cooldown (Dial C):* Adds +5 seconds per successive upgrade level while scaling output exponentially, creating vulnerability windows during corporate raids.

### C. Storyline & Narrative Progression Roadmap
* **Narrative Unfolding:** Continue shifting terminal log displays from debugging-style diagnostics to rich, atmospheric storytelling.
* **Goal Target Cues:** Introduce dynamic story log entries prompting players on exact requirements to clear stage milestones (e.g., target defense counts, required J/sec generation rates, or storage limits).
* **4-Stage Regional Arc:**
  1. **Wardenclyffe:** Reboot station, intercept Morse message, pick AC vs. DC branch, defend against Edison Trust raids, migrate.
  2. **Poughkeepsie:** Explore kinetic hydro-generation, navigate corporate espionage, expand regional grid ties.
  3. **Ithaca:** Master high-capacity energy storage, ground distribution networks, and advanced decryption.
  4. **Niagara Falls:** Construct the final regional monolith; resolve the narrative across 8 distinct branching endpoints based on historical tech choices.
