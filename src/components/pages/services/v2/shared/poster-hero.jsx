/* Poster hero for the two hub pages (/services, /faq).

   Layout comes from examplesPages/exports: a marker rule + eyebrow, then the
   headline alone across the full measure, then a two-column band where the
   40-60 word answer sits left and a hairline-separated aside sits right (the
   stat counters on /services, the group index on /faq). The service detail
   pages keep inner-hero.jsx — this is the wider, poster-scale sibling.

   The answer paragraph stays the first *content* in the DOM after the H1: it
   is the extraction unit AI answer engines lift (docs/geo-plan.md, Phase 2).

   No hooks on purpose — the entry reveal is pure CSS, so nothing here forces a
   client boundary and the SSR HTML never carries opacity: 0. */

import styles from "./poster-hero.module.scss";

const PosterHero = ({eyebrow, title, answer, aside}) => (
    <section className={styles.hero}>
        <div className={styles.container}>
            <div className={styles.marker}>
                <span className={styles.markerRule} aria-hidden="true"/>
                <p className={styles.eyebrow}>{eyebrow}</p>
            </div>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.body}>
                <p className={styles.answer}>{answer}</p>
                {aside ? <div className={styles.aside}>{aside}</div> : null}
            </div>
        </div>
    </section>
);

export default PosterHero;
