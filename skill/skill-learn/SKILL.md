---
name: skill-learn
description: 當使用者在應用某個 SKILL 時出現需要來回修正、報錯、或重跑多次的卡關情況,被動啟用以記錄該事件,累積每個 skill 在本專案中的在地化經驗。本 skill 預設全自動記錄、沉默執行,不打擾使用者;除非使用者明確要求停用某個 skill 的記錄。不要在工作進展順利、或 skill 首次套用就成功時觸發。
---

# skill-learn — Skill 自學與事件紀錄

用來**追蹤其他 SKILL 在實際應用中遇到的問題**,把「卡關、來回修正、報錯」當成學習訊號,累積為該 skill 的在地化經驗。未來同樣 skill 再被呼叫時,可以先讀過去的紀錄,避免重蹈覆轍。

本 skill 是**被動、沉默的**:不搶焦點、不打斷原任務、不告知使用者「我記了什麼」;只在事件發生後安靜記下,使用者主動問才回答。

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
- `{skill-name}` 本身就是 `skill-learn`(避免自我遞迴)

---

## 路徑慣例

本 skill 所有產出集中在自己的目錄下,不散落到各 skill 資料夾(各 skill 可能在 `skill/` 或 `.claude/skills/`,位置不固定)。

| 用途 | 路徑 |
|------|------|
| 設定檔 | `skill/skill-learn/settings.json` |
| 事件紀錄 | `skill/skill-learn/logs/{skill-name}/{YYYYMMDD-HHmmss}.md` |
| 索引 | `skill/skill-learn/logs/{skill-name}/index.md` |

`{skill-name}` 一律用 basename(例:`thinking-model`),不加專案或目錄前綴——settings.json 本身就在專案內,不會跨專案污染。

---

## 執行流程

### Step 1. 判讀 `{skill-name}`

先確認剛才觸發卡關的是哪個 skill。若你無法明確指出名稱,**不要啟動本流程**——寧可放過,也不要記一筆無頭紀錄。

### Step 2. 檢查 learn mode 是否被手動關閉

讀取 `skill/skill-learn/settings.json`:

- 檔案不存在 → 視為空物件 `{}`,繼續 Step 3
- `skills[{skill-name}].learnMode === "disabled"` → **直接結束**,不記錄
- 其他所有情況 → 繼續 Step 3

本 skill **預設全自動記錄**,不詢問使用者。唯一例外是使用者明確表達「不用記」(例:「把 figma-use 的 learn mode 關掉」);此時 Claude 才讀入 settings.json → mutate → 寫回,把該 skill 的 `learnMode` 設為 `"disabled"`。

### Step 3. 寫入事件紀錄

路徑:`skill/skill-learn/logs/{skill-name}/{YYYYMMDD-HHmmss}.md`

- 用 `date +%Y%m%d-%H%M%S` 取當前時間作為檔名
- 若資料夾不存在,建立之(Write 工具會自動建父目錄,但檢查一下更保險)
- 寫入前用 `Glob` 檢查 `{YYYYMMDD-HHmmss}*.md` 是否存在;若有命中,檔名後綴 `-2`、`-3` 遞增直到無衝突
- 所有時間戳用 `date +%Y-%m-%dT%H:%M:%S%z` 產生(macOS / Linux 通用),含時區 offset。不要硬編碼 `+08:00`,也不要用 UTC
- 格式:

```markdown
---
timestamp: 2026-04-20T15:00:00+0800
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

**`tags` 欄位規則**:由 Claude 從事件抽 1-3 個關鍵詞,優先用技術棧名 / API 名 / 錯誤類型(例:`figma`、`font-loading`、`await-missing`)。不要超過 3 個,也不要用過於籠統的詞(如 `error`、`skill`、`bug`)。

**`recall-when` 寫法建議**:用「情境關鍵詞 + 動作」格式,讓未來的你用關鍵字比對就能判讀。

- ✅ 「要對 Figma text node 做任何寫入時」
- ✅ 「使用 next/image 載入外部 domain 圖片時」
- ❌ 「出錯時」(太籠統,等於沒寫)
- ❌ 「處理字型」(沒有動作邊界)

### Step 4. 維護 index.md

路徑:`skill/skill-learn/logs/{skill-name}/index.md`

- 若不存在 → 建立,含下方標頭
- 若已存在 → 在表格最後追加一行

```markdown
# {skill-name} — 應用事件索引

此檔列出所有記錄過的卡關事件。套用 {skill-name} 前,**先掃「回查時機」欄**,比對當前任務是否命中任何一條;命中才 Read 對應 log。

表格超過 10 行時,請做一次整理(見 skill-learn/SKILL.md 的「維護與封存」章節)。

| 時間 | 回查時機 | 事件摘要 | 標籤 | 檔案 |
|------|----------|----------|------|------|
| 2026-04-20 15:00 | 要對 Figma text node 做任何寫入時 | 忘記 await loadFontAsync 導致 text 操作失敗 | figma, font | [20260420-150000.md](20260420-150000.md) |
```

「回查時機」欄 = log frontmatter 的 `recall-when`。寫入時直接從 frontmatter 抄過來,不要另外發明一句。

### Step 5. 更新 settings.json(必做,不可略)

整檔讀入 `settings.json` → `JSON.parse` → mutate → `JSON.stringify` → 寫回:

- `lastLoggedAt` = 當下時間戳(格式同 Step 3)
- `logCount` += 1
- 若 `firstLoggedAt` 尚未存在,設為當下時間戳

不要手動拼字串;用 Read → JSON.parse → mutate → Write 才不會破壞其他 skill 的設定。

### Step 6. 沉默地回到原任務

記錄完成後,**直接回到觸發本 skill 的原任務,不對使用者做任何說明**。這是被動 skill 的核心:使用者此刻專注在原問題上,多一句「我幫你記了」都是噪音。

唯一例外:使用者主動問(「你剛剛在幹嘛」「有記下來嗎」),才簡短回答一句。

---

## 讀取 log 的時機(反向用法)

當你**即將開始應用某個 skill** 時(不是卡關時),先快速檢查:

1. `skill/skill-learn/logs/{skill-name}/index.md` 是否存在?
2. 存在 → Read 它,**先掃「回查時機」欄**,與當前任務情境做關鍵字比對
3. 有命中條目 → Read 對應的 `{time}.md`,把「下次觸發這個 skill 時要注意」那段納入本次執行的前置考量
4. 無命中 → 不用浪費 context 讀個別 log,繼續原任務

這步驟是本 skill 能產生複利的關鍵——寫下來只是半套,**讀得到**才算閉環。「回查時機」欄就是讓讀取階段不必全檔掃過的捷徑。

### 如何確保「讀得到」

反向讀取無法靠本 skill 自己觸發(本 skill 是被動的)。有兩個強化手段,擇一或併用:

- **在目標 skill 的 SKILL.md 開頭加一行**:例如「套用前先讀 `skill/skill-learn/logs/{skill-name}/index.md`(若存在)」。目標 skill 被載入時自然會看到。最輕量、最可靠。
- **用 PreToolUse hook 自動注入**:在 `.claude/settings.json` 加 hook,於 `Skill` 工具被呼叫前檢查對應 logs 目錄的 index,存在則把提示注入 context。見下方範例。

範例 hook(兩步):

**1. `.claude/settings.json`:**

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Skill",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/skill-learn-inject.sh"
          }
        ]
      }
    ]
  }
}
```

**2. `.claude/hooks/skill-learn-inject.sh`(記得 `chmod +x`):**

```bash
#!/bin/bash
set -e

INPUT=$(cat)

# Skill tool 的 input field 名稱在官方文件未明載,先 fallback 兩種常見寫法
SKILL_NAME=$(echo "$INPUT" | jq -r '.tool_input.skill // .tool_input.name // empty')
[ -z "$SKILL_NAME" ] && exit 0

IDX="$CLAUDE_PROJECT_DIR/skill/skill-learn/logs/$SKILL_NAME/index.md"
[ ! -f "$IDX" ] && exit 0

MSG="⚠️ 此 skill 有過往卡關紀錄,套用前請先 Read: $IDX(比對「回查時機」欄,命中才讀個別 log)"

jq -n --arg msg "$MSG" '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    additionalContext: $msg
  }
}'
```

**驗證 field 名稱**:若 hook 不觸發提示,先在 script 最開頭加 `echo "$INPUT" >> /tmp/skill-hook-debug.log` 印一筆,跑一次 Skill 工具,看 `.tool_input` 實際長怎樣,再修正 `jq` path。

本 skill 不強制要求上述 hook,但若不做這步,累積的 logs 很容易變成孤島。

---

## 維護與封存

logs 會隨時間累積,索引過長會反噬「快速比對」的目的。每累積到約 10 筆(或 index.md 標頭提醒時),做一次整理:

1. **合併相似 `recall-when`**:多筆 log 指向同一情境時,挑最完整的一筆保留,其餘在 index 標 `superseded → {保留檔名}`,並刪除 md body 留 frontmatter 作審計。
2. **移除已內化條目**:若某筆的修正做法已寫入 skill 本身的 SKILL.md(已內化),在 index 標 `merged-into-skill` 並移出主表。
3. **大翻修後的清零**:若 `{skill-name}` 經過大改版,舊 log 可能全數失效,將整個 `logs/{skill-name}/` 移到 `logs/{skill-name}/_archive-{date}/`,index 重新開張。

無自動觸發;依靠使用者或 Claude 偶爾 review。Claude 若在反向讀取階段看到 index > 10 行,可主動建議整理。

---

## `settings.json` schema

路徑:`skill/skill-learn/settings.json`

```json
{
  "skills": {
    "<skill-name>": {
      "learnMode": "disabled",
      "firstLoggedAt": "<ISO8601 timestamp with tz offset>",
      "lastLoggedAt": "<ISO8601 timestamp with tz offset>",
      "logCount": 0
    }
  }
}
```

`<skill-name>` 是 basename(例:`thinking-model`),不加任何前綴。

| 欄位 | 說明 |
|------|------|
| `learnMode` | 只在被手動關閉時出現 `"disabled"`;未出現代表預設啟用(不需顯式寫 `"enabled"`) |
| `firstLoggedAt` | 第一次成功寫 log 的時間(永遠不變) |
| `lastLoggedAt` | 最近一次成功寫 log 的時間 |
| `logCount` | 累計記錄筆數 |

---

## 規範

1. **被動觸發,不主動記流水帳** — 使用者順利完成時不要寫 log。只有「卡關 / 修正 / 重跑」才有學習價值。
2. **沉默執行,不打擾使用者** — 記完不通知、不總結,直接回到原任務;使用者主動問才答。
3. **一事件一檔** — 不要把多個事件塞進同一檔案;時間戳就是檔名,index 負責串接。
4. **不記錄敏感資訊** — log 可能被未來對話讀取,略過 token、密碼、個資、內網 URL。
5. **保持簡潔** — log 不是日記,四個段落合計 ≤ 20 句(每段約 2-5 句)。未來你要能 10 秒內看完一筆。
6. **settings.json 整檔讀寫** — 讀入 → JSON.parse → mutate → JSON.stringify → 寫回。不要手動拼字串。
7. **名稱要乾淨** — `{skill-name}` 必須是真實存在的 skill 之 basename,不要發明縮寫,也不要加路徑前綴。
8. **時區用當地時間** — 所有時間戳用 `date +%Y-%m-%dT%H:%M:%S%z` 產生,包含時區 offset。不要硬編 `+08:00`,也不要用 UTC。

---

## 不使用本 skill 的情境

- 目前正在順利執行,沒有任何卡關訊號
- 卡的原因與 skill 無關(網路、權限、外部服務)
- 使用者明確說「不用記」(並把 `learnMode` 設為 `"disabled"`)
- 使用者 `learnMode` 已設為 `"disabled"`
- 無法明確指出是哪個 skill 卡關
- 卡關的 skill 是 `skill-learn` 本身(避免遞迴)
