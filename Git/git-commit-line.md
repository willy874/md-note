# Git命令集

## 安裝
```
$ apt-get install git
```
## 版號確認
```
$ git --version
```
## 初始化 config
```
$ git config --global user.name "<Your user name>"
$ git config --global user.email "<Your email@gmail.com>"
```
## 切換資料夾
```
$ cd <Your folder name>
```
## 版本庫建立
```
$ git init
```

## 加入版控
### 將指定檔案加入版控
```
$ git add <Your file name>
```

### 將全部檔案加入版控
```
$ git add -a
$ git add .
```

## 提交
```
$ git commit -m "<Your commot text>"
```

## 設定遠端
### 說明事項
第一個 remote name 一般設定為 origin
#### github:
http: https://github.com/*__userName__*/*__projectame__*.git
<br>
ssh: git@github.com:*__userName__*/*__projectName__*.git

### 查詢所有設定的遠端對象
```
$ git remote
```
### 新增遠端對象
```
$ git remote add <Your remote name> <Remote url>
```
### 修改遠端對象
```
$ git remote set-url <Your remote name> <Remote url>
```
### 移除遠端對象
```
$ git remote remove origin
$ git remote rm origin
```

## 推送 
### 說明事項
第一個 branch name 一般設定為 master
### 推送至指定遠端
```
git push -u <Your remote name> <Your branch name>
```
## 拉取
### 將遠端版本庫拉下來
```
$ git fetch <Your remote name>
```
### 拉下來的版本庫和本地進行合併
```
$ git merge <Your remote name>/<Remote branch name>
```
### 同時執行 fetch & merge
```
$ git pull <Your remote name> <Remote branch name>:<Your branch name>
```
### 設定追蹤分支
```
$ git branch --set-upstream <Your branch name> <Your remote name>/<Remote branch name>
```

## 分支
### 查詢分支清單
```
$ git branch
```
### 建立新分支
```
$ git branch <Your branch name>
```
### 切換分支
```
$ git checkout <Your branch name>
```
### 合併分支
```
$ git merge <Your branch name>
```
### 刪除分支
```
$ git branch -d <Your branch name>
```

### SSH Key 產生
```
$ ssh-keygen -t rsa -b 4096 -C "<Your email@gmail.com>"
```



feat: 新增/修改功能 (feature)。
fix: 修補 bug (bug fix)。
docs: 文件 (documentation)。
style: 格式 (不影響程式碼運行的變動 white-space, formatting, missing semi colons, etc)。
refactor: 重構 (既不是新增功能，也不是修補 bug 的程式碼變動)。
perf: 改善效能 (A code change that improves performance)。
test: 增加測試 (when adding missing tests)。
chore: 建構程序或輔助工具的變動 (maintain)。
revert: 撤銷回覆先前的 commit 例如：revert: type(scope): subject (回覆版本：xxxx)。
