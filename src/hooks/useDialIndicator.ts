import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

type DialItemId = string | number;

interface UseDialIndicatorParams<ID extends DialItemId> {
  itemIds: ID[];
  selectedId?: ID;
  onSelect?: (id: ID) => void;
}

const INDICATOR_HALF_WIDTH = 13;
const SCROLL_SETTLE_MS = 120;

const getScreenCenter = (el: HTMLDivElement, scrollLeft: number) =>
  el.offsetLeft + el.offsetWidth / 2 - scrollLeft;

/**
 * 아바타 리스트를 다이얼처럼 스크롤할 때, 화면상 고정된 바늘(세모 인디케이터)
 * 아래로 지나가는 항목을 자동으로 포커스한다.
 * - 리스트는 snap-mandatory로 한 항목씩 딱딱 걸리며 스크롤된다.
 * - 리스트 끝부분처럼 스크롤이 바늘 위치까지 닿지 못하면, 바늘을 실제로 멈춘
 *   항목 쪽으로 옮긴다.
 */
export const useDialIndicator = <ID extends DialItemId>({
  itemIds,
  selectedId,
  onSelect,
}: UseDialIndicatorParams<ID>) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<ID, HTMLDivElement>());
  const selectedIdRef = useRef(selectedId);
  const pointerXRef = useRef<number | null>(null);
  const suppressSettleRef = useRef(false);

  const firstItemId = itemIds[0];

  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  const moveIndicatorTo = useCallback((centerX: number) => {
    if (!indicatorRef.current) return;
    indicatorRef.current.style.left = `${centerX - INDICATOR_HALF_WIDTH}px`;
  }, []);

  const findClosestToPointer = useCallback((container: HTMLDivElement) => {
    const pointerX = pointerXRef.current;
    if (pointerX === null) return null;

    let closestId: ID | null = null;
    let closestEl: HTMLDivElement | null = null;
    let minDistance = Infinity;

    for (const [id, el] of itemRefs.current) {
      const distance = Math.abs(
        getScreenCenter(el, container.scrollLeft) - pointerX,
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestId = id;
        closestEl = el;
      }
    }

    return closestId !== null && closestEl !== null
      ? { id: closestId, el: closestEl }
      : null;
  }, []);

  // 첫 항목의 중심을 바늘의 화면상 고정 위치로 삼는다.
  useLayoutEffect(() => {
    if (pointerXRef.current !== null) return;
    const target =
      firstItemId !== undefined ? itemRefs.current.get(firstItemId) : undefined;
    const container = scrollRef.current;
    if (!target || !container) return;

    const pointerX = target.offsetLeft + target.offsetWidth / 2;
    pointerXRef.current = pointerX;
    container.style.scrollPaddingLeft = `${pointerX - target.offsetWidth / 2}px`;

    moveIndicatorTo(pointerX);
    if (indicatorRef.current) indicatorRef.current.style.visibility = 'visible';
  }, [firstItemId, moveIndicatorTo]);

  const settleFocus = useCallback(() => {
    // 클릭으로 인한 스크롤은 handleSelect에서 이미 확정 처리했으므로
    // 여기서 바늘 최근접 탐색으로 다시 덮어쓰지 않는다.
    if (suppressSettleRef.current) {
      suppressSettleRef.current = false;
      return;
    }

    const container = scrollRef.current;
    if (!container) return;

    const closest = findClosestToPointer(container);
    if (!closest) return;

    if (closest.id !== selectedIdRef.current) {
      onSelect?.(closest.id);
    }
    moveIndicatorTo(getScreenCenter(closest.el, container.scrollLeft));
  }, [findClosestToPointer, moveIndicatorTo, onSelect]);

  // 스크롤 리스너 등록을 useEffect(커밋 이후 비동기 스케줄)가 아닌
  // useLayoutEffect(커밋 중 동기 실행)로 붙여야, 마운트 직후 곧바로 스크롤이
  // 발생해도 리스너가 이미 붙어있어 놓치지 않는다.
  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // scrollend를 지원하면 스냅이 실제로 멈춘 시점에 정확히 포커스를 갱신하고,
    // 미지원 브라우저는 debounce로 대체한다.
    if ('onscrollend' in window) {
      container.addEventListener('scrollend', settleFocus);
      return () => container.removeEventListener('scrollend', settleFocus);
    }

    let timeoutId: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(settleFocus, SCROLL_SETTLE_MS);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [settleFocus]);

  const registerItemRef = useCallback(
    (id: ID) => (el: HTMLDivElement | null) => {
      if (el) itemRefs.current.set(id, el);
      else itemRefs.current.delete(id);
    },
    [],
  );

  const handleSelect = useCallback(
    (id: ID) => {
      onSelect?.(id);

      const container = scrollRef.current;
      const target = itemRefs.current.get(id);
      const pointerX = pointerXRef.current;
      if (!container || !target || pointerX === null) return;

      // 리스트 끝부분처럼 바늘 위치까지 스크롤이 닿지 못하면 실제 도달 가능한
      // 위치로 미리 clamp해서, 세모도 그 실제 위치로 바로 옮겨준다.
      const desiredLeft = target.offsetLeft + target.offsetWidth / 2 - pointerX;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      const clampedLeft = Math.min(Math.max(desiredLeft, 0), maxScrollLeft);

      if (clampedLeft !== container.scrollLeft) {
        suppressSettleRef.current = true;
        container.scrollTo({ left: clampedLeft, behavior: 'smooth' });
      }

      moveIndicatorTo(getScreenCenter(target, clampedLeft));
    },
    [moveIndicatorTo, onSelect],
  );

  return { scrollRef, indicatorRef, registerItemRef, handleSelect };
};
