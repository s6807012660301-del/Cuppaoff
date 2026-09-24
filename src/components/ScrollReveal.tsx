import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ScrollReveal.css'

gsap.registerPlugin(ScrollTrigger)

type ScrollRevealProps = {
  children: ReactNode
  scrollContainerRef?: React.RefObject<HTMLElement | null>
  enableBlur?: boolean
  baseOpacity?: number
  baseRotation?: number
  blurStrength?: number
  containerClassName?: string
  textClassName?: string
  rotationEnd?: string
  wordAnimationEnd?: string
}

export default function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLHeadingElement>(null)
  const splitText = useMemo(() => {
    if (typeof children !== 'string') return children
    return children.split(/(\s+)/).map((word, index) =>
      /^\s+$/.test(word) ? word : <span className="word" key={index}>{word}</span>,
    )
  }, [children])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scroller = scrollContainerRef?.current ?? window
    const context = gsap.context(() => {
      gsap.fromTo(
        container,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: { trigger: container, scroller, start: 'top bottom', end: rotationEnd, scrub: true },
        },
      )

      const words = container.querySelectorAll<HTMLElement>('.word')
      if (!words.length) return

      const trigger = { trigger: container, scroller, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true }
      gsap.fromTo(words, { opacity: baseOpacity, willChange: 'opacity' }, { ease: 'none', opacity: 1, stagger: 0.05, scrollTrigger: trigger })

      if (enableBlur) {
        gsap.fromTo(words, { filter: `blur(${blurStrength}px)` }, { ease: 'none', filter: 'blur(0px)', stagger: 0.05, scrollTrigger: trigger })
      }
    }, container)

    return () => context.revert()
  }, [baseOpacity, baseRotation, blurStrength, enableBlur, rotationEnd, scrollContainerRef, wordAnimationEnd])

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <span className={`scroll-reveal-text ${textClassName}`}>{splitText}</span>
    </h2>
  )
}