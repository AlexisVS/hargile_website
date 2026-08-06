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

   What it draws: a boundary, what crosses it, what does not, and — the thing
   the first version got wrong — two mounts rather than one. That version put
   the model on the far side by construction and called the right-hand zone
   "AI provider", so the line read as separating your data from the model.
   True of a Claude or GPT integration; false of a classifier, a forecaster or
   a vision model we train, where the model sits inside the zone and there is
   nobody on the other side. It is also false of an open-weight LLM fine-tuned
   and served on the client's own hardware, which is the case that settles it:
   any figure keyed on model *type* has no cell for that, while one keyed on
   model *location* takes it without a redraw. So the two mounts are drawn
   identically, one on each side of the line, and where the model goes reads as
   the same kind of scoping decision as everything else in the drawing. The
   section is called "where does your data go" — location is its axis.

   The mounts are bracket corners over a near-invisible body, not the dashed
   rectangles the first version used. Standard DFD/STRIDE notation reserves
   dashes for trust boundaries (every other line solid), so a dashed box inside
   the zone reads to anyone who knows that notation as a second boundary nested
   in the first — the exact opposite of what the in-house mount means. We keep
   the boundary itself solid and bright, against the convention, because it is
   the subject and most of this page's readers are not reading a threat model.
   Brackets carry "a fitted slot" better than dashes did anyway.

   Two figures, one wide and one column, both in the markup with CSS choosing
   between them: an SVG <text> does not re-wrap, so a single drawing cannot
   survive both 1440px and 390px. The compact one drops the return leg and the
   note about owning the code — three crossings in a 320-unit column collide,
   and those are the two elements the three paragraphs never mention. */

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
                    viewBox="0 0 1040 400"
                    aria-hidden="true"
                    focusable="false"
                >
                    <text className={styles.kicker} x="2" y="32">{s("zoneYou")}</text>
                    <text className={styles.kicker} x="752" y="58">{s("zoneProvider")}</text>

                    {/* Your side is drawn on three sides only — its fourth edge
                        is the boundary itself, so the zone and the line are one
                        object rather than two things near each other. */}
                    <path className={styles.zone} d="M600 44 H1 V364 H600"/>

                    {/* The boundary, broken exactly where a flow crosses it:
                        gaps at 100–124 and 148–172, nowhere else. */}
                    <line className={styles.boundary} x1="600" y1="44" x2="600" y2="100"/>
                    <line className={styles.boundary} x1="600" y1="124" x2="600" y2="148"/>
                    <line className={styles.boundary} x1="600" y1="172" x2="600" y2="364"/>

                    {/* Accented along the full height of the in-house mount
                        facing it. The first version put this mark where a
                        stroke died against the line, which said "one flow was
                        turned back"; run the length of the mount instead it
                        says "this stretch is not crossed at all", which is the
                        actual claim once the model is on your side. */}
                    <line className={styles.closed} x1="600" y1="200" x2="600" y2="328"/>

                    <text
                        className={`${styles.kicker} ${styles.kickerAccent}`}
                        x="600" y="388" textAnchor="middle"
                    >
                        {s("boundary")}
                    </text>

                    <rect className={styles.box} x="30" y="84" width="190" height="56"/>
                    <text className={styles.boxTitle} x="125" y="118" textAnchor="middle">{s("systems")}</text>

                    <rect className={styles.boxAccent} x="30" y="226" width="190" height="56"/>
                    <text className={styles.boxTitle} x="125" y="260" textAnchor="middle">{s("sensitive")}</text>

                    {/* What crosses. Labelled with what leaves and under what
                        safeguard, which is the one annotation a residency
                        diagram is useless without. */}
                    <line className={styles.flow} x1="220" y1="112" x2="746" y2="112"/>
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
                    <path className={styles.flowDim} d="M752 160 H125 V152"/>
                    <path className={styles.headDim} d="M125 140 l-5.5 11 h11 z"/>
                    <text className={styles.label} x="430" y="182" textAnchor="middle">{s("back")}</text>

                    {/* What does not cross: a short run into the mount that is
                        already on this side. Nothing leaves that mount. */}
                    <line className={styles.flow} x1="220" y1="254" x2="294" y2="254"/>
                    <path className={styles.headAccent} d="M300 254 l-11 -5.5 v11 z"/>

                    {/* The in-house mount. Same body, same brackets, same size
                        as the one opposite — the only difference between them
                        is which side of the line they are on, which is the
                        whole argument. */}
                    <rect className={styles.mount} x="300" y="200" width="270" height="128"/>
                    <path className={styles.tick} d="M300 214 V200 H314"/>
                    <path className={styles.tick} d="M556 200 H570 V214"/>
                    <path className={styles.tick} d="M300 314 V328 H314"/>
                    <path className={styles.tick} d="M556 328 H570 V314"/>
                    <text className={styles.boxTitle} x="435" y="250" textAnchor="middle">{s("mountHome")}</text>
                    <text className={styles.label} x="435" y="274" textAnchor="middle">{s("mountHomeNote")}</text>
                    <text
                        className={`${styles.label} ${styles.labelBright}`}
                        x="435" y="296" textAnchor="middle"
                    >
                        {s("mountHomeStays")}
                    </text>

                    <rect className={styles.mount} x="752" y="72" width="278" height="128"/>
                    <path className={styles.tick} d="M752 86 V72 H766"/>
                    <path className={styles.tick} d="M1016 72 H1030 V86"/>
                    <path className={styles.tick} d="M752 186 V200 H766"/>
                    <path className={styles.tick} d="M1016 200 H1030 V186"/>
                    <text className={styles.boxTitle} x="891" y="130" textAnchor="middle">{s("mountMarket")}</text>
                    <text className={styles.label} x="891" y="154" textAnchor="middle">{s("mountMarketNote")}</text>

                    <text className={styles.label} x="30" y="348">{s("code")}</text>
                </svg>

                {/* Not the wide figure squeezed — a different drawing of the
                    same object, stood on its end so the boundary is a rule the
                    eye crosses on its way down the page. One mount above the
                    line, one below, and the single stroke that crosses runs
                    down the left margin because the in-zone mount now occupies
                    the width the old version routed through. */}
                <svg
                    className={`${styles.fig} ${styles.figCompact}`}
                    viewBox="0 0 320 556"
                    aria-hidden="true"
                    focusable="false"
                >
                    <text className={styles.kicker} x="2" y="14">{s("zoneYou")}</text>

                    <path className={styles.zone} d="M2 350 V30 H318 V350"/>

                    <rect className={styles.box} x="64" y="52" width="192" height="50"/>
                    <text className={styles.boxTitle} x="160" y="84" textAnchor="middle">{s("systems")}</text>

                    <rect className={styles.boxAccent} x="64" y="142" width="192" height="50"/>
                    <text className={styles.boxTitle} x="160" y="174" textAnchor="middle">{s("sensitive")}</text>

                    {/* Straight down into the mount that never leaves. */}
                    <line className={styles.flow} x1="160" y1="192" x2="160" y2="216"/>
                    <path className={styles.headAccent} d="M160 222 l-5.5 -11 h11 z"/>

                    <rect className={styles.mount} x="76" y="222" width="220" height="94"/>
                    <path className={styles.tick} d="M76 236 V222 H90"/>
                    <path className={styles.tick} d="M282 222 H296 V236"/>
                    <path className={styles.tick} d="M76 302 V316 H90"/>
                    <path className={styles.tick} d="M282 316 H296 V302"/>
                    <text className={styles.boxTitle} x="186" y="252" textAnchor="middle">{s("mountHome")}</text>
                    <Label
                        className={styles.label}
                        value={t.raw("schema.mountHomeNoteCompact")}
                        x="186" y="278" dy="18" anchor="middle"
                    />

                    {/* The gap at 22–46 is where the one crossing goes; the
                        accent run at 120–252 is the stretch under the in-zone
                        mount, which nothing approaches. */}
                    <line className={styles.boundary} x1="2" y1="350" x2="22" y2="350"/>
                    <line className={styles.boundary} x1="46" y1="350" x2="318" y2="350"/>
                    <line className={styles.closed} x1="120" y1="350" x2="252" y2="350"/>
                    <text
                        className={`${styles.kicker} ${styles.kickerAccent}`}
                        x="318" y="342" textAnchor="end"
                    >
                        {s("boundaryCompact")}
                    </text>

                    {/* Down the left margin, through the gap, then across and
                        down — stopping short of the mount rather than touching
                        it. An arrow resting on the frame it points at reads as
                        a collision. */}
                    <path className={styles.flow} d="M64 77 H34 V416 H159 V421"/>
                    <path className={styles.headAccent} d="M159 432 l-5.5 -11 h11 z"/>
                    <Label
                        className={`${styles.label} ${styles.labelAccent}`}
                        value={t.raw("schema.outCompact")}
                        x="318" y="372" dy="18" anchor="end"
                    />

                    <text className={styles.kicker} x="318" y="410" textAnchor="end">{s("zoneProvider")}</text>
                    <rect className={styles.mount} x="22" y="436" width="274" height="100"/>
                    <path className={styles.tick} d="M22 450 V436 H36"/>
                    <path className={styles.tick} d="M282 436 H296 V450"/>
                    <path className={styles.tick} d="M22 522 V536 H36"/>
                    <path className={styles.tick} d="M282 536 H296 V522"/>
                    <text className={styles.boxTitle} x="159" y="478" textAnchor="middle">{s("mountMarket")}</text>
                    <text className={styles.label} x="159" y="502" textAnchor="middle">{s("swap")}</text>
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
