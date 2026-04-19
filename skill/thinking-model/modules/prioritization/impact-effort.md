# 機會 / 影響矩陣（Impact vs Effort）

## 核心概念

產品管理、策略決策常用的 2×2 矩陣，兩軸：
- **Impact（影響 / 價值）**：這件事做出來能帶來多大的結果？（營收、使用者、學習、長期資產）
- **Effort（投入 / 成本）**：要做到這件事需要多少資源？（時間、人力、金錢、機會成本）

|          | 高影響                          | 低影響                     |
|----------|---------------------------------|----------------------------|
| **低成本** | **Quick Wins**：馬上做           | Fill-ins：有空再做          |
| **高成本** | Big Bets：審慎規劃、分段驗證      | **Money Pit**：砍掉         |

四個象限的策略：
1. **Quick Wins（低成本高影響）**：第一優先，立刻做完建立動能。
2. **Big Bets（高成本高影響）**：值得做但風險高，要拆成小階段、先驗證假設（對應 [MVP](../action/mvp.md)）。
3. **Fill-ins（低成本低影響）**：不急不緊，有空順手做，不要佔主力時間。
4. **Money Pit（高成本低影響）**：最該警覺的象限。很多公司的技術債、無人用的功能、過度工程的系統都埋在這裡。**果斷砍掉**。

跟[艾森豪矩陣](eisenhower.md)的差別：艾森豪用「重要 vs 緊急」管**個人時間**；Impact vs Effort 用「價值 vs 成本」管**專案 / 功能 / 方案**。

## 使用時機

當使用者處於以下情境，載入此 submodule：

- **產品 roadmap、功能優先序、專案排序**
- 資源有限（時間、人、錢），要挑最划算的幾件事
- 面對一堆候選方案，每個聽起來都不錯
- **副業、side project 選擇**：在 3 個想做的東西之間猶豫
- 團隊在爭論「該做 A 還是 B」，缺乏共同的比較框架
- 技術債、重構、優化項目排序

不適合時機：
- 只有一個選項、沒有比較對象——用 [decision 模組](../decision/index.md)的單項評估
- 價值無法估算（探索型研究、品牌投資）——硬套會扭曲判斷
- 風險才是主要考量（不是成本）——該用 [Pre-mortem](../decision/pre-mortem.md) 或[期望值](../decision/expected-value.md)模型

## 如何應用

1. **列出所有候選方案**：先不篩選、先倒出來。
2. **為每個方案評估 Impact**：
   - 量化指標優先（預估 +X% 留存、+Y 萬營收）
   - 難量化時用質化分級（S/A/B/C）
   - 問「如果這件事成功了，會帶來多大改變？」
3. **為每個方案評估 Effort**：
   - 時間（人週 / 月）、人力、外部成本
   - 不只是**這次**的成本，還要考慮**維運成本**
4. **畫成 2×2 或散布圖**：目測每個方案在哪一象限。
5. **依象限決策**：
   - Quick Wins：列為下週優先
   - Big Bets：切成 MVP 驗證、設里程碑
   - Fill-ins：收進 backlog、有空再做
   - Money Pit：明確砍掉、寫下砍掉的理由避免被重提
6. **定期重排**：Impact 和 Effort 會隨時間變。半年前的 Quick Win 可能已經做完或失去價值。

## 案例

- **產品 roadmap**：使用者提了 50 個功能請求。把每個放到矩陣上——你會發現 5-10 個是 Quick Wins（改個文案、加個篩選器），2-3 個是 Big Bets（新模組、新架構），其他多半是 Fill-ins 或 Money Pit。
- **副業選擇**：
  - 寫電子報：Impact 中、Effort 中 → Big Bet，要驗證
  - 開 SaaS：Impact 高、Effort 高 → Big Bet，MVP 先
  - 接案：Impact 中（換錢）、Effort 中 → 視目標是現金流還是資產
  - 做 YouTube：Impact 高（長期）、Effort 極高 → 看投入強度
- **技術重構**：資料庫遷移是 Money Pit 還是 Big Bet？看有沒有真正痛到。多數「看起來該做的架構升級」其實是 Money Pit。
- **行銷活動**：改 onboarding 文案（Quick Win）vs 重做整個 landing page（Big Bet）vs 每週發推特（Fill-in）vs 付費投電視廣告（可能 Money Pit）。
- **個人時間**：學 Vim 快捷鍵（Quick Win——半天換長期效率）vs 學一門全新語言（Big Bet）vs 看第 20 支 YouTube「如何提高生產力」影片（Money Pit）。

## 常見誤用

- **自己評自己的方案**：提案者傾向高估自己方案的 Impact、低估 Effort。要找**第三方**評估或團隊互評。
- **沒量化就排象限**：純感覺排出來的矩陣跟沒排差不多。至少給個 S/A/B/C 或 1-10 分。
- **忽略維運成本**：功能上線那天的成本只是開始。很多 Money Pit 是「做的時候不貴，養起來很貴」。
- **Quick Win 上癮**：只撿 Quick Win 會忽略 Big Bet，長期沒有重大突破。Quick Wins 是日常，Big Bets 是年度主線。
- **Big Bet 不切 MVP**：高成本高影響的東西直接全押，沒先驗證假設。要搭配 [MVP](../action/mvp.md)（[action 模組](../action/index.md)）逐步釋放風險。
- **不敢砍 Money Pit**：已經投入一半的專案（[沉沒成本](../decision/sunk-cost.md)偏誤）很難砍。矩陣要配合「沉沒成本不是成本」的思維。

## 與其他模型的關係

- **+ [MVP](../action/mvp.md)**（[action 模組](../action/index.md)）：Big Bet 不能一次下注，要切 MVP 先驗證關鍵假設。
- **+ [80/20](pareto.md)**：在每個象限內再跑 80/20，找出那 20% 真正關鍵的。
- **+ [North Star](north-star.md)**：Impact 的大小應該用 North Star 來衡量，不然每個人對「影響」的定義飄來飄去。
- **+ [艾森豪矩陣](eisenhower.md)**：Impact vs Effort 排專案層級，艾森豪矩陣排每日執行層級，兩者互補。
- **+ [沉沒成本](../decision/sunk-cost.md)**（[decision](../decision/index.md) / [bias 模組](../bias/index.md)）：砍 Money Pit 的最大阻力就是沉沒成本偏誤，兩者搭配用。
- **+ [槓桿](../action/leverage.md)**（[action 模組](../action/index.md)）：高 Impact / 低 Effort 的本質就是「高槓桿活動」。
