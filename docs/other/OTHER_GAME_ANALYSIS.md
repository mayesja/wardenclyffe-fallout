# Factory Survival — Other Game Analysis Framework
**Status**: Draft  
**Owner**: Unofficial 4th Collaborator (via JM)  
**Description**: Objective quantitative matrix used to evaluate outside video games, harvest high-leverage mechanics, and isolate design anti-patterns for Factory Survival.

---

## 1. Core Methodology & Objective Evaluation

To prevent nostalgia bias and ensure development time is spent efficiently, all external game references are evaluated against the **5 Core Analysis Questions** posed by the Claude development agent. 

Each question is scored on a standardized, objective 4-point scale:
* **3 (High)** — World-class execution; directly applicable to a core pillar or requirement of Factory Survival.
* **2 (Medium)** — Strong execution; contains valuable sub-mechanics or interface layouts worth adapting.
* **1 (Low)** — Niche or primitive execution; limited structural overlap but contains a minor reference point.
* **0 (Zero)** — Completely non-applicable, absent, or a structural dead zone for that specific title.

### The Scoring Formula
Every game produces a raw score out of a maximum of 15 points:
$$\text{Total Score} = \text{Onboarding} + \text{Monetization} + \text{Session Design} + \text{Social Glue} + \text{Automation UX}$$

*Note: All questions are weighted equally at this stage. Weights may be adjusted dynamically via multipliers later in development to highlight specific surfacing priorities.*

---

## 2. Master Evaluation Grid (System Baseline Reference)

This matrix establishes the theoretical scores based on structural gameplay/social archetypes before evaluating individual titles.

| Player/Social Architecture (Archetypes) | 1. Onboarding | 2. Monetization | 3. Session Design | 4. Social Glue | 5. Automation UX | Total Baseline |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Mobile 4X / Solo-to-Alliance Pivot** *(WOS, Last Asylum)* | 3 | 3 | 3 | 3 | 1 | **13 / 15** |
| **Infinite Incremental / Math** *(Trimps, Alien Invasion)* | 3 | 2 | 3 | 1 | 2 | **11 / 15** |
| **Solo vs. System / Open Story** *(SimCity, Civ, Alpha Centauri, XCOM, JA, Uplink)* | 1 | 0 | 3 | 0 | 3 | **7 / 15** |
| **High-Density Ad-Hoc Social (MUD)** *(Thunderdome, Crossfire)* | 1 | 0 | 3 | 3 | 0 | **7 / 15** |
| **Pure Solo / Fixed Arc** *(Paperclips, Incredible Machine)* | 1 | 0 | 3 | 0 | 3 | **7 / 15** |
| **Skill-Based Session Arenas** *(Doom, Quake, XEvil)* | 2 | 0 | 2 | 1 | 0 | **5 / 15** |

---

## 3. Analysis Tranches & Roadmap

Games are bucketed into three operational tranches based on their final score. 

### 🟢 Tranche 1: Core Blueprints (Score 11–15)
* **Definition**: Comprehensive systems mapping closely to the multi-layered MMO reality of Factory Survival.
* **Objective**: Study holistic execution, monetization loops, and high-retention onboarding.

### 🟡 Tranche 2: Feature Specialists (Score 6–10)
* **Definition**: Often completely solo or non-profit legacy games that nevertheless showcase world-class execution in one or two isolated axes.
* **Objective**: Target and extract specific sub-systems (e.g., UI layout paradigms, script-gating, player-driven bartering economies).

### 🔴 Tranche 3: Edge Case Reference Points (Score 1–5)
* **Definition**: Games with minimal structural overlap but high execution in singular, pure mechanics (e.g., pure spatial awareness, stress/tension tracking, or historical gameplay anchors).
* **Objective**: Harvest quick, fundamental lessons and identify critical structural anti-patterns.

---

## 4. Execution Strategy: Bottom-Up Deconstruction

We will execute this analysis using a **Bottom-Up** strategy, dissecting games from **Tranche 3 up to Tranche 1**. 

### Strategic Justification
1.  **Isolating Pure Mechanics**: Lower-tranche games offer hyper-focused, unpolluted loops (e.g., the cause-and-effect physics of *The Incredible Machine*). We can harvest these building blocks cleanly without getting bogged down by alliance mechanics or monetization data.
2.  **Defining the Anti-Patterns Early**: Examining edge cases first allows us to catalog design dead-ends, interface bottlenecks, and loops that cause player friction before finalizing major infrastructure choices in Slack.
3.  **Building a Universal Vocabulary**: By the time we evaluate Tranche 1 giants like *Whiteout Survival*, we will have an arsenal of harvested micro-mechanics (e.g., *Uplink’s* interface tension, *Thunderdome’s* ad-hoc economic grouping) to instantly deploy as counter-measures against the genre’s traditional flaws.

---

## 5. Active Game Inventory To Be Processed

The following 14 games are queued for numerical evaluation and assignment to their respective analytical tranches:

* Last Asylum
* Civilization (III - V)
* Alpha Centauri
* SimCity 2000
* Alien Invasion RPG Idle Game
* Frost World
* Universal Paperclips
* Trimps
* Thunderdome 2: Rise of the Freejacks (NukeFire)
* Jagged Alliance
* XCom
* Uplink Hacker Elite
* The Incredible Machine
* Doom / Quake (1-3)
* XEvil
* Crossfire

---

## 6. Tranche 3 Analysis: Skill-Based Session Arenas

### Target Games
* Doom / Quake (1-3)
* XEvil

### Raw Score Baseline Evaluation
* **Onboarding**: 2 / 3
* **Monetization**: 0 / 3 (Dead Zone)
* **Session Design**: 2 / 3
* **Social Glue**: 1 / 3
* **Automation UX**: 0 / 3 (Dead Zone)
* **Total Archetype Score**: **5 / 15**

---

### Deep-Dive Structural Answers

#### 1. Onboarding — First 5 Minutes
* **The Paradigm**: Drop the player straight into immediate action with zero narrative delays or menu congestion. The hook relies on instantaneous agency and resolving immediate environmental threats.
* **What to ABSORB**: 
    * *The Subterranean Pocket:* Start players in an isolated, dark subterranean tile. Do not blast them with UI panels, global maps, or alliance functions.
    * *Action-to-Automation Dopamine:* Transition from manual clicking to the first functional conveyor belt within 180 seconds. The initial hook must be the physical visual feedback of a machine completely eliminating manual labor.
* **What to REJECT**: 
    * *The Reflex Wall:* Traditional arena games filter players by physical twitch dexterity. *Factory Survival* must reject any onboarding that penalizes execution speed, focusing instead on purely logical spatial placement.

#### 2. Session Design — Sustainable Retention
* **The Paradigm**: Elimination of mandatory daily streaks or artificial energy gates. Retention relies entirely on pushing players into a "flow state"—calibrating spatial awareness against clear, predictable mechanics.
* **What to ABSORB**:
    * *Logistical Pathing Control:* High-level *Quake* gameplay is governed by map-timing (routing pathing perfectly to capture spawning mega-health/armor tokens). Translate this directly into **Surface Map Logistics**. Managing supply convoys should be a high-stakes spatial puzzle where holding the transport corridor *is* the defensive game.
    * *High-Tension Micro-Sessions:* Surface expeditionary marches or outpost checks should visually feel like tight, fast-paced tactical skirmishes with transparent, high-stakes feedback loops.
* **What to REJECT**:
    * *Total Session Progress Wipes:* In *XEvil*, failure wipes out the entire session run. In a long-term mobile MMO, losing hard progress kills retention. Defeat on the Surface should cost the *cargo payload/material output*, never the core underground infrastructure.

#### 3. Social Glue — Alliance Ad-Hoc Dynamics
* **The Paradigm**: Long-term community retention built entirely through organic, specialized team roles and shared tactical communication rather than forced calendar coordination.
* **What to ABSORB**:
    * *Role-Based Resource Specialization:* Arena shooter team modes (e.g., Capture the Flag) divide players into natural tactical roles based on their chosen positioning and loadout. Because *Factory Survival* uses distinct underground factory specialization, alliance surface warfare must match this. Alliances succeed when members act as specialized infrastructure nodes (e.g., Player A manufactures heavy drone chassis, Player B runs a dedicated plasma fuel pipeline, Player C writes/supplies tactical Lua targeting logic scripts).
    * *Deterministic Replay Sharing:* Arena shooters grew communities by sharing small demo files. Because our C# simulation core is deterministic, the game can easily export ultra-lightweight replay files of successful base defenses or convoy ambushes straight into alliance chat pipelines for bragging rights and optimization critique.
* **What to REJECT**:
    * *Zero-Sum Toxic Elitism:* Pure hostile skill-gating creates toxic communities that starve out incoming players. Surface map mechanics must provide critical economic, supply, or defense coordination roles so casual or non-PvP-focused players remain highly valuable assets to top-tier alliances.

---

### Summary of Extracted Structural Building Blocks
1.  **Onboarding Pipeline**: Drop-in -> Manual Click Node -> Automated Belt Loop visual feedback in <3 minutes.
2.  **Surface Map Corridor Mechanic**: Convoys treated as high-stakes spatial pathing loops rather than passive progress bars.
3.  **Alliance Integration**: Transition alliance structures from passive military groups to active, interdependent production/logistics syndicates.

---

## 7. Tranche 2 Analysis: Feature Specialists (Score 6–10)

### Target Archetype: Solo-vs-System / Open Story
*   **Target Games**: Civilization (III - V), SimCity 2000, XCOM, Jagged Alliance, Uplink Hacker Elite, Sid Meier's Alpha Centauri

### Raw Score Baseline Evaluation
*   **Onboarding**: 1 / 3 (Low)
*   **Monetization**: 0 / 3 (Dead Zone)
*   **Session Design**: 3 / 3 (High)
*   **Social Glue**: 0 / 3 (Dead Zone)
*   **Automation UX**: 3 / 3 (High)
*   **Total Archetype Score**: **7 / 15**

---

### Deep-Dive Structural Answers

#### 1. Onboarding — First 5 Minutes
*   **The Paradigm**: High cognitive friction, text-heavy menus, and overwhelming initial agency. The player is dropped into a sprawling world or complex command center with very little hand-holding, relying on intrinsic curiosity or pre-existing genre literacy to push past the initial interface wall.
*   **What to ABSORB**:
    *   *The Elite Command Center Aesthetic:* Establish an immediate, compelling visual hook using a high-fidelity tactical interface. Even before the player understands the underlying mechanics, looking at a stylized telemetry grid or command terminal instantly communicates an elite-operator positioning.
    *   *The Automated Tech-Breakthrough Narrative:* Replicate the style of schematic delivery where unlocking an advanced material or logic layer triggers a clean, minimalist terminal schematic and a brief audio file snippet to heighten atmospheric immersion.
*   **What to REJECT**:
    *   *The Manual Text Wall / Overwhelming Choice:* Completely reject dense, text-heavy tutorial dumps or manual-reliant openings that create immediate cognitive fatigue. Avoid menu clutter; your design bays should strictly display component combinations your active factory lines are actually capable of producing.

#### 2. Session Design — Sustainable Retention
*   **The Paradigm**: Mastery of the asynchronous flow state. By decoupling progression from real-world clocks or energy mechanics, retention is driven entirely by intersecting systemic loops: a short-term tactical puzzle is directly tied to a long-term macro-infrastructure project.
*   **What to ABSORB**:
    *   *The Macro/Micro Pendulum:* Replicate the loop where a fast, 2-minute tactical surface hex engagement yields specific salvage blocks. These blocks are directly brought back to upgrade a deep, long-term conveyor network or production line in the underground base, which eventually unlocks a new tier of tactical military units.
    *   *The Industrial Eco-Friction Loop:* Tie massive factory production volumes to environmental feedback. Over-producing or expanding your subterranean footprint triggers a direct, telegraphed tactical challenge on the Surface Map by increasing machine swarm aggressiveness.
*   **What to REJECT**:
    *   *The Predictable Scripting Cliff:* Reject insular single-player loops where a player can permanently "solve" the AI's script patterns. Every underlying automation system must eventually interface with a dynamic, unpredictable, player-driven global alliance ecosystem to maintain infinite retention.

#### 3. Automation UX — Structural Macro-Management
*   **The Paradigm**: High-level telemetry, abstract overview screens, and deterministic control panels. The player acts as a macro-manager setting templates, blueprints, and infrastructure layouts, while autonomous systems execute the granular operations.
*   **What to ABSORB**:
    *   *Deterministic Feedback Toggles:* Give players command-and-control interfaces to manage complex, automated sub-systems through abstract overview screens, nesting deep telemetry data cleanly on a single screen.
    *   *Dynamic Production Matrixing:* Unit assembly costs must be entirely deterministic, calculated dynamically by summing up the material weights of the components selected in the design blueprint interface.
*   **What to REJECT**:
    *   *Granular Manual Micro-Management:* Reject any requirement for manual, unit-by-unit slot sorting, repetitive inputs, or manual blueprint menu cleanup. The UI should automatically sunset inferior components when a higher-tier drop directly supersedes them in your factory logic.

---

### Individual Game Deep Dives

#### Game 1: SimCity 2000
*   **What to ABSORB**:
    *   *Cross-Sectional Overlay Mapping:* Utilize a clean visual toggle between the gritty, tactical Surface Map view and the clean, satisfying Underground Factory view.
    *   *Infrastructure Proximity Networks:* Tie machine operations to physical, spatial connectivity (e.g., wiring into localized power grids or linking fluid pipelines), turning base optimization into a rewarding spatial puzzle.
    *   *The Budget Telemetry Panel:* Provide a macro-level telemetry screen where adjusting overarching factory variables instantly propagates predictable downstream data through production lines.
*   **What to REJECT**:
    *   *Untelegraphed Disaster Destruction:* Avoid random, unmapped failure states or catastrophic disasters that erase hours of design with no warning. Every base raid or convoy ambush must be a 100% deterministic, telegraphed event.

#### Game 2: Civilization (III - V)
*   **What to ABSORB**:
    *   *Tech Tree Milestone Unlock Loop:* Design tech trees where unlocking a fundamental automation component instantly expands both base infrastructure capabilities and surface combat divisions.
    *   *Hex-Based Resource Yields:* Display clean, explicit data overlays directly on surface hex tiles to make extraction values and territory tracking instantly readable at a glance.
    *   *The Unit Automation Toggle:* Allow players to manually clear high-stakes trade corridors, and then toggle supply convoys to an automated background routing script once the lane is secure.
*   **What to REJECT**:
    *   *The Synchronous Turn-Based Progression Wall:* Avoid artificial turn-based queues. The entire global map and underground factory layers must function on a continuous, asynchronous, real-time server clock.

#### Game 3: XCOM
*   **What to ABSORB**:
    *   *The Geoscape Telemetry Hub:* Utilize a dark, high-contrast holographic radar screen for the Global Surface Operations View to monitor machine swarm vectors and alliance logistics lanes.
    *   *The Direct Macro-to-Micro Upgrades Pipeline:* Ensure that rare, specialized salvage blocks or corrupted cores secured on the Surface Map act as the explicit catalysts required to unlock elite underground automation tech.
    *   *Visual Layered Hierarchy:* Adopt a highly scannable "ant-farm" vertical cross-section for the subterranean base layout, letting players audit facility statuses instantly via color and silhouette.
*   **What to REJECT**:
    *   *Permanent Unit Loss Permadeath:* Reject permanent progress wipes on individual tactical assets. Units must be treated as modular, automated constructs—losing a unit costs hardware materials and factory queue time, never unrecoverable character progress.

#### Game 4: Jagged Alliance
*   **What to ABSORB**:
    *   *The Sector Grid Control Mechanics:* Divide the surface world into an explicit alpha-numeric grid where controlling specific coordinates unlocks unique processing modifiers or localized resource extractions.
    *   *Granular Component Wear-and-Tear:* Introduce subtle component wear metrics to manufacturing machinery and automated surface units, driving an ongoing economic demand for spare parts and lubricants.
    *   *The Asynchronous Contract Interface:* Use an integrated in-universe communication terminal for accepting shipping contracts from rogue outposts or ordering raw inputs from corporate drop-ships.
*   **What to REJECT**:
    *   *Manual Slot Inventory Bottlenecks:* Reject slot-by-slot inventory management constraints. Material movement must be entirely automated via conveyor logic, container registries, and item sorters.

#### Game 5: Uplink Hacker Elite
*   **What to ABSORB**:
    *   *Interface-Driven Suspense:* Use a prominent trace-tracker countdown timer when harvesting corrupted machine nodes on the surface, creating high-tension risk/reward decisions.
    *   *The Modular Logic Upgrade Loop:* Allow players to upgrade software toolkits and logical libraries over time, expanding the processing space available for running complex Lua automation scripts.
    *   *A Clean Monospace Logs Audit Trail:* Provide a searchable, monospace text feed detailing real-time micro-events (e.g., weapon fire, shield impacts) to serve as a combat debugging tool for technical players.
*   **What to REJECT**:
    *   *The Single-Mistake Sudden Death Progress Wipe:* Reject catastrophic, unmitigated save-file wipes. Failures on the surface must be capped at localized resource loss or temporary system reboots, never infrastructure deletion.

#### Game 6: Sid Meier's Alpha Centauri
*   **What to ABSORB**:
    *   *The Four-Slot Blueprint Matrix:* Establish a modular vehicle construction interface based on explicit component slots: Chassis (movement/energy), Payload (weaponry, cargo vaults, or extraction beams), Armor Shell (mitigation), and Logic Core (script execution space).
    *   *R&D Prototyping Tooling Costs:* The first unit deployed using a newly unlocked high-tier component costs a flat injection of rare "Salvage Blocks" to tool up the factory line, forming a clean resource sink.
    *   *Dual-Purpose Utility Payloads:* Vehicles are repurposed entirely by swapping their payload cores—a single chassis can function as a combat vanguard, a mobile harvester, or a supply cargo truck depending on its slot configuration.
    *   *Component Stripping for Economic Agility:* Allow players to intentionally strip armor or chassis components down to a minimalist blueprint to rapidly mass-produce cheap, fragile, high-damage glass cannons during crisis windows.
    *   *Zero-Maintenance Logistics Upgrades:* Introduce specialized chassis or fuel modules that remove ongoing deployment energy drains, letting players completely optimize trade routes into passive, zero-maintenance resource channels.
*   **What to REJECT**:
    *   *The Emotional Unit Morale Matrix:* Completely reject psychological panic or morale sub-systems. Surface forces are cold, automated constructs running on deterministic script logic; failure must always be a calculable design metric, never random panic.

---

---

## 8. Tranche 2 Analysis: Pure Solo / Fixed Arc

### Target Games
* The Incredible Machine
* Universal Paperclips

### Raw Score Baseline Evaluation
* **Onboarding**: 1 / 3 (Low)
* **Monetization**: 0 / 3 (Dead Zone)
* **Session Design**: 3 / 3 (High)
* **Social Glue**: 0 / 3 (Dead Zone)
* **Automation UX**: 3 / 3 (High)
* **Total Archetype Score**: **7 / 15**

---

### Deep-Dive Structural Answers

#### 1. Onboarding — First 5 Minutes
* **The Paradigm**: Low-assistance, high-curiosity entries. The user is presented with a clear mechanical canvas or a minimalist interface with zero text-heavy tutorial dumps, relying on immediate feedback loop testing to establish the boundary rules.
* **What to ABSORB**:
    * *The Incomplete Layout Scaffold:* Start the player in an infrastructure sector where a local production loop is 80% complete but stalling. Forcing them to diagnose and place the missing 20% (e.g., a single drivetrain or connecting a utility line) teaches system mechanics faster than a text dump.
    * *Dynamic Interface Unlocks:* Keep complex menus, trading terminals, and advanced structural layers entirely hidden from the UI layout until the user satisfies the exact material thresholds required to use them.
    * *Single-Variable Victory Constraints:* Early gameplay challenges should isolate a single clear goal (e.g., "Route Commodity X to Intake Y") to explicitly map out transport boundaries before forcing long-term factory maintenance.
* **What to REJECT**:
    * *The Manual Action-Spam Opener:* Completely reject requirements to manually click a single interface button repeatedly to kickstart the baseline economy. The user is a toolmaker; they should establish automated resource-routing loops from minute one.

#### 2. Session Design — Sustainable Retention
* **The Paradigm**: The asynchronous flow state. Progression is driven entirely by intersecting systemic loops where solving a localized mechanical puzzle or completing a resource bottleneck threshold shifts the macro scale of the game completely.
* **What to ABSORB**:
    * *The Scale Paradigm Shift:* Abruptly shift the core gameplay loop at major milestones. Once a specific commodity layer is completely automated and trivialized, explode the scope of the world (e.g., moving from local conveyor layout optimization to surface convoy routing and global alliance market mechanics).
    * *The Closed-Loop Milestone:* Structure base sectors or pipeline milestones so that once a layout is "solved," it runs flawlessly in the background with zero ongoing micro-management, letting the player safely shift 100% of their attention forward.
    * *Resource-Sink Projects:* Introduce massive structural projects (e.g., "Subterranean Power Grid Upgrade") that act as numbers thresholds, forcing the player to systematically overhaul and expand their baseline logistics loops to achieve the next tier.
* **What to REJECT**:
    * *The Hard Narrative End-Wall:* Reject hard completion terminations where an optimized base simply locks up or resets. Completed sectors must seamlessly convert into automated background anchor nodes that continually pump physical commodities or custom drone variants into the live, persistent alliance market.

#### 3. Automation UX — Structural Macro-Management
* **The Paradigm**: The deterministic hand-off. The user lays out structural logic, connections, and script parameters in a paused or overview state, and the simulation engine executes the commands with 100% mathematical predictability.
* **What to ABSORB**:
    * *The Paused "Simulation Mode" Testing:* Allow players to design complex Assemblies, route pipelines, and configure custom logic scripts in a completely paused, non-destructive editing state. They click a "Run Cycle" toggle to simulate the data output and telemetry triggers without risking real hardware assets.
    * *Kinetic Input/Output Socket Handoffs:* Components pass active mathematical vectors directly to adjacent sockets (e.g., a motor outputting torque directly into a drivetrain component, which converts it to directional hex locomotion vectors).
    * *Automated Algorithmic Bidding:* Implement overview controls that let automation lines monitor market terminals and execute buying or selling scripts the exact second a specific commodity passes a set credit value threshold.
* **What to REJECT**:
    * *Sub-Grid Pixel Friction:* Avoid placement friction requiring pixel-perfect layout alignment to function. Buildings must snap to a strict, clean grid tile, and vehicle chassis designs must use precise socket slots to keep calculation feedback readable.

---

### Individual Game Deep Dives

#### Game 7: The Incredible Machine
* **What to ABSORB**:
    * *Environmental Hazard Modifier Interlocking:* Environmental hazards should actively trigger or bypass component states (e.g., an acid rain hazard tile damages base hulls but provides a 20% processing bonus if the vehicle is socketed with a specialized Corrosive Cell component).
    * *Visual Telemetry Flags:* When a mechanism stalls or a pipeline grid breaks due to excess mass or lack of energy, populate a clear, high-contrast visual warning flag directly over the broken node for rapid structural auditing.
    * *The Toolbox Inventory Paradigm:* Keep non-installed components stored cleanly in a side-panel design inventory to prevent spatial clutter on the main world map layout.
* **What to REJECT**:
    * *Single-Solution Bottlenecks:* Avoid rigid level design paths that force a single correct arrangement of parts. The calculation core must allow infinite layout variations based on how players balance mass, torque, and power math.

#### Game 8: Universal Paperclips
* **What to ABSORB**:
    * *Computing Resource Budgets:* Track an abstract processing resource pool (e.g., Operations/Memory Capacity) that limits how many advanced background scripts or logic core functions can run simultaneously.
    * *Lossless Material Transformations:* Maintain clean, unpolluted, absolute commodity conversion ratios (e.g., Input X always yields exactly Output Y) so technical players can reliably construct flawless efficiency balance sheets.
    * *The Real-Time Dashboard Ledger:* Utilize an active, scrolling monospace ledger tracking micro-events to provide immediate visual feedback on every macro variable change.
* **What to REJECT**:
    * *Hidden Balance Crashes:* Completely reject hidden calculations or sudden balance spikes that wipe out infrastructure reserves with zero warning. Every point of system friction, power drain, or wear-and-tear must be explicitly exposed to the user.

---

### Historical Case Study Appendix: Trash (2005)
*Nota: This entry serves as an archival reference point for a niche multiplayer title utilizing a raw "Scrappunk" economy.*

#### Raw Score Baseline Evaluation
*   **Onboarding**: 1 / 3 (Low)
*   **Monetization**: 0 / 3 (Dead Zone)
*   **Session Design**: 2 / 3 (Medium)
*   **Social Glue**: 2 / 3 (Medium)
*   **Automation UX**: 1 / 3 (Low)
*   **Total Score**: **6 / 15** (Tranche 2: Feature Specialist)

#### Extracted Architectural Building Blocks
*   **What to ABSORB**:
    *   *The Shared Tech Pool:* Replicate the ability for alliance members to share high-tier factory outputs or components through a unified depot, allowing lower-tier members to construct specialized unit variants.
    *   *FPS-Style Tech Drops:* When high-level units or convoys are destroyed on the Surface Map, they should drop a high-yield "Salvage Node" directly on that hex, creating an immediate tactical hotspot for nearby players to contest.
    *   *Strategic Resource Hubs:* Lock advanced tech tiers behind the active spatial control of specialized, finite sector coordinates (e.g., an abandoned silicon refinery or polymer reservoir) on the surface map.
*   **What to REJECT**:
    *   *APM Micro Bottlenecks:* Reject twitch-reflex combat mechanics and high-APM micro-management requirements. Success must be dictated entirely by layout optimization, resource distribution, and automated script logic.
