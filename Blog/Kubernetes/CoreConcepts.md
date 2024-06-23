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
Kind: Pod
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
```

- 取得 Pod 資訊

```sh
kubectl describe myapp-pod
# kubectl describe <Metadata Name>
```
