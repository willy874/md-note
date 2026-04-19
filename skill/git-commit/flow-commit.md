# Flow Commit

目標:交付一個乾淨的 commit(或一疊乾淨的 commits)。在任何 `git commit` 之前,先確認 lint 通過並執行 code review。當 diff 太大或太雜亂、難以塞進單一 commit 時,進行拆分或 stage 重組。**不 push、不開 PR。**

## 1. 快照當前變更

並行執行:

- `git status`
- `git diff`(未 stage)
- `git diff --staged`(已 stage)
- `git log -n 5 --oneline`(commit message 風格參考)

## 2. 評估複雜度 — 在動手之前先選定策略

檢視 diff 並判斷:

| 情況                                                                | 策略                                  |
| ------------------------------------------------------------------- | ------------------------------------- |
| 單一連貫的變更、約 ≲ 300 LOC、單一關注點                            | **A. 單一 commit**                    |
| 多個無關的關注點散落在不同檔案                                      | **B. 拆分 commits**                   |
| 關注點交錯在_同一份檔案內_,難以用 `git add -p` 切開                | **C. 透過暫存副本進行 stage 重組**    |

不確定時,寧選 B 也不選 A;寧選 C 也不選 B。一個讓人困惑的單一 commit 是最糟的結果。

## 3. Lint — commit 之前必須通過

依據變更內容執行對應的 lint 指令:

- 永遠執行:`pnpm format:check`(repo root,`oxfmt`)
- 動到 `apps/console/**`:`pnpm --filter @merak/console lint` + `pnpm --filter @merak/console lint:check`
- 動到其他 apps/packages:執行其對應的 lint script

若有任何失敗:

1. 在程式碼中修正錯誤(若是格式問題,可直接 `pnpm format`)。
2. 重新執行失敗的指令直到通過。
3. 絕不在有 lint 錯誤的情況下 commit。絕不 `--no-verify`。

## 4. Code review — 呼叫 `code-reviewer` agent

針對待提交的 diff 派送 `code-reviewer` 子 agent。簡報內容包含:

- 此變更想達成什麼(一句話)
- 動到哪些檔案/區域
- 任何不那麼明顯、希望被仔細檢視的地方

分流結果:

- **阻擋級**(bug、安全性、慣例違反)→ commit 前必須修正。
- **非阻擋級小毛病** → 在 commit message 中註記或延後處理,由使用者決定。

若 review 修正動到了程式碼,重跑 lint(§3)。

## 5. Commit — 依照所選策略

### A. 單一 commit

依照 `.claude/skills/git-commit/quick-commit.md` 的 §1–§4(收集、草擬、stage、commit)。

### B. 拆分 commits

對於每個邏輯群組:

1. 只 stage 該群組的檔案:`git add <specific-files>`。針對部分檔案的拆分,使用 `git add -p` 並只接受相關 hunk。
2. 用 `git diff --staged` 確認 stage 的內容符合預期群組。
3. 為該群組撰寫聚焦的 Conventional Commits message 並 commit。
4. 重複直到 working tree 乾淨。

排序 commit 時,在合理範圍內讓每個 commit 都能獨立編譯/通過 lint(例如:在使用基礎設施重構成果的功能程式碼之前,先 commit 基礎設施重構)。

### C. 透過暫存副本進行 stage 重組

當 `git add -p` 太彆扭時使用 — 例如:rename、大量重新格式化與邏輯變更交錯、或讓 hunk 切割變得混亂的搬移。

1. 建立暫存目錄:`mkdir -p /tmp/merak-commit-staging/<timestamp>/`。
2. 將所有修改/新增的檔案複製過去,保留相對路徑:

   ```bash
   git diff --name-only --diff-filter=AMR | xargs -I{} sh -c 'mkdir -p "/tmp/merak-commit-staging/<timestamp>/$(dirname {})" && cp "{}" "/tmp/merak-commit-staging/<timestamp>/{}"'
   ```

3. 將 working tree 重置回 HEAD:`git restore --staged --worktree <paths>`(範圍限定於你複製過的檔案 — 不要清掉無關的工作)。
4. 對於每個邏輯切片:
   - 直接編輯檔案以重新套用該切片,以暫存副本作為最終狀態的參考。
   - 對該切片執行 lint(§3)。
   - 依 §5.B 進行 stage + commit。
5. 當最後一個切片落地後,working tree 應與原始暫存副本一致。用 `diff -r <paths> /tmp/merak-commit-staging/<timestamp>/` 驗證。
6. 刪除暫存目錄。

若在任何時點重播的結果與暫存副本出現你沒有預期的偏差,停下來詢問使用者再繼續 — 不要默默丟棄變更。

## 6. 回報

對於每個建立的 commit:短 hash + subject line。若有非阻擋級的 review 發現被延後處理,也一併註記。

## 紅線

- 絕不在 lint 失敗時 commit。絕不 `--no-verify`。
- 此流程絕不 push、絕不開 PR。
- 絕不為了「清理乾淨」而丟棄未 commit 的工作。若策略 C 中某個切片重播出錯,暫存副本即真實來源 — 從那裡還原。
- 除非使用者明確要求,否則絕不 `--amend`。
