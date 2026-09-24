import { useEffect, useRef } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'
import './Grainient.css'

type GrainientProps = {
  color1?: string
  color2?: string
  color3?: string
  timeSpeed?: number
  grainAmount?: number
  contrast?: number
  saturation?: number
  zoom?: number
  className?: string
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255] : [1, 1, 1]
}

const vertex = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uGrainAmount;
uniform float uContrast;
uniform float uSaturation;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  vec2 p = (uv - 0.5) / max(uZoom, 0.01);
  float wave = sin(p.y * 5.0 + iTime * uTimeSpeed * 2.0) * 0.08;
  float blend = clamp(p.x + p.y * 0.35 + wave + 0.5, 0.0, 1.0);
  vec3 color = mix(uColor3, uColor2, smoothstep(0.0, 0.55, blend));
  color = mix(color, uColor1, smoothstep(0.45, 1.0, blend));
  float grain = noise(uv * 2.0 + iTime * 0.02);
  color += (grain - 0.5) * uGrainAmount;
  color = (color - 0.5) * uContrast + 0.5;
  float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(luminance), color, uSaturation);
  fragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`

export default function Grainient({
  color1 = '#FF9FFC',
  color2 = '#5227FF',
  color3 = '#B497CF',
  timeSpeed = 0.25,
  grainAmount = 0.1,
  contrast = 1.2,
  saturation = 1,
  zoom = 0.9,
  className = '',
}: GrainientProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const renderer = new Renderer({ webgl: 2, alpha: true, antialias: false, dpr: Math.min(window.devicePixelRatio || 1, 2) })
    const gl = renderer.gl
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 }, iResolution: { value: new Float32Array([1, 1]) }, uTimeSpeed: { value: timeSpeed },
        uGrainAmount: { value: grainAmount }, uContrast: { value: contrast }, uSaturation: { value: saturation }, uZoom: { value: zoom },
        uColor1: { value: new Float32Array(hexToRgb(color1)) }, uColor2: { value: new Float32Array(hexToRgb(color2)) }, uColor3: { value: new Float32Array(hexToRgb(color3)) },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })
    const canvas = gl.canvas
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    container.appendChild(canvas)

    const resize = () => {
      const rect = container.getBoundingClientRect()
      renderer.setSize(Math.max(1, rect.width), Math.max(1, rect.height))
      program.uniforms.iResolution.value[0] = gl.drawingBufferWidth
      program.uniforms.iResolution.value[1] = gl.drawingBufferHeight
    }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)
    resize()

    let frame = 0
    const start = performance.now()
    const render = (now: number) => {
      program.uniforms.iTime.value = (now - start) * 0.001
      renderer.render({ scene: mesh })
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      if (canvas.parentNode === container) container.removeChild(canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [color1, color2, color3, contrast, grainAmount, saturation, timeSpeed, zoom])

  return <div ref={containerRef} className={`grainient-container ${className}`.trim()} aria-hidden="true" />
}