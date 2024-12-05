"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Coins } from 'lucide-react'

const generateData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    mints: Math.floor(Math.random() * 40) + 10,
  }))
}

export const FunMintingViz = () => {
  const [data, setData] = useState(generateData())
  const [tokens, setTokens] = useState<number[]>([])
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Update graph data
    const updateInterval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)]
        newData.push({
          hour: (prevData[prevData.length - 1].hour + 1) % 24,
          mints: Math.floor(Math.random() * 40) + 10,
        })
        return newData
      })
    }, 3000)

    // Add floating tokens
    const tokenInterval = setInterval(() => {
      setTokens(prev => {
        const newTokens = [...prev, Date.now()]
        if (newTokens.length > 5) {
          return newTokens.slice(1)
        }
        return newTokens
      })
    }, 2000)

    return () => {
      clearInterval(updateInterval)
      clearInterval(tokenInterval)
    }
  }, [])

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-white to-orange-50/30 p-6 shadow-lg">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,107,0,0.1),transparent)]" />
      
      {/* Animated tokens */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <AnimatePresence>
          {tokens.map((id) => (
            <motion.div
              key={id}
              initial={{ y: 400, x: Math.random() * 80 + 10 + "%", opacity: 0, scale: 0 }}
              animate={{ 
                y: -20,
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0],
                rotate: [0, 360]
              }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ 
                duration: 4,
                ease: "easeOut"
              }}
              className="absolute"
            >
              <div className="relative flex items-center justify-center rounded-full bg-primary/10 p-2">
                <Coins className="h-6 w-6 text-primary" />
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/10"
                  animate={{
                    scale: [1, 1.5],
                    opacity: [0.5, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Area chart */}
      <div className="relative h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <defs>
              <linearGradient id="mintingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(255, 107, 0)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="rgb(255, 107, 0)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="hour"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              itemStyle={{ color: '#ff6b00' }}
              labelStyle={{ color: '#64748b' }}
            />
            <Area
              type="monotone"
              dataKey="mints"
              stroke="#ff6b00"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#mintingGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

