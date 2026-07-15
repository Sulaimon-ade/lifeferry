import { useEffect, useRef, useState } from 'react';

/**
 * Reveals content once it scrolls into view (used for subtle fade-ins).
 *
 * threshold defaults to 0 so ANY pixel of the observed element intersecting
 * the viewport triggers the reveal. A higher threshold can leave content
 * permanently hidden when the observed element is taller than the viewport
 * (its intersection ratio can never reach the threshold). We also reveal
 * immediately when IntersectionObserver is unavailable or the user prefers
 * reduced motion, so content is never stuck invisible.
 */
export function useInView(threshold = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
