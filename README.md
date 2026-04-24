# Narrative Focus

> **中文摘要**：检测和修正技术教程、面试解析文章中的"叙述重心错位"——当响亮但表层的实现细节抢了真正决定行为的架构性机制的风头时，读者的心智模型会被锚定在错误的位置，导致后续学习不断回流重构。通过"替换实验"判定每个细节的角色（架构性 / 传输性 / 配置性），在前处理阶段标注收集物，在后处理阶段检测并精准修正。后处理包含权威性校验步骤，确保重心迁移不引入技术语义错误。兼容 OpenClaw / CodeBuddy 原生 Skill 格式，也适用于 Claude Code、Cursor 等 AI coding agent。

An AgentSkill for detecting and fixing **Narrative Weight Misalignment** in technical tutorials and interview prep articles. Compatible with OpenClaw, CodeBuddy, and any AI coding agent.

## The Problem

Technical tutorials often give disproportionate emphasis to implementation details that are familiar or have catchy names (e.g., "event delegation", "virtual DOM"), while the mechanisms that actually determine user-observable behavior get buried as footnotes. This causes readers to anchor their mental model on the wrong concept — then spend hours reconstructing it when they hit real-world problems.

**Example**: A React event system article titled one of its "Three Core Mechanisms" as "Event Delegation" with a full chapter — but event delegation is just the signal delivery pipe. The actual core is Fiber-tree traversal, which was compressed into a few lines in a flow chart. The reader walks away thinking "event delegation" is the key concept, then gets confused when debugging `stopPropagation()` behavior in production.

## Scope

| In scope | Out of scope |
|----------|-------------|
| Technical tutorials, deep-dive explainers | API reference docs |
| Interview prep articles | Opinion pieces, news/changelog |
| Framework comparison articles | Non-technical content |

This skill answers one question: **"Does the narrative weight of each concept match its actual role?"** It does not check for missing content, theme boundaries, or genre consistency.

## How It Works

### Substitution Test (the core judgment rule)

For any technical detail, ask: **If the proposition conveyed by this detail were replaced with an alternative, would the user's observable behavior change?**

- **Yes** → Architectural (determines system behavior) → deserves high narrative weight
- **No, only the delivery method changes** → Transport (pipe to get signals to the architecture) → low narrative weight
- **Behavior unchanged, only configuration differs** → Configurable (switch/option on existing mechanism) → medium narrative weight

**Critical: Proposition identification before substitution.** The same technical detail can convey different propositions depending on context. You must identify what proposition the detail is actually conveying in the article before applying the substitution test — do not substitute the literal term/implementation, substitute the proposition.

**Proposition granularity.** The same detail can be read at different granularities (e.g., "positional encoding provides location info" vs "sine/cosine formulas implement position encoding"). The correct granularity depends on what the article actually elaborates. See `references/proposition-granularity-guide.md` for the decision flowchart and worked examples.

### Two Modes

| Mode | When | Purpose |
|------|------|---------|
| **Pre-processing** | During research/collection phase | Label collected details with role tags to prevent misalignment before writing |
| **Post-processing** | After a draft is complete | Detect misalignment in existing articles and surgically fix it |

### Post-processing Safeguards

Post-processing includes two safeguard steps after correction:

1. **Second-pass detection** — re-run the detection workflow on the corrected article to confirm all misalignments are resolved
2. **Authoritative verification** — check modified sections against authoritative sources (official docs, team blogs, MDN) to ensure weight migration did not introduce technical semantic errors. Only **technical facts** are verified against authorities; **narrative framing** is not (official docs serve a different purpose than mental-model-oriented articles)

## Installation

### OpenClaw / CodeBuddy (native AgentSkill)

This skill uses the AgentSkill-compatible `SKILL.md` format and works natively with OpenClaw and CodeBuddy:

**OpenClaw** — install from ClawHub or copy to your skills directory:
```bash
# Via ClawHub (recommended)
openclaw skill install narrative-focus

# Or manually
cp -r narrative-focus/ ~/.openclaw/skills/
```

**CodeBuddy** — copy to your skills directory:
```bash
cp -r narrative-focus/ ~/.codebuddy/skills/
```

### Other AI Coding Agents (Claude Code, Cursor, Windsurf, etc.)

Load `SKILL.md` as context, then load the appropriate reference file (`references/pre-processing.md` or `references/post-processing.md`) based on which mode you need. The substitution test and role labels are defined in SKILL.md; the detailed SOPs are in the reference files.

For example, with Claude Code:
```
# Add to CLAUDE.md or instruct directly:
Read narrative-focus/SKILL.md and follow its workflow for post-processing detection on this article.
```

## Usage

### Pre-processing (collection phase)

Tell your agent something like:
- "按叙述重心规范收集" (Collect with narrative focus rules)
- "角色标注" (Role labeling)
- "Label these technical details by role using the substitution test"

The agent will identify the proposition conveyed by each detail, apply the substitution test, and tag it as Architectural / Transport / Configurable.

### Post-processing (review & fix)

Tell your agent something like:
- "检测叙述重心错位" (Detect narrative weight misalignment)
- "审稿重心" (Review narrative focus)
- "Check this article for narrative weight misalignment"

The agent will scan the article, identify misalignments, fix them — upgrading architectural concepts and downgrading transport/configurable ones — then verify modified sections against authoritative sources to ensure no technical errors were introduced.

## Examples

| Example | What it shows |
|---------|--------------|
| [`react-event-system/`](examples/react-event-system/) | Classic misalignment: event delegation over-highlighted, Fiber traversal obscured. Full Step 1–5 detection + correction + second-pass. Includes **proposition granularity analysis**. |
| [`docker-orchestration/`](examples/docker-orchestration/) | Title-content mismatch: build details crowd out orchestration. Multiple Transport/Configurable items over-highlighted. |
| [`v8-gc/`](examples/v8-gc/) | **Borderline case**: most weights correct, 2 borderline items. Shows how the skill handles "almost right" articles and its own scope boundary. |

## File Structure

```
narrative-focus/
├── SKILL.md                              # Core concepts + mode routing
├── README.md
├── LICENSE
├── references/
│   ├── pre-processing.md                 # SOP: collection & labeling phase
│   ├── post-processing.md                # SOP: detection, correction & verification
│   └── proposition-granularity-guide.md  # How to read propositions at the right depth
└── examples/
    ├── react-event-system/               # Classic misalignment + granularity analysis
    │   ├── before.md
    │   └── after.md
    ├── docker-orchestration/             # Title-content mismatch
    │   ├── before.md
    │   └── after.md
    └── v8-gc/                            # Borderline case + scope boundary
        └── before.md
```

## License

MIT
