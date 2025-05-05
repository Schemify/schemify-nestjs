src/
├── domain/ # Capa de Dominio
│ ├── entities/ # Entidades del dominio
│ │ └── user.entity.ts # Ejemplo: Entidad User
│ ├── repositories/ # Interfaces de repositorios
│ │ └── user.repository.ts # Contrato para el repositorio de User
│ ├── services/ # Servicios de dominio
│ │ └── user.service.ts # Lógica de negocio pura para User
│ ├── value-objects/ # Objetos de valor
│ │ └── email.value-object.ts
│ └── events/ # Eventos de dominio
│ └── user-created.event.ts
│
├── application/ # Capa de Aplicación
│ ├── use-cases/ # Casos de uso
│ │ └── create-user.use-case.ts
│ ├── dtos/ # DTOs para la comunicación
│ │ └── create-user.dto.ts
│ ├── mappers/ # Mapeadores entre capas
│ │ └── user.mapper.ts
│ └── services/ # Servicios de aplicación
│ └── user-application.service.ts
│
├── infrastructure/ # Capa de Infraestructura
│ ├── database/ # Configuración de la base de datos
│ │ └── user.repository.ts # Implementación del repositorio
│ ├── controllers/ # Controladores HTTP
│ │ └── user.controller.ts
│ ├── providers/ # Proveedores de servicios
│ │ └── user.provider.ts
│ ├── config/ # Configuración de la aplicación
│ │ └── database.config.ts
│ ├── exceptions/ # Manejo de excepciones
│ │ └── user.exception.ts
│ └── modules/ # Módulos de infraestructura
│ └── user.module.ts
│
├── shared/ # Componentes compartidos
│ ├── decorators/ # Decoradores personalizados
│ │ └── roles.decorator.ts
│ ├── guards/ # Guards personalizados
│ │ └── auth.guard.ts
│ ├── interceptors/ # Interceptors personalizados
│ │ └── logging.interceptor.ts
│ ├── pipes/ # Pipes personalizados
│ │ └── validation.pipe.ts
│ └── utils/ # Utilidades generales
│ └── helpers.ts
│
└── app.module.ts # Módulo principal de la aplicación

npx protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto.cmd --ts_proto_out=./ --ts_proto_opt=nestJs=true ./proto/example.proto
Mover archivo resultante a libs/common/src/types

"compilerOptions": {
"tsConfigPath": "apps/schemify-nestjs/tsconfig.app.json",
"assets": ["proto/*.proto"],
"watchAssets": true
}

🔒 Logger centralizado (por ejemplo con Pino) y redirección de logs Kafka a archivos o servicios externos.

$ docker tag schemify-nestjs-schemify-microservice ixyz0/schemify-microservice-nestjs:v0.1.0

docker push ixyz0/schemify-microservice-nestjs:v0.1.0

https://hub.docker.com/repository/docker/ixyz0/schemify-microservice-nestjs/general


helm create postgres-chart


comandos minikube

# Ver el estado de minikube
minikube status

# Encender minikube
minikube start

# Verificar los nodos
kubectl get nodes

cd schemify-nestjs
mkdir deployments
cd deployments
helm create schemify-microservice

En clústers remotos (allí siempre necesitas subir la imagen a un registry como Docker Hub o GitHub Container Registry).

minikube start --addons=ingress

helm repo add kong https://charts.konghq.com
helm repo update

helm install kong kong/kong \
  --set ingressController.enabled=true \
  --set admin.type=NodePort \
  --set proxy.type=NodePort \
  --namespace kong --create-namespace

kubectl get svc -n kong

ver que ip expone minikube
minikube profile list
	minikube ip

  kubectl get svc

kubectl get endpoints httpbin-httpbin-chart


kubectl get pods

kubectl delete deployment httpbin

helm install httpbin ./httpbin-chart

helm uninstall httpbin --no-hooks

kubectl delete all -l app.kubernetes.io/instance=httpbin

kubectl delete deployment httpbin
kubectl delete pod -l app=httpbin
kubectl delete replicaset -l app=httpbin

kubectl delete all -l app=httpbin

sh.helm.release.v1.httpbin.v1
kubectl delete secret sh.helm.release.v1.httpbin.v1

helm list
kubectl get all | grep httpbin

curl http://<MINIKUBE_IP>:<KONG_NODEPORT>/httpbin/get
minikube ip


helm upgrade --install httpbin ./httpbin-chart

kubectl delete pod -l app.kubernetes.io/instance=httpbin

estado correctop
ixyz@kelsier:~/documents/deployments/minikube/deployments$ kubectl get deployment httpbin
kubectl get svc httpbin
kubectl get ingress httpbin
NAME      READY   UP-TO-DATE   AVAILABLE   AGE
httpbin   1/1     1            1           33m
NAME      TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
httpbin   ClusterIP   10.104.161.54   <none>        80/TCP    33m
NAME      CLASS   HOSTS   ADDRESS         PORTS   AGE
httpbin   kong    *       10.105.161.86   80      27m
ixyz@kelsier:~/documents/deployments/minikube/deployments$

ixyz@kelsier:~/documents/deployments/minikube/deployments$ kubectl get svc kong-gw-kong-proxy -n kong
NAME                 TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)                      AGE
kong-gw-kong-proxy   NodePort   10.105.161.86   <none>        80:30435/TCP,443:30118/TCP   21h
ixyz@kelsier:~/documents/deployments/minikube/deployments$

ixyz@kelsier:~/documents/deployments/minikube/deployments$ kubectl get pods -n kong -o wide
NAME                            READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES
kong-gw-kong-797dcc6d66-nhsfk   2/2     Running   0          21h   10.244.0.51   minikube   <none>           <none>
kong-gw-postgresql-0            1/1     Running   0          21h   10.244.0.52   minikube   <none>           <none>
ixyz@kelsier:~/documents/deployments/minikube/deployments$