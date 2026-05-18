'use client'

import {Cell, Pie, PieChart} from 'recharts'
import {animate, motion, useMotionValue} from 'motion/react'
import {useEffect, useRef, useState} from 'react'

const GaugeChart = ({score = 0, label = 'Score'}) => {
    const COLORS = ['#EF4444', '#F59E0B', '#22C55E'] // rouge, orange, vert
    const motionScore = useMotionValue(0)
    const [displayedScore, setDisplayedScore] = useState(0)
    const [needleAngle, setNeedleAngle] = useState(0)
    const lastAngleRef = useRef(0)

    // Déterminer la couleur en fonction du score
    const getScoreColor = (score) => {
        if (score >= 90) return COLORS[2] // vert
        if (score >= 50) return COLORS[1] // orange
        return COLORS[0] // rouge
    }

    const needleColor = getScoreColor(displayedScore)

    useEffect(() => {
        const scoreControls = animate(motionScore, score, {
            duration: 3,
            easing: 'easeOut',
            onUpdate: latest => setDisplayedScore(Math.round(latest)),
        })

        const startAngle = lastAngleRef.current
        const targetAngle = (score / 100) * 180

        let startTime = null
        const duration = 3000 // 3 secondes
        let rafId = null

        const animateNeedle = (timestamp) => {
            if (!startTime) startTime = timestamp
            const elapsed = timestamp - startTime
            const progress = Math.min(elapsed / duration, 1)

            const easeProgress = 1 - (1 - progress) * (1 - progress)

            const currentAngle = startAngle + (targetAngle - startAngle) * easeProgress
            lastAngleRef.current = currentAngle
            setNeedleAngle(currentAngle)

            if (progress < 1) {
                rafId = requestAnimationFrame(animateNeedle)
            }
        }

        rafId = requestAnimationFrame(animateNeedle)

        return () => {
            scoreControls.stop()
            if (rafId) cancelAnimationFrame(rafId)
        }
    }, [score, motionScore])

    const scoreColor = displayedScore >= 90
        ? 'text-green-400'
        : displayedScore >= 50
            ? 'text-yellow-400'
            : 'text-red-500'

    const data = [
        {name: 'Bad', value: 50},
        {name: 'Average', value: 40},
        {name: 'Good', value: 10},
    ]

    const calculateNeedleEnd = () => {
        const radian = (Math.PI - (needleAngle * Math.PI) / 180)
        return {
            x: 100 + 70 * Math.cos(radian),
            y: 100 - 70 * Math.sin(radian)
        }
    }

    const needleEnd = calculateNeedleEnd()

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
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} stroke={COLORS[index]} />
                        ))}
                    </Pie>
                </PieChart>

                <svg
                    width="200"
                    height="200"
                    className="absolute top-0 left-0"
                    style={{ pointerEvents: 'none' }}
                >
                    <line
                        x1="100"
                        y1="100"
                        x2={needleEnd.x}
                        y2={needleEnd.y}
                        stroke={needleColor}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />

                    <circle cx="100" cy="100" r="4" fill={needleColor} />

                    <circle cx="100" cy="100" r="2" fill="#ffffff" />
                </svg>
            </div>

            <div className="mt-2 text-lg text-white font-semibold flex items-center space-x-2">
                <span>{label}:</span>
                <motion.span
                    className={`font-bold ${scoreColor}`}
                    initial={{ scale: 1 }}
                    animate={{
                        scale: [1, 1.2, 1],
                        transition: { duration: 0.5, ease: "easeOut" }
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
