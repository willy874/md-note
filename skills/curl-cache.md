---

name: curl-cache

description: 規範 curl(尤其是帶 body 的請求)的腳本化、索引化執行流程。每一個任務以 task-name 為單位,在 /tmp/claude-scripts/ 下建立 run.sh / params / result / error 檔案,並透過 /tmp/claude-scripts/index.md 維護任務索引以便重用與避免命名衝突。當需要執行帶 body 的 curl、或要把一次性 API 呼叫沉澱成可重用腳本時自動套用。本規則不適用於 MCP Method 呼叫。

---

# curl-cache — curl 任務腳本化與索引

  

把每一次「需要被重用、或具有副作用的 curl 呼叫」沉澱成 `/tmp/claude-scripts/{task-name}/` 下的腳本與輸入輸出檔案,並用 `index.md` 統一索引,避免重複造輪子,也方便後續除錯與重跑。

  

> **適用範圍**:本 skill 僅針對 `curl`(以及語意等價的 HTTP CLI 工具)。MCP Method 呼叫**不**套用此流程,直接呼叫對應 tool 即可。

>

> **併發**:本流程不支援同一 `task-name` 並行執行,也不支援多筆 task 同時 append 進 `index.md`。呼叫端自行保證序列化執行。

  

---

  

## 變數定義

  

- **task-name**: 該任務的識別名,**必須**為 `kebab-case` 且以動詞開頭(`get-`/`list-`/`create-`/`update-`/`delete-`/`search-`/`upload-`/`download-` 等),動詞後接名詞段(如 `get-user`、`create-issue`)。

- 禁用字符:macOS 檔系統禁用的 `/`、NUL。

- 額外禁用 `|`、反引號、空白、換行(因為會被寫進 Markdown 表格儲存格)。

- 長度上限 64 字元(macOS 檔名上限為 255 bytes,留餘裕給子路徑)。

- 動詞段(第一個 `-` 之前的字串)用於 schema 相容性判定的語意比對。

- **ext**: 副檔名/格式,輸入端與輸出端各自獨立判定。

- **輸入端(`params`)** 依優先序:

1. body 為 JSON → `params.json`,UTF-8 無 BOM,內容為**單一**合法 JSON 值(物件/陣列/scalar 皆可),不得在外層另包注釋或多份文件。

2. body 為 `application/x-www-form-urlencoded` → `params.form.json`,內容為一個 JSON 物件,key 為欄位名、value 為字串(或字串陣列代表同名多值);由 `run.sh` 解析後逐欄 `--data-urlencode` 注入。**不**使用 shell `source`,以避免引號/空白/特殊字元被 shell 解析。

3. body 為 multipart → `params.multipart.json`,JSON 為陣列,每筆 `{ "name": "field", "type": "text"|"file", "value": "...", "mime": "<可選>" }`。`type=file` 時 `value` 是相對於 task 目錄(即 `params.multipart.json` 所在目錄)的路徑,或絕對路徑;若任務需要把附帶檔案沉澱在 task 內,**建議**集中放到 task 目錄下的 `files/` 子資料夾(例 `value: "files/avatar.png"`),但這是約定不是強制。單檔上傳亦走此格式,不再用 `params.bin`。

4. 純 query string → `params.query.json`,格式同 `params.form.json`,但由 `run.sh` 以 `-G --data-urlencode` 注入而不放進 body。

5. 純二進位 body(非 multipart,例如 `--data-binary @file`、`PUT` 上傳檔案) → `params.bin`,直接整檔注入,Content-Type 由 `run.sh` 顯式設定。

6. 仍無法歸類 → `params.txt`,`run.sh` 自行解析,並於檔頭註解寫清解析方式與 Content-Type。

- **輸出端(`result` / `error`)** 依優先序:

1. 看 response `Content-Type` header 的 **MIME type 主值**(忽略 `;` 之後的 `charset` 等參數,並小寫比對):`application/json` 或 `+json` 結尾 → `json`、`application/xml` 或 `+xml` 結尾 / `text/xml` → `xml`、`text/html` → `html`、`text/*` 其他 → `txt`、`image/*` / `application/octet-stream` / `application/pdf` / 其他二進位 → `bin`。

2. 無 `Content-Type` 或主值無法歸類時,看 payload 第一個非空白字元(`{` / `[` → `json`、`<` → `html`,除非有明確 XML 宣告才視為 `xml`)。

3. 仍無法判定時用 `txt`(可印的)或 `bin`(含 NUL 或非 UTF-8 序列)。

- **project-name**: Claude 當前啟動所在的工作目錄,在 `run.sh` 中以**寫入時固定**的絕對路徑 `PROJECT_DIR=` 變數記錄(避免日後從別的 cwd 重跑時意外切換)。

- 若 `PROJECT_DIR` 等於 `$HOME` 或該目錄下沒有 `.env`,視為「無專案上下文」,跳過 project 端 `.env` 載入,只用 `~/.env`。

- `run.sh` 內部以 `PROJECT_DIR` 而非 `$PWD` 判定 project 端 `.env`。

  

---

  

## Task Index(`/tmp/claude-scripts/index.md`)

  

- 索引檔位置 `/tmp/claude-scripts/index.md`,刻意放在 `/tmp` —— 接受 macOS 重啟後 `/tmp` 被清掉、索引與所有腳本一併重建。重啟後若先前的腳本仍需要,得重新跑一次任務以重建。

- 若 `/tmp/claude-scripts/` 目錄不存在,先 `mkdir -p`。若 `index.md` 不存在(首次執行,或 `/tmp` 剛被清),先寫入下方 header + 分隔列,再 append 第一筆資料列。

- 若 `/tmp/claude-scripts/` 存在但 `index.md` 缺失而下層仍有 task 目錄(意味之前被手動刪除索引),仍視為首次:重建空 header,既存 task 目錄不自動掃描回填,任務需要時自然會在重新建立階段被偵測為命名衝突或重新 append。

  

### 表格格式

  

```markdown

| task-name | endpoint | method | created-at |

| --------- | -------- | ------ | ---------- |

| get-user | api.example.com/users/:id | GET | 2026-05-01T10:00:00Z |

| create-issue | api.github.com/repos/:owner/:repo/issues | POST | 2026-05-01T10:05:00Z |

```

  

欄位定義:

  

- `endpoint` 正規化規則:

- 只記錄 `host + pathname`;query string 視為參數,**不**進 endpoint。

- 去除 scheme(`http` / `https` 視為同一個 endpoint)。

- host 一律小寫(DNS 不分大小寫);pathname 保留原大小寫(路徑區分大小寫)。

- 非預設 port 必須保留(`localhost:3000` ≠ `localhost:8080`)。

- 去除 pathname 結尾的 `/`(`/users` ≡ `/users/`)。

- **路徑變數模板化**:可變段落以 `:name` 占位(例 `/users/123` 與 `/users/456` 都歸一為 `/users/:id`)。

- 自動視為可變段(無需人工判斷):

- 純數字(`^[0-9]+$`)。

- UUID(`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`)。

- 長度 ≥ 16 的 hex 字串(`^[0-9a-fA-F]{16,}$`)。

- 長度 ≥ 16 的 base64url 識別子(`^[A-Za-z0-9_-]{16,}$`)。

- 不符上述條件的段落視為靜態,不模板化(寧可拆成兩筆 task 也不要錯併)。

- 占位名稱由建立者自訂,僅用於可讀性;比對 `(endpoint, method)` 是否相同時,**所有 `:xxx` 視為等價**(`/users/:id` ≡ `/users/:user_id`)。

- `method`:HTTP method 一律大寫(`GET` / `POST` / …)。

- `created-at`:ISO 8601 UTC,`Z` 結尾(例 `2026-05-01T10:00:00Z`)。不允許本機時區。

  

### 重用 / 命名衝突檢查

  

建立新 `task-name` 前,先讀 `index.md`:

  

- 確認沒有命名衝突。

- 找有沒有現存腳本同時符合 `(endpoint, method)` **且** 參數 schema 相容。

- **schema 相容性判定**(依序檢查,任一不符視為不同任務):

1. **參數來源類型**:body 媒體類型(none / json / form / multipart / binary / txt)與是否帶 query string 都必須一致 —— 例如「無 body 的 GET」與「有 body 的 GET」即使 endpoint+method 相同,仍視為不同任務。

2. **欄位集合**:對於有 body 的請求,top-level body 欄位名集合(必填子集)必須相同;對於僅有 query 的請求,改比 query key 集合。

3. **欄位型別**:對應欄位的 JSON 型別一致(string/number/boolean/object/array/null);object/array 只比對 top-level,不遞迴。

4. **task-name 動詞**:既存 task 名稱的動詞段若與新需求動詞不同,視為不同任務(以 task-name 命名取代「語意」主觀判定)。

- 不確定時新建一筆,不要勉強複用。

- 若新需求只是 path 變數值不同(命中既有模板)、且 schema 相容,直接重用既有 task,不新建 task,也**不**新增 `index.md` 列。

- 若 `(endpoint, method)` 模板相同但 schema 不相容,**新建**獨立 task(以更具體的動詞或限定詞區分 task-name,例如 `create-user` vs `bulk-create-users`),並在 `index.md` append 一筆 —— 此時索引會出現兩列同模板不同 task-name,後續比對需逐筆檢查 schema 才能挑中正確 task。

  

每次**新建** task 後 append 一筆;**重用**(命中既有 task)時不 append。

  

---

  

## CURL Rules

  

### 何時建立腳本(決策樹)

  

依序判斷,命中即停;以上皆未命中則**不**建腳本。

  

1. 同一 `(endpoint, method)`(經本檔的 endpoint 正規化與路徑模板化後)已在 `index.md` 出現過 **且** 通過下方「重用 / 命名衝突檢查」中的 schema 相容性判定 → **必須**重用既有腳本,不另建。命中本條後不再評估後續規則。若 `(endpoint, method)` 相同但 schema 不相容(例如同樣 `POST /users` 但欄位集合不同),視為**不**命中本條,改用後續規則決定是否新建另一獨立 task(以動詞或限定詞區分 task-name)。

2. 具副作用的 method(POST/PUT/PATCH/DELETE)→ 建腳本。

3. 請求帶 body(任何 `-d` / `--data` / `--data-raw` / `--data-binary` / `--data-urlencode` / `-F` / `--form` / `--json` / heredoc 重定向)→ 建腳本。

4. 命令展開後的單行 `curl` 長度 **> 512 字元** → 建腳本。

5. 已知會被再叫第二次(同一 session 後續步驟有明確依賴) → 建腳本。

  

> 「展開後單行長度」計算:反斜線換行折回單行、heredoc body 全數計入、結尾換行不計;`-H`/`-b`/`--cookie`/`-A`/`-e` 等所有 flag 與其值都計入;不計 `curl` 命令字本身的前置 `env VAR=...` 包裝。

>

> **例外**:純探索/除錯的一次性 GET(無 body、method=GET、且為單次性確認) 即使命中規則 #4,可直接執行不建腳本,但回覆中要明示「未建腳本」以利使用者知情。**規則 #1 沒有此例外** —— 索引已有的條目一律重用。

  

### 檔案配置

  

對需要建立腳本的任務,在 `/tmp/claude-scripts/{task-name}/` 下:

  

- 父目錄 `/tmp/claude-scripts/` 與 task 目錄不存在時,以 `mkdir -p` 建立。

- `run.sh`:可執行腳本(`chmod +x`),shebang `#!/usr/bin/env bash`,緊接著 `set -euo pipefail`。本檔示範的所有 shell 片段假設 macOS 內建 bash 3.2 也能跑(不可使用 4.x+ 才有的 associative array、`mapfile` 等)。

- `params.*`:參數檔。**有 body 或有 query string** 都要建立(可能同時存在 `params.query.json` 與 body 的 `params.*`);無 body 且無 query 才省略(與 method 無關)。各種 `params.*` 對應 ext 與格式見上方「變數定義 / 輸入端」。

- `result.{ext}`:成功回應(2xx)。

- `error.{ext}`:失敗回應(非 2xx 或傳輸錯誤)。`error` 的 `ext` 與 `result` 各自獨立,依實際 payload 判定(`result.json` 對應 `error.html` 是合理的)。

  

`result.*` 與 `error.*` 同次執行**互斥**,只會存在其一(包含同名不同 ext 的舊檔)。

  

### `params` 注入慣例(`run.sh` 必須遵守)

  

所有 `params.*` 解析都用 `jq` 進行,**不**用 shell `source` —— 因為 `params` 內容是任務輸入資料,可能含引號/空白/`$`/`#`/換行/反斜線等,被 shell 解析會錯。(注:這與後文 `.env` 仍用 `source` 並不衝突 ——`.env` 是使用者控制的 shell 賦值檔,而 `params` 是任務資料。)`run.sh` 可預設 `jq` 已安裝(macOS 多以 Homebrew 安裝);為防萬一,需在腳本開頭以 `command -v jq >/dev/null || { echo "jq required" >&2; exit 127; }` 守門。

  

- `params.json` → `curl --data-binary @params.json`(整檔注入,保留二進位安全),並設 `-H 'Content-Type: application/json'`。

- `params.form.json`(form body) → 以 **NUL byte** 分隔遍歷 key/value(避免 value 含 tab/換行而錯欄),逐筆 `--data-urlencode "$key=$value"`(必須單字串 `"key=value"`,讓 curl 自行 urlencode 整段;**不**寫成 `KEY="$VALUE"` 兩段式)。value 為陣列時對每個元素重複注入。建議用法(bash 3.2 相容):

  

```bash

args=()

while IFS= read -r -d '' kv; do

args+=(--data-urlencode "$kv")

done < <(

jq -j '

to_entries[]

| .key as $k

| (.value | if type=="array" then .[] else . end)

| "\($k)=\(.)\u0000"

' params.form.json

)

curl "${args[@]}" ...

```

- `params.query.json`(query string) → 同上方式遍歷,但 curl 需多加 `-G`(整個請求只加一次),每筆仍以 `--data-urlencode "$kv"` 注入,curl 會自動把它們組進 query string 而非 body。

- `params.multipart.json` → 對每筆 entry 依 `type` 注入:

- `type=text` → 預設用 `--form-string "name=value"`(完全不解釋 `@`/`<` 等前綴);僅當明確需要從檔案讀內容時才改用 `-F`。

- `type=file` → `-F "name=@path"`;若 entry 含 `mime` 欄位,附上 `;type=<mime>`(例 `-F "name=@path;type=image/png"`)。`path` 為相對路徑時相對於 task 目錄解析(以 `cd` 到 task 目錄後執行,或先把路徑串成絕對路徑)。

- 遍歷以 NUL 分隔以保留 entry 順序,順序須等同 JSON 陣列順序。

- `params.bin`(純二進位 body) → `--data-binary @params.bin`;`Content-Type` 由 `run.sh` 顯式 `-H` 指定(若未指定則 curl 預設 `application/x-www-form-urlencoded`,通常**不**是預期值)。

- `params.txt` → 由 `run.sh` 自行解析,需在腳本檔頭註解寫清解析邏輯與 Content-Type。

  

### 失敗處理

  

- `run.sh` 必須**顯式**判定 HTTP 失敗(用 `curl -w '%{http_code}'` 抓 status、或加 `--fail-with-body`)—— 不能依賴 `curl` 預設 exit code,因為 4xx/5xx 預設不會 non-zero。

- 「成功」定義:HTTP status 為 2xx **且** curl 本身 exit code 為 0(即無傳輸層錯誤)。其餘皆為失敗(4xx、5xx、DNS/TLS/timeout)。

- 重定向預設**啟用** `-L`(`curl -L`),只在 task 明確需要 raw 3xx 時才省略;啟用 `-L` 後,`%{http_code}` 取得的是最終跳轉後的 status(預期落於 2xx 視為成功)。若 task 刻意不跟隨重定向,3xx 視為成功(因為那就是預期回應),此時 `run.sh` 必須在註解明示「不跟隨重定向、3xx 即為 result」。

- 寫入流程(每次執行開始時):

1. 先 `rm -f result.* error.*`(用 glob;為避免 `set -e` 在無檔時報錯,搭配 `set +f` 或預先 `shopt -s nullglob`,並在 `rm -f` 上忽略結果)。實作建議:`rm -f -- "$DIR"/result.* "$DIR"/error.* 2>/dev/null || true`。

2. 執行 curl,把 body 寫入暫存檔、`%{http_code}` 抓出。

3. 依 status 判定後,以 Content-Type 判定 ext,把暫存檔 `mv` 為 `result.{ext}` 或 `error.{ext}`。

- 若 curl 傳輸層失敗(無 response payload):寫一個最小 JSON 到 `error.json`,內容形如 `{ "transport_error": true, "curl_exit_code": <n>, "stderr": "<curl 的 stderr 文字>" }`,以保留可重現診斷資訊。

4. 失敗時 `run.sh` 以 non-zero exit 結束(建議:傳輸錯誤回 curl 原 exit code;HTTP 非 2xx 回固定值如 22,與 `--fail` 慣例一致)。

- 確保資料夾永遠只反映「最近一次」執行結果(`result.*` 與 `error.*` 不會同時存在)。

  

### 重用與歷史

  

- 重用既有腳本會直接覆蓋上一輪的 `params.{ext}` / `result.{ext}` / `error.{ext}` —— 刻意不保留歷史。

- **同腳本不同參數**(例如同一 `get-user` 撈不同 user id):視為同一任務,直接覆寫 `params`;若需要保留前一輪輸出,執行前自行 `cp` 出去。

- **語意不同**(例如同樣 `POST /users` 但目的不同) → 依「重用 / 命名衝突檢查」新建獨立 task。

  

---

  

## Environment Variables

  

`run.sh` 自行負責載入 `.env`,呼叫端不需要先 source。`PROJECT_DIR` 由 Claude 在建立 `run.sh` 時硬編進腳本(其值為建立當下的專案目錄絕對路徑)。建議在 `set -euo pipefail` 之後加入:

  

```bash

PROJECT_DIR="/abs/path/to/project" # 由 Claude 寫入時填入;若無專案上下文則設為空字串

load_env() {

local f="$1"

[ -n "$f" ] || return 0

[ -f "$f" ] || return 0

set -a

# shellcheck disable=SC1090

. "$f" || { set +a; echo "failed to source $f" >&2; return 1; }

set +a

}

load_env "$HOME/.env"

if [ -n "$PROJECT_DIR" ] && [ "$PROJECT_DIR" != "$HOME" ]; then

load_env "$PROJECT_DIR/.env"

fi

```

  

載入規則:

  

- 載入順序:先 `~/.env`,後 `{PROJECT_DIR}/.env`。後載入者覆蓋前者 → **同名變數以 project 端為準**。

- 任一檔案不存在時直接跳過,不報錯(以 `[ -f ... ]` 守門)。

- `PROJECT_DIR` 為空(無專案上下文)或等於 `$HOME` 時,只載入 `~/.env`。

- 若 source 過程中檔案語法錯誤,腳本立即以 non-zero exit,並把訊息寫到 stderr —— 不要靜默繼續執行。

- `.env` 內語法限定為 `KEY=VALUE`(可選 `export`)。**禁止**多行字串、command substitution(`$(...)`、反引號)等需要執行邏輯的內容,以避免 source 時觸發未預期副作用。

  

### 安全性

  

- `.env` 應只放應用層變數(API token、endpoint base URL、app config 等)。

- **避免**寫入會改變 shell 或 `curl` 行為的變數,例如 `PATH`、`LD_*`、`DYLD_*`、`SSL_CERT_*`、`CURL_CA_BUNDLE`、`HTTP(S)_PROXY` 等。這些會直接污染子 process,可能造成預期外的網路或安全行為。