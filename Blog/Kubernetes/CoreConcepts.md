# Core Concepts

## Node(Minions)

### Components

- API Server
- ETCD
- Scheduler
- Controller
- Kubelet
- Container Runtime

### MasterNode vs WorkNode

one only cluster, the one MasterNode and money WorkNode.

#### MasterNode

- API Server
- ETCD
- Scheduler
- Controller

#### WorkNode

- Kubelet
- Container Runtime
 
### Container Runtime

- Docker
- ContainerD
- Rocket
- CRI-O

最早 k8s 只支援 docker。
後來有人定義 CRI 標準，除了 CRI 支持也同時要保持支援 docker。

ContainerD 是 Docker 的一部分，也是 Container Runtime。所以運行 K8s 可以不安裝 docker，只安裝 ContainerD。

### CLI

- ctr
- nerdctl
- crictl

## Pod

- Pod 是 k8s 能建立的最小控制單元
- 每個 Pod 將共享相同的資源、網路，同時被創建與銷毀。
- 使用 `kubectl run <Pod Name> --image <Image Name>` 去創建 Pod，他會從 Docker、DockerHub、Organization 去尋找 Image。
- 使用 `kubectl get pods` 取得 pods 列表

## With yaml

Example:
pod-definition.yaml

```yaml
appVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
    type: frontend
spec:
  containers:
    - name: nginx-container
      image: nginx

    - name: backend-container
      image: redis
```

CLI:

- 使用 yaml 創建 Pod

```sh
kubectl create -f pod-definition.yaml
# kubectl create -f <File Path>
```

```sh
kubectl apply -f pod-definition.yaml
# kubectl apply -f <File Path>
```

- 使用 image 創建 Pod

```sh
kubectl run nginx --image=nginx
# kubectl run <Pod name> <Image name>
```

- 取得 Pod 列表

```sh
kubectl get pods
```

- 取得 Pod 資訊

```sh
kubectl describe myapp-pod
# kubectl describe <Metadata Name>
```

- 刪除 Pod

```sh
kubectl delete myapp-pod
# kubectl delete <Metadata Name>
```

- 其他功能
  
模擬運行 Pod `--dry-run`
設定輸出格式為 `-o yaml`
設定輸出格式為 yaml，指定檔案為 nginx.yaml `-o yaml > nginx.yaml`

```sh
kubectl run nginx --image=nginx --dry-run -o yaml > nginx.yaml
# kubectl run <Pod name> <Image name> --dry-run
```

--dry-run：預設情況下，一旦執行指令，就會建立資源。如果您只想測試指令，請使用 --dry-run=client 選項。這不會創建資源。相反，告訴您是否可以建立資源以及您的命令是否正確。

-o yaml：這將以 YAML 格式在螢幕上輸出資源定義。

## ReplicaSets

ReplicaSets 是管理 Pod 一層控制介面，可以決定啟動ㄧ組群組 Pod 的控制單位。

```yaml
appVersion: v1
kind: ReplicationController
metadata:
  name: myapp
  labels:
    app: myapp
    type: frontend
spec:
  template:
    metadata:
      name: myapp-pod
      labels:
        app: myapp
        type: frontend
    spec:
      containers:
        - name: nginx-container
          image: nginx

        - name: backend-container
          image: redis

replicas: 3
selector:
  matchLabels:
    type: frontend
```

```sh
kubectl get replicaset
```

```sh
kubectl describe replicaset new-replica-set
# kubectl describe replicaset <ReplicaSet name>
```

```sh
kubectl replace -f replace.yaml
```

```sh
kubectl scale --replicas=6 -f replicaset.yaml
```

```sh
kubectl explain replicaset
```

```yaml
appVersion: v1
kind: ReplicaSet
metadata:
  name: Replicaset-1
spec:
  replicas: 2
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      name: myapp-pod
      labels:
        app: myapp
        tier: frontend
    spec:
      containers:
        - name: nginx-container
          image: nginx
```

```sh
kubectl get rs
```

## Deployment

Deployment 是基於 ReplicaSet 之上的控制層

```yaml
appVersion: v1
kind: Deployment
metadata:
  name: Deployment-1
spec:
  replicas: 2
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      name: myapp-pod
      labels:
        app: myapp
        tier: frontend
    spec:
      containers:
        - name: nginx-container
          image: nginx
```

```sh
kubectl get deployments
```

## Namespace

```sh
kubectl create -f pod-definition.yaml --namespace=dev
# kubectl create -f <File Path> --namespace=<Name>
```

```sh
kubectl config set-context $(kubectl config current-context)  --namespace=dev
# kubectl create -f <File Path> --namespace=<Name>
```

```yaml
appVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
  namespace: dev
spec:
  hard:
    pods: "10"
    request.cpu: '4'
    request.memory: 5Gi
    limits.cpu: '10'
    limits.memory: 10Gi
```

