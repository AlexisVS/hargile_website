'use client';

import { useEffect } from 'react';

/**
 * FAQ accordion behaviour, applied to server-rendered markup.
 * Non-negotiables 1 & 2: the HTML resting state is ALL OPEN, so every answer
 * is visible without JS and stays in the DOM when collapsed (grid-template-rows
 * 1fr -> 0fr + overflow hidden). This island only collapses; it never mounts copy.
 */
export default function FaqAccordion() {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ease = 'grid-template-rows .45s cubic-bezier(.16,1,.3,1)';
    const cleanups = [];

    const set = (btn, panel, plus, open, animate) => {
      if (!animate) panel.style.transition = 'none';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.style.gridTemplateRows = open ? '1fr' : '0fr';
      plus.style.transform = open ? 'rotate(45deg)' : 'none';
      if (!animate) {
        requestAnimationFrame(() => {
          panel.style.transition = reduced ? 'none' : ease;
        });
      }
    };

    document.querySelectorAll('[data-accordion]').forEach((group) => {
      group.querySelectorAll('[data-faq]').forEach((item, i) => {
        const btn = item.querySelector('[data-faq-btn]');
        const panel = item.querySelector('[data-faq-panel]');
        const plus = item.querySelector('[data-plus]');
        if (!btn || !panel || !plus) return;
        set(btn, panel, plus, reduced || i === 0, false);
        const onClick = () => set(btn, panel, plus, btn.getAttribute('aria-expanded') !== 'true', true);
        btn.addEventListener('click', onClick);
        cleanups.push(() => btn.removeEventListener('click', onClick));
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
