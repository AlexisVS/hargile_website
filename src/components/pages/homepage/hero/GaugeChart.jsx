'use client'

import {animate, motion, useMotionValue, useTransform} from 'motion/react'
import {useEffect, useState} from 'react'

const COLORS = ['#EF4444', '#F59E0B', '#22C55E'] // rouge, orange, vert

const getScoreColor = (score) => {
    if (score >= 90) return COLORS[2]
    if (score >= 50) return COLORS[1]
    return COLORS[0]
}

const angleToX = (angle) => 100 + 70 * Math.cos(Math.PI - (angle * Math.PI) / 180)
const angleToY = (angle) => 100 - 70 * Math.sin(Math.PI - (angle * Math.PI) / 180)

/* Cadran en arcs SVG — remplace le PieChart recharts (seul usage de recharts
   dans le projet, ~500 KB avec d3 pour trois arcs statiques). Même géométrie :
   demi-cercle 180°→0°, segments 50/40/10 séparés par 3° de padding, rayon
   médian 83 pour l'anneau inner 80 / outer 86 d'origine. Angles en convention
   recharts : 0° = est, croissant anti-horaire. */
const ARC_RADIUS = 83
const ARC_WIDTH = 6
const arcPoint = (angle) => {
    const rad = (angle * Math.PI) / 180
    return `${(100 + ARC_RADIUS * Math.cos(rad)).toFixed(2)} ${(100 - ARC_RADIUS * Math.sin(rad)).toFixed(2)}`
}
const arcPath = (from, to) =>
    `M ${arcPoint(from)} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${arcPoint(to)}`
const ARCS = [
    {d: arcPath(180, 93), color: COLORS[0]}, // Bad — 50 %
    {d: arcPath(90, 20.4), color: COLORS[1]}, // Average — 40 %
    {d: arcPath(17.4, 0), color: COLORS[2]}, // Good — 10 %
]

const GaugeChart = ({score = 0, label = 'Score'}) => {
    const motionScore = useMotionValue(0)
    const motionAngle = useMotionValue(0)
    const [displayedScore, setDisplayedScore] = useState(0)

    // Reactive SVG attributes — no setState per frame, no rerender during animation
    const needleX = useTransform(motionAngle, angleToX)
    const needleY = useTransform(motionAngle, angleToY)

    useEffect(() => {
        const scoreControls = animate(motionScore, score, {
            duration: 3,
            ease: 'easeOut',
            onUpdate: latest => setDisplayedScore(Math.round(latest)),
        })

        const angleControls = animate(motionAngle, (score / 100) * 180, {
            duration: 3,
            ease: 'easeOut',
        })

        return () => {
            scoreControls.stop()
            angleControls.stop()
        }
    }, [score, motionScore, motionAngle])

    const needleColor = getScoreColor(displayedScore)
    const scoreColor = displayedScore >= 90
        ? 'text-green-400'
        : displayedScore >= 50
            ? 'text-yellow-400'
            : 'text-red-500'

    return (
        <div className="flex flex-col items-center">
            <svg width="200" height="200">
                {ARCS.map((arc) => (
                    <path
                        key={arc.color}
                        d={arc.d}
                        stroke={arc.color}
                        strokeWidth={ARC_WIDTH}
                        fill="none"
                    />
                ))}

                <motion.line
                    x1="100"
                    y1="100"
                    x2={needleX}
                    y2={needleY}
                    stroke={needleColor}
                    strokeWidth="3"
                    strokeLinecap="round"
                />

                <circle cx="100" cy="100" r="4" fill={needleColor}/>
                <circle cx="100" cy="100" r="2" fill="#ffffff"/>
            </svg>

            <div className="mt-2 text-lg text-white font-semibold flex items-center space-x-2">
                <span>{label}:</span>
                <motion.span
                    className={`font-bold ${scoreColor}`}
                    initial={{scale: 1}}
                    animate={{
                        scale: [1, 1.2, 1],
                        transition: {duration: 0.5, ease: 'easeOut'},
                    }}
                    key={displayedScore}
                >
                    {displayedScore}%
                </motion.span>
            </div>
        </div>
    )
}

export default GaugeChart
