# Wardenclyffe Field Station: Core Field Manual & Strategic Walkthrough

This manual serves as the comprehensive tactical blueprints and operational interface schematic for **Wardenclyffe Field Station**, an incremental survival narrative game tracking early 20th-century electromagnetic breakthrough fields against corporate industrial espionage.

---

## 1. THE USER INTERFACE LAYOUT & PANEL GEOMETRY
When a player opens the game terminal on their phone screen, they are presented with a highly structured, 512px-clamped retro-styled monochrome command deck rendered in monospace text (`'Courier New'`). The display uses high-contrast amber illumination accents (`#ffb000`), cyan tech highlights (`#00f0ff`), and alert embers (`#ff3b00`) against a dark void background (`#0a0705`).

The interface is structured vertically into four distinct fixed visual modules:

### A. The Fixed Header HUD
* **Station Banner:** A blocked visual banner reading `▓▒░ WARDENCLYFFE FIELD STATION ░▒▓`.
* **Local Grid Status:** A horizontal read-out row tracking your live connection state. It displays `OFFLINE` in deep amber-red during early-stage development or an active sabotage event, switching to a glowing cyan `OPERATIONAL POWERED` upon tech branch alignment, and flashing a bright `SECURED / STABLE` when victory is finalized.
* **Top Sticky Alert Layer (`#alert-banner`):** A hidden physical bar that punches onto the absolute top layer of the screen with a heavy shadow drop during critical narrative thresholds.
    * *When Decoding:* Displays a striking cyan banner (`#00f0ff` background, dark text) showing a rolling time remaining clock: `▸ DECODING SIGNAL FROM STATION OMAHA (30s) ◂`.
    * *When Attacked:* Displays a flashing warning red banner (`#ff3b00` background, dark text) showing: `⚠ SECURITY ALERT — EDISON SABOTAGE ACTIVE (10s) ⚠`.

### B. The Terminal Log Room (`.log-box`)
* An isolated, auto-scrolling terminal viewport measuring exactly 160px high. It acts as the narrative and mechanical diary of the station, logging entries prefixed with an incremental timeline ticker (`[t+1]`, `[t+2]`).
* **Visual Triage Colors:**
    * `log-system` (Muted Amber): Machine automated ticks, boots, and ambient resets.
    * `log-action` (Bright Pure White): Direct player manual click operations.
    * `log-unlock` (Electric Cyan): Significant infrastructural breakthroughs or assembly integrations.
    * `log-warning` (Ember Red): Resource damage, system snaps, and hostile corporate ambushes.

### C. The Resource Readout Dashboard (`.stats-grid`)
A structured metric grid monitoring the station’s baseline asset ledger across three cards:
1.  **Joules Counter (Double Width Card):** Displays the current stored electrical charge in massive 1.8rem numbers with an amber ambient glow. It features a permanent text sublabel tracking maximum limits (`/ 100` initially, expanding to `/ 200` via advanced direct current physics).
2.  **Wiring Spool Counter:** Tracks current copper wire reserves safely bound to inventory spools.
3.  **Machines Ticker:** A dynamic status display mapping current high-yield machinery counts. It alters its label contextually depending on your gameplay timeline: showing `COILS` during early phases and Path B, or automatically shifting its text frame to read `AC GENS` if Path A is embraced.

### D. The Actions Panel & Upgrade Dock (`.actions-panel`)
The core interactive zone where contextual controls slide into view as resource milestones are passed:
* **Standard Action Buttons:** Industrial framed click boxes that change background styling upon touch (`:active`).
* **Card Containers:** Multi-layered control boxes (Warehouse, Pneumatic Loom, Morse Encounter) featuring internal sub-buttons, status headers, and segmented button toggles.

### E. The Fixed Lower Dashboard Bar (`.game-footer`)
A persistent horizontal row at the very bottom edge of the layout, tracking compressed raw data states for tracking operational health:
* `J: [Value]` — Live integer Joules tracking.
* `W: [Value] / [Cap]` — Current wire inventory vs hard limit capacity (e.g., `W: 0 / 20`).
* `Passive Gen (Cyan/Red):` Shows net generation rate like `+5J/s` when active, changing to a red `[OFF]` during blackout lockouts.
* `Loom Status:` Displays loom speed state (`LOOM:LOW`, `LOOM:MED`, `LOOM:HIGH`, or a crimson `LOOM:HALT`).
* `Threat Status (Red):` Flashes a warning string `TRUST ⚠` once the corporate loop actively maps the station.
* `Defenses Readout:` Counts active defensive systems (`DEF: XFC / XJB`).

---

## 2. THE MECHANICAL CORE ENGINE & BALANCING ARCHITECTURE
The system operates on a single, unified 1Hz time-loop cycle engine (`setInterval` running every 1000ms), which coordinates automated asset tracking, processing delays, and hostile encounter schedules.

### Boundary Constraints & Resource Caps
* **Joule Array Clamp:** Electrical capacity cannot naturally cross its active storage ceiling. Extra power generated past the cap is permanently vented as grounding waste.
* **Logistics Warehouse Cap:** Wire inventory is capped by storage limits (initially 20 spools). If wire stocks reach this ceiling, a dedicated alert banner (`#banner-logistics-blocked`) flashes, notifying the player that logistics are completely choked. Manual forging is blocked, and automated looms stop tracking progress until inventory space is freed.

### Automated Loom Automation System
Once constructed for 50 Joules, the Pneumatic Loom automatically draws power from the station's core reserves every second to spool raw copper into wire. It features three operational tension levels:
* **LOW Tension:** Drains `2 Joules/sec`. Produces `1 Wire every 10 seconds`. Features a 0% mechanical snap risk.
* **MED Tension:** Drains `5 Joules/sec`. Produces `1 Wire every 5 seconds`. Features a 0% mechanical snap risk.
* **HIGH Tension:** Drains `15 Joules/sec`. Produces `1 Wire every 2 seconds`. Features a strict **10% random chance to snap** on every 2-second completion interval.
    * *The Snap Event:* If the high-tension lottery triggers a failure, the loom halts instantly, changes its footer to `LOOM:HALT`, and locks down the interface. It displays a bright red status text reading `BROKEN/HALT` and reveals a `[ REPAIR LOOM ]` action button. Automated production remains completely frozen until the player manually spends 10 Joules to re-thread the shuttle lines.

---

## 3. PATHWAY A WALKTHROUGH: ALTERNATING CURRENT (AC) TECH BRANCH
*Focus: High-yield automation, energy scaling, and attack delay avoidance.*

```
[ START: 0 Joules ]
       │
       ▼ (Crank Dynamo)
[ 50 Joules Threshold ] ──► Morse Signal Starts Decoding (30s)
       │
       ▼ (Timer Hits 0s)
[ Omaha Encounter Choice ] ──► Choose Button [A] (Spend 15 Wiring)
       │
       ├─────────────────────────────────────────┐
       ▼                                         ▼
[ Build AC Generators ]                   [ Build Faraday Cages ]
(Cost: 20J + 5W ──► +5J/s)                 (Cost: 20W ──► Delay Attacks +15s)
       │                                         │
       └────────────────────┬────────────────────┘
                            │
                            ▼
               [ Spend Capacitor Overcharge ]
               (One-time dump: Joules ──► Wire)
                            │
                            ▼
             [ REACH 5 AC GENS + 40 WIRING ]
                            │
                            ▼
             ★ WIN CONDITION A: GRID SECURED ★
```

### Phase 1: The Initial Ascent & Ignition
1.  **Screen View:** The player sees an `OFFLINE` status in the header, 0 Joules, and 0 Wiring. The only active control is the heavy `[ CRANK DYNAMO ]` button.
2.  **Player Actions:** The player repeatedly clicks `[ CRANK DYNAMO ]`. Each press injects white lines into the terminal: `[t+1] Dynamo armature manually cranked. Produced +1 Joule.`.
3.  **Milestone 10 Joules:** The `[ FORGE COPPER WIRING ]` button reveals itself in the actions panel. The player clicks it, spending 10 Joules to generate `+1 Wiring`.
4.  **Milestone 20 Joules & 2 Wires:** The `[ BUILD PNEUMATIC LOOM ]` button unlocks. The player hoards 50 Joules, then executes the build command. The log prints a cyan notification: `Constructed automated mechanical Pneumatic Loom system. Fabric production lines online.`. The `panel-loom-controls` box immediately expands into view on screen, revealing the LOW, MED, and HIGH tension toggles.
5.  **Milestone 50 Joules:** The instant the master Joule pool cross-checks a value of 50, the spark-gap receiver fires. The terminal throws a cyan alert: `The spark-gap Morse receiver springs to life! It is automatically recording an incoming long-distance frequencies pattern...`. Simultaneously, the top sticky alert banner flashes on screen: `▸ DECODING SIGNAL FROM STATION OMAHA (30s) ◂`.

### Phase 2: The Breakthrough Decision
1.  **Screen View:** The alert banner ticks down in real time every second: `(29s)`, `(28s)`, `(27s)`. The user interface continues operating normally. The player toggles the Pneumatic Loom to MED tension to rapidly hoard copper wires before the transmission completes.
2.  **The Transmission Arrives:** When the countdown strikes zero, the alert banner vanishes. The log updates: `📡 SIGNAL FULLY DECODED. Open transmission lines from Station Omaha are requiring immediate field response commands.`. An overarching `panel-morse-encounter` card locks into the action field, printing Omaha's request: `"STATION OMAHA CALLING. WE HAVE TESLA'S AC SCHEMATICS BUT NEED COPPER TO REPAIR OUR SHIELDING. WILL TRADE FOR 15 WIRING."`
3.  **The Commitment:** The player must have at least 15 copper wire spools in inventory to choose option A. They click `[A] Accept AC Schematics`. 15 wires are instantly deducted.
4.  **The Reaction:** The encounter card collapses into hiding. The log throws an immediate crimson alert: `Agreement Signed. Station Omaha shares Alternating Current blueprints. Warning: The Edison Trust has declared our project an illegal patent infringement!`. In the footer panel, the threat status tracker `TRUST ⚠` blinks into active tracking mode. The header status shifts to a bright cyan `OPERATIONAL POWERED`.

### Phase 3: Surviving the Corporate Strike
1.  **The Structural Alteration:** The central machine tracking column on the stats dashboard shifts its label title from `COILS` to **`AC GENS`**. Two brand-new branch-specific upgrade buttons animate onto the dashboard panel: `[ BUILD AC GENERATOR ]` and `[ BUILD FARADAY CAGE ]`.
2.  **The Threat Loop:** Because Path A represents an overt threat to the corporate electrical monopoly, the Edison Trust attacks aggressively. The baseline attack clock is set to a short 30 seconds.
3.  **The Ambush Experience:** Every 30 seconds (plus or minus a small randomized window), the screen locks down. The top alert layer snaps into an intense red alarm: `⚠ SECURITY ALERT — EDISON SABOTAGE ACTIVE (10s) ⚠`. The central status switches to `SABOTAGED LOCKOUT (OFFLINE)`. The terminal log logs a random hostile strike, such as: `⚠ EXTRALIEGAL ATTACK: Saboteur spotted in the relay room. Emergency shutdown initiated. Stored resources damaged!`. 
4.  **The AC Penalty:** Upon each impact, **5 Wire units are immediately ripped from inventory**. Furthermore, for 10 full seconds, all passive power generation and automated loom cycles are completely frozen.
5.  **Tactical Countermeasures:** To slow the onslaught, the player hoards wire to assemble **Faraday Cages** (`Cost: 20 Wiring`). Each cage built injects a cyan notification into the logs and permanently adds an extra `+15 seconds` of safety cushion to the attack countdown timer. By stacking 2 or 3 Faraday Cages, the attack frequency is pushed out past a minute, giving the player breathing room to scale resources.

### Phase 4: Scaling the Alternating Array to Victory
1.  **The Power Surge:** The player begins assembling **AC Generators** (`Cost: 20 Joules + 5 Wiring`). Each generator constructed increases the station’s baseline passive output by an immense **+5 Joules/sec**. The lower footer displays the soaring rate: `+5J/s`, `+10J/s`, `+15J/s`.
2.  **The Cap Problem:** With power generating at +15J/s or higher, the player constantly slams against the 100 Joule maximum storage cap. To prevent wasting power, they wait until wiring hits 5, then hit the emergency **`[ CAPACITOR OVERCHARGE ]`** button.
3.  **The Capacitor Blast:** This button can only be used once per game. The instant it is touched, the log fires a warning: `💥 CRITICAL DIRECT OVERCHARGE SPENT! Dissipated entire storage core to weld out +[Yield] Wiring instantly.`. All current Joules are completely zeroed out, converted into massive wire counts at a rate of 1 wire per 10 Joules, and the button disappears forever, replaced by a gray banner: `◈ CAPACITOR OVERCHARGE — DEPLETED`.
4.  **The Final Push:** Utilizing the massive injection of wires from the overcharge, the player ramps up production. They push their infrastructure until they cross the final target requirement threshold: **5 active AC Generators and 40 stored Copper Wires**.
5.  **Victory:** The system freezes the timer loops. The header status locks onto `SECURED / STABLE`. The terminal prints a final victory message, and the golden `★ GRID SECURED. EDISON TRUST DEFEATED. ★` banner flashes across the center panel.

---

## 4. PATHWAY B WALKTHROUGH: DIRECT CURRENT (DC) TECH BRANCH
*Focus: Maximum storage capacity, steady passive accumulation, and defensive damage mitigation.*

```
[ START: 0 Joules ]
       │
       ▼ (Crank Dynamo)
[ 50 Joules Threshold ] ──► Morse Signal Starts Decoding (30s)
       │
       ▼ (Timer Hits 0s)
[ Omaha Encounter Choice ] ──► Choose Button [B] (Spend 10 Wiring)
       │
       ├─────────────────────────────────────────┼─────────────────────────────────────────┐
       ▼                                         ▼                                         ▼
[ Assemble Tesla Coils ]                  [ Build Leyden Jars ]                     [ Build Junction Boxes ]
(Cost: 10W ──► +1J/s)                      (Cost: 5W ──► Cap Doubles to 200J)        (Cost: 200J ──► Blunt Damage 50%)
       │                                         │                                         │
       └─────────────────────────────────────────┼─────────────────────────────────────────┘
                                                 │
                                                 ▼
                                  [ REACH 10 COILS + 30 WIRING ]
                                                 │
                                                 ▼
                                  ★ WIN CONDITION B: GRID SECURED ★
```

### Phase 1: The Initial Ascent
*(Identical to Path A: Manual dynamo cranking, wire forging, and automated loom construction until the Morse code signal fully completes its 30-second timeline sequence.)*

### Phase 2: The Breakthrough Decision
1.  **The Alternative Choice:** When the Omaha transmission logs complete, the player evaluates option B: `[B] Reject & Build Leyden Jar`. This path costs less up front, demanding only `10 Wiring units`. 
2.  **The Commitment:** The player triggers option B. 10 wires are deducted from inventory spools.
3.  **The Reaction:** The encounter panel vanishes. The terminal log records an alternative isolationist path: `Transmission Denied. Locked keys down. We will turtle behind local isolation fields and store power natively inside Leyden arrays.`. In the lower footer, the threat tracking string `TRUST ⚠` lights up. The header status row switches to a glowing cyan `OPERATIONAL POWERED`.

### Phase 3: The Fortress Defense Strategy
1.  **The Structural Alteration:** The central machine tracking column on the stats grid remains locked onto its original layout title: **`COILS`**. Three brand-new branch-specific build pathways reveal themselves in the actions panel: `[ ASSEMBLE TESLA COIL ]`, `[ BUILD LEYDEN JAR ]`, and `[ BUILD JUNCTION BOX ]`.
2.  **The Threat Loop:** Because Direct Current setups operate at local scales rather than broadcasting long-distance signals, they are harder for corporate spies to scout. The baseline attack clock is set to a more generous **45 seconds** before the first strike hits.
3.  **The Ambush Experience:** When an attack triggers, the screen enters the 10-second alarm lockout mode (`⚠ SECURITY ALERT — EDISON SABOTAGE ACTIVE (10s) ⚠`).
4.  **The DC Penalty Mitigation:** Because Path B works with contained local currents, the baseline inventory asset damage is lower: **only 3 Wire units are lost per attack** (compared to 5 on the AC path). 
5.  **The Shield Wall:** To protect their hard-earned wire inventory, the player saves up 200 Joules and constructs a protected **Junction Box**. The log prints a clean safety unlock message: `Heavy iron isolated circuit paths fused. Protected Junction Box #1 operational. Attack damage blunted.`. 
    * *The Protection Formula:* Each Junction Box built divides incoming resource damage by half (`Loss = Base Loss / (2 * JunctionBoxes)`). With just 1 Junction Box deployed, wire loss from an ambush drops from 3 units to a negligible **1 wire unit**.

### Phase 4: Packing the Battery Array to Victory
1.  **Doubling the Battery Core:** The absolute first priority for a DC station is to build the **Leyden Jar** assembly (`Cost: 5 Wiring`). The instant it is purchased, the button disappears from the screen forever. The terminal log confirms: `Insulated capacitor glass banks arranged. Energy core structural limits doubled.`. On the stats grid, the maximum Joules ceiling label text immediately changes from `/ 100` to **`/ 200`**, allowing the station to hold twice as much raw energy without grounding waste.
2.  **Steady Passive Harvesting:** Rather than using loud generators, Path B relies on building an array of **Tesla Coils** (`Cost: 10 Wiring`). Each coil assembled adds a steady **+1 Joule/sec** passive flow to the engine core. The player steadily adds coils, watching their passive footer tick up: `+1J/s`, `+2J/s`, `+3J/s`... up to `+10J/s`.
3.  **The End Game Sequence:** Because the Joule cap was expanded to 200, the player can safely leave the Pneumatic Loom running on HIGH or MED tension without worrying about quick power brownouts. They manage loom breakdowns quickly using the repair button, and hoard resources until they satisfy the final victory criteria: **10 active Tesla Coils and 30 stored Copper Wires**.
4.  **Victory:** The time loops freeze. The grid status locks onto a glowing cyan `SECURED / STABLE`. The victory panel clears away the action deck and reveals the final victory crown: `★ GRID SECURED. EDISON TRUST DEFEATED. ★`.

---

## 5. RECONCILIATION SUMMARY CHART
To assist with rapid triage when observing the live state machine via dev tunnels, use this reference ledger:

| Metric / Feature | Base Baseline State | Path A: Alternating Current (AC) | Path B: Direct Current (DC) |
| :--- | :--- | :--- | :--- |
| **Header Status Text** | `OFFLINE` | `OPERATIONAL POWERED` | `OPERATIONAL POWERED` |
| **Max Joule Capacity** | 100 Joules Limit | 100 Joules Limit | **200 Joules Limit** (Via Leyden Jars) |
| **Primary Automation Asset**| Tesla Coils (+1J/s) | **AC Generators (+5J/s)** | Tesla Coils (+1J/s) |
| **Dashboard Dynamic Label** | `COILS` | **`AC GENS`** | `COILS` |
| **Base Attack Interval** | No Threats Active | Fast Frequency (30s Clock) | **Slower Frequency (45s Clock)** |
| **Base Sabotage Wire Damage**| No Threats Active | Heavy Loss (-5 Wires) | **Lighter Loss (-3 Wires)** |
| **Unique Defensive System** | None Available | **Faraday Cages** (+15s Attack Delay) | **Junction Boxes** (-50% Damage Blunt) |
| **Emergency Burst Button** | Hidden | **Capacitor Overcharge** (One-Time Use) | Not Available |
| **Final Victory Targets** | Goal Not Unlocked | **5 AC Generators + 40 Stored Wires**| **10 Tesla Coils + 30 Stored Wires** |
