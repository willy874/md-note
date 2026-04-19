# Quick Commit

目標:產生**一個**簡潔的 commit。不 push、不開 PR。

## 1. 收集當前狀態(並行執行)

在一個訊息中,並行送出這三個 Bash 呼叫:

- `git status`(絕不使用 `-uall`)
- `git diff`(包含已 stage 與未 stage 的內容)
- `git log -n 5 --oneline`(對齊此 repo 近期的 commit 風格)

## 2. 分析並草擬訊息

- 分類變更:`feat` / `fix` / `refactor` / `docs` / `chore` / `test` / `style` / `perf`。
  - `add` → 全新功能,使用 `feat`
  - `update` → 既有功能的強化,使用 `feat` 或 `refactor`
  - `fix` → bug 修正
- 領域明確時加上 scope:`feat(auth): ...`、`fix(member): ...`。
- Subject line 為單行、72 字元以內,聚焦在**為什麼**而非**做了什麼**。
- 對於多個相關變更,在 body 中以 bullet 列出,但仍產生**一個** commit(此模式不會拆 commit)。
- **絕不**包含看似機密資訊的檔案。若有任何此類檔案被 stage,停下並警告使用者。

## 3. Stage 並 commit(並行執行)

在一個訊息中:

- `git add <明確的檔案路徑>`(絕不使用 `-A` 或 `.`)
- 透過 HEREDOC 建立 commit:

```bash
git commit -m "$(cat <<'EOF'
<type>(<scope>): <subject>

<optional body bullets>

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>
EOF
)"
```

接著執行 `git status` 確認 commit 成功(此步驟依賴 commit,須在 commit 之後依序執行)。

## 4. Hook 失敗處理

若 pre-commit hook 拒絕了 commit,調查原因、修正、重新 stage,然後建立**新的** commit。**不要**使用 `--amend` 或 `--no-verify`。

## 5. 回報

一到兩句話:commit 的短 hash 與 subject。停下。不 push、不開 PR。
