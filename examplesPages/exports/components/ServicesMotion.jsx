'use client';

import { useEffect } from 'react';

/**
 * Motion island for /services. Renders NOTHING: the page markup is server
 * rendered and fully visible without JS. This only subtracts (pushes
 * below-the-fold elements back) and then brings them forward.
 *
 * variant: 'spine' | 'pile' | 'velocity'
 */
export default function ServicesMotion({ variant = 'spine' }) {
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rows = Array.from(document.querySelectorAll('[data-row]'));
    const spine = document.querySelector('[data-spine]');
    const spineLabel = document.querySelector('[data-spine-label]');
    const strip = document.querySelector('[data-velocity]');
    const anchor = document.querySelector('[data-offers]') || document.body;

    let reveals = [];
    let counters = [];
    let raf = null;
    let safety = null;
    let active = 0;
    let lastTop = anchor.getBoundingClientRect().top;
    let vx = 0;
    let x = 0;

    const show = (el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      reveals = reveals.filter((n) => n !== el);
    };

    const runCount = (el) => {
      counters = counters.filter((n) => n !== el);
      const to = parseInt(el.dataset.to, 10);
      const t0 = performance.now();
      el.textContent = '0';
      const step = (t) => {
        const p = Math.min(1, (t - t0) / 900);
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = String(to);
      };
      requestAnimationFrame(step);
    };

    if (!reduced) {
      const vh0 = window.innerHeight;
      reveals = Array.from(document.querySelectorAll('[data-reveal]')).filter((el) => {
        if (el.getBoundingClientRect().top < vh0 * 0.9) return false; // already seen: leave alone
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        return true;
      });
      counters = Array.from(document.querySelectorAll('[data-count]'));
      safety = setTimeout(() => {
        reveals.slice().forEach((el) => {
          if (el.getBoundingClientRect().top < window.innerHeight * 1.5) show(el);
        });
      }, 2500);
    }

    const tick = () => {
      const vh = window.innerHeight;

      let next = 0;
      rows.forEach((r, i) => {
        if (r.getBoundingClientRect().top < vh * 0.55) next = i;
      });
      if (next !== active) {
        active = next;
        if (spine) spine.textContent = '0' + (active + 1);
        if (spineLabel) spineLabel.textContent = rows[active].dataset.label || '';
      }

      if (reduced) return;

      reveals.slice().forEach((el) => {
        if (el.getBoundingClientRect().top < vh * 0.88) show(el);
      });
      counters.slice().forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.top < vh * 0.9 && b.bottom > 0) runCount(el);
      });

      if (variant === 'pile') {
        rows.forEach((r, i) => {
          const b = r.getBoundingClientRect();
          const p = Math.max(0, Math.min(1, (vh * 0.92 - b.top) / (vh * 0.5)));
          const e = 1 - Math.pow(1 - p, 3);
          const lift = (1 - e) * (18 + i * 26);
          r.style.transform = `translate3d(0,${(-lift).toFixed(2)}px,0) scale(${(1 - (1 - e) * 0.035).toFixed(4)})`;
          r.style.opacity = String(0.35 + 0.65 * e);
          r.style.zIndex = String(10 - i);
        });
      }

      // Scroll delta from a rect, not window.scrollY: works with any scroller.
      const top = anchor.getBoundingClientRect().top;
      const delta = lastTop - top;
      lastTop = top;

      if (variant === 'velocity' && strip) {
        vx += delta * 1.15;
        x -= vx * 0.12;
        vx *= 0.86;
        const w = strip.scrollWidth / 2 || 1;
        if (x <= -w) x += w;
        if (x > 0) x -= w;
        strip.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
        if (Math.abs(vx) > 0.05) requestAnimationFrame(tick); // stops at rest: no ambient loop
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        tick();
      });
    };

    // capture:true so scrolls on any scroll container reach us
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Pointer spotlight + chevron nudge on the offer rows.
    const detach = rows.map((row) => {
      const spot = row.querySelector('[data-spot]');
      const chev = row.querySelector('[data-chev]');
      const move = (e) => {
        const b = row.getBoundingClientRect();
        row.style.setProperty('--mx', `${e.clientX - b.left}px`);
        row.style.setProperty('--my', `${e.clientY - b.top}px`);
      };
      const enter = () => {
        if (spot) spot.style.opacity = '1';
        if (chev && !reduced) chev.style.transform = 'translateX(8px)';
      };
      const leave = () => {
        if (spot) spot.style.opacity = '0';
        if (chev) chev.style.transform = 'none';
      };
      row.addEventListener('pointermove', move);
      row.addEventListener('pointerenter', enter);
      row.addEventListener('pointerleave', leave);
      return () => {
        row.removeEventListener('pointermove', move);
        row.removeEventListener('pointerenter', enter);
        row.removeEventListener('pointerleave', leave);
      };
    });

    tick();

    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (safety) clearTimeout(safety);
      detach.forEach((fn) => fn());
      reveals.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    };
  }, [variant]);

  return null;
}
