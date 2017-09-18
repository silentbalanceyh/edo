# 系统端口列表

## 核心组件

* ZooKeeper：全局配置管理器
* H2：容器内置Metadata管理器
* Vert.X：Web/Sock/Rpc服务器，路由管理器
* MySQL：数据库服务器（分表）
* Felix：OSGI内置插件管理

## 配置管理ZooKeeper

* 9090：zkui端口号
* 服务端端口配置：

```
    server.1=127.0.0.1:2881:3881
    server.2=127.0.0.1:2882:3882
    server.3=127.0.0.1:2883:3883
    server.4=127.0.0.1:2884:3884
    server.5=127.0.0.1:2885:3885
```
* 客户端连接端口：

```
    server.1：2181
    server.2：2182
    server.3：2183
    server.4：2184
    server.5：2185
```
* 连接字符串（**客户端配置**）：

```
# src/main/resources/engine/zk/zoo.properties
vie.zk.client=127.0.0.1:2181,127.0.0.1:2182,127.0.0.1:2183,127.0.0.1:2184,127.0.0.1:2185
```

## Api Gateway路由管理

* 项目名/容器名：```edo-agent/edo-agent```
* 数据库：```SCF_AGENT```
* 7000：H2数据库端口
* 7100：H2 WebConsole端口
* 7200：Restful Api端口（专用前端访问主端口）
* 7300：Web Server端口
* 7400：Web Socket端口
* 7500：Rpc Server端口
* 7600：Osgi容器端口

## 模块管理

模块管理端口号从6000开始，段落如下：

* 6000 - 6099：H2数据库端口，
* 6100 - 6199：H2 WebConsole端口
* 6200 - 6299：Restful Api端口
* 6300 - 6399：Web Server端口
* 6400 - 6499：Web Socket端口
* 6500 - 6599：Rpc Server端口
* 6600 - 6699：Osgi容器端口

**Meta配置**

```
# meta/start-meta.sh
export TCP_PORT=6000
export WEB_PORT=6100
export H2_ENV=edo-auth
```

**Restful/Socket/Web/Rpc**

```
# src/main/resources/engine/server.properties
# Web Service
server.port.api=6200
# Web Site
server.port.web=6300
# Web Socket
server.port.web.socket=6400
# Rpc
opt.rpc.port=6500
```

**Osgi容器**

```
# src/main/resources/engine/felix/bundle.properties
# Remote Shell
osgi.shell.telnet.port=6600
```

**数据库连接配置**

```
# src/main/resources/engine/database/jdbc.properties
# H2 元数据配置
H2.jdbc.url=jdbc:h2:tcp://127.0.0.1:6000/SCF_AUTH;PASSWORD_HASH=TRUE
H2.jdbc.driver=org.h2.Driver
H2.jdbc.username=scf
H2.jdbc.password=db6ea8d90fa0cad8597d332cb1ee3903143588bce135c1f1100a6e62c523dd70
H2.jdbc.database.name=SCF_AUTH
# MySQL 数据库
MYSQL.jdbc.url=jdbc:mysql://127.0.0.1:3306/SCF_AUTH? \
	serverTimezone=UTC&useUnicode=true&characterEncoding=UTF-8&autoReconnect=true&failOverReadOnly=false
MYSQL.jdbc.driver=com.mysql.cj.jdbc.Driver
MYSQL.jdbc.username=htl
MYSQL.jdbc.password=pl,okmijn123
MYSQL.jdbc.database.name=SCF_AUTH
```

### 目前模块对应端口

* `edo-auth`：6000, 6100, 6200, 6300, 6400, 6500, 6600
* `edo-app`：6001, 6101, 6201, 6301, 6401, 6501, 6601
* `edo-addr`：6002, 6102, 6202, 6302, 6402, 6502, 6602
* `edo-hr`：6003, 6103, 6203, 6303, 6403, 6503, 6603
