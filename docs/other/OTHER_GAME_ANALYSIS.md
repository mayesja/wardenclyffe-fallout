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
| **Solo vs. System / Open Story** *(SimCity, Civ, XCOM, JA, Uplink)* | 1 | 0 | 3 | 0 | 3 | **7 / 15** |
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
