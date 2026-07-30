/* Inner-page hero shared by the M4 pages (/services, /services/*, /faq).
   Typographic poster: the type is the visual — no backdrop, no WebGL (the
   hero loader only covers / and /contact, nothing to coordinate with here).
   The `answer` paragraph is the page's 40-60 word self-contained answer and
   must remain the first content in the DOM: it is the extraction unit AI
   answer engines lift (docs/geo-plan.md, Phase 2 writing rules).

   No hooks on purpose — the entry reveal is pure CSS (same keyframe numbers
   as the homepage hero), so this stays usable from server components. */

import styles from "./inner-hero.module.scss";

const InnerHero = ({eyebrow, title, answer}) => (
    <section className={styles.hero}>
        <div className={styles.container}>
            <div className={styles.head}>
                <p className={styles.eyebrow}>{eyebrow}</p>
                <h1 className={styles.title}>{title}</h1>
            </div>
            <p className={styles.answer}>{answer}</p>
        </div>
    </section>
);

export default InnerHero;
