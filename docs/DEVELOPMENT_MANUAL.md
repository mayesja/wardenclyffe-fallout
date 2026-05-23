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
