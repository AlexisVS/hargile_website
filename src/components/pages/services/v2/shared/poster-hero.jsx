/* Poster hero for all six M4 pages: the two hubs (/services, /faq) and the four
   service detail pages under /services/*.

   Layout comes from examplesPages/exports: a marker rule + eyebrow, then the
   headline alone across the full measure, then a two-column band where the
   40-60 word answer sits left and a hairline-separated aside sits right (the
   stat counters on /services, the group index on /faq; the detail pages ship
   without one for now).

   ⚠️ The six render the SAME copy geometry, and that is load-bearing rather
   than tidy: 100svh box, .tight top offset, var(--container-max) measure, 860px
   stack point, answer capped at 62ch. Every quiet zone and relief value in
   wave-grid-backdrop.jsx is tuned to exactly that geometry and shared by all
   six, so changing any of it here is a six-page re-export, not a style tweak.
   Differentiate pages by composition (the `backdrop` prop), never by geometry.
   See docs/service-detail-hero-plan.md, "The one hard constraint".

   `eyebrow` is optional and the whole marker row goes with it — the rule exists
   to lead into the label, so on its own it is a dash floating above the
   headline. Dropping it also drops the top padding a step (.tight): the marker
   was part of what held the headline down from the navbar, so keeping the
   original offset would leave the hero top-heavy with nothing in the gap.
   ⚠️ No page passes one today — /faq dropped its own to line up with /services,
   the detail pages dropped theirs with the same call. The prop is kept because
   that is a taste call of Mihai's that can flip, and because it is the branch
   that carries .tight, i.e. the shared geometry above, with it.

   The answer paragraph stays the first *content* in the DOM after the H1: it
   is the extraction unit AI answer engines lift (docs/geo-plan.md, Phase 2).

   No hooks on purpose — the entry reveal is pure CSS, so nothing here forces a
   client boundary and the SSR HTML never carries opacity: 0. `backdrop` takes
   an already-mounted node for the same reason: all six pages pass the wave
   grid, and neither the dynamic import nor the "use client" it needs lands in
   here. */

import styles from "./poster-hero.module.scss";

const PosterHero = ({eyebrow, title, answer, aside, backdrop}) => (
    <section className={`${styles.hero}${eyebrow ? "" : ` ${styles.tight}`}`}>
        {backdrop}
        <div className={styles.container}>
            {eyebrow ? (
                <div className={styles.marker}>
                    <span className={styles.markerRule} aria-hidden="true"/>
                    <p className={styles.eyebrow}>{eyebrow}</p>
                </div>
            ) : null}
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.body}>
                <p className={styles.answer}>{answer}</p>
                {aside ? <div className={styles.aside}>{aside}</div> : null}
            </div>
        </div>
    </section>
);

export default PosterHero;
