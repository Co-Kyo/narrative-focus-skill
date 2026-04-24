# Experiments

Three rounds of experiments validating the Narrative Focus skill — covering cross-domain robustness, controlled comparison, and correction effectiveness. All experiments used **Xiaomi MiMo v2.5-pro** as the base model, with sub-agent groups (Skill input vs no Skill input) for controlled comparison.

## Experiment Overview

| Round | Method | Test Subjects | Core Finding |
|-------|--------|---------------|-------------|
| 1 | 5 synthetic articles × Skill detection | Methodology cross-domain robustness | 75.8% misalignment detection rate, 100% technical fact accuracy |
| 2 | 3 real articles × 2 sub-agent groups (with/without Skill) | Skill's incremental value over same-model baseline | Skill = precision ruler, no-Skill control = comprehensive checkup |
| 3 | 2 articles × full correction pipeline | Correction effectiveness verification | Average improvement of 3.0 points (5-point scale) |

## Directory Structure

```
experiments/
├── README.md                                    # This file
├── final-evaluation.md                          # Final comprehensive evaluation (3 rounds)
│
├── round1-cross-domain/                         # Round 1: Cross-domain robustness
│   ├── articles/                                #   5 synthetic test articles
│   │   ├── 01-kubernetes-networking.md          #     DevOps / Infrastructure
│   │   ├── 02-postgresql-optimization.md        #     Backend / Database
│   │   ├── 03-transformer-architecture.md       #     Machine Learning
│   │   ├── 04-rust-ownership.md                 #     Systems Programming
│   │   └── 05-tls-handshake.md                  #     Security / Cryptography
│   ├── detection-results/                       #   Skill detection reports (5)
│   └── summary.md                               #   Round 1 summary
│
├── round2-controlled/                           # Round 2: Controlled comparison
│   ├── articles/                                #   3 real-world articles
│   │   ├── 01-mysql-index.md                    #     MySQL Index (cnblogs)
│   │   ├── 02-linux-cfs.md                      #     Linux CFS Scheduler (CSDN)
│   │   └── 03-git-objects.md                    #     Git Internals (matools)
│   ├── no-skill-control-results/                #   No-Skill control group (same model, no Skill input) (3)
│   ├── skill-detection-results/                 #   Skill detection group (same model + Skill input) (3)
│   └── summary.md                               #   Round 2 summary
│
└── round3-correction/                           # Round 3: Correction verification
    ├── corrected-articles/                      #   Post-correction articles (2)
    │   ├── 01-mysql-index-corrected.md
    │   └── 02-linux-cfs-corrected.md
    ├── correction-reports/                      #   Correction + second-pass + verification (2)
    ├── re-evaluation/                           #   No-Skill control re-evaluation (2)
    └── summary.md                               #   Round 3 summary
```

## Key Results

### Round 1: Cross-domain Robustness

- **Misalignment rate**: 25/33 concepts misaligned (75.8%)
- **Technical fact accuracy**: 5/5 domains, all substitution test assumptions technically valid
- **Proposition granularity issues**: 5/5 domains encountered — confirms the necessity of `proposition-granularity-guide.md`
- **Unique patterns discovered**: Orthogonal concept invasion (Rust), equal-weight linear narrative trap (TLS), author self-diagnosis consistency (Transformer/TLS)

### Round 2: Skill vs No-Skill Control (Same Model)

Both groups used the same MiMo v2.5-pro model. The only difference: the Skill group received SKILL.md + post-processing.md as input; the no-Skill control group received only the article and a general "evaluate narrative focus" prompt.

| Capability | Skill Group | No-Skill Control |
|-----------|-------------|------------------|
| Precise A/T/C role classification | ✅ Strong | ❌ Absent |
| Quantified "mostly correct + few misaligned" | ✅ Strong | ❌ Absent |
| Misalignment type differentiation | ✅ Strong | ❌ Vague |
| Missing content detection | ❌ Out of scope | ✅ Strong |
| Depth assessment | ❌ Out of scope | ✅ Strong |
| Overall quality scoring | ❌ Absent | ✅ Present |

### Round 3: Correction Effectiveness

| Article | Before | After | Improvement |
|---------|--------|-------|-------------|
| MySQL Index | ~2/5 | 4.5/5 | **+2.5** |
| Linux CFS | 1/5 | 4.5/5 | **+3.5** |
| **Average** | **1.5/5** | **4.5/5** | **+3.0** |

Second-pass detection: ✅ all passed. Authoritative verification: ✅ all passed.
