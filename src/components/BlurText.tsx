import { motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'

type BlurTextProps = {
  text?: string
  delay?: number
  className?: string
  animateBy?: 'words' | 'letters'
  direction?: 'top' | 'bottom'
  onAnimationComplete?: () => void
  stepDuration?: number
}

function buildKeyframes(from: Record<string, string | number>, steps: Record<string, string | number>[]) {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((step) => Object.keys(step))])
  return Object.fromEntries([...keys].map((key) => [key, [from[key], ...steps.map((step) => step[key])]]))
}

export default function BlurText({
  text = '',
  delay = 120,
  className = '',
  animateBy = 'words',
  direction = 'top',
  onAnimationComplete,
  stepDuration = 0.35,
}: BlurTextProps) {
  const segments = useMemo(() => (animateBy === 'words' ? text.split(' ') : text.split('')), [animateBy, text])
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.unobserve(entry.target)
      }
    }, { threshold: 0.1 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const from = direction === 'top'
    ? { filter: 'blur(10px)', opacity: 0, y: -24 }
    : { filter: 'blur(10px)', opacity: 0, y: 24 }
  const steps = [
    { filter: 'blur(4px)', opacity: 0.5, y: direction === 'top' ? 3 : -3 },
    { filter: 'blur(0px)', opacity: 1, y: 0 },
  ]
  const animate = buildKeyframes(from, steps)

  return (
    <p ref={ref} className={className} style={{ display: 'flex', flexWrap: 'wrap' }}>
      {segments.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          className="inline-block will-change-[transform,filter,opacity]"
          initial={from}
          animate={inView ? animate : from}
          transition={{ duration: stepDuration * 2, delay: (index * delay) / 1000, ease: 'easeOut' }}
          onAnimationComplete={index === segments.length - 1 ? onAnimationComplete : undefined}
        >
          {segment}
          {animateBy === 'words' && index < segments.length - 1 ? '\u00A0' : null}
        </motion.span>
      ))}
    </p>
  )
}
