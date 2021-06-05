Docker
===

包成鏡像檔
```
$ docker build . -t <Tag Name>
```

運行鏡像檔變容器
```
$ docker run -p <外Prot>:<內Prot> -it <Image ID>
```

移除鏡像檔
```
$ docker rmi <Image ID>
```

顯示所有容器
```
$ docker ps -

強制移除容器
```
$ docker rm -f <Container ID>
```

登入 $ docker hub
```
$ docker login docker.io 
```

推容器上 $ docker hub
```
$ docker push <Account Name>/<Tag Name>:<Tag>
```

推容器上 $ docker hub
```
$ docker pull <Account Name>/<Tag Name>:<Tag>
```

基於鏡像檔建立新標籤
```
$ docker tag <Image ID> <Account Name>/<Tag Name>:<Tag>
```

清除內存
```
$ wsl --shutdown
```