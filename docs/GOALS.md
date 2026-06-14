# Wardenclyffe Field Station: Project Vision & Prototyping Goals

This document serves as the high-level roadmap and structural guide for the development of **Wardenclyffe Field Station**. It outlines the core intent of the project, the technical environment constraints, and the collaborative methodology between the designer and Gemini.

---

## PROJECT ORIGINS & MULTI-AGENT DEVELOPMENT ARCHITECTURE

### The Replit Genesis & Pivot
*Wardenclyffe Field Station* originated as a rapid, three-way prototyping collaboration between the creator, Gemini, and the Replit Agent. 
* **The Wasteland Version:** The initial prototype was generated inside a React framework wrapper on Replit, featuring a generic post-apocalyptic survival theme.
* **The Wardenclyffe Pivot:** The creator initiated a complete narrative and mechanical shift, steering the project into its current historical alternate-reality setting—focusing on Nikola Tesla’s experimental technology, the atmospheric Wardenclyffe field station, and the aggressive corporate espionage of the Edison Trust.
* **The Framework Migration:** Following the initial sprint, the codebase was extracted from React and migrated into a lean, native three-file system (HTML/CSS/JS) to maximize execution speed, maintain zero external dependencies, and optimize performance for local editing and browser deployment on a Chromebook setup.

### The Three-Tier AI Studio Framework
To eliminate AI context drift, prevent code-generation hallucinations, and maintain absolute project momentum during long development timelines, the project utilizes an isolated, multi-threaded workspace structure. Gemini is systematically divided into three distinct operational "classes":

1. **Class 1: The Master Architect (Main Thread)**
   * *Role:* Technical Product Manager and Version Control Director.
   * *Function:* Permanently stores the master documentation (`GOALS.md` and `DEVELOPMENT_MANUAL.md`), manages game balance ledgers, and drafts explicit technical implementation instructions for the development sandbox. This thread tracks overall project continuity and never handles raw, multi-file code writing.
2. **Class 2: The Programmer (Ad Hoc Sandbox Threads)**
   * *Role:* Pure, Stateless Code Generation Engine.
   * *Function:* Temporary, short-lived threads spun up exclusively to write single, surgical code features or fix bugs using the current live state of `index.html`, `style.css`, and `script.js`. Once a feature is successfully implemented and pushed to GitHub, these threads are completely destroyed to wipe out cached memory drift.
3. **Class 3: The Creative Writer (Narrative & Mechanics Designer)**
   * *Role:* World-Builder, Dialogue Writer, and Systems Innovator.
   * *Function:* Independent threads dedicated entirely to lore expansion, writing flavor text for the automated station messages panel, and inventing experimental gameplay mechanics. These concepts are benchmarked here in the prototype lab before being considered for separate, larger game projects.

---

## 1. CORE PROJECT GOALS

* **Goal 1: Design & Planning Experience** To provide the creator with practical experience thinking through core gameplay design, progression systems, balancing structures, and narrative-driven loops.
* **Goal 2a: Mechanical Experimentation for Larger Projects** To act as an isolated laboratory for testing distinct incremental and survival game mechanics. The insights gained here are meant to explore what features might be applicable to a separate, larger game project collaboration being developed in tandem.
* **Goal 2b: Cross-Project Knowledge Contribution** To use the direct balancing insights, player frustrations, and pacing breakthroughs discovered in this prototype to contribute back conceptually to that larger collaborative project (focusing purely on design principles, not raw code transfer).
* **Goal 3: Understanding AI Capabilities & Limitations** To map out exactly what Gemini can and cannot do effectively during an extended software project. This includes using Markdown documentation to actively track architecture, specifications, design logs, and operational milestones to maintain project continuity.
* **Goal 4: Building an Enjoyable, Tailored Game** To construct a functional, engaging incremental prototype that the creator genuinely enjoys playing through from start to finish.

---

## 2. DEVELOPER PROFILE & ENVIRONMENT CONSTRAINTS

* **Coding Proficiency:** The creator is completely focused on gameplay design and has very minimal development, programming, or terminal scripting experience. The creator relies on Gemini to write, structure, and maintain 100% of the project's source code.
* **Hardware Setup:** All development operations are run locally on a Chromebook.
* **Tooling Framework:** * **Crosetini Linux Terminal:** Used exclusively for executing straightforward, copy-pasted operational commands (such as running local development servers).
    * **VS Code:** Used as the primary local text editing environment to save file assets.
    * **GitHub Repository:** Used as the master version control layout to back up working states, download clean files, and track project history.
* **Target Device Viewport:** The game is explicitly designed, structured, and visually optimized to fit a compact mobile phone screen interface, though live testing is also conducted natively inside a Chromebook desktop web browser window.

---

## 3. COLLABORATIVE METHODOLOGY & RULES

To ensure code stability and prevent development fatigue, all future interactions must adhere to these strict execution rules:

1.  **Gemini Writes the Code:** Because Gemini generated the entirety of this HTML, CSS, and JavaScript framework, Gemini is fully responsible for managing the architecture, variable scopes, and backend logic.
2.  **Verbose, Line-by-Line Comments:** Every single code block, conditional loop, and event selector modified or generated by Gemini must feature explicit, clear, plain-English comments detailing exactly what the code is doing.
3.  **One Surgical Adjustment at a Time:** Gemini will never combine multiple bug fixes or feature requests into a single response. Development will proceed by identifying one precise mechanic, reviewing its current code lines, applying the fix, and verifying its success on the phone before moving forward.
4.  **No Structural Guesswork:** Gemini will only request edits based on code lines explicitly provided or confirmed by the creator during the immediate conversation turn to eliminate hallucinated variables.
5.  **Immediate Warning Halts:** If an edit introduces a red underline syntax warning in VS Code or crashes the web server, all progress halts immediately to roll back and find a safer approach.

---

## 4. GAMEPLAY DESIGN INSPIRATION
*Wardenclyffe Field Station* is conceptually modeled after the design philosophy of classic incremental games like **Universal Paperclips**. The gameplay layout begins with a deceptively simple, manual task (cranking a dynamo for single Joules) and is engineered to slowly unfold, layer by layer, introducing automation machinery, shifting dashboard metrics, permanent technological branching decisions, and escalating threat counters that demand strategic resource management.

* **The New York State Expansion:** Moving beyond a single-site loop, the game utilizes a forward-only geographical progression (Wardenclyffe ──► Poughkeepsie ──► Ithaca ──► Niagara Falls). Progression is driven by regional lifecycles, resource-based branching choices, and a specialized "Expedition Crate" asset migration system that shifts gameplay paradigms as the player scales upward.
  
---

## 5. EXPERIENCES & LEARNINGS

What I have discovered after a few iterations of adding features and debugging:

1.  **Gemini has a finite memory:** Gemini will lose the thread after a few hours, or maybe 30-40 prompts.  Is this limitation due to going down a rabbit hole and losing the bigger picture, or because Gemini's tank is full and has a first in/first out memory?
      * Below may be the first signs that Gemini has lost the thread and needs to be refreshed.

      1.  **Gemini may not accurately track line numbers** Gemini will reference a line of code in the file, but the line number given does not usually match the line number in my editor.  Sometimes off by 5-10 lines.  Sometimes it's in a completely different section of the file.
      2.  **Gemini may not accurately remember comments** One of the tactics was to use comments to explicitly separate code sections.  This would make it easier to search for the correct location for editing and/or debugging.  But the suggestions do not always match the exact comment in the file.
      3.  **Gemini may hallucinate variable or function names**  When Gemini instructs me to look for a specific block of code, the variable names or function names give may not match what is in the code.  Despite repeatedly apologising for the error, Gemini does not refresh its memory, and continues directing me towards non-existant code.
2.   **Gemini is great until it's not**  While functioning, Gemini gives very good code changes, and has improved with providing explicit comments.
3.   **Proposed workflow**  Suggested workaround to deal with memory loss:
      1.   Upload .md and source code files and explain what the next development task will be
      2.   Have Gemini generate a prompt to describe this new task
      3.   Begin a second/separate sandbox Gemini thread
      4.   Upload the .md and source code files
      5.   Use the prompt from the original thread to begin the development task
      6.   Once the task is complete, functionality is tested, get a wrap-up summary for DEVELOPMENT_MANUAL.md
      7.   Close out the sandbox, update the .md, and have the original thread walk me through github push
4.   **Can Gemini recognize when it has lost the thread?**  Once Gemini starts making mistakes it apologiezes, but then presses on regardless.  Is there a way to have Gemini itself recognize that it is lost, alert me, and find a way to safely bail out before creating further errors and confusion (and frustration)?
5.   **Insights into Goal #3, but hurdles for Goal #4**  We are learning the limits of Gemini's capabilities, which is stated in Goal #3.  However, this has slowed down Goal #4 -- making an enjoyable game to play.

---
