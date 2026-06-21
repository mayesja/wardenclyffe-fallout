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

---

## 3. GAMEPLAY WALKTHROUGHS & SYSTEM RECONCILIATION

### A. Pathway A: Alternating Current (AC) Tech Branch
*Design Strategy: High-yield automation expansion, heavy resource risks, and frequency delay defense.*

```
[ START: 0 Joules ] ──► Manual Crank ──► Forge Wire ──► Build Loom ──► Hit 50 Joules
                                                                            │
   ┌────────────────────────────────────────────────────────────────────────┘
   ▼
[ 30-Second Morse Decode Clock ] ──► Accept Omaha Deal [A] (Cost: 15 Wiring)
   │
   ├─────────────────────────────────────────┐
   ▼                                         ▼
[ Build AC Generators ]                   [ Build Faraday Cages ]
(Cost: 20J + 5W ──► +5J/s)                 (Cost: 20W ──► Extends Safety Delay +15s)
   │                                         │
   └────────────────────┬────────────────────┘
                        │
                        ▼
           [ One-Time Capacitor Overcharge ]
           (Dumps raw Joules into massive Wire)
                        │
                        ▼
         [ TARGET: 5 AC GENS + 40 STORED WIRES ] ──► ★ WIN CONDITION A ACHIEVED ★
```

* **Phase 1 (Ignition):** The player cranks the dynamo manually to reach 10 Joules, unlocks wiring forgery, and hoards 50 Joules to build the Automated Loom. Upon hitting 50 Joules, the spark-gap receiver engages, prompting a 30-second live cyan top countdown banner.
* **Phase 2 (The Decision):** When the clock hits zero, the player accepts Omaha's terms, trading 15 wire spools for the AC schematic. The master dashboard tracking label instantly swaps its context from `COILS` to `AC GENS`.
* **Phase 3 (The Threat):** The Edison Trust attacks aggressively on a fast **30-second baseline loop**. During an active 10-second lockout attack, generation drops to zero, and **5 stored wires are ripped from inventory**. The player hoards resources to construct **Faraday Cages** (`Cost: 20 Wiring`), which permanently pad an extra `+15 seconds` onto the attack frequency clock to delay strikes.
* **Phase 4 (The Surge & Victory):** The player constructs **AC Generators** (`Cost: 20 Joules + 5 Wiring`), rocketing passive generation upward by `+5 Joules/sec` per unit. To prevent power waste against the 100-Joule cap, the player utilizes the one-time **`[ CAPACITOR OVERCHARGE ]`** blast to instantly melt all stored power directly into wire. The game is won once the player stabilizes **5 AC Generators and 40 stored Copper Wires**.

### B. Pathway B: Direct Current (DC) Tech Branch
*Design Strategy: Large storage capacity, steady passive tracking, and high resource protection shields.*

```
[ START: 0 Joules ] ──► Manual Crank ──► Forge Wire ──► Build Loom ──► Hit 50 Joules
                                                                            │
   ┌────────────────────────────────────────────────────────────────────────┘
   ▼
[ 30-Second Morse Decode Clock ] ──► Reject Omaha Deal [B] (Cost: 10 Wiring)
   │
   ├─────────────────────────────────────────┼─────────────────────────────────────────┐
   ▼                                         ▼                                         ▼
[ Assemble Tesla Coils ]                  [ Build Leyden Jars ]                     [ Build Junction Boxes ]
(Cost: 10W ──► +1J/s)                      (Cost: 5W ──► Cap Doubles to 200J)        (Cost: 200J ──► Blunts Damage -50%)
   │                                         │                                         │
   └─────────────────────────────────────────┼─────────────────────────────────────────┘
                                             │
                                             ▼
                             [ TARGET: 10 COILS + 30 STORED WIRES ] ──► ★ WIN CONDITION B ACHIEVED ★
```

* **Phase 1 (Ignition):** Identical manual power ramping and loom assembly as Path A until the Morse transmission clock successfully completes its countdown.
* **Phase 2 (The Decision):** The player denies Omaha's deal, choosing to turtle behind local isolation fields. They spend 10 wire spools, and the header status row switches over to `OPERATIONAL POWERED`.
* **Phase 3 (The Protection):** Because local DC lines emit lower signatures, the Edison Trust loop runs on a wider, slower **45-second baseline tracking interval**. Hostile raids only cause a **lighter baseline loss of 3 wire spools**. To neutralize this damage, the player saves 200 Joules to assemble a protected **Junction Box**. Each active Box divides incoming wire theft by half, reducing threat impacts to just 1 single wire spool.
* **Phase 4 (The Battery Bank & Victory):** The player quickly spends 5 wires to build the **Leyden Jar** array, permanently doubling the storage capacity from `/ 100` to **`/ 200`** Joules to capture energy without waste. They scale out stable **Tesla Coils** (`Cost: 10 Wiring`) to accumulate steady `+1 Joule/sec` ticks. Victory is claimed once the dashboard logs **10 active Tesla Coils and 30 stored Copper Wires**.

### C. Technical Reconciliation Ledger
| Operational Metric | Base Baseline State | Path A: Alternating Current (AC) | Path B: Direct Current (DC) |
| :--- | :--- | :--- | :--- |
| **Grid Status Row** | `OFFLINE` | `OPERATIONAL POWERED` | `OPERATIONAL POWERED` |
| **Joule Storage Limit**| 100 Joules Maximum | 100 Joules Maximum | **200 Joules Maximum** (Leyden Tech) |
| **Primary Machine Asset**| Tesla Coils (+1J/s) | **AC Generators (+5J/s)** | Tesla Coils (+1J/s) |
| **Dashboard Metric Node**| `COILS` | **`AC GENS`** | `COILS` |
| **Threat Frequency Clock**| No Threats Triggered | Fast Attack Cycle (30s Base) | **Slower Attack Cycle (45s Base)** |
| **Ambush Wire Penalties**| No Threats Triggered | Severe Resource Theft (-5 Wire) | **Moderate Resource Theft (-3 Wire)** |
| **Unique Blueprint Unlocks**| Baseline Items | **Faraday Cages** (+15s Delay) | **Junction Boxes** (Damage Blunting) |
| **Emergency Burst Button**| Hidden / Locked | **Capacitor Overcharge** (Active) | Hidden / Unavailable |
| **Win Criteria Metrics** | Goal Hidden | **5 AC Generators + 40 Wires** | **10 Tesla Coils + 30 Wires** |

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
    
---

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
* **Breakthrough Modals (Unlock Splash Screens):** Inserting simple visual text banners that display full-screen lore snapshots when Path A or Path B is initially signed.

### Future Gameplay Experiments (Status: Planned / Not Yet Implemented)
The following mechanics are currently being evaluated as design experiments for upcoming iterations to gather insights for larger collaboration blueprints:
*  **Build timers:**  When higher level technologies are built there will be a countdown timer until they are "online" and ready to use or start to take effect.  For example, building a Tesla Coil has a 5 second timer after being built but before it starts generating power.
   * Should building additional technologies be blocked until the countdown timer expires (dim the build buttons)?
   * Or should there be a construction queue?
* **Schematic Assembly (Item Combination):** Combining specific configurations of components and energy within the panel to generate new technologies.
* **Component Optimization (Item Upgrades):** Spending extra Joules (or other components) to permanently improve the output of existing technology.  (e.g., increasing TESLA COILS output from +1J/s to +2J/s by adding 5 WIRING).
* **Wiring Rack lockout** Allow Path A to build Wiring Storage Rack (construction requires 150J, but Path A is limited to 100J). -- Building AC Generators also raises max Joules  Lower the cost to build storage rack  
* **Capacitor Discharge lockout** Prevent situation where CAPACITOR DISCHARGE is used prematurely and prevents accomplishing the 1st goal (40 Wiring with a 20 Wiring storage limit). -- Raise the limit  Allow re-use  Lower the goal requirement

  
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
     1. Wardclyffe -- Initial technology, first message & story path choice, first attacks & defenses, accomplish first goal, prepare to move
     2. Poughkeepsie -- Hydro generation technology explored, second message & story path choice, attacks and defenses, second goal, prepare to move
     3. Ithaca -- Storage & distribution technology explored, third message & story path choice, attacks & defenses, third goal, prepare to move
     4. Niagra Falls -- Endgame technology, accomplish final goal based on story path choices (eight possible endings)
  


---
