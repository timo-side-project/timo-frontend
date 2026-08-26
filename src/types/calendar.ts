/** 캘린더 날짜 셀의 표시 타입 (회고 카테고리 + 기록 없음) */
export type CalendarDayCategoryType =
  | 'past-negative'
  | 'past-positive'
  | 'present-hedonistic'
  | 'present-fatalistic'
  | 'future-oriented'
  | 'slate';

/** 날짜별 캘린더 표시 정보 ('yyyy-MM-dd' 키로 조회) */
export interface CalendarDayRecordByDateItem {
  categoryType: CalendarDayCategoryType;
  reflectionId: number;
}
