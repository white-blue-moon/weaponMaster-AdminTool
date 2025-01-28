-- TODO 어드민 툴 유저 관리 테이블

-- 설정 예약 관리 테이블
DROP TABLE IF EXISTS site_setting_reserved;
CREATE TABLE site_setting_reserved (
    id                  INT AUTO_INCREMENT PRIMARY KEY COMMENT '기본 키 컬럼',
    settings_id         INT         NOT NULL COMMENT '홈페이지 설정값 대상 고유 아이디',
    reserved_date       TIMESTAMP   NOT NULL COMMENT '설정 ON 예약 날짜',
    reserved_state      TINYINT     NOT NULL DEFAULT 0 COMMENT '설정 ON 반영 상태 여부 (0: ON 반영 전, 1: ON 반영 완료)',
    create_date         TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '예약 생성 시간',
    update_date         TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '예약 최종 수정 시간',
    UNIQUE (settings_id), -- settings_id를 고유값으로 설정
    FOREIGN KEY (settings_id) REFERENCES site_setting(id) ON DELETE CASCADE -- ON DELETE CASCADE: site_setting에서 해당 id가 삭제되면, 관련 예약도 함께 삭제
) CHARSET=utf8 COMMENT='설정 예약 관리 테이블';

-- 홈페이지 점검 정보 관리 테이블
DROP TABLE IF EXISTS inspection;
CREATE TABLE inspection (
    id              INT AUTO_INCREMENT PRIMARY KEY COMMENT '기본 키 컬럼',
    active_state    TINYINT     NOT NULL DEFAULT 0 COMMENT '설정 ON 반영 상태 여부 (0: OFF, 1: ON)',
    comment         VARCHAR(255) COMMENT '점검 사유 등 내용 기재 (선택사항)',
    start_date      TIMESTAMP   NOT NULL COMMENT '점검 시작 시간',
    end_date        TIMESTAMP   NOT NULL COMMENT '점검 종료 시간',
    create_date     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '점검 정보 최초 생성 시간',
    update_date     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '점검 정보 최종 수정 시간'
) CHARSET=utf8 COMMENT='홈페이지 점검 정보 관리 테이블';
-- 홈페이지 점검 정보 관리 테이블 인덱스 추가
CREATE INDEX idx_inspection_active_state_date ON inspection (active_state, start_date, end_date);
