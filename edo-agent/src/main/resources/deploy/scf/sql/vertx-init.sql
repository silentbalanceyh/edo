--------------------------------------------------------------------------------------
-- EVX_VERTICLE表，保存了所有和VertX相关的元数据配置信息
DROP TABLE IF EXISTS EVX_VERTICLE;
CREATE TABLE EVX_VERTICLE(
    --主键ID标识符
    K_ID VARCHAR(36),                          -- 当前Verticle对应的ID标识符
    S_CLASS VARCHAR(255) NOT NULL,              -- 当前Verticle的Java类名
    S_INSTANCES INT                             -- 实例数量
        CHECK(S_INSTANCES > 0),
    S_IGROUP VARCHAR(255),                      -- Isolation Group信息
    S_JSON_CONFIG VARCHAR(2048),                -- 额外的Json配置
    S_ISOLATED_CLASSES VARCHAR(2048),           -- Isolation Classes
    --配置项中的两个特殊的类路径
    CP_EXT VARCHAR(2000),                       -- Extra Classpath
    --配置属性Boolean类型
    IS_HA BOOLEAN NOT NULL,                     -- 是否开启了HA
    IS_WORKER BOOLEAN NOT NULL,                 -- 是否是一个Worker
    IS_MULTI BOOLEAN NOT NULL,                  -- 是否是一个Multi类型的Verticle
    --创建部署配置        
    PRIMARY KEY(K_ID)
);
-- EVX_VERTICLE的索引创建
CREATE INDEX IDX_VERTICLE_CLASS ON EVX_VERTICLE(S_CLASS);
CREATE INDEX IDX_VERTICLE_IGROUP ON EVX_VERTICLE(S_IGROUP);
CREATE INDEX IDX_VERTICLE_IS_HA ON EVX_VERTICLE(IS_HA);
CREATE INDEX IDX_VERTICLE_IS_WORKER ON EVX_VERTICLE(IS_WORKER);
CREATE INDEX IDX_VERTICLE_IS_MULTI ON EVX_VERTICLE(IS_MULTI);

--------------------------------------------------------------------------------------
-- EVX_ROUTE，路由表结构，保存了路由地址以及相关的处理器
DROP TABLE IF EXISTS EVX_ROUTE;
CREATE TABLE EVX_ROUTE(
    --主键ID标识符
    K_ID VARCHAR(36),                          -- 当前Route对应的ID标识符
    S_PARENT VARCHAR(255) NOT NULL,             -- 当前Route的父PATH
    S_PATH VARCHAR(255) NOT NULL,               -- 客户端访问的入口URI路径
    S_METHOD VARCHAR(10) NOT NULL               -- HTTP方法
        CHECK(S_METHOD = 'GET' OR S_METHOD = 'POST' OR S_METHOD = 'PUT' OR S_METHOD = 'DELETE' OR S_METHOD = 'OPTIONS' OR S_METHOD = 'HEAD' OR S_METHOD = 'TRACE' OR S_METHOD = 'CONNECT' OR S_METHOD = 'PATCH'),
    S_MIME_CONSUMER VARCHAR(2048),              -- Consumer Mimes
    S_MIME_PRODUCER VARCHAR(2048),              -- Producer Mimes
    S_ORDER INT,                                -- 同一个路径下的ORDER，这个值只有路径相同时才会使用
    --处理器信息
    S_SHANDLER VARCHAR(255),                    -- Java处理当前Route的SuccessHandler内容
    S_FHANDLER VARCHAR(255),                    -- Java处理当前Route的FailureHandler内容
    PRIMARY KEY(K_ID)
);
-- EVX_ROUTE的索引创建
CREATE INDEX IDX_ROUTE_PARENT ON EVX_ROUTE(S_PARENT);
CREATE INDEX IDX_ROUTE_PATH ON EVX_ROUTE(S_PATH);
CREATE INDEX IDX_ROUTE_METHOD ON EVX_ROUTE(S_METHOD);

--------------------------------------------------------------------------------------
-- EVX_URI, 接口参数验证表，保存了某个接口中的参数获取方式以及参数规范
DROP TABLE IF EXISTS EVX_URI;
CREATE TABLE EVX_URI(
    K_ID VARCHAR(36),                          -- 当前URI对应的ID标识符
    S_URI VARCHAR(255) NOT NULL,                -- 系统中的URI地址，唯一值
    IS_SECURE BOOLEAN NOT NULL,                    -- 当前Api是否需要执行安全认证
    S_METHOD VARCHAR(10) NOT NULL               -- HTTP方法
        CHECK(S_METHOD = 'GET' OR S_METHOD = 'POST' OR S_METHOD = 'PUT' OR S_METHOD = 'DELETE' OR S_METHOD = 'OPTIONS' OR S_METHOD = 'HEAD' OR S_METHOD = 'TRACE' OR S_METHOD = 'CONNECT' OR S_METHOD = 'PATCH'),
    S_PARAM_TYPE VARCHAR(10) NOT NULL           -- 参数的获取方式
        CHECK(S_PARAM_TYPE = 'QUERY' OR S_PARAM_TYPE = 'FORM' OR S_PARAM_TYPE = 'BODY' OR S_PARAM_TYPE = 'CUSTOM'),
    S_GLOBAL_ID VARCHAR(255),                   -- 这个URI地址对应的GLOBAL ID，这个ID最终Record会使用
    J_IN VARCHAR(255),                          -- 前置脚本
    J_OUT VARCHAR(255),                            -- 后置脚本
    S_SENDER VARCHAR(255) NOT NULL,             -- 当前这个Api调用的Message Sender
    S_RESPONDER VARCHAR(255) NOT NULL,          -- 当前这个Api调用的Responder
    MSG_ADDRESS VARCHAR(255) NOT NULL,          -- 当前URL对应的Event Bus上的地址信息
    S_MAPPING CLOB,                             -- 参数映射表
    S_JOINED CLOB,                                 -- 执行Joined查询以及删专用Api信息，处理DELETE和INSERT
    L_REQUIRED_PARAM CLOB,                      -- 必须参数列表,
    L_RETURN_FILTERS CLOB,                      -- 返回结果中需要过滤的属性值
    L_CONTENT_MIMES CLOB,                       -- Content Type中对应MIME
    L_ACCEPT_MIMES CLOB,                        -- Accept Type中对应MIME
    PRIMARY KEY(K_ID)
);
-- EVX_URI的索引创建
CREATE INDEX IDX_URI_URI ON EVX_URI(S_URI);
CREATE INDEX IDX_URI_METHOD ON EVX_URI(S_METHOD);
CREATE INDEX IDX_URI_PARAM_TYPE ON EVX_URI(S_PARAM_TYPE);

--------------------------------------------------------------------------------------
--- EVX_RULE, 验证规则表，保存了某个接口参数的验证规则, Parameter Validation Rule
DROP TABLE IF EXISTS EVX_RULE;
CREATE TABLE EVX_RULE(
    K_ID VARCHAR(36),                          -- 当前Rule对应的ID标识符
    S_NAME VARCHAR(255) NOT NULL,               -- 参数名称
    S_TYPE CHAR(16) NOT NULL                    -- 字段类型
        CHECK(S_TYPE='BooleanType' OR S_TYPE='IntType' OR S_TYPE='LongType' 
        OR S_TYPE='DateType' OR S_TYPE='StringType' OR S_TYPE='BinaryType' 
        OR S_TYPE='DecimalType' OR S_TYPE='JsonType' OR S_TYPE='XmlType' OR S_TYPE='ScriptType'),
    S_ORDER INT,                                -- 当前规则的顺序
    J_COMPONENT_TYPE VARCHAR(15) NOT NULL       -- 组件类型
        CHECK(J_COMPONENT_TYPE='VALIDATOR' OR J_COMPONENT_TYPE='CONVERTOR' OR J_COMPONENT_TYPE='DEPENDANT'),
    J_COMPONENT_CLASS VARCHAR(255),             -- Java组件Class
    J_CONFIG CLOB,                              -- Java组件中需要使用的Json配置
    J_ERROR_MSG VARCHAR(2048),                  -- Error Message验证失败的信息
    -- 关联属性
    R_URI_ID VARCHAR(36),                      -- 关联EVX_URI表
    PRIMARY KEY(K_ID),
    FOREIGN KEY(R_URI_ID) REFERENCES EVX_URI(K_ID)
);
-- EVX_RULE的索引创建
CREATE INDEX IDX_RULE_NAME ON EVX_RULE(S_NAME);
CREATE INDEX IDX_RULE_TYPE ON EVX_RULE(S_TYPE);
CREATE INDEX IDX_RULE_ORDER ON EVX_RULE(S_ORDER);
CREATE INDEX IDX_RULE_COM_TYPE ON EVX_RULE(J_COMPONENT_TYPE);
CREATE INDEX RIDX_RULE_URI_ID ON EVX_RULE(R_URI_ID);

--------------------------------------------------------------------------------------
--- EVX_ADDRESS
DROP TABLE IF EXISTS EVX_ADDRESS;
CREATE TABLE EVX_ADDRESS(
    K_ID VARCHAR(36),                          -- 当前Address对应的ID标识符
    S_WORK_CLASS VARCHAR(255) NOT NULL,         -- 当前Verticle的Java类名
    S_CONSUMER_ADDR VARCHAR(255) NOT NULL,      -- 当前Verticle对应的地址信息
    S_CONSUMER_HANDLER VARCHAR(255) NOT NULL,   -- 设置Consumer类名
    PRIMARY KEY(K_ID)
);
--- EVX_ADDRESS的索引创建
CREATE INDEX IDX_ADDRESS_WORK_CLASS ON EVX_ADDRESS(S_WORK_CLASS);
CREATE INDEX IDX_ADDRESS_CONSUMER_ADDR ON EVX_ADDRESS(S_CONSUMER_ADDR);

--------------------------------------------------------------------------------------
--- ENG_SCRIPT
DROP TABLE IF EXISTS ENG_SCRIPT;
CREATE TABLE ENG_SCRIPT(
    K_ID VARCHAR(36),                          -- Script脚本的ID
    S_NAME VARCHAR(255) NOT NULL,               -- 脚本名称
    S_NAMESPACE VARCHAR(255) NOT NULL,          -- 脚本名空间
    S_CONTENT CLOB,                             -- 脚本内容
    PRIMARY KEY(K_ID)
);
--- ENG_SCRIPT
CREATE INDEX IDX_SCRIPT_NAME ON ENG_SCRIPT(S_NAME);
CREATE INDEX IDX_SCRIPT_NAMESPACE ON ENG_SCRIPT(S_NAMESPACE);
--------------------------------------------------------------------------------------
--- EVX_SOCK
DROP TABLE IF EXISTS EVX_SOCK;
CREATE TABLE EVX_SOCK(
    K_ID VARCHAR(36),                           -- Sock的ID
    S_NAME VARCHAR(255) NOT NULL,               -- Sock的名称，一般为类名
    S_ADDR_ROUTE VARCHAR(255) NOT NULL,            -- Sock中的Route路由地址
    S_ADDR_EVENT VARCHAR(255) NOT NULL UNIQUE,  -- Sock中的Event地址
    J_PERMITS CLOB,                               -- Sock中当前处理器的Permit配置
    J_CONFIG CLOB,                                -- Sock中其他配置
    S_WORKER VARCHAR(255) NOT NULL UNIQUE,        -- Sock中对应的Worker消息转发器
    S_MODIFIER VARCHAR(255) NOT NULL UNIQUE,    -- Sock中对应的Modifier消息Key
    PRIMARY KEY(K_ID)
);
--- EVX_SOCK
CREATE INDEX IDX_SOCK_NAME ON EVX_SOCK(S_NAME);
CREATE INDEX IDX_SOCK_ADDR_ROUTE ON EVX_SOCK(S_ADDR_ROUTE);
CREATE INDEX IDX_SOCK_ADDR_EVENT ON EVX_SOCK(S_ADDR_EVENT);
CREATE INDEX IDX_SOCK_WORKER ON EVX_SOCK(S_WORKER);
CREATE INDEX IDX_SOCK_MODIFIER ON EVX_SOCK(S_MODIFIER);
