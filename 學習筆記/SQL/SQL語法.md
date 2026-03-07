# SQL 語法筆記

```sql
-- 建立 persons 資料表
CREATE TABLE persons (
  id INT NOT NULL AUTO_INCREMENT,              -- 序號，整數、非空、自動遞增
  name VARCHAR(255),                           -- 名字，可變長度的文字
  age INT UNSIGNED,                            -- 年齡，非負整數
  city ENUM('Taipei', 'Hsinchu', 'Kaohsiung'), -- 所在城市，固定選項
  PRIMARY KEY (id)                             -- 主鍵
);
```

```sql
-- 若 persons 資料表存在，則刪除之
DROP TABLE IF EXISTS persons;
```

```sql
-- 在 persons 資料表中新增 email 欄位，放在 name 欄位後方
ALTER TABLE persons ADD email VARCHAR(50) AFTER name;
```

```sql
-- 刪除 persons 資料表中的 email 欄位
ALTER TABLE persons DROP email;
```

```sql
-- 將 age 欄位的資料型態改為 TINYINT UNSIGNED
ALTER TABLE persons MODIFY age TINYINT UNSIGNED;
```

```sql
-- 將 city 欄位的預設值改為 "Taipei"
ALTER TABLE persons ALTER city SET DEFAULT "Taipei";
```

```sql
-- 將 city 欄位的預設值刪除
ALTER TABLE persons ALTER city DROP DEFAULT;
```
