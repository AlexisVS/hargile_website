"use client";

/* The chapter index in the /faq hero aside: three in-page anchors, title left,
   numeral right. Plain <a href="#..."> — same-page jumps, no router. */

import {useTranslations} from "next-intl";
import {FAQ_GROUPS} from "./groups";
import styles from "./faq-index.module.scss";

const FaqIndex = () => {
    const t = useTranslations("pages.faq.groups");

    return (
        <nav className={styles.index}>
            <ul className={styles.list}>
                {FAQ_GROUPS.map(({key, id, num}) => (
                    <li key={key}>
                        <a href={`#${id}`} className={styles.link}>
                            <span>{t(key)}</span>
                            <span className={styles.num} aria-hidden="true">{num}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default FaqIndex;
