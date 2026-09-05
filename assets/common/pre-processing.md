# Pre-processing: Collection & Labeling SOP

## Applicable Scenarios

Doing deep research / knowledge collection on a technical domain, needing to ensure collected details won't cause narrative weight misalignment in subsequent writing.

## Core Principle

At collection time, you often don't yet know what's architectural vs. transport — because you haven't built a complete mental model yet. So pre-processing isn't about "judging right vs. wrong" — it's about **labeling collected items with role tags to give post-processing room to operate**.

## Workflow

### Step 1: Collect Details

Collect technical details normally. Don't skip any information that seems "unimportant."

### Step 2: Identify Propositions & Apply Substitution Test

For each collected detail, execute the shared procedure defined in SKILL.md:

1. **Identify the proposition** the detail is conveying (see "Substitution Test" → "Proposition identification before substitution")
2. **Apply the substitution test** to determine the role (Architectural / Transport / Configurable)
3. For **proposition granularity**, follow `references/proposition-granularity-guide.md`

The role labels and their definitions are in SKILL.md → "Three-Layer Role Labels".

### Step 3: Record Labels and Rationale

For each technical detail, record:

```
- Detail: [name]
- Role Label: [Architectural / Transport / Configurable]
- Rationale: [what behavior would/wouldn't change if replaced]
- Expected Narrative Weight: [High / Low / Medium]
```

### ⚠️ User Checkpoint (Mandatory)

After recording all labels, **pause and present the full labeling table** to the user. Ask:

> "以上标签是否合理？有需要调整的角色判定吗？确认后进入风险标记步骤。"

Wait for user confirmation. If the user disagrees with any label:
1. Ask the user what proposition the detail is conveying in their context
2. Re-run the substitution test with the user-provided context
3. Update the label and rationale

Do not proceed to Step 4 until the user confirms the labels.

### Step 4: Flag Potential Misalignment Risks

If a detail meets any of these conditions, flag it as `Potential Misalignment Risk`:

1. **Familiarity-weighting risk**: The detail uses a common term (e.g., "event delegation", "virtual DOM") that easily leads readers to auto-complete processing logic using its classical meaning
2. **Length-induced risk**: The detail is extensively elaborated in source materials (independent chapter, lots of code examples) but is actually Transport/Configurable
3. **Implicit-completion risk**: The detail's name implies certain processing logic (e.g., "delegation" implies processing at the delegation point), but the actual processing logic is elsewhere

### Step 5: Output Collection

Output all collected technical details with their labels in a structured format for use in post-processing.

## Exception Handling

| Scenario | Trigger | Action |
|----------|---------|--------|
| Detail has no clear proposition | The detail is a raw implementation fact (e.g., "uses port 443") with no behavioral claim | Label as `Transport` by default — raw implementation details are signal delivery, not behavioral mechanisms. Record rationale: "No behavioral proposition identified; defaulting to Transport." |
| Substitution test result is ambiguous | Replacing the proposition changes behavior "somewhat" but not fundamentally | Label as `Configurable` — ambiguous cases indicate a switch/option rather than a core mechanism. Flag for user review at checkpoint. |
| Source material is incomplete | Collected details are fragments, not full explanations | Proceed with labeling based on available context. Add `⚠️ Incomplete Source` flag. The label is provisional and should be re-evaluated when full material is available. |
| Proposition granularity cannot be determined | Article treats the detail at mixed depths (e.g., mentions concept, then shows partial code) | Follow the decision flowchart in `references/proposition-granularity-guide.md` → "Unclear / mixed signals" path: default to conceptual level and flag `⚠️ Granularity Ambiguous` for user review. |
| Detail spans multiple propositions | A single technical term conveys two distinct propositions (e.g., "Fiber tree" = data structure + traversal algorithm) | Split into two entries, one per proposition. Label each independently. This is common for compound concepts — do not force a single label. |
| User disagrees with label at checkpoint | User provides additional context that changes the proposition reading | Re-run the substitution test with the user-provided proposition. Update label and rationale. Record the user's input in the rationale field for traceability. |

## Guidance for External Collection/Production

When requesting collection from external parties (e.g., AI agents, collaborators), append this requirement beyond "collect these technical details":

> **For each technical concept, in addition to explaining "what it is", answer: if it were replaced with an alternative implementation, would the user's observable behavior change? If yes, it's Architectural; if no, it's Transport.**

The key: this doesn't require collectors to make judgments before understanding the full picture — it gives them an operational rule.
