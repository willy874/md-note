---
name: git-commit
description: Stage and commit current changes. TRIGGER when the user says any of `commit`, `幫我 commit`, `/commit`, `/git-commit`. Presents two modes — Quick (minimal, single commit) or Flow (lint + code review, may split/stage-restructure commits). Neither mode pushes or opens a PR. Do not trigger for, reading git history/log, reviewing diffs without committing, resolving merge conflicts, rebasing, reverting commits, or any read-only git inspection.
---

# Git Commit Skill

## 步驟 1 — 選擇模式

呼叫 `AskUserQuestion`,提出單一問題 `Choose commit mode?`:

- **Quick Commit**(建議)— 最精簡流程:收集、草擬、暫存、提交。不跑 lint、不做 review、單一 commit。
- **Flow Commit** — 在 commit 之前會跑 lint 並呼叫 `code-reviewer` agent。當 diff 過於複雜時,會拆成多個 commit 或透過暫存副本進行 stage 重組。同樣不會 push 或開 PR。

## 步驟 2 — 執行

- Quick → 讀 `.claude/skills/git-commit/quick-commit.md` 並完全照做。
- Flow → 讀 `.claude/skills/git-commit/flow-commit.md` 並完全照做。

## 規則(兩種模式共用)

- 絕不使用 `git add -A` 或 `git add .`。只 stage 本次 commit 預期的特定檔案。
- 除非使用者明確要求,否則絕不使用 `--no-verify` 或 `--amend`。
- 若 pre-commit hook 失敗,修正根本問題、重新 stage,然後建立**新的** commit。不要 amend。
- Commit message 遵循 Conventional Commits(`feat`、`fix`、`refactor`、`docs`、`chore`、`test`、`style`、`perf`),可選擇加上 scope:`feat(auth): ...`。
- 透過 HEREDOC 傳遞 commit message 以保留格式。
- 若完全沒有變更(沒有 untracked 檔案、也沒有任何修改),告訴使用者沒有東西可以 commit 並停止。不要建立空的 commit。
- 若偵測到可能含有機密資訊的檔案(`.env`、`*credentials*`、`*secret*`、`*.pem`、`*.key`),在 stage 之前停下並警告使用者。
- 兩種模式都絕不 push、也絕不開 PR。
