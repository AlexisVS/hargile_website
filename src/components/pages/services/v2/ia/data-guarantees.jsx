/* Where your data goes — the question that decides whether an SME integrates
   AI at all, answered on the page rather than only in the FAQ below it.

   Server Component, like the body it sits in: every string ships in the first
   HTML response, and it forfeits useReveal the way the rest of this page does.
   That is the choreography decision for /services/ia — the whole body is still,
   and one animated block in the middle of it would read as an accident. So the
   figure below has no draw-on, no hover, no reveal: it is finished the moment
   it paints.

   The figure is hand-written SVG rendered on the server. A charting library
   would draw in the browser, which would keep these labels out of the initial
   HTML and break the rule /services/seo makes a selling point of.

   What it draws is the three rows seen at once: a boundary, what crosses it,
   what does not, and the fact that the box on the right is a slot rather than a
   partner. The stroke that stays home is labelled "en priorité" on purpose —
   the copy says we *favour* solutions that keep sensitive data in-house, and a
   drawing that sealed it in would promise more than the sentence does.

   Two figures, one wide and one column, both in the markup with CSS choosing
   between them: an SVG <text> does not re-wrap, so a single drawing cannot
   survive both 1440px and 390px. The compact one drops the return leg — three
   crossings in a 320-unit column collide, and the return is the one element the
   three paragraphs never mention. */

import {getTranslations} from "next-intl/server";
import styles from "./data-guarantees.module.scss";

const ROWS = ["flow", "sensitive", "reversible"];

/* SVG text does not wrap, so labels that need two lines ship as arrays and each
   locale picks its own break — the FR strings run longer than the EN ones
   everywhere in this figure. */
const Label = ({value, x, y, dy, className, anchor}) => {
    const lines = Array.isArray(value) ? value : [value];
    return (
        <text className={className} x={x} y={y} textAnchor={anchor}>
            {lines.map((line, i) => (
                <tspan key={line} x={x} dy={i === 0 ? 0 : dy}>{line}</tspan>
            ))}
        </text>
    );
};

const DataGuarantees = async ({locale}) => {
    const t = await getTranslations({locale, namespace: "pages.services.detail.ia.data"});
    const s = (key) => t(`schema.${key}`);

    return (
        <div className={styles.block}>
            <h3 className={styles.title}>{t("title")}</h3>

            {/* aria-hidden: the three paragraphs below carry the whole argument
                in prose, so announcing the figure would read it out twice. The
                labels still ship in the HTML, which is what the crawlers read. */}
            <div className={styles.schema}>
                <svg
                    className={`${styles.fig} ${styles.figWide}`}
                    viewBox="0 0 1040 380"
                    aria-hidden="true"
                    focusable="false"
                >
                    <text className={styles.kicker} x="2" y="32">{s("zoneYou")}</text>
                    <text className={styles.kicker} x="752" y="70">{s("zoneProvider")}</text>

                    {/* Your side is drawn on three sides only — its fourth edge
                        is the boundary itself, so the zone and the line are one
                        object rather than two things near each other. */}
                    <path className={styles.zone} d="M600 44 H1 V344 H600"/>

                    {/* The boundary, broken exactly where a flow crosses it. */}
                    <line className={styles.boundary} x1="600" y1="44" x2="600" y2="100"/>
                    <line className={styles.boundary} x1="600" y1="124" x2="600" y2="168"/>
                    <line className={styles.boundary} x1="600" y1="192" x2="600" y2="344"/>
                    <text
                        className={`${styles.kicker} ${styles.kickerAccent}`}
                        x="600" y="368" textAnchor="middle"
                    >
                        {s("boundary")}
                    </text>

                    <rect className={styles.box} x="40" y="84" width="210" height="56"/>
                    <text className={styles.boxTitle} x="145" y="118" textAnchor="middle">{s("systems")}</text>

                    <rect className={styles.boxAccent} x="40" y="222" width="210" height="56"/>
                    <text className={styles.boxTitle} x="145" y="256" textAnchor="middle">{s("sensitive")}</text>

                    {/* What leaves. */}
                    <line className={styles.flow} x1="250" y1="112" x2="746" y2="112"/>
                    <path className={styles.headAccent} d="M752 112 l-11 -5.5 v11 z"/>
                    <text
                        className={`${styles.label} ${styles.labelAccent}`}
                        x="430" y="100" textAnchor="middle"
                    >
                        {s("out")}
                    </text>

                    {/* What comes back — under the boxes, then up into the
                        middle of the one it came from. A straight run would end
                        in the gap between the two boxes, pointing at nothing. */}
                    <path className={styles.flowDim} d="M752 180 H145 V152"/>
                    <path className={styles.headDim} d="M145 140 l-5.5 11 h11 z"/>
                    <text className={styles.label} x="430" y="202" textAnchor="middle">{s("back")}</text>

                    {/* What stays: the one stroke that reaches the boundary and
                        does not pass. The other two cross through gaps in the
                        line; this one meets it where it is unbroken, and the
                        boundary thickens to accent exactly there. That contrast
                        is the whole argument — the mark belongs on the line it
                        fails to cross, not floating short of it. */}
                    <line className={styles.flow} x1="250" y1="250" x2="594" y2="250"/>
                    <line className={styles.stop} x1="600" y1="228" x2="600" y2="272"/>
                    <text
                        className={`${styles.label} ${styles.labelBright}`}
                        x="400" y="238" textAnchor="middle"
                    >
                        {s("stays")}
                    </text>

                    <text className={styles.label} x="40" y="322">{s("code")}</text>

                    {/* The provider as a slot: dashed body, bracketed corners.
                        A logo would name a supplier; a slot says it is fitted.

                        It spans the same 84–278 band as the two boxes opposite,
                        so the two sides of the figure carry equal weight: your
                        side holds two named things, theirs holds one mount. */}
                    <rect className={styles.slot} x="752" y="84" width="278" height="194"/>
                    <path className={styles.tick} d="M752 98 V84 H766"/>
                    <path className={styles.tick} d="M1016 84 H1030 V98"/>
                    <path className={styles.tick} d="M752 264 V278 H766"/>
                    <path className={styles.tick} d="M1016 278 H1030 V264"/>
                    <text className={styles.boxTitle} x="891" y="175" textAnchor="middle">{s("slot")}</text>
                    <text className={styles.label} x="891" y="199" textAnchor="middle">{s("slotNote")}</text>
                </svg>

                {/* Not the wide figure squeezed — a different drawing of the
                    same object, stood on its end so the boundary is a rule the
                    eye crosses on its way down the page.

                    It carries two strokes where the wide one carries three. The
                    return leg and the note about owning the code are both gone:
                    at 320 units every stroke needs a label beside it, and those
                    two are the ones no paragraph below would miss. What is left
                    is the argument itself — one thing crosses, one thing meets
                    the line and stops. */}
                <svg
                    className={`${styles.fig} ${styles.figCompact}`}
                    viewBox="0 0 320 568"
                    aria-hidden="true"
                    focusable="false"
                >
                    <text className={styles.kicker} x="2" y="14">{s("zoneYou")}</text>

                    <path className={styles.zone} d="M2 312 V30 H318 V312"/>

                    <rect className={styles.box} x="64" y="52" width="192" height="50"/>
                    <text className={styles.boxTitle} x="160" y="84" textAnchor="middle">{s("systems")}</text>

                    <rect className={styles.boxAccent} x="64" y="142" width="192" height="50"/>
                    <text className={styles.boxTitle} x="160" y="174" textAnchor="middle">{s("sensitive")}</text>

                    {/* Out of the left edge, down the margin, across the
                        boundary through a gap in it, and it stops short of the
                        slot rather than touching it — an arrow resting on the
                        frame it points at reads as a collision. */}
                    <path className={styles.flow} d="M64 77 H34 V420 H160 V425"/>
                    <path className={styles.headAccent} d="M160 436 l-5.5 -11 h11 z"/>

                    {/* Straight down to the line, and no further. */}
                    <line className={styles.flow} x1="160" y1="192" x2="160" y2="298"/>
                    <Label
                        className={`${styles.label} ${styles.labelBright}`}
                        value={t.raw("schema.staysCompact")}
                        x="174" y="226" dy="20"
                    />

                    {/* The gap at 22–46 is where the flow crosses; the accent
                        run at 138–182 is where the other one does not. */}
                    <line className={styles.boundary} x1="2" y1="312" x2="22" y2="312"/>
                    <line className={styles.boundary} x1="46" y1="312" x2="318" y2="312"/>
                    <line className={styles.stop} x1="138" y1="312" x2="182" y2="312"/>
                    <text
                        className={`${styles.kicker} ${styles.kickerAccent}`}
                        x="318" y="336" textAnchor="end"
                    >
                        {s("boundaryCompact")}
                    </text>

                    <Label
                        className={`${styles.label} ${styles.labelAccent}`}
                        value={t.raw("schema.outCompact")}
                        x="46" y="368" dy="20"
                    />

                    <text className={styles.kicker} x="318" y="416" textAnchor="end">{s("zoneProvider")}</text>
                    <rect className={styles.slot} x="22" y="444" width="274" height="104"/>
                    <path className={styles.tick} d="M22 458 V444 H36"/>
                    <path className={styles.tick} d="M282 444 H296 V458"/>
                    <path className={styles.tick} d="M22 534 V548 H36"/>
                    <path className={styles.tick} d="M282 548 H296 V534"/>
                    <text className={styles.boxTitle} x="160" y="488" textAnchor="middle">{s("slot")}</text>
                    <text className={styles.label} x="160" y="512" textAnchor="middle">{s("swap")}</text>
                </svg>
            </div>

            {/* Three columns, no numerals. The three guarantees hold at the same
                time — nothing is done first or last — so numbering them would
                lend an order the content does not have. Same call, and the same
                reason, as the 01–04 dropped from web/deliverables.jsx. */}
            <div className={styles.cols}>
                {ROWS.map((key) => (
                    <div key={key} className={styles.col}>
                        <h4 className={styles.colTitle}>{t(`rows.${key}.title`)}</h4>
                        <p className={styles.colText}>{t(`rows.${key}.text`)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataGuarantees;
