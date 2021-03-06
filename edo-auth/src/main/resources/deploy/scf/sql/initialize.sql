--------------------------------------------------------------------------------------
-- SYS_META 核心元数据表
DROP TABLE IF EXISTS SYS_META;
CREATE TABLE SYS_META(
    -- 元数据对应的ID                         
    K_ID VARCHAR(36),                          -- Meta元素ID标识符，GUID格式
    -- 模型的配置属性
    S_STATUS VARCHAR(8)                         -- SYSTEM | USER | DISABLED
        CHECK(S_STATUS = 'SYSTEM' OR S_STATUS = 'USER' OR S_STATUS = 'DISABLED'),
    S_NAME VARCHAR(255) NOT NULL,               -- 模型名称
    S_COMMENTS CLOB,                            -- 模型备注
    S_NAMESPACE VARCHAR(255) NOT NULL,          -- 模型名空间
    S_CATEGORY CHAR(8) NOT NULL                 -- ENTITY | RELATION
        CHECK(S_CATEGORY = 'ENTITY' OR S_CATEGORY='RELATION'),              
    S_GLOBAL_ID VARCHAR(255) NOT NULL UNIQUE,   -- Global ID
    S_MAPPING CHAR(10) NOT NULL                 -- DIRECT | COMBINATED | PARTIAL
        CHECK(S_MAPPING = 'DIRECT' OR S_MAPPING='COMBINATED' OR S_MAPPING='PARTIAL'),
    S_POLICY CHAR(10) NOT NULL                  -- GUID | INCREMENT | ASSIGNED | COLLECTION     
        CHECK(S_POLICY = 'GUID' OR S_POLICY='INCREMENT' OR S_POLICY='ASSIGNED' OR S_POLICY='COLLECTION'),
    -- 数据库属性
    D_TABLE VARCHAR(255) NOT NULL,              -- 数据库表名
    D_SUB_TABLE VARCHAR(255),                   -- 数据库子表名
    D_SUB_KEY VARCHAR(255),                     -- 数据库子表ID
    D_SEQ_NAME VARCHAR(255),                    -- Oracle中使用的序列名
    D_SEQ_STEP INT                              -- 如果使用自增长则表示自增长的梯度
        CHECK(D_SEQ_STEP > 0),
    D_SEQ_INIT INT,                             -- 自增长的起始数据
        CHECK(D_SEQ_INIT > 0),
    -- 约束定义
    PRIMARY KEY(K_ID)
);
-- SYS_META的索引创建，主针对查询
CREATE INDEX IDX_META_NAME ON SYS_META(S_NAME);
CREATE INDEX IDX_META_NAMESPACE ON SYS_META(S_NAMESPACE);
CREATE INDEX IDX_META_CATEGORY ON SYS_META(S_CATEGORY);
CREATE INDEX IDX_META_GLOBAL_ID ON SYS_META(S_GLOBAL_ID);
CREATE INDEX IDX_META_MAPPING ON SYS_META(S_MAPPING);
CREATE INDEX IDX_META_POLICY ON SYS_META(S_POLICY);
CREATE INDEX IDX_META_STATUS ON SYS_META(S_STATUS);

--------------------------------------------------------------------------------------
-- SYS_KEY 核心键值表
DROP TABLE IF EXISTS SYS_KEYS;
CREATE TABLE SYS_KEYS(
    K_ID VARCHAR(36),                          -- Keys对应的ID，GUID格式
    -- Key的系统属性
    S_NAME VARCHAR(255) NOT NULL,               -- 系统键名称
    S_COMMENTS CLOB,                            -- 键备注
    S_CATEGORY CHAR(10) NOT NULL                -- 键的类型
        CHECK(S_CATEGORY = 'PrimaryKey' OR S_CATEGORY = 'ForeignKey' OR S_CATEGORY='UniqueKey'),
    IS_MULTI BOOLEAN NOT NULL,                  -- 是否跨字段
    S_COLUMNS CLOB NOT NULL,                    -- 列信息，Json格式，对应字段名（SYS_FIELDS）的集合
    -- 关联属性
    R_META_ID VARCHAR(36),                     -- 关联SYS_META表
    PRIMARY KEY(K_ID),
    FOREIGN KEY(R_META_ID) REFERENCES SYS_META(K_ID)
);
-- SYS_KEYS的索引创建，主针对查询
CREATE INDEX IDX_KEYS_NAME ON SYS_KEYS(S_NAME);
CREATE INDEX IDX_KEYS_CATEGORY ON SYS_KEYS(S_CATEGORY);
CREATE INDEX IDX_KEYS_IS_MULTI ON SYS_KEYS(IS_MULTI);
CREATE INDEX RIDX_KEYS_META_ID ON SYS_KEYS(R_META_ID);

--------------------------------------------------------------------------------------
-- SYS_FIELD 核心字段表
DROP TABLE IF EXISTS SYS_FIELDS;
CREATE TABLE SYS_FIELDS(
    -- 字段的ID标识符
    K_ID VARCHAR(36),                          -- Fields对应的ID标识符，GUID格式
    -- Field的系统属性
    S_NAME VARCHAR(255) NOT NULL,               -- 字段名称
    S_COMMENTS CLOB,                            -- 字段备注
    S_TYPE CHAR(16) NOT NULL                    -- 字段类型
        CHECK(S_TYPE='BooleanType' OR S_TYPE='IntType' OR S_TYPE='LongType' 
        OR S_TYPE='DateType' OR S_TYPE='StringType' OR S_TYPE='BinaryType' 
        OR S_TYPE='DecimalType' OR S_TYPE='JsonType' OR S_TYPE='XmlType' OR S_TYPE='ScriptType'),
    -- Constraints对应的属性
    C_PATTERN VARCHAR(255),                     -- StringType: 字段需要满足的格式正则表达式
    C_VALIDATOR VARCHAR(255),                   -- 验证器对应的Validator
    C_LENGTH INT                                -- 字段的长度
        CHECK(C_LENGTH >= 0),
    C_DATETIME CHAR(6)                          -- STRING | TIMER
        CHECK(C_DATETIME='STRING' OR C_DATETIME='TIMER'),
    C_DATEFORMAT VARCHAR(36),                   -- 时间格式的pattern
    C_PRECISION SMALLINT(16),                   -- 浮点数精度描述
    C_UNIT VARCHAR(36),                         -- 当前数据的单位描述
    C_MAX_LENGTH INT                            -- 当前字符串最大长度
        CHECK(C_MAX_LENGTH >= -1),
    C_MIN_LENGTH INT                            -- 当前字符串最小长度
        CHECK(C_MIN_LENGTH >= -1),
    C_MAX BIGINT,                               -- 最大值
    C_MIN BIGINT,                               -- 最小值
    -- 数据库对应的一部分约束
    IS_PRIMARY_KEY BOOLEAN NOT NULL,            -- bool: 当前字段是否主键
    IS_UNIQUE BOOLEAN NOT NULL,                 -- bool: 当前字段是否Unique的
    IS_SUB_TABLE BOOLEAN NOT NULL,              -- bool: 当前字符是否属于子表字段
    IS_FOREIGN_KEY BOOLEAN NOT NULL,            -- bool: 当前字段是否外键
    IS_NULLABLE BOOLEAN NOT NULL,               -- bool: 当前字段是否可为null
    -- 数据库属性
    D_COLUMN_NAME VARCHAR(255) NOT NULL,        -- 数据列名称
    D_COLUMN_TYPE VARCHAR(255) NOT NULL,        -- 数据列类型
    D_REF_TABLE VARCHAR(255),                   -- 当前字段所用于的引用表
    D_REF_ID VARCHAR(255),                      -- 当前字段所用于的表的主键名
    -- 关联属性
    R_META_ID VARCHAR(36),                     -- 关联SYS_META表 
    PRIMARY KEY(K_ID),
    FOREIGN KEY(R_META_ID) REFERENCES SYS_META(K_ID)
);
-- SYS_FIELDS的索引创建，主针对查询
CREATE INDEX IDX_FIELDS_NAME ON SYS_FIELDS(S_NAME);
CREATE INDEX IDX_FIELDS_TYPE ON SYS_FIELDS(S_TYPE);
CREATE INDEX IDX_FIELDS_LENGTH ON SYS_FIELDS(C_LENGTH);
CREATE INDEX IDX_FIELDS_DATETIME ON SYS_FIELDS(C_DATETIME);
CREATE INDEX IDX_FIELDS_MAX_LENGTH ON SYS_FIELDS(C_MAX_LENGTH);
CREATE INDEX IDX_FIELDS_MIN_LENGTH ON SYS_FIELDS(C_MIN_LENGTH);
CREATE INDEX IDX_FIELDS_MAX ON SYS_FIELDS(C_MAX);
CREATE INDEX IDX_FIELDS_MIN ON SYS_FIELDS(C_MIN);
CREATE INDEX IDX_FIELDS_IS_PRIMARY_KEY ON SYS_FIELDS(IS_PRIMARY_KEY);
CREATE INDEX IDX_FIELDS_IS_UNIQUE ON SYS_FIELDS(IS_UNIQUE);
CREATE INDEX IDX_FIELDS_IS_SUB_TABLE ON SYS_FIELDS(IS_SUB_TABLE);
CREATE INDEX IDX_FIELDS_IS_FOREIGN_KEY ON SYS_FIELDS(IS_FOREIGN_KEY);
CREATE INDEX IDX_FIELDS_IS_NULLABLE ON SYS_FIELDS(IS_NULLABLE);
CREATE INDEX RIDX_FIELDS_META_ID ON SYS_KEYS(R_META_ID);


--------------------------------------------------------------------------------------
-- SYS_VIEW
DROP TABLE IF EXISTS SYS_VIEW;
CREATE TABLE SYS_VIEW(
    K_ID VARCHAR(36),                          -- View元素ID标识符
    S_STATUS VARCHAR(8)                         -- SYSTEM | USER | DISABLED
        CHECK(S_STATUS = 'SYSTEM' OR S_STATUS = 'USER' OR S_STATUS = 'DISABLED'),
    S_NAME VARCHAR(255) NOT NULL,               -- 模型名称
    S_COMMENTS CLOB,                            -- 模型备注
    S_NAMESPACE VARCHAR(255) NOT NULL,          -- 模型名空间
    S_GLOBAL_ID VARCHAR(255) NOT NULL UNIQUE,   -- Global ID
    D_CATEGORY VARCHAR(20) NOT NULL,            -- 数据库类型，字符串：MSSQL, PGSQL, ORACLE, MYSQL
    D_VIEW VARCHAR(255) NOT NULL,               -- 数据库内视图的名称，V_前缀
    D_STATEMENT CLOB NOT NULL,                  -- SQL或NON-SQL语句
    D_CHECK_OPTION BOOLEAN,                     -- 是否检查CHECK约束
    PRIMARY KEY(K_ID)
);
-- SYS_VIEW索引构建
CREATE INDEX IDX_VIEW_NAME ON SYS_VIEW(S_NAME);
CREATE INDEX IDX_VIEW_NAMESPACE ON SYS_VIEW(S_NAMESPACE);
CREATE INDEX IDX_VIEW_STATUS ON SYS_VIEW(S_STATUS);
CREATE INDEX IDX_VIEW_GLOBAL_ID ON SYS_VIEW(S_GLOBAL_ID);
CREATE INDEX IDX_VIEW_CATEGORY ON SYS_VIEW(D_CATEGORY);
CREATE INDEX IDX_VIEW_VIEW ON SYS_VIEW(D_VIEW);
CREATE INDEX IDX_VIEW_CHECK_OPTION ON SYS_VIEW(D_CHECK_OPTION);

--------------------------------------------------------------------------------------
-- SYS_VCOLUMNS
DROP TABLE IF EXISTS SYS_VCOLUMNS;
CREATE TABLE SYS_VCOLUMNS(
    K_ID VARCHAR(36),                          -- View中列元素ID标识符
    --Field属性
    S_NAME VARCHAR(255) NOT NULL,               -- 字段名称
    S_COMMENTS CLOB,                            -- 字段备注
    S_TYPE CHAR(16) NOT NULL                    -- 字段类型
        CHECK(S_TYPE='BooleanType' OR S_TYPE='IntType' OR S_TYPE='LongType' 
        OR S_TYPE='DateType' OR S_TYPE='StringType' OR S_TYPE='BinaryType' 
        OR S_TYPE='DecimalType' OR S_TYPE='JsonType' OR S_TYPE='XmlType' OR S_TYPE='ScriptType'),
    -- 数据库属性
    D_COLUMN_NAME VARCHAR(255) NOT NULL,        -- 数据列名称
    D_COLUMN_TYPE VARCHAR(255) NOT NULL,        -- 数据列类型
    R_VIEW_ID VARCHAR(36),                     -- 关联SYS_VIEW表
    -- 关联属性
    PRIMARY KEY(K_ID),
    FOREIGN KEY(R_VIEW_ID) REFERENCES SYS_VIEW(K_ID)    
);
-- SYS_VCOLUMNS的索引创建，主针对查询
CREATE INDEX IDX_VCOLUMNS_NAME ON SYS_VCOLUMNS(S_NAME);
CREATE INDEX IDX_VCOLUMNS_TYPE ON SYS_VCOLUMNS(S_TYPE);
CREATE INDEX IDX_VCOLUMNS_COLUMN_NAME ON SYS_VCOLUMNS(D_COLUMN_NAME);
CREATE INDEX IDX_VCOLUMNS_COLUMN_TYPE ON SYS_VCOLUMNS(D_COLUMN_TYPE);
CREATE INDEX RIDX_VCOLUMNS_VIEW_ID ON SYS_VCOLUMNS(R_VIEW_ID);

--------------------------------------------------------------------------------------
-- SYS_INDEX
DROP TABLE IF EXISTS SYS_INDEX;
CREATE TABLE SYS_INDEX(
    K_ID VARCHAR(36),                          -- Index索引ID标识符
    D_NAME VARCHAR(255) NOT NULL,               -- 数据库中索引名：IDX_前缀
    D_COLUMNS CLOB NOT NULL,                    -- JSON格式：[{"column":"A","mode":"ASC"}]
    R_REF_ID VARCHAR(36) NOT NULL,             -- 关联table/view的identifier，非外键：S_META, S_VIEW
    PRIMARY KEY(K_ID)
);
-- SYS_INDEX索引创建
CREATE INDEX IDX_INDEX_NAME ON SYS_INDEX(D_NAME);
CREATE INDEX IDX_INDEX_REF_ID ON SYS_INDEX(R_REF_ID);

--------------------------------------------------------------------------------------
-- SYS_TRIGGER
DROP TABLE IF EXISTS SYS_TRIGGER;
CREATE TABLE SYS_TRIGGER(
    K_ID VARCHAR(36),                          -- TRIGGER的ID标识符
    D_NAME VARCHAR(255) NOT NULL,               -- 数据库中触发器名称：TG_前缀
    D_CATEGORY VARCHAR(20) NOT NULL,            -- 数据库类型，字符串：MSSQL, PGSQL, ORACLE, MYSQL
    D_TARGET VARCHAR(8) NOT NULL                -- 操作对象是 VIEW | TABLE
        CHECK(D_TARGET = 'VIEW' OR D_TARGET = 'TABLE'),
    D_OP_TYPE VARCHAR(10) NOT NULL              -- 操作类型 INSERT | UPDATE | DELETE
        CHECK(D_OP_TYPE = 'INSERT' OR D_OP_TYPE = 'UPDATE' OR D_OP_TYPE = 'DELETE'),
    D_MODE VARCHAR(20) NOT NULL                 -- 操作位置 BEFORE | AFTER | INSTEAD_OF
        CHECK(D_MODE = 'BEFORE' OR D_MODE = 'AFTER' OR D_MODE = 'INSTEAD_OF'),
    D_STATEMENT CLOB NOT NULL,                  -- SQL或NON-SQL语句
    R_REF_ID VARCHAR(36) NOT NULL,             -- 关联table/view的identifier，非外键：S_META, S_VIEW
    PRIMARY KEY(K_ID)
);
-- SYS_TRIGGER索引创建
CREATE INDEX IDX_TRIGGER_REF_ID ON SYS_TRIGGER(R_REF_ID);
CREATE INDEX IDX_TRIGGER_NAME ON SYS_TRIGGER(D_NAME);
CREATE INDEX IDX_TRIGGER_CATEGORY ON SYS_TRIGGER(D_CATEGORY);
CREATE INDEX IDX_TRIGGER_TARGET ON SYS_TRIGGER(D_TARGET);
CREATE INDEX IDX_TRIGGER_OP_TYPE ON SYS_TRIGGER(D_OP_TYPE);
CREATE INDEX IDX_TRIGGER_MODE ON SYS_TRIGGER(D_MODE);

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
    K_ID VARCHAR(36),                           -- Script脚本的ID
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
