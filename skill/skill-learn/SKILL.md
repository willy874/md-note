---
name: skill-learn
description: 當使用者在應用某個 SKILL 時出現需要來回修正、報錯、或重跑多次的卡關情況，被動啟用以記錄該事件，累積每個 skill 在本專案中的在地化經驗。每個 skill 首次觸發時會詢問是否啟動 learn mode，選擇會被記錄到 settings.json 作為後續判斷依據。不要在工作進展順利、或 skill 首次套用就成功時觸發。
---

# skill-learn — Skill 自學與事件紀錄

用來**追蹤其他 SKILL 在實際應用中遇到的問題**,把「卡關、來回修正、報錯」當成學習訊號,累積為該 skill 的在地化經驗。未來同樣 skill 再被呼叫時,可以先讀過去的紀錄,避免重蹈覆轍。

本 skill 是**被動的**:不搶焦點、不打斷使用者原本想做的事,只在事件發生後安靜記下。

---

## 何時觸發

當你正在應用某個其他 skill(下稱 `{skill-name}`),且發生以下情況之一:

- 使用者連續糾正你對該 skill 的應用方式(「不是這樣」「應該要 X」)
- 套用 skill 後出錯、報錯、或需要重跑
- 多輪往返(>2 次)後才得到正確結果
- 使用者明確表示上一步的 skill 應用方式有問題

**不要觸發的情境**:

- 首次套用即成功
- 純閒聊、一般技術問答
- 使用者沒有給出任何校正訊號
- 錯誤與 skill 無關(例如環境問題、網路錯誤)

---

## 執行流程

### Step 1. 判讀 `{skill-name}`

先確認剛才觸發卡關的是哪個 skill。若你無法明確指出名稱,**不要啟動本流程**——寧可放過,也不要記一筆無頭紀錄。

### Step 2. 讀取 learn mode 狀態

讀取 `skill/skill-learn/settings.json`:

- 檔案不存在 → 視為空物件 `{}`,進入 Step 3 詢問
- 存在但 `skills[{skill-name}]` 未設定 → 進入 Step 3 詢問
- `skills[{skill-name}].learnMode === "disabled"` → **直接結束**,不記錄
- `skills[{skill-name}].learnMode === "enabled"` → 跳到 Step 4
- `skills[{skill-name}].learnMode === "ask-each-time"` → 重跑 Step 3

### Step 3. 首次觸發,詢問使用者

呼叫 `AskUserQuestion`:

- **question**: `偵測到剛才應用 「{skill-name}」 時有來回修正。要啟用 learn mode 把這次事件記下嗎?(未來同 skill 再被觸發時可以先讀)`
- **options**:
  - `啟用並記錄這次` — 之後都會自動記
  - `只記這次,以後再問` — 存為 `ask-each-time`
  - `不要記,以後也不問` — 存為 `disabled`

將回答寫回 `skill/skill-learn/settings.json`(整檔讀入 → mutate → 整檔寫回,避免 JSON 破損):

```json
{
  "skills": {
    "{project-name}/{skill-name}": {
      "learnMode": "{enabled|disabled}",
      "firstAskedAt": "2026-04-20T15:00:00+08:00"
    }
  }
}
```

若使用者選「不要記」→ 到此結束,不進入 Step 4-5。

### Step 4. 寫入事件紀錄

路徑:`.claude/skills/{skill-name}/logs/{YYYYMMDD-HHmmss}.md`

- 用 `date +%Y%m%d-%H%M%S` 取當前時間作為檔名
- 若資料夾不存在,建立之
- 格式:

```markdown
---
timestamp: 2026-04-20T15:00:00+08:00
skill: {skill-name}
trigger: 一句話描述觸發本次紀錄的事件
tags: [tag1, tag2]
recall-when: 未來滿足什麼條件時應回查本筆(越具體越好,是 index 的回查時機欄位來源)
---

## 當時情境

使用者原本想做什麼、skill 怎麼被呼叫的(2-3 句)。

## 發生了什麼

錯誤訊息、修正的來回、實際卡點(2-5 句)。

## 修正後的做法

最後怎麼解的、哪一步才是對的。

## 下次觸發這個 skill 時要注意

未來此 skill 再被呼叫時,可以主動避開的問題 / 要先檢查的點。
```

**`recall-when` 寫法建議**:用「情境關鍵詞 + 動作」格式,讓未來的你用關鍵字比對就能判讀。

- ✅ 「要對 Figma text node 做任何寫入時」
- ✅ 「使用 next/image 載入外部 domain 圖片時」
- ❌ 「出錯時」(太籠統,等於沒寫)
- ❌ 「處理字型」(沒有動作邊界)

### Step 5. 維護 index.md

路徑:`.claude/skills/{skill-name}/logs/index.md`

- 若不存在 → 建立,含下方標頭
- 若已存在 → 在表格最後追加一行

```markdown
# {skill-name} — 應用事件索引

此檔列出所有記錄過的卡關事件。套用 {skill-name} 前,**先掃「回查時機」欄**,比對當前任務是否命中任何一條;命中才 Read 對應 log。

| 時間 | 回查時機 | 事件摘要 | 標籤 | 檔案 |
|------|----------|----------|------|------|
| 2026-04-20 15:00 | 要對 Figma text node 做任何寫入時 | 忘記 await loadFontAsync 導致 text 操作失敗 | figma, font | [20260420-150000.md](20260420-150000.md) |
```

「回查時機」欄 = log frontmatter 的 `recall-when`。寫入時直接從 frontmatter 抄過來,不要另外發明一句。

追加時,更新 `settings.json` 的 `lastLoggedAt` 與 `logCount`。

### Step 6. 回到原本任務

記錄完成後,**回到觸發本 skill 的原任務**。不要對使用者長篇大論「我幫你記了什麼」,一句話帶過即可(例:「已記錄此次 {skill-name} 的卡點到 logs/」)。

---

## 讀取 log 的時機(反向用法)

當你**即將開始應用某個 skill** 時(不是卡關時),先快速檢查:

1. `.claude/skills/{skill-name}/logs/index.md` 是否存在?
2. 存在 → Read 它,**先掃「回查時機」欄**,與當前任務情境做關鍵字比對
3. 有命中條目 → Read 對應的 `{time}.md`,把「下次觸發這個 skill 時要注意」那段納入本次執行的前置考量
4. 無命中 → 不用浪費 context 讀個別 log,繼續原任務

這步驟是本 skill 能產生複利的關鍵——寫下來只是半套,**讀得到**才算閉環。「回查時機」欄就是讓讀取階段不必全檔掃過的捷徑。

---

## `settings.json` schema

路徑:`skill/skill-learn/settings.json`

```json
{
  "skills": {
    "<skill-name>": {
      "learnMode": "enabled | disabled | ask-each-time",
      "firstAskedAt": "<ISO8601 timestamp>",
      "lastLoggedAt": "<ISO8601 timestamp>",
      "logCount": 0
    }
  }
}
```

| 欄位 | 說明 |
|------|------|
| `learnMode` | `enabled`=自動記;`disabled`=永不記也不問;`ask-each-time`=每次觸發都再問 |
| `firstAskedAt` | 第一次詢問使用者的時間(永遠不變) |
| `lastLoggedAt` | 最近一次成功寫 log 的時間 |
| `logCount` | 累計記錄筆數 |

---

## 規範

1. **被動觸發,不主動記流水帳** — 使用者順利完成時不要寫 log。只有「卡關 / 修正 / 重跑」才有學習價值。
2. **一事件一檔** — 不要把多個事件塞進同一檔案;時間戳就是檔名,index 負責串接。
3. **不記錄敏感資訊** — log 可能被未來對話讀取,略過 token、密碼、個資、內網 URL。
4. **保持簡潔** — log 不是日記,四個段落合計 ≤ 15 句。未來你要能 10 秒內看完一筆。
5. **settings.json 整檔讀寫** — 讀入 → JSON.parse → mutate → JSON.stringify → 寫回。不要手動拼字串。
6. **名稱要乾淨** — `{skill-name}` 必須是真實存在的 skill 名,不要發明縮寫。
7. **不要重複詢問** — 若 `skills[{skill-name}]` 已有 `learnMode` 設定(非 `ask-each-time`),絕對不要再問第二次。

---

## 不使用本 skill 的情境

- 目前正在順利執行,沒有任何卡關訊號
- 卡的原因與 skill 無關(網路、權限、外部服務)
- 使用者明確說「不用記」
- 使用者 `learnMode` 設為 `disabled`
- 無法明確指出是哪個 skill 卡關
