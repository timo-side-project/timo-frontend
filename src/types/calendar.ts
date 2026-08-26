/** 캘린더 날짜 셀의 표시 타입 (회고 카테고리 + 기록 없음) */
export type CalendarDayCategoryType =
  | 'past-negative'
  | 'past-positive'
  | 'present-hedonistic'
  | 'present-fatalistic'
  | 'future-oriented'
  | 'slate';

/** 날짜별 캘린더 표시 정보 ('yyyy-MM-dd' 키로 조회) */
export interface CalendarDayMark {
  categoryType: CalendarDayCategoryType;
  /** 비공개 회고처럼 표시는 하되 선택할 수 없는 날짜 */
  isDisabled?: boolean;
}

/** 마크가 없는 날짜를 그리는 방식 (기본: 회색 배경 표시) */
export type CalendarEmptyDayVariant = 'slate' | 'none';
