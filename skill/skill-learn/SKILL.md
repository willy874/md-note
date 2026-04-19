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

**一事件一筆,於事件有結論的那一輪寫入**:同一卡關事件即使反覆來回,也只寫一筆——只在該事件有**明確結論**(解決 / 繞過 / 放棄)的那一輪回覆前,才沉默寫入。結論出現前的中間輪次不要先寫,避免寫了又改、或半成品誤導未來。若同一任務中出現性質不同的兩個卡關(例如先是認證問題、後是資料格式問題),才分別記錄。

**不要觸發的情境**:

- 首次套用即成功
- 純閒聊、一般技術問答
- 使用者沒有給出任何校正訊號
- 錯誤與 skill 無關(例如 lint 工具報 syntax error、`npm install` 網路失敗、API token 過期)——判準是「就算不套用這個 skill,這個錯誤也會發生」
- `{skill-name}` 本身就是 `skill-learn`(避免自我遞迴)

---

## 路徑慣例

本 skill 所有產出集中在自己的目錄下,不散落到各 skill 資料夾。

以下用 `<SL>` 代稱「本 SKILL.md 所在目錄」。**寫入路徑時以 `dirname` 推得,不要硬編**——這樣 skill 無論安裝在 `skill/skill-learn/`、`.claude/skills/skill-learn/` 或其他位置,路徑都會自動跟著走,不會寫到別的副本去。

| 用途 | 路徑 |
|------|------|
| 設定檔 | `<SL>/settings.json` |
| 事件紀錄 | `<SL>/logs/{skill-name}/{YYYYMMDD-HHmmss}.md` |
| 索引 | `<SL>/logs/{skill-name}/index.md` |

`{skill-name}` 一律用 basename(例:`thinking-model`),不加專案或目錄前綴——`settings.json` 本身就在專案內,不會跨專案污染。

---

## 執行流程

### Step 1. 判讀 `{skill-name}`

先確認剛才觸發卡關的是哪個 skill。若你無法明確指出名稱,**不要啟動本流程**——寧可放過,也不要記一筆無頭紀錄。

### Step 2. 檢查 learn mode 是否被手動關閉

讀取 `<SL>/settings.json`:

- 檔案不存在 → 視為空物件 `{}`,繼續 Step 3
- `skills?.[{skill-name}]?.learnMode === "disabled"` → **直接結束**,不記錄(用 optional chaining;`skills` 或 `skills[{skill-name}]` 不存在時視為未停用,繼續 Step 3)
- 其他所有情況 → 繼續 Step 3

(如何把某個 skill 的 `learnMode` 設為 `"disabled"`,見下方「如何關閉某 skill 的 learn mode」章節——那是使用者主動要求時的獨立動作,不屬於本流程。)

### Step 3. 寫入事件紀錄

路徑:`<SL>/logs/{skill-name}/{YYYYMMDD-HHmmss}.md`

- 用 `date +%Y%m%d-%H%M%S` 取當前時間作為檔名
- 若資料夾不存在,建立之(Write 工具會自動建父目錄,但檢查一下更保險)
- 寫入前用 `Glob` 檢查 `{YYYYMMDD-HHmmss}*.md` 是否存在;若有命中,從後綴 `-2` 起遞增(`...-2.md`、`...-3.md`...)直到無衝突
- 所有時間戳用 `date +%Y-%m-%dT%H:%M:%S%z` 產生(macOS / Linux 通用),含時區 offset。不要硬編碼 `+08:00`,也不要用 UTC
- **寫入前先做一次敏感資訊掃描**。以下是最小可行的比對清單,命中即替換為 `[REDACTED]`:
  - **API keys / tokens**:`sk-[A-Za-z0-9_-]{16,}`、`ghp_[A-Za-z0-9]{20,}`、`xox[baprs]-[A-Za-z0-9-]+`(Slack)、`AKIA[A-Z0-9]{16}`(AWS)、`Bearer\s+[A-Za-z0-9._-]+`
  - **通用憑證模式**:`password\s*[:=]\s*\S+`、`api[_-]?key\s*[:=]\s*\S+`、`secret\s*[:=]\s*\S+`、看起來像 JWT 的三段式 base64(`eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+`)
  - **個資**:email regex、台灣手機 `09\d{8}`、身分證號 `[A-Z][12]\d{8}`
  - **內網識別**:`*.internal`、`*.local`、私有 IP 段(`10.`、`192.168.`、`172.(1[6-9]|2\d|3[01]).`)
  - 清單外但你判斷「離開本機就不應外流」的字串,也當敏感處理
  - **例外**:git commit SHA(40-char hex)、UUID、npm package 版本號不算敏感,不要誤判
- 格式:

```markdown
---
timestamp: 2026-04-20T15:00:00+0800
skill: {skill-name}
trigger: 一句話描述觸發本次紀錄的事件
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

### Step 4. 維護 index.md

路徑:`<SL>/logs/{skill-name}/index.md`

- 若不存在 → 用 Write 建立,含下方標頭 + 第一行紀錄
- 若已存在 → 用 **Read → 字串拼接 → Write 整檔重寫** 來追加新行。**不要用 Edit**——表格最後一行的 `old_string` 不夠獨特,容易匹配失敗或誤配
- 追加後數**表格資料列數**(不含表頭列與分隔線列);**資料列 ≥10** 時,在標頭第二段補上一行 `⚠️ 待整理(N 筆,≥10):下次反向讀取時請先依「維護與封存」章節整理`。這一行標記就是未來觸發整理的訊號

```markdown
# {skill-name} — 應用事件索引

此檔列出所有記錄過的卡關事件。套用 {skill-name} 前,**先掃「回查時機」欄**,比對當前任務是否命中任何一條;命中才 Read 對應 log 的「下次觸發這個 skill 時要注意」段落即可。

| 時間 | 回查時機 | 事件摘要 | 檔案 |
|------|----------|----------|------|
| 2026-04-20 15:00 | 要對 Figma text node 做任何寫入時 | 忘記 await loadFontAsync 導致 text 操作失敗 | [20260420-150000.md](20260420-150000.md) |
```

- 「回查時機」欄 = log frontmatter 的 `recall-when`。寫入時直接從 frontmatter 抄過來,不要另外發明一句
- 「事件摘要」欄 = log frontmatter 的 `trigger`。同樣直接抄

### Step 5. 更新 settings.json(必做,不可略)

整檔讀入 `settings.json` → `JSON.parse` → mutate → `JSON.stringify` → 寫回:

- **先確保路徑存在**(否則下面的欄位更新會撞上 undefined):
  - 若 `skills` 不存在 → 設為 `{}`
  - 若 `skills[{skill-name}]` 不存在 → 設為 `{}`
- `lastLoggedAt` = 當下時間戳(格式同 Step 3)
- `logCount` = `(skills[{skill-name}].logCount ?? 0) + 1`
- 若 `firstLoggedAt` 尚未存在,設為當下時間戳

這些統計欄位**目前不被自動流程讀取**,純供使用者或 Claude 未來人工查詢統計用(例:「這個 skill 在本專案已卡關幾次?」「第一次記是什麼時候?」)。不要手動拼字串;用 Read → JSON.parse → mutate → Write 才不會破壞其他 skill 的設定。

### Step 6. 沉默地回到原任務

**執行時機**:Step 3–5 不在「卡關當下」跑,而是在**卡關事件有明確結論的那一輪回覆前**靜默執行(結論 = 解決 / 繞過 / 放棄,判準見「何時觸發」章節「一事件一筆」段)。若該卡關尚在進行中,按兵不動;等到確認收尾的那一輪,再把 Step 3–5 一氣呵成寫完、再寫回覆。

寫完後**直接回到觸發本 skill 的原任務,不對使用者做任何說明**。這是被動 skill 的核心:使用者此刻專注在原問題上,多一句「我幫你記了」都是噪音。

唯一例外:使用者主動問(「你剛剛在幹嘛」「有記下來嗎」),才簡短回答一句。

---

## 如何關閉某 skill 的 learn mode

這是獨立動作,與上面的事件流程無關。只有當使用者明確表達「不用記」(例:「把 figma-use 的 learn mode 關掉」)時才執行:

1. Read `<SL>/settings.json`(檔案不存在就視為 `{}`)
2. `JSON.parse` → mutate:`skills[{skill-name}].learnMode = "disabled"`
3. `JSON.stringify` → Write 寫回

未來只要該欄位存在且為 `"disabled"`,Step 2 就會直接跳過事件紀錄。要重新啟用時,刪除該 `learnMode` 欄位即可(不需要寫 `"enabled"`,未出現就代表啟用)。

---

## 讀取 log 的時機(反向用法)

> ⚠️ **若未安裝下方「如何確保『讀得到』」章節的 hook,本 skill 的反向讀取無法自動觸發**——累積的 log 將成孤島,只寫不讀等於半套。請優先完成 hook 設定,否則本 skill 幾乎沒有複利價值。

當你**即將開始應用某個 skill** 時(不是卡關時),先快速檢查:

1. `<SL>/logs/{skill-name}/index.md` 是否存在?
2. 存在 → Read 它,**先掃「回查時機」欄**,與當前任務情境做關鍵字比對
3. 有命中條目 → Read 對應的 `{time}.md`,**只讀「下次觸發這個 skill 時要注意」段落**即可(其他段落是寫給未來審計用的脈絡,當下不需要佔 context),把內容納入本次執行的前置考量
4. 無命中 → 不用浪費 context 讀個別 log,繼續原任務
5. 若 index.md 標頭有 `⚠️ 待整理` 標記 → 先依「維護與封存」整理完再繼續

這步驟是本 skill 能產生複利的關鍵——寫下來只是半套,**讀得到**才算閉環。「回查時機」欄就是讓讀取階段不必全檔掃過的捷徑。

### 如何確保「讀得到」

反向讀取無法靠本 skill 自己觸發(本 skill 是被動的)。有兩個強化手段,擇一或併用:

- **在目標 skill 的 SKILL.md 開頭加一行**:例如「套用前先讀 `<SL>/logs/{skill-name}/index.md`(若存在)」。目標 skill 被載入時自然會看到。最輕量、最可靠。
- **用 PreToolUse hook 自動注入**:在 `.claude/settings.json` 加 hook,於 `Skill` 工具被呼叫前檢查對應 logs 目錄的 index,存在則把提示注入 context。見下方範例。

範例 hook(兩步;**前置需求**:系統需安裝 `jq`。macOS 預設沒有,可用 `brew install jq`;Ubuntu/Debian 用 `apt install jq`;若環境無法安裝,可改用純 bash + `grep`/`sed` 解析 JSON,但不保證所有邊界情況):

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
SKILL_NAME=$(echo "$INPUT" | jq -r '.tool_input.skill // empty')
[ -z "$SKILL_NAME" ] && exit 0

# <SL> 依專案安裝位置而定,同時嘗試兩個常見路徑
IDX=""
for SL_DIR in "$CLAUDE_PROJECT_DIR/skill/skill-learn" "$CLAUDE_PROJECT_DIR/.claude/skills/skill-learn"; do
  if [ -f "$SL_DIR/logs/$SKILL_NAME/index.md" ]; then
    IDX="$SL_DIR/logs/$SKILL_NAME/index.md"
    break
  fi
done
[ -z "$IDX" ] && exit 0

MSG="⚠️ 此 skill 有過往卡關紀錄,套用前請先 Read: $IDX(掃『回查時機』欄,命中才讀對應 log 的『下次觸發這個 skill 時要注意』段落)"

jq -n --arg msg "$MSG" '{
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    additionalContext: $msg
  }
}'
```

本 skill 不強制要求上述 hook,但若不做這步,累積的 logs 很容易變成孤島。

---

## 維護與封存

logs 會隨時間累積,索引過長會反噬「快速比對」的目的。當 index.md 被標上 `⚠️ 待整理`(Step 4 達 10 行時自動上標),做一次整理:

1. **合併相似 `recall-when`**:多筆 log 指向同一情境時,挑最完整的一筆保留,**其餘檔案直接刪除**。index 中被合併那幾行改為刪除線加註:`~~20260301-120000.md~~ superseded → 20260420-150000.md`
2. **移除已內化條目**:若某筆的修正做法已寫入 skill 本身的 SKILL.md(已內化),在 index 把該行標 `merged-into-skill`,檔案可直接刪除
3. **大翻修後的清零**:若 `{skill-name}` 經過大改版,舊 log 可能全數失效,將整個 `<SL>/logs/{skill-name}/` 移到 `<SL>/logs/{skill-name}/_archive-{date}/`,index 重新開張
4. 整理完成後,把標頭的 `⚠️ 待整理` 標記移除

無自動觸發;依靠 Claude 在反向讀取階段看到 `⚠️ 待整理` 時順手處理。

---

## `settings.json` schema

路徑:`<SL>/settings.json`

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
| `learnMode` | 只在被手動關閉時出現 `"disabled"`;未出現代表預設啟用(不需顯式寫 `"enabled"`)。**唯一被自動流程讀取的欄位** |
| `firstLoggedAt` | 第一次成功寫 log 的時間(永遠不變)。純供人工查詢 |
| `lastLoggedAt` | 最近一次成功寫 log 的時間。純供人工查詢 |
| `logCount` | 累計記錄筆數。純供人工查詢 |

---

## 規範

1. **被動觸發,不主動記流水帳** — 使用者順利完成時不要寫 log。只有「卡關 / 修正 / 重跑」才有學習價值。
2. **沉默執行,不打擾使用者** — 記完不通知、不總結,直接回到原任務;使用者主動問才答。
3. **一事件一檔,於事件有結論的那一輪寫入** — 同一事件反覆往返只寫一筆,**只在卡關有明確結論(解決 / 繞過 / 放棄)的那一輪**沉默寫入;結論出現前的中間輪次不要先寫(避免寫了又改、半成品誤導)。性質不同的卡關才分別記。時間戳就是檔名,index 負責串接。
4. **不記錄敏感資訊** — log 可能被未來對話讀取。寫入前必做一次掃描,凡是 token、密碼、個資、內網 URL 都替換為 `[REDACTED]`。不確定就當敏感處理。
5. **保持簡潔** — log 不是日記,四個段落合計 ≤ 20 句(每段約 2-5 句)。未來你要能 10 秒內看完一筆。
6. **settings.json 整檔讀寫** — 讀入 → JSON.parse → mutate → JSON.stringify → 寫回。不要手動拼字串。
7. **名稱要乾淨** — `{skill-name}` 必須是真實存在的 skill 之 basename,不要發明縮寫,也不要加路徑前綴。
8. **時區用當地時間** — 所有時間戳用 `date +%Y-%m-%dT%H:%M:%S%z` 產生,包含時區 offset。不要硬編 `+08:00`,也不要用 UTC。

---

## 不使用本 skill 的情境

- 目前正在順利執行,沒有任何卡關訊號
- 卡的原因與 skill 無關(網路、權限、外部服務、lint、API token 過期等——就算不套用這個 skill 也會發生的錯誤)
- 使用者明確說「不用記」(並把 `learnMode` 設為 `"disabled"`)
- 使用者 `learnMode` 已設為 `"disabled"`
- 無法明確指出是哪個 skill 卡關
- 卡關的 skill 是 `skill-learn` 本身(避免遞迴)
- 同一任務已經寫過一筆 log,且當前卡關仍屬同一事件(等任務結束彙整即可)
