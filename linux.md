# Linux 練習筆記

## 查看當前位置
```
$ pwd
```

## 如何進入root?
第一次登入時因為 root 沒有密馬
```
$ sudo passwd root
```
接著輸入當前使用者密碼和新密碼，看見 `password updated successfully` 就成功了!
在來鍵入
```
$ sudo -i
or
$ sudo su -
```


```
 curl http://localhost
```
關閉防火牆
```
 sudo ufw disadle
```