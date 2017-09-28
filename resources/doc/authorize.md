# 授权流程处理

## 权限管理运算流程

### 1.基本环（第一闭环：路径计算）

1. 使用用户登录过后的`userId`读取该用户的角色对应的所有权限代码：

	```
	访问流程：SEC_USER -> SEC_ROLE -> SEC_PERMISSION
	```
2. 根据API中的资源字段：`method`和`path`直接从`SEC_ACTION`中读取操作信息并最终读取到该操作对应的权限代码：

	```
	访问流程：SEC_ACTION -> SEC_PERMISSION
	```
3. 进行第一次匹配处理，1中可以得到当前用户拥有的所有权限码，2中可以得到当前用户访问的资源所需要的权限码，资源所需权限码必须存在于用户角色对应的权限码中。

**本次计算输出**

1. privateKey：从`SEC_ROLE`表中拿到，一个集合；
2. 权限类型：从`SEC_ACTION`定位到唯一的权限码，从`SEC_PERMISSION`中读取type字段；
3. 操作级别：从`SEC_ACTION`中读取操作级别；

### 2.资源环

1. 根据`SEC_ACTION`中的关联字段读取该Action访问的资源信息`SEC_RESOURCE`，该资源必须满足条件：`type=API`；

	```
	访问流程：SEC_ACTION -> SEC_RESOURCE
	```
2. 根据`SEC_ACTION`中读取到的四个参数定位该资源的子资源：`(method,path,identifier)`，查询`SEC_RESOURCE`表（返回记录必须唯一）；

	```
	访问流程：SEC_RESOURCE -> SEC_RESOURCE （通过根路径查找资源树中最终访问的资源需求表）
	```
3. 读取子资源记录中的结果：`type, level, publicKey`；
4. 从密钥库中读取当前角色的密钥，传入：`(Who,Do)：R_ROLE_ID, ACTION_CODE`；

	```
	访问流程：SEC_ROLE_MATRIX -> privateKey
	```

### 3.检测环（第二闭环：资源计算）

1. 检查资源环中的`type`是否和基本环最终输出的`SEC_PERMISSION`的type字段相等，*：API类型的资源会出现转换，在资源环第二步中，实际上已经在查找API资源对应的子资源信息。
2. 检查资源环中最终输出的`level`的值是否比基本环中的`level`小（计算法则使用位运算）
3. 进行最终验证：`privateKey`和`publicKey`是否一致，一致性可行，则表示该资源可访问，此次请求成功。

### 4.可选环（第三闭环：Matrix）

*：在此步骤中必须提供ActionCode，即上边`SEC_ACTION`的代码

1. 上边步骤完成过后，通过`SEC_RESOURCE`和`SEC_ROLE`中各自的ID从`SEC_ROLE_MATRIX`中查找`query`、`projection`处理行列数据域的问题，因为授权过后直接进入自身流程，这两个参数负责提供核心查询参数；
2. 继续进行第二部操作，通过`SEC_RESOURCE`和`SEC_USER`中各自的ID从`SEC_USER_MATRIX`中查找`query`、`projection`、`approval`、`duration`等复杂信息，进行用户级别的特殊行列运算；

## 几个基本数据

1. `type = API | MODULE | DIRECT | MENU`
2. `level = V | E | S | (C | U (A) | D) | F`
	* V: Visible——可见不可见，最小权限
	* E：Enable——可用不可用，次小权限
	* S：Search——搜索权限（搜索会配合Matrix处理
	* C：Create——添加，值
	* U：Update——更新，值
	* A：Approval——带条件更新，值	
	* D：Delete——删除，值
	* F：Full——全部权限，值

**计算原理**

```
V: 00000001
E: 00000011
S: 00000111
C: 00001111
U: 00111111
A: 00011111
D: 01111111
F: 11111111


```
