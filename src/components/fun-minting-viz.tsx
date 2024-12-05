"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Coins } from 'lucide-react'

const generateData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    mints: Math.floor(Math.random() * 40) + 10,
  }))
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/10 p-4 shadow-xl backdrop-blur-md">
        <p className="mb-1 text-sm text-gray-600">{`Hour ${label}:00`}</p>
        <p className="text-lg font-semibold text-primary">
          {payload[0].value} NFTs Minted
        </p>
      </div>
    )
  }
  return null
}

const CustomizedDot = ({ cx, cy }: any) => {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      className="fill-primary stroke-white"
      strokeWidth={2}
    />
  )
}

export const FunMintingViz = () => {
  const [data, setData] = useState(generateData())
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData => {
        const newData = [...prevData.slice(1)]
        newData.push({
          hour: (prevData[prevData.length - 1].hour + 1) % 24,
          mints: Math.floor(Math.random() * 40) + 10,
        })
        return newData
      })
    }, 5000) // Slower update for smoother transitions

    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative h-[400px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-white/80 to-orange-50/30 p-6 shadow-lg"
    >
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,107,0,0.1),transparent)]" />
      
      {/* Subtle grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,107,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,107,0,0.05)_1px,transparent_1px)] bg-[size:4rem_2rem]" />

      <div className="relative h-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <defs>
              <linearGradient id="mintingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(255, 107, 0, 0.3)" />
                <stop offset="100%" stopColor="rgba(255, 107, 0, 0)" />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              stroke="rgba(255, 107, 0, 0.1)"
            />
            
            <XAxis 
              dataKey="hour"
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}:00`}
            />
            
            <YAxis 
              stroke="#94a3b8"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="mints"
              stroke="#ff6b00"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#mintingGradient)"
              dot={<CustomizedDot />}
              activeDot={{ 
                r: 6, 
                fill: "#ff6b00",
                stroke: "white",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Animated NFT indicator */}
        <AnimatePresence>
          {data.slice(-1)[0]?.mints > 30 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="absolute right-8 top-8 flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 backdrop-blur-md"
            >
              <Coins className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">High Minting Activity</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

