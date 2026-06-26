import Link from 'next/link';
import { useRouter } from 'next/router';
import type { JSX, MouseEvent, ReactNode } from 'react';
import { useLenisStore } from '@/shared/stores/lenis.store';

type PropsCustomLink = {
  to: string;
  children: ReactNode;
  className?: string;
  /** Extra side-effect to run on navigation (e.g. close the mobile menu). */
  onClick?: () => void;
  /** Forwarded to next/link — used for React Query prefetch on hover. */
  onMouseEnter?: () => void;
  /** Set false to opt out of Next.js route prefetching. */
  prefetch?: boolean;
};

/** Smooth-scroll to top, then navigate after the scroll settles. */
const SCROLL_DURATION = 0.6;
const NAVIGATE_DELAY = 400;

/**
 * Internal navigation link. Renders a real `next/link` (crawlable href, route
 * prefetch, new-tab / keyboard support) and adds a smooth Lenis scroll-to-top
 * before pushing the route on a plain left click.
 */
const CustomLink = ({
  to,
  children,
  className = '',
  onClick,
  onMouseEnter,
  prefetch,
}: PropsCustomLink): JSX.Element => {
  const router = useRouter();
  const lenis = useLenisStore(state => state.lenis);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Let the browser handle new-tab / modified / non-primary clicks natively.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    event.preventDefault();
    onClick?.();
    lenis?.scrollTo(0, { duration: SCROLL_DURATION });

    setTimeout(() => {
      router.push(to, undefined, { locale: router.locale });
    }, NAVIGATE_DELAY);
  };

  return (
    <Link
      href={to}
      locale={router.locale}
      prefetch={prefetch}
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </Link>
  );
};

export { CustomLink };
