'use client'

import {Cell, Pie, PieChart} from 'recharts'
import {animate, motion, useMotionValue, useTransform} from 'motion/react'
import {useEffect, useState} from 'react'

const COLORS = ['#EF4444', '#F59E0B', '#22C55E'] // rouge, orange, vert

const data = [
    {name: 'Bad', value: 50},
    {name: 'Average', value: 40},
    {name: 'Good', value: 10},
]

const getScoreColor = (score) => {
    if (score >= 90) return COLORS[2]
    if (score >= 50) return COLORS[1]
    return COLORS[0]
}

const angleToX = (angle) => 100 + 70 * Math.cos(Math.PI - (angle * Math.PI) / 180)
const angleToY = (angle) => 100 - 70 * Math.sin(Math.PI - (angle * Math.PI) / 180)

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
            <div className="relative">
                <PieChart width={200} height={200}>
                    <Pie
                        data={data}
                        startAngle={180}
                        endAngle={0}
                        innerRadius={80}
                        outerRadius={86}
                        paddingAngle={3}
                        dataKey="value"
                        isAnimationActive={false}
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} stroke={COLORS[index]}/>
                        ))}
                    </Pie>
                </PieChart>

                <svg
                    width="200"
                    height="200"
                    className="absolute top-0 left-0"
                    style={{pointerEvents: 'none'}}
                >
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
            </div>

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
