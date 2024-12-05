"use client"
import { useEffect, useRef } from 'react'

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const setSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setSize()
    window.addEventListener('resize', setSize)

    // Particle system
    class Particle {
      canvas: HTMLCanvasElement
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.x = Math.random() * this.canvas.width
        this.y = Math.random() * this.canvas.height
        this.size = Math.random() * 3 + 1
        this.speedX = Math.random() * 2 - 1
        this.speedY = Math.random() * 2 - 1
        this.color = `rgba(255, 107, 0, ${Math.random() * 0.2})`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x > this.canvas.width) this.x = 0
        if (this.x < 0) this.x = this.canvas.width
        if (this.y > this.canvas.height) this.y = 0
        if (this.y < 0) this.y = this.canvas.height
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const particles: Particle[] = []
    for (let i = 0; i < 50; i++) {
      particles.push(new Particle(canvas))
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(249, 250, 251, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.update()
        particle.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-50"
    />
  )
}
