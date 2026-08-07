# Wardenclyffe Field Station: Master Development Manual

This master manual unifies the technical file architecture, layout specifications, mechanical engines, narrative walkthroughs, and current milestone logs for **Wardenclyffe Field Station**. It serves as the single source of truth for the project's technical framework and ongoing gameplay experiments.

---

## 1. CODEBASE & INTERFACE ARCHITECTURE

### A. Three-File System Map
The codebase is intentionally separated into three clean, standard files to optimize local execution and ease of management on Chromebook viewports:
1.  **`index.html` (The Structure):** Defines the hard physical layout grid, structural buttons, text injection nodes, and hidden overlay panels.
2.  **`style.css` (The Presentation):** Handles the terminal aesthetic, applying a 512px width constraint to emulate a phone screen, text glowing shadows, animation clocks, and color variables.
3.  **`script.js` (The Logic):** Holds the master core state variables, hooks player button actions, tracks processing intervals, and manages the 1Hz interval clock loop.

### B. Viewport Modules & Visual Geometry
The mobile interface divides the 512px application frame vertically into five distinct modules:
* **The Fixed Header HUD:** Contains the station visual banner and a live layout connector mapping `LOCAL GRID STATUS` (`OFFLINE`, `OPERATIONAL POWERED`, or `SABOTAGED LOCKOUT`). It includes the `#alert-banner` element which forces itself onto the top layer of the layout during decoding sequences (Cyan highlight) or attacks (Ember Red).
* **The Terminal Log Box (`#terminal-log`):** A fixed 160px high viewport window with a hidden scrolling layout. It continuously accepts stylized diagnostic logging text (`log-system`, `log-action`, `log-unlock`, `log-warning`) and automatically forces its scrollbar position downward to lock onto incoming entries.
* **The Resource Readout Dashboard (`.stats-grid`):** A CSS Grid module displaying primary player assets (Joules, Wiring, and a variable tracking element whose title changes text dynamically from `COILS` to `AC GENS` depending on technological branching alignment).
* **The Actions Panel (`.actions-panel`):** A linear vertical stack acting as the core control panel. Interactive elements, card grids, and speed selectors use the `.hidden` class utility properties to seamlessly toggle into and out of visibility depending on resource thresholds.
* **The Lower Quick-Stats Bar (`.game-footer`):** A fixed footer panel positioned at the bottom margin edge tracking raw integer readouts, generation scales, active threat warnings (`TRUST ⚠`), and defense infrastructure assets.

### C. Viewport Scroll Alert Banner Logic
* **Trigger Mechanics:** Evaluated inside the core `writeLog()` pipeline. If an incoming entry carries a high-priority structural class (`log-system`, `log-unlock`, `log-warning`) and the `#terminal-log` container is detected outside the active visual viewport boundaries, the `.scroll-alert-banner` is toggled into active visibility.
* **Exclusion Constraints:** Routine manual interaction events (e.g., direct kinetic cranking or manual wire forging) are strictly blacklisted from the trigger check to prevent banner notification spam during early game grinding.
* **Dismissal Loop:** Bound to a click event listener on the banner element. Clicking initiates a smooth scroll interpolation forcing the player's viewport back to the top terminal layout, instantly clearing the banner's active visibility state.
* 
---

## 2. THE MECHANICAL ENGINE & BALANCE ARCHITECTURE

### A. The 1Hz Core Loop
The game relies completely on a single master background heartbeat loop (`setInterval`) running exactly every 1000 milliseconds to handle calculations. This single tick coordinates three main automated functions:
1.  **Passive Generation:** Automatically computes current generator counts and injects extra power directly into core reserves (`joules += generatedJoules`).
2.  **Loom Timeline Tracking:** Advances processing clock metrics (`loomProgressMs += 1000`) if power supplies satisfy active consumption costs.
3.  **Hostile Scheduler Tracking:** Decrements background encounter clocks and checks if countdown variables have cleared out.

### B. Boundary Conditions & Logistics Constraints
To prevent processing errors, the engine cross-checks and clamps variables using an explicit constraint block (`enforceBoundaries()`) before rendering the visual screen:
* **Joule Containment Ceiling:** Raw power cannot naturally pass its active storage array cap (initially 100 Joules, expanding to 200 Joules via Path B technology). Surplus power is vented.
* **Logistics Warehouse Cap:** Wire items cannot exceed active structural rack capabilities (initially 20 spools). When full, manual forging is blocked, automated loops halt tracking, and a bright flashing text alert (`#banner-logistics-blocked`) pops onto the dashboard screen.

### C. Automated Pneumatic Loom Metrics
Once built, the loom automates wire production by tracking progress intervals against a set power drain:
* **LOW Tension:** Drains `2 Joules/sec`. Spools `1 Wire every 10 seconds`. Features a 0% mechanical snap risk.
* **MED Tension:** Drains `5 Joules/sec`. Spools `1 Wire every 5 seconds`. Features a 0% mechanical snap risk.
* **HIGH Tension:** Drains `15 Joules/sec`. Spools `1 Wire every 2 seconds`. Carries a continuous **10% random chance to snap** on every 2-second completion check.
    * *The Snap Event:* If a failure occurs, the loom changes its visual text tracker to a red `BROKEN/HALT` and freezes all production progress indicators. It displays a `[ REPAIR LOOM ]` button, requiring a manual expenditure of 10 Joules to reset tracking clocks and re-thread the machinery.

### D. Stage 0 Mechanical Lifecycle
The primary gameplay loop transitions through four distinct execution states based on resource accumulation, ideological selection, and threat mitigation:---

STATE 0: STATIC CHILL
│  (Manual Crank Dynamo ──► Generates Joules)
▼
STATE 1: THE SPARK-GAP RECEIVER
│  (Accumulate 10 Wiring ──► Build Tesla Coil ──► Passive Joule Gen)
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
The player manually cranks the dynamo. Every tap increments `joules`. If clicked at or above the starting `100J` containment ceiling, a conditional gate blocks production text and logs: `\u26A0\uFE0F Joule containment ceiling reached. Excess energy vented.` At 20 Joules, `[ FORGE COPPER WIRING ]` unlocks. The player pieces together raw wire spools. At 10 Wiring, `[ ASSEMBLE TESLA COIL ]` unlocks, establishing the station's first passive 1Hz automated generation tick (+1 J/sec).

#### Phase 2: The Decryption Banner
The exact moment the station reaches **50 Joules**, the receiver triggers an intercept event. The top viewport panel overrides with a scrolling cyan alert: `\uD83D\uDCE1 ►NEW SIGNAL INCOMING`. A 30-second countdown initializes. The player is forced to monitor the feed while maintaining manual resource harvesting loops. When the timer hits zero, a high-priority blueprint choice card is presented.

#### Phase 3: The Ideological Divergence
* **PATHWAY A: Alternating Current (Accept Poughkeepsie's Terms)**
    * *Narrative:* The player signs a transmission pact with the distant Poughkeepsie Station Relay.
    * *Immediate Effect:* The baseline Joule storage capacity ceiling instantly scales from 100J up to **150J**, clearing the physical limits to handle high-voltage distribution.
    * *Unlocks:* Access to the automated **Pneumatic Loom** (converts Joules to Wire) and the **Wire Spool Rack** upgrade (costs 80 Joules / 10 Wiring; expands wire storage cap by +20).
    * *The Threat:* Active **Edison Trust Sabotage Attacks** fire via the 1Hz loop, attempting to steal wire or force short circuits.
    * *Win Condition:* Stabilize **5 AC Generators** and accumulate **40 stored Copper Wires**.

* **PATHWAY B: Direct Current (Reject the Terms)**
    * *Narrative:* The player rejects external corporate and relay alliances, locking down the station into a highly insulated, self-reliant loop.
    * *Immediate Effect:* Unlocks immediate local storage expansions via the **Leyden Jar Battery** bank, scaling the Joule capacity dynamically without relying on external network relays.
    * *Unlocks:* Access to the heavy-gauge **Manual Drawing Bench** and specialized **Insulated Ground Shields** to entirely nullify incoming espionage vectors.
    * *The Threat:* Intense **Grid Overload snaps**, causing structural wire degradation if passive automated generation loops run unmonitored.
    * *Win Condition:* Establish **4 DC Dynamo Shunts** and hold **35 Insulated Wires** inside stabilized local cells.

#### Phase 4: Regional Migration
Upon fulfilling the chosen pathway requirements, the main interaction panel switches to a single flashing interface link: `[ INITIALIZE EXPEDITION CRATE ]`. Clicking this button triggers the Migration Sequence: current local infrastructure variables are scuttled, specialized inventory data is packed into a transportable matrix state, and the viewport updates to load **Stage 1: Poughkeepsie (The Kinetic Generation)**.


---

## 4. MILESTONE LOGS & GAMEPLAY DESIGN TRACKS

### Milestone 1: Core Engine Porting & Mobile Validation (May 2026)
* **Operational Summary:** Successfully ported the game structure away from complex React framework wrappers and simplified it into clean native HTML/CSS/JS files. Verified layout layout scaling inside Chromebook local server viewports and mobile phone tunnels.
* **Observations on Initial Balance Math:**
    * Manual clicking ratios feel tight; requiring 10 clicks to forge a wire means early automation choices feel highly impactful.
    * High-tension loom adjustments require active screen attention due to the sudden 10% snap lottery. This introduces a great risk-vs-reward loop before automation takes over.
* **Resolved Structural Syntax Errors:** Cleared up a series of open bracket errors inside the main user interface renderer and synchronized caching selector names (`elJoules`, `elWiring`) across files to protect script loading. Cleaned corrupt character symbols out of background logs to ensure clean unicode display on mobile web layers.

### Milestone 2: Balance Pass & Tech Refinement (May 2026)
* **Operational Summary:** Standardized the early progression timeline. Re-anchored the spark-gap receiver sequence to execute immediately upon crossing the 50 Joule landmark.
* **Cleaned Redundancies:** Stripped out repetitive walkthrough rules from historic logs to make documentation completely streamlined and lightweight.

### Milestone 3: Path B requirements and UI improvements (May 2026)
* **Operational Summary:** Path B (the DC technology) creates the initial Leyden Jar and increases max Joules to 200.  Subsequent Leyden Jars increase max Joules by 100J for each addtional jar.
* **User Interface Improvements** Buttons for technology that has been unlocked, but do not have the required resources are dimmed.  When the resources are available, the button displays normally and is active.  There is a fading effect visual.

### Milestone 4: The New York State Expansion Blueprint (June 2026)
* **Operational Summary:** Officially decoupled the core engine from a single-site design and mapped out a multi-stage regional progression framework across four New York locations. 
* **Design Breakthroughs:** Established a definitive 8-step regional gameplay loop (Arrive, Build, Decrypt, Branch, Survive, Monolith, Stabilize, Migrate) and structured a 3-fork ideological narrative tree yielding 8 distinct endpoints.
* **Architectural Impact:** The 1Hz core loop will be modified in future sprints to act as a regional state machine, dynamically swapping resource labels (e.g., Hydro-Buoys vs. Vault Banks) based on player tech-branching decisions.

### Milestone 5: UI Viewport Tracking & Capacitor Logic Tuning (June 2026)
* **Operational Summary:** Successfully designed and deployed a live viewport-tracking notification banner for mobile/Chromebook screen optimization. Restructured the Path A execution sequence to allow safe inventory capacity overshoots during high-energy discharges.
* **Resolved Structural Syntax Errors:** 
  * Fixed an issue where the global `enforceBoundaries()` loop prematurely clipped inventory gains back down to the baseline warehouse cap. Updated `btnOvercharge` to dynamically expand `wireStorageCap` at the moment of discharge.
  * Corrected an AI reference drift loop during the sandbox session by enforcing a strict script re-upload check, validating variable alignment before finalizing code injection blocks.

### Milestone 6: Poughkeepsie Tech Alignment & Kinetic Overflow Fix (June 2026)
* **Poughkeepsie Narrative Integration:** Officially updated the early-stage Morse reception logs, transitioning text references from "Station Omaha" to "Poughkeepsie Station" to seamlessly bridge the Stage 0 tutorial with the upcoming regional New York State expansion framework.
* **Encoding Stabilization:** Standardized all narrative script event logs to utilize native 16-bit JavaScript Unicode escape sequences (`\uD83D\uDCE1` for Radio Towers, `\u26A1` for High Voltage, `\u26A0\uFE0F` for Warning Signs) rather than raw graphical emojis, preventing paste corruption inside VS Code and rendering smoothly on mobile browser viewports.
* **AC Path Economic Balance:** Resolved the Stage 0 structural soft-lock by lowering the purchase threshold for the first `Build Wire Spool Rack` from 150 Joules down to 80 Joules and 10 Wiring. Concurrently, patched the Alternating Current (AC) tech branch selection to instantly scale the base Joule storage ceiling to 150 Joules upon choice confirmation, ensuring players can comfortably accumulate resources under the cap.
* **Kinetic Crank Gatekeeper Bugfix:** Corrected an issue where the manual dynamo click handler blindly reported energy production at max capacity. Built a conditional gate inside the handler function to check the current resource ceiling before logging text; clicking at or above maximum capacity now actively blocks the standard output and triggers a distinct warning: `\u26A0\uFE0F Joule containment ceiling reached. Excess energy vented.`

### Milestone 7: Asynchronous Construction Queues & Scalable Engine Core (June 2026)
* **Global Construction Cooldown:** Implemented a global 5-second structural queue lockout to simulate construction assembly times for advanced layout items (e.g., AC Generators and Leyden Jar Batteries). Integrated the tracking state directly into the 1Hz heartbeat loop, forcing affected button labels to dynamically render live countdown strings (e.g., `[ Assembling... 5s ]`) and dimming opacity to `0.35` during construction.
* **Asynchronous Resource Yield Modification:** Patched an exploitation vector where permanent structural state modifications (e.g., `acGenerators++`) applied instantly at the start of a countdown. Restructured click handlers to execute resource cost deductions upfront, while deferring structural state rewards until the master countdown explicitly completes at zero.
* **Object-Oriented Callback Architecture:** Future-proofed the 1Hz master engine loop for upcoming multi-stage progression (Stages 1–4) by eliminating rigid, hardcoded string-matching tags. Transitioned the `structureInQueue` state to accept an object-oriented payload containing an executable anonymous completion function (`onComplete`). Advanced structures across all future regions can now pass custom localized completion rewards without requiring structural modifications to the core engine loop.

### Milestone 8: Full State Encapsulation Refactor (August 2026)
* **Operational Summary:** Completed a comprehensive 3-step engine refactor, eliminating over 25 loose global variables in favor of a single, deeply nested `gameState` source-of-truth object tree (`gameState.resources`, `gameState.caps`, `gameState.structures`, `gameState.queues`, `gameState.combat`, `gameState.meta`, `gameState.uiState`).
* **Architectural Breakthroughs:**
  * **Unified State Management:** Bound all early-game mechanics—including the Pneumatic Loom (tension settings and 10% snap lottery), Bluff-side Turbines, 50-Joule Morse code intercept, and Path A/B branching—directly to the encapsulated state tree.
  * **Asynchronous Queue Synchronization:** Standardized global build queues to execute callbacks using structural payload references, ensuring UI rendering updates cleanly across tick intervals.
  * **Zero Global Pollution:** Cleaned the global scope in `script.js` to ensure 100% data encapsulation, preparing the baseline engine for future multi-stage geographical transitions (Poughkeepsie, Ithaca, Niagara) and mobile viewport performance optimization.* 


---
## 5.  TODO's

### Future User Interface Concepts (Status: Planned / Not Yet Implemented)
The following UI concepts should be added or repaired to improve playing exerience:
*  **Dim button text for unavailble options:** Make button label text dim when that button cannot be used.  For example FORGE COPPER WIRING should be dim when the JOULE count is too low.
   *  Added in Milestone 3
*  **Message & Warning alerts:** When a new message (blue notices) or warning (red notices) occur, and the player has scrolled down so that the messages panel is not visible then there will be a banner at the top of the screen to alert the player of the new notice.  Use the same color, and present something like "New notice available. Click here to read."  Clicking on the notice immediately scrolls up to display the message panel.
   *  Added in Milestone 5
* **Acoustic Landscape (HTML5 Audio API):** Integrating raw, low-frequency synthetic synthesizer oscillators natively inside the JavaScript file.
   * Generate audio clicks every time the player starts a TESLA COIL (sounds electro-mechanical). 
   * Generate a high-to-low slide when a loom snaps under high tension (sounds like losing power).
   * Generate a low-to-high slide when an attack occurs (sounds like a warning siren).
* **Breakthrough Modals (Unlock Splash Screens):** Inserting simple visual text banners that display full-screen lore snapshots when Path A or Path B is initially signed.  Or when a major technology is unlocked, or used, for the first time.

### Future Gameplay Experiments (Status: Planned / Not Yet Implemented)
The following mechanics are currently being evaluated as design experiments for upcoming iterations to gather insights for larger collaboration blueprints:
*  **Build timers:**  When higher level technologies are built there will be a countdown timer until they are "online" and ready to use or start to take effect.  For example, building a Tesla Coil has a 5 second timer after being built but before it starts generating power.
   * Should building additional technologies be blocked until the countdown timer expires (dim the build buttons)?
   * Began implementation in Milestone 7
* **Schematic Assembly (Item Combination -- horizontal growth):** Combining specific configurations of components and energy within the panel to generate new technologies.  Fixed recipes for combinations, or open system allowing for player creativity and exploration? 
* **Component Optimization (Item Upgrades -- vertical growth):** Spending extra Joules (or other components) to permanently improve the output of existing technology.  (e.g., Level 1 AC Gen + 20 Wires ──► Level 2 AC Gen). 
* **Pacing Dial Options to Test:**
    1.  *Fixed Cooldown (Dial A):* Standardized flat 5-second lockout for predictable pacing. Ideal for Stage 0 Tutorial synchronization.
    2.  *Instant Gratification (Dial B):* Eliminates cooldown limits entirely upon upgrade click; rewards strategic inventory hoarding and resource dumps.
    3.  *Escalating High-Stakes Cooldown (Dial C):* Adds +5 seconds per successive upgrade level but scales output exponentially. Introduces defensive vulnerabilities, forcing players to check for active corporate raid vectors before taking their grid offline for upgrades.
* **Meta-improvements** Allow for methods to reduce costs, increase limits, lower requirement threshholds
* **Wiring Rack lockout** Allow Path A to build Wiring Storage Rack (construction requires 150J, but Path A is limited to 100J). -- Building AC Generators also raises max Joules / Lower the cost to build storage rack  
* **Capacitor Discharge lockout** Prevent situation where CAPACITOR DISCHARGE is used prematurely and prevents accomplishing the 1st goal (40 Wiring with a 20 Wiring storage limit). -- Raise the limit / Allow re-use / Lower the goal requirement
* **Pneumatic Loom Joule Usage** If the Pneumatic Loom is built before any power generation, it becomes a race between the Loom and clicking CRANK DYNAMO.  Loom probably needs an OFF SWITCH.
### Upgrades & Construct Tuning Paradigms (June 2026 Design Session)
  
### Future Storyline Developments (Status: Planned / Not Yet Implemented)
To create an engaging game to play there needs to be a well-told story.
*  **Initial screen:**  There does not need to be any type of explanation at the very beginning.  There is a message window, a status display, and one button to press.  As the player presses the CRANK DYNAMO button the story can unfold one step at a time in the message window.
*  **Simple story**  The player begins by pressing the CRANK DYNAMO button.  There isn't much context at first, but as technologies are unlocked the story moves forward.
     1. When enough power generators are built, the receiver kicks on and a message is received (small modification).  It takes a few moments to decode.
     2. The player is given an option.  Path A is to accept AC, Path B is to reject and pursue DC.
     3. Both lead to Edison Crew attacks.  And both have defensive technologies, which are different depending on the chosen path.
     4. Each path has an end scenario once the requirements are fulfilled.
* **Messages Panel**  Eventually shift messages displayed in the window from debugging-style to story-telling.  The Replit/React version has some that can be emulated.
   * See if Gemini can recover them from source files and help implement them into the current three files.
* **Goal Target Messages**  Story messages to cue the player about the requirements to achieve a goal.  IE How many defenses to build.  How much J/sec or max storage to build to complete the stage.
* **Story Progression**  Described in the NARRATIVE doc, but briefly:
     1. Wardenclyffe -- Initial technology, first message & story path choice, first attacks & defenses, accomplish first goal, prepare to move
     2. Poughkeepsie -- Hydro generation technology explored, second message & story path choice, attacks and defenses, second goal, prepare to move
     3. Ithaca -- Storage & distribution technology explored, third message & story path choice, attacks & defenses, third goal, prepare to move
     4. Niagra Falls -- Endgame technology, accomplish final goal based on story path choices (eight possible endings)

  
  


---
