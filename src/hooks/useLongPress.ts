import { type PointerEvent, useCallback, useEffect, useRef } from 'react';

/** 롱프레스로 인정할 최소 누름 시간(ms) */
const DEFAULT_DELAY = 500;
/** 이 거리(px)를 넘겨 움직이면 스크롤·드래그로 보고 롱프레스를 취소한다 */
const MOVE_THRESHOLD = 10;

interface UseLongPressOptions {
  /** 눌린 요소를 함께 넘겨 메뉴 위치 계산 등에 쓸 수 있게 한다 */
  onLongPress: (target: HTMLElement) => void;
  delay?: number;
}

/**
 * 길게 누르기를 감지한다.
 * 스크롤 컨테이너 안에서도 쓸 수 있도록 일정 거리 이상 움직이면 취소하고,
 * 롱프레스가 발동한 뒤 이어지는 click은 무시한다.
 */
export const useLongPress = ({
  onLongPress,
  delay = DEFAULT_DELAY,
}: UseLongPressOptions) => {
  // 세 값 모두 렌더 결과에 영향을 주지 않으므로 ref로 둔다
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const isTriggeredRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current === null) return;

    clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  // 누르고 있는 도중 언마운트되면 타이머가 남으므로 정리한다
  useEffect(() => clearTimer, [clearTimer]);

  const handlePointerDown = (e: PointerEvent<HTMLElement>) => {
    isTriggeredRef.current = false;
    startPointRef.current = { x: e.clientX, y: e.clientY };
    // currentTarget은 이벤트 처리가 끝나면 비므로 지금 붙잡아 둔다
    const target = e.currentTarget;

    clearTimer();
    timerRef.current = setTimeout(() => {
      isTriggeredRef.current = true;
      onLongPress(target);
    }, delay);
  };

  const handlePointerMove = (e: PointerEvent) => {
    const startPoint = startPointRef.current;
    if (!startPoint || timerRef.current === null) return;

    // 누른 지점에서 멀어졌다면 롱프레스가 아니라 스크롤·드래그 의도로 본다
    const distance = Math.hypot(
      e.clientX - startPoint.x,
      e.clientY - startPoint.y,
    );
    if (distance > MOVE_THRESHOLD) clearTimer();
  };

  // 롱프레스 후 손을 떼면 click이 뒤따라 발생한다.
  // 버블링보다 먼저 도는 capture 단계에서 막아야 자식의 onClick까지 닿지 않는다.
  const handleClickCapture = (e: React.MouseEvent) => {
    if (!isTriggeredRef.current) return;

    e.preventDefault();
    e.stopPropagation();
    isTriggeredRef.current = false;
  };

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: clearTimer,
    onPointerCancel: clearTimer,
    onPointerLeave: clearTimer,
    onClickCapture: handleClickCapture,
    // 안드로이드 크롬에서 길게 누르면 뜨는 브라우저 기본 메뉴를 막는다
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  };
};
