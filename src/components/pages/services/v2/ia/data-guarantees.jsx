/* Where your data goes — the question that decides whether an SME integrates
   AI at all, answered on the page rather than only in the FAQ below it.

   Server Component, like the body it sits in: every string ships in the first
   HTML response, and it forfeits useReveal the way the rest of this page does.
   That is the choreography decision for /services/ia — the whole body is still,
   and one animated block in the middle of it would read as an accident. */

import {getTranslations} from "next-intl/server";
import section from "@/components/pages/homepage/v2/v2-section.module.scss";
import styles from "./data-guarantees.module.scss";

const ROWS = [
    {key: "flow", num: "01"},
    {key: "sensitive", num: "02"},
    {key: "reversible", num: "03"},
];

const DataGuarantees = async ({locale}) => {
    const t = await getTranslations({locale, namespace: "pages.services.detail.ia.data"});

    return (
        <div className={styles.block}>
            <h3 className={styles.title}>{t("title")}</h3>
            <div className={styles.rows}>
                {ROWS.map(({key, num}) => (
                    <div key={key} className={styles.row}>
                        <span
                            className={`${section.numLg} ${section.numOutline} ${styles.num}`}
                            aria-hidden="true"
                        >
                            {num}
                        </span>
                        <div className={styles.body}>
                            <h4 className={styles.rowTitle}>{t(`rows.${key}.title`)}</h4>
                            <p className={styles.rowText}>{t(`rows.${key}.text`)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataGuarantees;
