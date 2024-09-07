import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'

const ConfettiEffect = ({ trigger, x, y }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (trigger) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // 定義粒子顏色
      const colors = ['#E49366', '#FFFFFF']

      // 粒子數量
      const particleCount = 100

      // 初始化粒子數組
      const particles = []

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: x, // 粒子的初始x座標
          y: y, // 粒子的初始y座標
          radius: Math.random() * 4 + 1, // 粒子的初始半徑
          color: colors[Math.floor(Math.random() * colors.length)], // 粒子的顏色
          speed: Math.random() * 2 + 1, // 粒子的速度
          angle: Math.random() * Math.PI * 2, // 粒子的移動角度
        })
      }

      // 繪製和更新粒子的位置和狀態
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        particles.forEach((p) => {
          // 更新粒子位置
          p.x += Math.cos(p.angle) * p.speed
          p.y += Math.sin(p.angle) * p.speed

          // 逐漸縮小粒子的半徑以模擬消失
          p.radius *= 0.92

          // 繪製粒子
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.fill()
        })

        // 移除半徑過小的粒子
        particles.forEach((p, i) => {
          if (p.radius < 0.5) {
            particles.splice(i, 1)
          }
        })

        // 如果仍有粒子存在，繼續繪製下一幀
        if (particles.length > 0) {
          requestAnimationFrame(draw)
        }
      }

      draw()
    }
  }, [trigger, x, y])

  return ReactDOM.createPortal(
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    ></canvas>,
    document.body
  )
}

export default ConfettiEffect
