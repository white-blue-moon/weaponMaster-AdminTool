-- 어드민 툴 유저 관리 테이블
DROP TABLE IF EXISTS admin_tool_user_info;
CREATE TABLE admin_tool_user_info (
    id                  INT AUTO_INCREMENT PRIMARY KEY COMMENT '기본 키 컬럼',
    user_id             VARCHAR(255)    NOT NULL COMMENT '유저 아이디',
    user_pw             VARCHAR(255)    NOT NULL COMMENT '유저 비밀번호',
    join_date           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '회원가입한 시간',
    last_login_date     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '가장 마지막 로그인 시간',
    UNIQUE (user_id)
) CHARSET=utf8 COMMENT='어드민 툴 유저 관리 테이블';

-- 어드민 툴 유저 로그 관리 테이블
DROP TABLE IF EXISTS admin_tool_user_log;
CREATE TABLE admin_tool_user_log (
    id              INT AUTO_INCREMENT PRIMARY KEY COMMENT 'row 고유 ID',
    user_id         VARCHAR(255)    NOT NULL COMMENT '유저 ID',
    contents_type   SMALLINT        NOT NULL COMMENT '컨텐츠 타입 (ex. 0: 어드민툴 시스템 자체, 1: Site Setting)',
    act_type   		SMALLINT        NOT NULL COMMENT '행동 타입 (ex. 1: 로그인, 2: 로그아웃, 3: 회원가입)',
    ref_value       SMALLINT        DEFAULT 0 COMMENT '참고 데이터',
    extra_ref_value SMALLINT        DEFAULT 0 COMMENT '추가 참고 데이터',
    create_date     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '로그 생성 날짜',
    update_date     TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '로그 수정 날짜'
) CHARSET=utf8mb4 COMMENT='어드민 툴 유저 로그 관리 테이블';
-- 어드민 툴 유저 로그 관리 테이블 인덱스 추가
CREATE INDEX idx_admin_tool_user_log_user_id        ON admin_tool_user_log(user_id);
CREATE INDEX idx_admin_tool_user_log_create_date    ON admin_tool_user_log(create_date);

-- 설정 예약 관리 테이블
DROP TABLE IF EXISTS site_setting_reserved;
CREATE TABLE site_setting_reserved (
    id                  INT AUTO_INCREMENT PRIMARY KEY COMMENT '기본 키 컬럼',
    settings_id         INT         NOT NULL COMMENT '홈페이지 설정값 대상 고유 아이디',
    reserved_date       TIMESTAMP   NOT NULL COMMENT '설정 ON 예약 날짜',
    reserved_state      TINYINT     NOT NULL DEFAULT 0 COMMENT '설정 ON 반영 상태 여부 (0: ON 반영 전, 1: ON 반영 완료)',
    create_date         TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '예약 생성 시간',
    update_date         TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '예약 최종 수정 시간',
    UNIQUE (settings_id) -- settings_id를 고유값으로 설정
) CHARSET=utf8 COMMENT='설정 예약 관리 테이블';

-- 홈페이지 점검 정보 관리 테이블
DROP TABLE IF EXISTS maintenance;
CREATE TABLE maintenance (
    id              INT AUTO_INCREMENT PRIMARY KEY COMMENT '기본 키 컬럼',
    active_state    TINYINT     NOT NULL DEFAULT 0 COMMENT '설정 ON 반영 상태 여부 (0: OFF, 1: ON)',
    comment         VARCHAR(255) COMMENT '점검 사유 등 내용 기재 (선택사항)',
    start_date      TIMESTAMP   NOT NULL COMMENT '점검 시작 시간',
    end_date        TIMESTAMP   NOT NULL COMMENT '점검 종료 시간',
    create_date     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '점검 정보 최초 생성 시간',
    update_date     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '점검 정보 최종 수정 시간'
) CHARSET=utf8 COMMENT='홈페이지 점검 정보 관리 테이블';
-- 홈페이지 점검 정보 관리 테이블 인덱스 추가
CREATE INDEX idx_maintenance_active_state_date ON maintenance (active_state, start_date, end_date);
