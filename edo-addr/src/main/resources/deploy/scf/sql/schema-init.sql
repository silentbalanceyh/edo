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