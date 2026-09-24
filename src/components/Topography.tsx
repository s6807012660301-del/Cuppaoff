import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import './Topography.css'

type TopographyProps = {
  lowColor?: string
  midColor?: string
  highColor?: string
  speed?: number
  morphAmount?: number
  bands?: number
  thickness?: number
  scale?: number
  glow?: number
  brightness?: number
  grain?: boolean
  grainIntensity?: number
  opacity?: number
  className?: string
}

function hexToRgb(hex: string) {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return match ? [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255] : [1, 1, 1]
}

const vertex = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

const fragment = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uSpeed;
uniform float uMorphAmount;
uniform float uBands;
uniform float uThickness;
uniform float uGlow;
uniform float uOpacity;
uniform float uBrightness;
uniform float uGrain;
uniform float uGrainIntensity;
uniform vec3 uLow;
uniform vec3 uMid;
uniform vec3 uHigh;
out vec4 fragColor;

float field(vec2 p) {
  float wave = sin(p.x * 5.0 + uTime * uSpeed) * 0.16 * uMorphAmount;
  wave += sin(p.y * 7.0 - uTime * uSpeed * 0.7) * 0.12 * uMorphAmount;
  wave += sin((p.x + p.y) * 9.0 + uTime * uSpeed * 0.45) * 0.08 * uMorphAmount;
  return clamp(0.5 + (p.y + wave) * 0.55, 0.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0);
  float elevation = field(p);
  float contour = abs(fract(elevation * uBands) - 0.5);
  float line = 1.0 - smoothstep(0.0, uThickness, contour);
  float halo = 1.0 - smoothstep(0.0, uGlow, contour);
  vec3 color = mix(uLow, uMid, smoothstep(0.15, 0.55, elevation));
  color = mix(color, uHigh, smoothstep(0.55, 0.95, elevation));
  float alpha = clamp(line + halo * 0.12, 0.0, 1.0) * uOpacity;
  color *= uBrightness;
  if (uGrain > 0.5) {
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + uTime) * 43758.5453);
    color += (grain - 0.5) * uGrainIntensity;
  }
  fragColor = vec4(clamp(color, 0.0, 1.0) * alpha, alpha);
}
`

export default function Topography({
  lowColor = '#5227FF',
  midColor = '#FF9FFC',
  highColor = '#FFFFFF',
  speed = 0.35,
  morphAmount = 5.6,
  bands = 7,
  thickness = 0.035,
  scale = 1,
  glow = 0.2,
  brightness = 0.6,
  grain = false,
  grainIntensity = 0.05,
  opacity = 0.32,
  className = '',
}: TopographyProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const renderer = new Renderer({ webgl: 2, alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 2) })
    const gl = renderer.gl
    gl.clearColor(0, 0, 0, 0)
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uResolution: { value: new Float32Array([1, 1]) }, uTime: { value: 0 }, uSpeed: { value: speed }, uMorphAmount: { value: morphAmount },
        uBands: { value: bands * scale }, uThickness: { value: thickness }, uGlow: { value: glow }, uOpacity: { value: opacity }, uBrightness: { value: brightness },
        uGrain: { value: grain ? 1 : 0 }, uGrainIntensity: { value: grainIntensity },
        uLow: { value: new Float32Array(hexToRgb(lowColor)) }, uMid: { value: new Float32Array(hexToRgb(midColor)) }, uHigh: { value: new Float32Array(hexToRgb(highColor)) },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
    const canvas = gl.canvas
    Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block' })
    container.appendChild(canvas)
    const resize = () => {
      const rect = container.getBoundingClientRect()
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height))
      program.uniforms.uResolution.value[0] = gl.drawingBufferWidth
      program.uniforms.uResolution.value[1] = gl.drawingBufferHeight
    }
    const observer = new ResizeObserver(resize)
    observer.observe(container)
    resize()
    let frame = 0
    const start = performance.now()
    const render = (now: number) => {
      program.uniforms.uTime.value = (now - start) * 0.001
      renderer.render({ scene: mesh })
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      if (canvas.parentNode === container) container.removeChild(canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [bands, brightness, grain, grainIntensity, glow, highColor, lowColor, midColor, morphAmount, opacity, scale, speed, thickness])

  return <div ref={containerRef} className={`topography-container ${className}`.trim()} aria-hidden="true" />
}