'use client';

import { useEffect } from 'react';

/**
 * Bento hover spotlight — sets --mx / --my on the hovered card.
 * Style the visible effect yourself, e.g.
 *   .hg-bento__spot { opacity: 0; transition: opacity .45s;
 *     background: radial-gradient(460px circle at var(--mx,50%) var(--my,50%), <accent 11%>, transparent 68%); }
 *   .hg-bento__card[data-hover="1"] .hg-bento__spot { opacity: 1 }
 * Renders nothing; disabled on touch and under prefers-reduced-motion.
 */
export default function BentoSpotlight() {
  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const cleanups = [];
    document.querySelectorAll('.hg-bento__card').forEach((card) => {
      const move = (e) => {
        const b = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - b.left}px`);
        card.style.setProperty('--my', `${e.clientY - b.top}px`);
      };
      const enter = () => card.setAttribute('data-hover', '1');
      const leave = () => card.removeAttribute('data-hover');
      card.addEventListener('pointermove', move);
      card.addEventListener('pointerenter', enter);
      card.addEventListener('pointerleave', leave);
      cleanups.push(() => {
        card.removeEventListener('pointermove', move);
        card.removeEventListener('pointerenter', enter);
        card.removeEventListener('pointerleave', leave);
        card.removeAttribute('data-hover');
      });
    });
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
