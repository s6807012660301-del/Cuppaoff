import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollReveal from './components/ScrollReveal'
import SpecularButton from './components/SpecularButton'
import Grainient from './components/Grainient'
import Topography from './components/Topography'
import BlurText from './components/BlurText'
import StaggeredMenu from './components/StaggeredMenu'
import flavorsExpandImage from './imports/flavorversion.jpg'
import brandLogo from './imports/Brand logo22.png'
import cupWithBiteImage from './imports/cuppawithbite.jpg'
import originalFlavorImage from './imports/originalflavor.png'
import strawberryFlavorImage from './imports/strawberryflavor.jpg'
import oatFlavorImage from './imports/oatflavor.jpg'
import matchaFlavorImage from './imports/matchaFlavor.jpg'
import chocolateFlavorImage from './imports/chocoflavor.jpg'

gsap.registerPlugin(ScrollTrigger)

function scrollToSection(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
}

function IntroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#5227FF] text-white">
      <Grainient color1="#FF9FFC" color2="#5227FF" color3="#B497CF" timeSpeed={0.25} grainAmount={0.08} contrast={1.25} zoom={0.9} />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-24 text-center">
        <div className="max-w-3xl">
          <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-white/75">Meet Cuppa</p>
          <h1 className="font-display text-5xl font-black leading-[1.02] md:text-7xl">
            Coffee, then the cup.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
            Cuppa makes delicious edible coffee cups, so your morning ritual leaves nothing behind.
          </p>
          <SpecularButton
            className="mt-9"
            baseColor="#5227FF"
            lineColor="#FFFFFF"
            tint="#FFFFFF"
            tintOpacity={0.16}
            textColor="#FFFFFF"
            autoAnimate
            onClick={() => scrollToSection('#home')}
          >
            Discover Cuppa
          </SpecularButton>
        </div>
      </div>
    </section>
  )
}

// ─── Scroll reveal hook ───────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const context = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.reveal').forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0.1, rotate: 3, filter: 'blur(4px)' },
          {
            opacity: 1,
            rotate: 0,
            filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: {
              trigger: element,
              start: 'top bottom-=15%',
              end: 'bottom bottom',
              scrub: true,
            },
          },
        )
      })
    })
    return () => context.revert()
  }, [])
}

// ─── Counter hook ─────────────────────────────────────────────────────────────
function useCounter(target: number, duration = 2000, trigger: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [trigger, target, duration])
  return count
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#5227FF]/85 backdrop-blur-xl shadow-lg shadow-[#5227FF]/20' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img src={brandLogo} alt="Cuppa" className="h-10 w-28 object-contain" />
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#FFFFFF]/85">
            <a href="#story" className="hover:text-[#FF9FFC] transition-colors">Our Story</a>
            <a href="#faq" className="hover:text-[#FF9FFC] transition-colors">FAQ</a>
          <a href="#roadmap" className="hover:text-[#FF9FFC] transition-colors">Roadmap</a>
          <a href="#sustainability" className="hover:text-[#FF9FFC] transition-colors">Impact</a>
          <SpecularButton size="sm" radius={999} baseColor="#5227FF" lineColor="#FF9FFC" tint="#5227FF" tintOpacity={1} textColor="#FFFFFF" autoAnimate onClick={() => scrollToSection('#waitlist')}>
            Join Waitlist
          </SpecularButton>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('open-contact-modal'))}
            className="rounded-full border border-[#FF9FFC]/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-[#FF9FFC] hover:text-[#5227FF]"
          >
            Contact
          </button>
        </div>
      </div>
      </nav>
      <div className="md:hidden">
        <StaggeredMenu
          colors={['#FF9FFC', '#B497CF', '#5227FF']}
          accentColor="#FF9FFC"
          items={[
            { label: 'Our Story', ariaLabel: 'Read our story', link: '#story' },
            { label: 'FAQ', ariaLabel: 'Read frequently asked questions', link: '#faq' },
            { label: 'Roadmap', ariaLabel: 'View the Cuppa roadmap', link: '#roadmap' },
            { label: 'Impact', ariaLabel: 'See our sustainability impact', link: '#sustainability' },
            { label: 'Join Waitlist', ariaLabel: 'Join the Cuppa waitlist', link: '#waitlist' },
            { label: 'Contact', ariaLabel: 'Contact Cuppa', onClick: () => window.dispatchEvent(new Event('open-contact-modal')) },
          ]}
        />
      </div>
    </>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 animate-gradient"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, #FF9FFC 35%, #FFFFFF 65%, #5227FF 100%)',
        }}
      />

      {/* Blob decorations */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 bg-[#FF9FFC]/30 animate-blob"
        style={{ filter: 'blur(40px)' }}
      />
      <div
        className="absolute bottom-0 -left-20 w-80 h-80 bg-[#5227FF]/20 animate-blob blob-2"
        style={{ filter: 'blur(50px)', animationDelay: '4s' }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center">
        {/* Left: copy */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#5227FF]/8 text-[#5227FF] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            🌿 Zero Waste · 100% Edible
          </div>
          <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-[1.05] text-[#5227FF] mb-6">
            The cup you don't throw away —{' '}
            <em className="not-italic text-white">you eat it.</em>
          </h1>
          <p className="text-[#5227FF]/70 text-lg leading-relaxed mb-8 max-w-md">
            Cuppa makes ready-to-enjoy edible coffee cups from wholesome ingredients. Choose your flavor, enjoy your coffee, and eat the cup when you're done.
          </p>
          <div className="flex flex-wrap gap-4">
            <SpecularButton baseColor="#FF9FFC" lineColor="#FFFFFF" tint="#5227FF" tintOpacity={1} textColor="#f4f4f5" autoAnimate onClick={() => scrollToSection('#waitlist')}>
              Join the Movement
            </SpecularButton>
          </div>
        </div>

        {/* Right: product image + steam animation */}
        <div className="relative flex justify-center">
          <div className="relative animate-float">
            {/* Blob shape behind image */}
            <div
              className="absolute inset-0 bg-[#FF9FFC]/25 blob-1 animate-blob"
              style={{ transform: 'scale(1.15)' }}
            />
            <img
              src={originalFlavorImage}
              alt="Coffee in an edible waffle cup"
              className="relative z-10 w-80 h-96 object-cover rounded-[2rem] shadow-2xl"
            />
            {/* Steam SVG */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
              <svg width="16" height="50" viewBox="0 0 16 50" fill="none" className="steam opacity-60">
                <path d="M8 48 Q12 36 6 24 Q0 12 8 2" stroke="#FF9FFC" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
              </svg>
              <svg width="16" height="50" viewBox="0 0 16 50" fill="none" className="steam-2 opacity-50">
                <path d="M8 48 Q4 36 10 24 Q16 12 8 2" stroke="#FF9FFC" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
              <svg width="16" height="50" viewBox="0 0 16 50" fill="none" className="steam-3 opacity-40">
                <path d="M8 48 Q12 36 5 24 Q-2 12 8 2" stroke="#5227FF" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            {/* Badge */}
            <div className="absolute -bottom-4 -right-4 bg-[#FF9FFC] text-[#5227FF] font-black text-sm px-4 py-2 rounded-full shadow-lg z-20 rotate-3">
              Eat the cup! 🍪
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#5227FF]/40 text-xs font-semibold uppercase tracking-widest animate-float">
        <span>Scroll</span>
        <svg width="16" height="24" viewBox="0 0 16 24"><path d="M8 2v20M2 16l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
      </div>
    </section>
  )
}

// ─── Problem ──────────────────────────────────────────────────────────────────
function ProblemSection() {
  return (
    <section className="py-24 bg-[#5227FF] text-[#FFFFFF] relative overflow-hidden">
      {/* Grain texture overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="reveal text-center mb-16">
          <ScrollReveal
            baseOpacity={0.1}
            enableBlur
            baseRotation={3}
            blurStrength={4}
            containerClassName="mb-4"
            textClassName="font-display font-black text-4xl md:text-5xl"
          >
            The disposable cup crisis
          </ScrollReveal>
          <p className="text-[#FFFFFF]/70 text-lg max-w-xl mx-auto">
            Every morning, billions of cups get tossed. And they don't go anywhere.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            { stat: '16B+', label: 'Disposable cups used in the US every year', color: '#FF9FFC' },
            { stat: '99%', label: 'Of paper cups end up in landfills, not recycling', color: '#FFFFFF' },
            { stat: '450 yrs', label: 'For a plastic-lined coffee cup to decompose', color: '#FF9FFC' },
          ].map((item, i) => (
            <div key={i} className="reveal text-center p-8 rounded-3xl bg-white/5 border border-white/10">
              <div className="font-display font-black text-5xl md:text-6xl mb-3" style={{ color: item.color }}>
                {item.stat}
              </div>
              <p className="text-[#FFFFFF]/75 text-base leading-relaxed">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="reveal grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="font-display font-bold text-2xl md:text-3xl mb-4">
              Most "paper" cups aren't recyclable.
            </h3>
            <p className="text-[#FFFFFF]/70 leading-relaxed mb-4">
              The plastic lining that keeps your coffee hot also makes the cup non-recyclable. Every day, consumers are unknowingly contributing to a waste stream with no exit — until now.
            </p>
            <p className="text-[#FFFFFF]/70 leading-relaxed">
              Cuppa's edible cups sidestep the problem entirely. There's nothing to throw away because <strong className="text-[#FF9FFC]">you eat the cup.</strong>
            </p>
          </div>
          <div className="relative rounded-3xl overflow-hidden bg-[#5227FF]">
            <img
              src="https://images.unsplash.com/photo-1761335831408-c8c3e16c2c1d?w=600&h=400&fit=crop&auto=format"
              alt="Disposable coffee cup next to cookies — the contrast Cuppa solves"
              className="w-full h-64 object-cover opacity-80"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-[#5227FF]/80 backdrop-blur-sm rounded-2xl px-4 py-3">
              <p className="text-xs text-[#FFFFFF]/85 font-semibold">This cup will outlive your grandchildren. 👆</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── What We Offer ────────────────────────────────────────────────────────────
function OfferSection() {
  const steps = [
    { icon: '🛒', title: 'Choose your flavor', desc: 'Pick the Cuppa edible cup that pairs best with your coffee, latte, or favorite drink.' },
    { icon: '🍪', title: 'We make your cups', desc: 'We prepare every cup with our wholesome recipe and careful production process.' },
    { icon: '📦', title: 'Receive your order', desc: 'Your ready-made Cuppa cups arrive prepared for your next coffee moment.' },
    { icon: '☕', title: 'Drink & eat', desc: 'Pour your coffee, enjoy the cup, then eat it. Nothing left behind.' },
  ]
  return (
    <section id="offer" className="page-background relative overflow-hidden py-24">
      <Topography lowColor="#5227FF" midColor="#FF9FFC" highColor="#FFFFFF" speed={0.35} morphAmount={5.6} bands={2} thickness={0.01} scale={1} glow={1.5} brightness={0.6} grain={false} opacity={1} className="opacity-100" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="reveal text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FF9FFC]/20 text-[#5227FF] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            Year 1 · Available Now
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#5227FF] mb-4">
            Shop ready-made edible cups.
          </h2>
          <p className="text-[#5227FF]/65 text-lg max-w-lg mx-auto">
            Delicious cups made by Cuppa for cafés, businesses, and customers who want a better way to enjoy coffee.
          </p>
        </div>

        {/* How it works steps */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {steps.map((step, i) => (
            <div key={i} className="reveal text-center" style={{ transitionDelay: `${i * 100}ms` }}>
              <div className="relative inline-flex">
                <div className="w-16 h-16 bg-[#FF9FFC] rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-md">
                  {step.icon}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-[#FF9FFC]/40 border-t-2 border-dashed border-[#FF9FFC]/60" />
                )}
              </div>
              <div className="text-xs font-black uppercase tracking-widest text-[#5227FF] mb-2">Step {i + 1}</div>
              <h3 className="font-display font-bold text-lg text-[#5227FF] mb-2">{step.title}</h3>
              <p className="text-sm text-[#5227FF]/65 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Kit cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="reveal rounded-3xl overflow-hidden shadow-xl">
            <img
              src={originalFlavorImage}
              alt="Original flavor ready-made edible coffee cup"
              className="w-full h-56 object-cover"
            />
            <div className="bg-white p-6">
              <div className="text-xs font-bold text-[#5227FF] uppercase tracking-widest mb-2">Original Flavor</div>
              <h3 className="font-display font-bold text-2xl text-[#5227FF] mb-2">The everyday edible coffee cup</h3>
              <p className="text-[#5227FF]/65 text-sm mb-4">Our first signature cup, made to hold your coffee and finish your ritual with a delicious, zero-waste bite.</p>
              <SpecularButton size="sm" baseColor="#FF9FFC" lineColor="#FFFFFF" tint="#FF9FFC" tintOpacity={1} textColor="#5227FF" autoAnimate onClick={() => scrollToSection('#waitlist')}>
                Order Cups →
              </SpecularButton>
            </div>
          </div>
          <div className="reveal rounded-3xl overflow-hidden shadow-xl" style={{ transitionDelay: '120ms' }}>
            <img
              src={chocolateFlavorImage}
              alt="Chocolate ready-made edible coffee cup"
              className="w-full h-56 object-cover"
            />
            <div className="bg-white p-6">
              <div className="text-xs font-bold text-[#FF9FFC] uppercase tracking-widest mb-2">Chocolate Flavor</div>
              <h3 className="font-display font-bold text-2xl text-[#5227FF] mb-2">A richer way to coffee</h3>
              <p className="text-[#5227FF]/65 text-sm mb-4">A delicious chocolate cup made by Cuppa for coffee lovers, cafés, and businesses ready to serve something new.</p>
              <SpecularButton size="sm" baseColor="#FF9FFC" lineColor="#FFFFFF" tint="#FF9FFC" tintOpacity={1} textColor="#5227FF" autoAnimate onClick={() => scrollToSection('#waitlist')}>
                Join the Waitlist →
              </SpecularButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────
function RoadmapPhaseCard({
  phase,
  index,
}: {
  phase: { phase: string; title: string; desc: string; color: string; bg: string; icon: string; status: string; img: string; imgAlt: string }
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const slideFrom = index % 2 === 0 ? 'translateX(-48px)' : 'translateX(48px)'

  return (
    <div
      ref={ref}
      className="rounded-3xl overflow-hidden shadow-lg"
      style={{
        backgroundColor: phase.bg,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : slideFrom,
        transition: `opacity 0.7s ease ${index * 150}ms, transform 0.7s ease ${index * 150}ms`,
      }}
    >
      <div className="grid md:grid-cols-3 gap-0">
        <div className="md:col-span-2 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{phase.icon}</span>
            <span
              className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full text-white"
              style={{ backgroundColor: phase.color }}
            >
              {phase.status}
            </span>
            <span className="text-xs font-bold text-[#5227FF]/50 uppercase tracking-widest">{phase.phase}</span>
          </div>
          <h3 className="font-display font-black text-3xl md:text-4xl text-[#5227FF] mb-3">{phase.title}</h3>
          <p className="text-[#5227FF]/65 text-base leading-relaxed">{phase.desc}</p>
        </div>
        <div className="relative overflow-hidden min-h-[220px]">
          <img
            src={phase.img}
            alt={phase.imgAlt}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${phase.bg} 0%, transparent 40%)` }} />
        </div>
      </div>
    </div>
  )
}

function RoadmapSection() {
  const phases = [
    {
      phase: 'Year 1 · Start',
      title: 'Build and validate',
      desc: 'We will improve our recipe, product quality, and production process. We will test the cup\'s performance and begin pilot sales with cafés and customers so CUPPA is ready for real-world use.',
      color: '#FF9FFC',
      bg: '#FFFFFF',
      icon: '🌱',
      status: 'Starting',
      img: originalFlavorImage,
      imgAlt: 'Original flavor edible coffee cup ready for pilot sales',
    },
    {
      phase: 'Year 3 · Create',
      title: 'Expand the market',
      desc: 'We will build partnerships with cafés and businesses, increase our B2B sales, introduce chocolate, matcha, strawberry, and oat flavors, and expand CUPPA across Thailand.',
      color: '#5227FF',
      bg: '#FFFFFF',
      icon: '☕',
      status: 'Next',
      img: chocolateFlavorImage,
      imgAlt: 'Chocolate edible coffee cup for cafés and business partnerships',
    },
    {
      phase: 'Year 5+ · Grow',
      title: 'Scale globally',
      desc: 'We will move toward larger-scale production, enter international markets, and develop more edible packaging products as CUPPA grows into a sustainable packaging brand.',
      color: '#FF9FFC',
      bg: '#FF9FFC',
      icon: '🌍',
      status: 'Vision',
      img: flavorsExpandImage,
      imgAlt: 'Four Cuppa edible coffee cup flavors arranged on a serving board',
    },
  ]
  return (
    <section id="roadmap" className="page-background relative overflow-hidden py-24">
      <Topography lowColor="#5227FF" midColor="#FF9FFC" highColor="#FFFFFF" speed={0.35} morphAmount={5.6} bands={2} thickness={0.01} scale={1} glow={1.5} brightness={0.6} grain={false} opacity={1} className="opacity-100" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="reveal text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FF9FFC]/20 text-[#FF9FFC] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            The Journey
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#5227FF] mb-4">
            From idea to sustainable brand.
          </h2>
          <p className="text-[#5227FF]/60 text-lg max-w-lg mx-auto">
            Year 1 to build and validate. Year 3 to expand the market. Year 5+ to scale globally.
          </p>
        </div>

        <div className="space-y-8">
          {phases.map((phase, i) => (
            <RoadmapPhaseCard key={i} phase={phase} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Sustainability ───────────────────────────────────────────────────────────
function SustainabilitySection() {
  const ref = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)
  const cups = useCounter(4200000, 2500, triggered)
  const plastic = useCounter(98, 2000, triggered)
  const co2 = useCounter(12, 2000, triggered)

  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setTriggered(true) },
      { threshold: 0.3 }
    )
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const pillars = [
    {
      icon: '🚫',
      title: 'Zero Waste',
      desc: 'Nothing to throw away. Nothing sitting in a landfill for centuries. You eat the packaging.',
      color: '#5227FF',
    },
    {
      icon: '🧴',
      title: 'No Plastic Lining',
      desc: 'Traditional paper cups are coated in plastic, making them non-recyclable. Our cups have no coating — just wholesome food.',
      color: '#FF9FFC',
    },
    {
      icon: '🔄',
      title: 'Circular by Design',
      desc: 'The waste stream ends in your stomach. Every Cuppa cup consumed is one less cup in a landfill.',
      color: '#FF9FFC',
    },
  ]

  return (
    <section id="sustainability" className="page-background relative overflow-hidden py-24" ref={ref}>
      <Topography lowColor="#5227FF" midColor="#FF9FFC" highColor="#FFFFFF" speed={0.35} morphAmount={5.6} bands={2} thickness={0.01} scale={1} glow={1.5} brightness={0.6} grain={false} opacity={1} className="opacity-100" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="reveal text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#5227FF]/10 text-[#5227FF] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            🌿 Save the World With Us
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#5227FF] mb-4">
            Every cup you eat is a cup saved.
          </h2>
          <p className="text-[#5227FF]/60 text-lg max-w-lg mx-auto">
            Three concrete pillars — no vague eco-language.
          </p>
        </div>

        {/* Impact counters */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { value: cups, suffix: '+', label: 'Cups saved from landfill (projected Year 1)', color: '#5227FF', format: (n: number) => n.toLocaleString() },
            { value: plastic, suffix: '%', label: 'Reduction in single-use plastic per user', color: '#FF9FFC', format: (n: number) => n.toString() },
            { value: co2, suffix: 'kg', label: 'CO₂ equivalent saved per person per year', color: '#FF9FFC', format: (n: number) => n.toString() },
          ].map((item, i) => (
            <div key={i} className="reveal text-center p-6 bg-white rounded-3xl shadow-sm">
              <div className="font-display font-black text-4xl md:text-5xl mb-2 leading-none" style={{ color: item.color }}>
                {item.format(item.value)}{item.suffix}
              </div>
              <p className="text-[#5227FF]/65 text-sm leading-relaxed mt-2">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <div key={i} className="reveal p-8 bg-white rounded-3xl shadow-sm" style={{ transitionDelay: `${i * 100}ms` }}>
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
                style={{ backgroundColor: p.color + '20' }}
              >
                {p.icon}
              </div>
              <h3 className="font-display font-bold text-xl text-[#5227FF] mb-3">{p.title}</h3>
              <p className="text-[#5227FF]/65 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Future Vision ────────────────────────────────────────────────────────────
function FutureVisionSection() {
  const flavors = [
    { name: 'Chocolate', desc: 'Dark chocolate + oat', color: '#FF9FFC', bg: '#FFFFFF', emoji: '🍫', pair: 'Pairs with: Coco Latte', image: chocolateFlavorImage },
    { name: 'Strawberry', desc: 'Berry + vanilla wafer', color: '#FF9FFC', bg: '#FF9FFC', emoji: '🍓', pair: 'Pairs with: Yogurt', image: strawberryFlavorImage },
    { name: 'Oat', desc: 'Golden oat + honey', color: '#5227FF', bg: '#FFFFFF', emoji: '🌾', pair: 'Pairs with: Milk', image: oatFlavorImage },
    { name: 'Matcha', desc: 'Ceremonial green tea', color: '#5227FF', bg: '#FFFFFF', emoji: '🍵', pair: 'Pairs with: Matcha Latte', image: matchaFlavorImage },
  ]
  return (
    <section className="flavor-section relative py-24">
      <Topography lowColor="#5227FF" midColor="#FF9FFC" highColor="#FFFFFF" speed={0.35} morphAmount={5.6} bands={2} thickness={0.01} scale={1} glow={1.5} brightness={0.6} grain={false} opacity={1} className="opacity-100" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="reveal text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FF9FFC]/20 text-[#FF9FFC] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-4">
            ✨ Coming in Phase 2.5
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#5227FF] mb-4">
            Flavors are just the beginning.
          </h2>
          <p className="text-[#5227FF]/60 text-lg max-w-lg mx-auto">
            Designed for fitness-conscious lifestyles. High protein. Low waste. Ridiculously good.
          </p>
        </div>

        <div className="flavor-list mb-12">
          {flavors.map((f, i) => (
            <div
              key={i}
              className="flavor-card reveal"
              style={{ '--flavor-color': f.color, '--flavor-surface': f.bg, transitionDelay: `${i * 80}ms` } as React.CSSProperties}
            >
              <div className="flavor-photo-slot" aria-label={`${f.name} flavor photo placeholder`}>
                {f.image && <img src={f.image} alt={`${f.name} flavor edible cup`} className="flavor-photo" />}
              </div>
              <div className="flavor-card-content p-6 text-center md:p-8">
                <div className="flavor-name inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black uppercase tracking-widest text-white" style={{ backgroundColor: f.color }}>
                  <span aria-hidden="true">{f.emoji}</span>
                  {f.name}
                </div>
                <p className="flavor-description mt-3 text-lg font-semibold text-[#5227FF]">{f.desc}</p>
                <p className="flavor-pair mt-1 text-sm text-[#5227FF]/55">{f.pair}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="snack-feature reveal rounded-3xl overflow-hidden bg-[#5227FF] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <div className="text-[#FF9FFC] text-xs font-black uppercase tracking-widest mb-3">Built for the fitness community</div>
            <h3 className="font-display font-bold text-3xl text-white mb-4">
              Your cup is your snack.
            </h3>
            <p className="text-white/65 leading-relaxed">
              High-protein, low-sugar Cuppa cups are engineered to complement your protein shake or morning espresso — not just hold it. Eat well. Waste nothing.
            </p>
          </div>
          <img
            src={cupWithBiteImage}
            alt="Cuppa edible coffee cup with coffee"
            className="w-52 h-36 object-cover rounded-2xl opacity-90"
          />
        </div>
      </div>
    </section>
  )
}

// ─── Trust & Safety ──────────────────────────────────────────────────────────
function TrustSafetySection() {
  return (
    <section id="trust" className="relative overflow-hidden bg-[#5227FF] py-24 text-white">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="reveal mb-12 max-w-2xl">
          <div className="mb-4 inline-flex rounded-full bg-[#FF9FFC]/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#FF9FFC]">Trust &amp; Safety</div>
          <h2 className="font-display text-4xl font-black md:text-5xl">Good ingredients. Clear answers.</h2>
          <p className="mt-4 text-lg leading-relaxed text-white/70">We are building CUPPA with the same care we put into every recipe. Our certification and nutrition details will be confirmed as the pilot production process is finalized.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: '✓', title: 'Food-safe process', text: 'Produced with food-grade ingredients and batch-level quality checks.', label: 'Certification in progress' },
            { icon: '◌', title: 'Allergen-aware', text: 'Our current recipe contains gluten. Dairy-free options are planned; always check the final label.', label: 'Label every batch' },
            { icon: '◎', title: 'Made to be eaten', text: 'Designed to hold a hot drink long enough to enjoy, then become part of the meal.', label: 'Product testing' },
          ].map((item) => (
            <div key={item.title} className="reveal rounded-3xl border border-white/15 bg-white/10 p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF9FFC] text-2xl font-black text-[#5227FF]">{item.icon}</div>
              <div className="mb-2 text-xs font-black uppercase tracking-widest text-[#FF9FFC]">{item.label}</div>
              <h3 className="font-display text-2xl font-bold">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-white/65">{item.text}</p>
            </div>
          ))}
        </div>
        <div className="reveal mt-8 grid gap-8 rounded-3xl bg-white p-7 text-[#5227FF] md:grid-cols-[0.8fr_1.2fr] md:p-10">
          <div>
            <div className="mb-3 text-xs font-black uppercase tracking-widest text-[#FF9FFC]">Draft nutrition · per cup</div>
            <div className="flex items-end gap-3"><strong className="font-display text-6xl font-black">180</strong><span className="pb-2 font-bold">kcal</span></div>
            <p className="mt-3 text-sm leading-relaxed text-[#5227FF]/60">Estimated for the current Original recipe. Final nutrition facts will appear on each production label.</p>
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold">Ingredients</h3>
            <p className="mt-3 leading-relaxed text-[#5227FF]/70">Oat flour, wheat flour, coconut oil, cane sugar, vanilla, sea salt, and natural flavoring. Contains wheat and gluten. Made in a kitchen that handles nuts and dairy.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Our Story ────────────────────────────────────────────────────────────────
function StorySection() {
  return (
    <section id="story" className="relative overflow-hidden bg-white py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 md:grid-cols-2">
        <div className="reveal overflow-hidden rounded-3xl bg-[#FF9FFC] p-4">
          <img src={flavorsExpandImage} alt="CUPPA edible cup flavors" className="h-[360px] w-full rounded-2xl object-cover" />
        </div>
        <div className="reveal">
          <div className="mb-4 inline-flex rounded-full bg-[#5227FF]/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#5227FF]">Our Story</div>
          <h2 className="font-display text-4xl font-black text-[#5227FF] md:text-5xl">We wanted the last sip to leave something good behind.</h2>
          <p className="mt-6 leading-relaxed text-[#5227FF]/70">CUPPA was created from a simple frustration: the coffee ritual felt special, but the disposable cup felt like an afterthought. We started experimenting with recipes that could hold a real drink, taste genuinely good, and disappear without a bin.</p>
          <p className="mt-4 leading-relaxed text-[#5227FF]/70">Today, we are building CUPPA one recipe, one pilot café, and one brave final bite at a time. Our goal is not to make people give up convenience. It is to make the convenient choice the delicious, responsible one.</p>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQSection() {
  const questions = [
    ['How long do CUPPA cups last?', 'Shelf life will depend on the final sealed packaging and recipe validation. Our pilot target is a clearly labeled, freshness-first product with storage guidance on every pack.'],
    ['Do the cups contain gluten or dairy?', 'The current base recipe contains wheat and gluten. Some flavors may contain or be made around dairy, so always check the final allergen statement on the product label.'],
    ['Can the cup hold hot coffee?', 'Yes. CUPPA is being tested for real coffee service and is designed to hold a hot drink for the length of a normal coffee moment before you eat it.'],
    ['Do you ship or deliver?', 'We plan to offer direct delivery for customers and coordinated delivery for cafés and business partners. Shipping availability will launch with the first pilot sales.'],
    ['Can cafés order in bulk?', 'Yes. Café and B2B ordering is central to our Year 3 plan. Join the waitlist and choose “café or business” so our team can contact you about pilot quantities.'],
  ]
  return (
    <section id="faq" className="page-background relative overflow-hidden py-24">
      <div className="relative z-10 mx-auto max-w-4xl px-6">
        <div className="reveal mb-12 text-center">
          <div className="mb-4 inline-flex rounded-full bg-[#FF9FFC]/25 px-4 py-2 text-xs font-black uppercase tracking-widest text-[#5227FF]">FAQ</div>
          <h2 className="font-display text-4xl font-black text-[#5227FF] md:text-5xl">Good questions deserve clear answers.</h2>
        </div>
        <div className="space-y-4">
          {questions.map(([question, answer]) => (
            <details key={question} className="reveal group rounded-3xl bg-white px-6 py-5 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-xl font-bold text-[#5227FF]">{question}<span className="text-2xl text-[#FF9FFC] transition-transform group-open:rotate-45">+</span></summary>
              <p className="max-w-3xl pt-4 leading-relaxed text-[#5227FF]/65">{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────
function WaitlistSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) setSubmitted(true)
  }

  return (
    <section id="waitlist" className="py-24 bg-[#5227FF] relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-72 h-72 bg-[#FF9FFC]/30 blob-1 animate-blob"
        style={{ filter: 'blur(60px)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF9FFC]/20 blob-2 animate-blob"
        style={{ filter: 'blur(50px)', animationDelay: '3s' }}
      />

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <div className="reveal">
          <div className="inline-flex items-center gap-2 bg-[#FF9FFC]/20 text-[#FF9FFC] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            🚀 Be First
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl text-[#FFFFFF] mb-4">
            The future is delicious.
          </h2>
          <p className="text-[#FFFFFF]/70 text-lg mb-10">
            Join the waitlist to be the first to try Cuppa flavors, get founding-member pricing, and shape the flavors we build next.
          </p>

          {submitted ? (
            <div className="animate-fade-up bg-[#FF9FFC]/20 border border-[#FF9FFC]/50 rounded-3xl p-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="font-display font-bold text-2xl text-white mb-2">You're in!</h3>
              <p className="text-white/70">We'll be in touch when your edible cup is ready. Until then — drink well, waste nothing.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 bg-white/10 text-white placeholder-white/50 border border-white/25 rounded-full px-6 py-4 text-base outline-none focus:border-[#FF9FFC] focus:bg-white/15 transition-all"
              />
              <SpecularButton
                size="lg"
                type="submit"
                baseColor="#FF9FFC"
                lineColor="#FFFFFF"
                tint="#FF9FFC"
                tintOpacity={1}
                textColor="#FFFFFF"
                autoAnimate
                className="w-full sm:w-auto"
              >
                Join the Movement
              </SpecularButton>
            </form>
          )}

          <p className="text-white/30 text-xs mt-4">No spam. Unsubscribe anytime. We hate waste of all kinds.</p>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const [contactOpen, setContactOpen] = useState(false)

  useEffect(() => {
    const openContactModal = () => setContactOpen(true)
    window.addEventListener('open-contact-modal', openContactModal)
    return () => window.removeEventListener('open-contact-modal', openContactModal)
  }, [])

  useEffect(() => {
    if (!contactOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setContactOpen(false)
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [contactOpen])

  return (
    <>
      <footer className="bg-[#5227FF] text-[#FFFFFF]/70 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img src={brandLogo} alt="Cuppa" className="h-16 w-40 object-contain object-left" />
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Edible coffee cups made from wholesome ingredients. Drink your coffee. Eat your cup. Leave nothing behind.
            </p>
          </div>
          <div>
            <h4 className="text-[#FFFFFF] font-bold text-sm mb-4 uppercase tracking-widest">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#roadmap" className="hover:text-[#FF9FFC] transition-colors">Roadmap</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#FFFFFF] font-bold text-sm mb-4 uppercase tracking-widest">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#story" className="hover:text-[#FF9FFC] transition-colors">Our Story</a></li>
              <li><a href="#sustainability" className="hover:text-[#FF9FFC] transition-colors">Sustainability</a></li>
              <li><a href="#faq" className="hover:text-[#FF9FFC] transition-colors">FAQ</a></li>
              <li><button type="button" onClick={() => setContactOpen(true)} className="hover:text-[#FF9FFC] transition-colors">Contact</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 Cuppa. Zero waste, by design.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#FF9FFC] transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#FF9FFC] transition-colors">TikTok</a>
            <a href="#" className="hover:text-[#FF9FFC] transition-colors">Twitter</a>
          </div>
        </div>
      </div>
      </footer>

      {contactOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#24115f]/55 p-6 backdrop-blur-md"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setContactOpen(false)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/40 bg-gradient-to-br from-white via-[#fff7ff] to-[#FF9FFC] p-8 text-[#5227FF] shadow-2xl md:p-10"
          >
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#FF9FFC]/60 blur-2xl" />
            <button
              type="button"
              aria-label="Close contact dialog"
              onClick={() => setContactOpen(false)}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#5227FF]/10 text-2xl font-bold transition-colors hover:bg-[#5227FF] hover:text-white"
            >
              ×
            </button>
            <div className="relative">
              <div className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-[#5227FF]/55">CUPPA contact</div>
              <BlurText
                text="Let's make a better coffee moment."
                delay={90}
                animateBy="words"
                direction="top"
                className="max-w-sm pr-8 font-display text-3xl font-black leading-tight md:text-4xl"
              />
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#5227FF]/65">Reach our team for customer questions, café partnerships, and bulk orders.</p>
              <div className="mt-7 space-y-3 rounded-2xl bg-white/70 p-5 text-sm shadow-sm">
                <a href="mailto:myatthihat@gmail.com" className="flex items-center justify-between gap-4 font-bold transition-colors hover:text-[#FF9FFC]">
                  <span className="text-[#5227FF]/55">Email</span>
                  <span>myatthihat@gmail.com</span>
                </a>
                <a href="tel:0623434599" className="flex items-center justify-between gap-4 font-bold transition-colors hover:text-[#FF9FFC]">
                  <span className="text-[#5227FF]/55">Phone</span>
                  <span>0623434599</span>
                </a>
                <div className="flex items-center justify-between gap-4 font-bold">
                  <span className="text-[#5227FF]/55">Line ID</span>
                  <span>mitchhe24</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  useReveal()
  return (
    <div className="min-h-screen">
      <IntroSection />
      <Navbar />
      <div id="home">
        <HeroSection />
      </div>
      <ProblemSection />
      <RoadmapSection />
      <SustainabilitySection />
      <OfferSection />
      <FutureVisionSection />
      <TrustSafetySection />
      <StorySection />
      <FAQSection />
      <WaitlistSection />
      <Footer />
    </div>
  )
}
