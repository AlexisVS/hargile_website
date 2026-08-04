"use client";

/* The chapter index in the /faq hero aside: three in-page anchors, titles only.
   Plain <a href="#..."> — same-page jumps, no router.

   No numeral and no row rules, on Mihai's call. Both were fighting the backdrop
   rather than the layout: the hero sits on the wave grid, and its lit mass falls
   exactly where the right-aligned numerals sat, so the one accent on the row was
   also the one thing with the least contrast behind it. The chapter numbers
   still exist — faq-groups.jsx runs them on the page body, where the background
   is flat and they read. FAQ_GROUPS keeps `num` for that reason. */

import {useTranslations} from "next-intl";
import {FAQ_GROUPS} from "./groups";
import styles from "./faq-index.module.scss";

const FaqIndex = () => {
    const t = useTranslations("pages.faq.groups");

    return (
        <nav className={styles.index}>
            <ul className={styles.list}>
                {FAQ_GROUPS.map(({key, id}) => (
                    <li key={key}>
                        <a href={`#${id}`} className={styles.link}>{t(key)}</a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default FaqIndex;
