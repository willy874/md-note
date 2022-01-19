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
$ docker ps -a

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

```yaml
version: "3.7"

services:
  web:
    build: .
    command: 'npm run dev'
    ports:
      - '3010:8001'
    env_file: .env
    volumes:
      - .:/code
  backend:
    image: willy/backend:latest
    command:
```


```bash
$ docker-compose up
$ docker build --platform amd64 -t willy874/project-name:v0
```

```Dockerfile
FROM node:16.13 as builder

WORKDIR /code
COPY . .
COPY  package.json .
COPY yarn.lock .
RUN yarn install
RUN npm run build

FROM node:16.13

WORKDIR /code

RUN adduser  --disabled-password --no-create-home will

RUN chown will /usr/local

RUN yarn add express

COPY --from=builder /code/dist .

COPY . .

USER will

```