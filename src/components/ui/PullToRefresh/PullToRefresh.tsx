'use client';

import { useQueryClient } from '@tanstack/react-query';
import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';

import { cn } from '@/src/lib/helpers/cn';

const PULL_THRESHOLD = 70;
const MAX_PULL_DISTANCE = 100;
const PULL_DAMPING = 0.5;
const REFRESH_MIN_DURATION = 600;

interface PullToRefreshProps extends ComponentProps<'div'> {
  queryKeys: readonly (readonly unknown[])[];
  children: ReactNode;
}

const PullToRefresh = ({
  queryKeys,
  children,
  className,
  ...props
}: PullToRefreshProps) => {
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const queryKeysRef = useRef(queryKeys);

  const startYRef = useRef(0);
  const pullDistanceRef = useRef(0);
  const isPullingRef = useRef(false);

  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    queryKeysRef.current = queryKeys;
  }, [queryKeys]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updatePullDistance = (value: number) => {
      pullDistanceRef.current = value;
      setPullDistance(value);
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (window.scrollY > 0) return;
      startYRef.current = event.touches[0].clientY;
      isPullingRef.current = true;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isPullingRef.current) return;

      const diff = event.touches[0].clientY - startYRef.current;
      if (diff <= 0) {
        updatePullDistance(0);
        return;
      }

      event.preventDefault();
      updatePullDistance(Math.min(diff * PULL_DAMPING, MAX_PULL_DISTANCE));
    };

    const handleTouchEnd = () => {
      if (!isPullingRef.current) return;
      isPullingRef.current = false;

      if (pullDistanceRef.current < PULL_THRESHOLD) {
        updatePullDistance(0);
        return;
      }

      updatePullDistance(PULL_THRESHOLD);
      setIsRefreshing(true);

      const minDuration = new Promise((resolve) => {
        setTimeout(resolve, REFRESH_MIN_DURATION);
      });

      Promise.all([
        ...queryKeysRef.current.map((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        ),
        minDuration,
      ]).finally(() => {
        setIsRefreshing(false);
        updatePullDistance(0);
      });
    };

    container.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    container.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [queryClient]);

  return (
    <div ref={containerRef} className={className} {...props}>
      <div
        className="relative z-60 flex shrink-0 items-center justify-center overflow-hidden transition-[height] duration-200"
        style={{ height: pullDistance }}
      >
        <div
          className={cn(
            'h-6 w-6 rounded-full border-2 border-g-60 border-t-primary',
            isRefreshing && 'animate-spin',
          )}
          style={
            isRefreshing
              ? undefined
              : { transform: `rotate(${pullDistance * 3}deg)` }
          }
        />
      </div>
      {children}
    </div>
  );
};

export default PullToRefresh;
