import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './StaggeredMenu.css'

type MenuItem = {
  label: string
  ariaLabel: string
  link?: string
  onClick?: () => void
}

type SocialItem = { label: string; link: string }

type StaggeredMenuProps = {
  items: MenuItem[]
  socialItems?: SocialItem[]
  colors?: string[]
  accentColor?: string
}

export default function StaggeredMenu({
  items,
  socialItems = [],
  colors = ['#B497CF', '#5227FF'],
  accentColor = '#5227FF',
}: StaggeredMenuProps) {
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  const panelRef = useRef<HTMLElement>(null)
  const layersRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const iconRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    const panel = panelRef.current
    const layers = layersRef.current?.querySelectorAll('.sm-prelayer')
    if (!panel) return
    gsap.set([panel, ...(layers ? [...layers] : [])], { xPercent: 100, opacity: 1 })
    gsap.set(iconRef.current, { rotate: 0 })
  }, [])

  const closeMenu = useCallback(() => {
    if (!openRef.current || !panelRef.current) return
    openRef.current = false
    setOpen(false)
    timelineRef.current?.kill()
    const layers = layersRef.current?.querySelectorAll('.sm-prelayer')
    gsap.to([...(layers ? [...layers] : []), panelRef.current], {
      xPercent: 100,
      duration: 0.35,
      ease: 'power3.in',
      stagger: 0.04,
    })
    gsap.to(iconRef.current, { rotate: 0, duration: 0.35, ease: 'power3.out' })
    if (textRef.current) textRef.current.textContent = 'Menu'
  }, [])

  const openMenu = useCallback(() => {
    if (!panelRef.current) return
    openRef.current = true
    setOpen(true)
    const layers = layersRef.current?.querySelectorAll('.sm-prelayer')
    const itemLabels = panelRef.current.querySelectorAll('.sm-panel-itemLabel')
    const socialLinks = panelRef.current.querySelectorAll('.sm-socials-link')
    gsap.set(itemLabels, { yPercent: 140, rotate: 10 })
    gsap.set(socialLinks, { y: 18, opacity: 0 })
    timelineRef.current?.kill()
    const timeline = gsap.timeline()
    timeline.to(layers ? [...layers] : [], { xPercent: 0, duration: 0.5, ease: 'power4.out', stagger: 0.07 })
    timeline.to(panelRef.current, { xPercent: 0, duration: 0.65, ease: 'power4.out' }, '-=0.35')
    timeline.to(itemLabels, { yPercent: 0, rotate: 0, duration: 0.8, ease: 'power4.out', stagger: 0.09 }, '-=0.42')
    timeline.to(socialLinks, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', stagger: 0.07 }, '-=0.45')
    timelineRef.current = timeline
    gsap.to(iconRef.current, { rotate: 225, duration: 0.65, ease: 'power4.out' })
    if (textRef.current) textRef.current.textContent = 'Close'
  }, [])

  const toggleMenu = () => (openRef.current ? closeMenu() : openMenu())

  return (
    <div className="staggered-menu-wrapper" style={{ '--sm-accent': accentColor } as React.CSSProperties} data-open={open || undefined}>
      <div ref={layersRef} className="sm-prelayers" aria-hidden="true">
        {colors.slice(0, 3).map((color, index) => <div key={`${color}-${index}`} className="sm-prelayer" style={{ background: color }} />)}
      </div>
      <header className="staggered-menu-header" aria-label="Mobile navigation">
        <button ref={toggleRef} type="button" className="sm-toggle" aria-expanded={open} aria-controls="mobile-menu-panel" onClick={toggleMenu}>
          <span ref={textRef} className="sm-toggle-text">Menu</span>
          <span ref={iconRef} className="sm-icon" aria-hidden="true"><span className="sm-icon-line" /><span className="sm-icon-line sm-icon-line-v" /></span>
        </button>
      </header>
      <aside id="mobile-menu-panel" ref={panelRef} className="staggered-menu-panel" aria-hidden={!open}>
        <div className="sm-panel-inner">
          <ul className="sm-panel-list" role="list">
            {items.map((item, index) => (
              <li className="sm-panel-item-wrap" key={item.label}>
                <a
                  className="sm-panel-item"
                  href={item.link || '#'}
                  aria-label={item.ariaLabel}
                  onClick={(event) => {
                    if (item.onClick) {
                      event.preventDefault()
                      item.onClick()
                    }
                    closeMenu()
                  }}
                >
                  <span className="sm-panel-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="sm-panel-itemLabel">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          {socialItems.length > 0 && <div className="sm-socials"><div className="sm-socials-title">Follow CUPPA</div><div className="sm-socials-list">{socialItems.map((item) => <a key={item.label} className="sm-socials-link" href={item.link}>{item.label}</a>)}</div></div>}
        </div>
      </aside>
    </div>
  )
}
