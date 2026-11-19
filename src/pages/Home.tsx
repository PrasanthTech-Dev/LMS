import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Heart,
  Headphones,
  Infinity as InfinityIcon,
  Palette,
  Play,
  PlayCircle,
  Sparkles,
  Star,
  Users,
  X,
} from 'lucide-react'

// 4 Popular Categories
const categories = [
  {
    name: 'Programming & Development',
    icon: Code2,
    href: '/courses?category=Web%20Development',
  },
  {
    name: 'Data Science & Analytics',
    icon: BarChart3,
    href: '/courses?category=Data%20Science',
  },
  {
    name: 'Design & Creativity',
    icon: Palette,
    href: '/courses?category=UI%2FUX%20Design',
  },
  {
    name: 'Business & Marketing',
    icon: Briefcase,
    href: '/courses?category=Business',
  },
]

// 4 Top Popular Courses exactly as in the design
const popularCourses = [
  {
    id: 'c1',
    title: 'React.js Complete Guide\nwith Projects',
    bestseller: true,
    image: '/home-course-react.jpg',
    rating: '4.9',
    reviews: '12.5k reviews',
    price: '$49.99',
    originalPrice: '$79.99',
    duration: '12.5 hrs',
    lessons: '120 Lessons',
  },
  {
    id: 'c2',
    title: 'Python for Data Science\nand AI',
    bestseller: false,
    image: '/home-course-python.jpg',
    rating: '4.8',
    reviews: '10.2k reviews',
    price: '$49.99',
    originalPrice: '$69.99',
    duration: '10.5 hrs',
    lessons: '95 Lessons',
  },
  {
    id: 'c3',
    title: 'UI/UX Design Masterclass',
    bestseller: false,
    image: '/home-course-uiux.jpg',
    rating: '4.9',
    reviews: '8.8k reviews',
    price: '$39.99',
    originalPrice: '$59.99',
    duration: '8.5 hrs',
    lessons: '80 Lessons',
  },
  {
    id: 'c4',
    title: 'Digital Marketing\nComplete Course',
    bestseller: false,
    image: '/home-course-marketing.jpg',
    rating: '4.7',
    reviews: '7.6k reviews',
    price: '$39.99',
    originalPrice: '$59.99',
    duration: '9.5 hrs',
    lessons: '70 Lessons',
  },
]

// 4 Feature Pillars in Why Choose EduLearn
const features = [
  {
    icon: Users,
    title: 'Expert Instructors',
    desc: 'Learn from industry professionals',
  },
  {
    icon: InfinityIcon,
    title: 'Lifetime Access',
    desc: 'Learn at your own pace, forever',
  },
  {
    icon: Award,
    title: 'Certificates',
    desc: 'Get recognized for your achievements',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: "We're here to help anytime",
  },
]

// Testimonials matching exact screenshot
const studentTestimonials = [
  {
    id: '1',
    name: 'Rahul Sharma',
    avatar: '/avatar-rahul.jpg',
    quote:
      'EduLearn has completely changed my learning journey. The courses are amazing and easy to follow!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Priya Nair',
    avatar: '/avatar-priya.jpg',
    quote:
      'Excellent platform with top-notch instructors. Highly recommended!',
    rating: 5,
  },
  {
    id: '3',
    name: 'Arjun Patel',
    avatar: '/avatar-arjun.jpg',
    quote:
      'A great learning experience with flexible access and useful resources.',
    rating: 5,
  },
]

export default function Home() {
  const [videoModalOpen, setVideoModalOpen] = useState(false)
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({})
  const [testimonialIndex, setTestimonialIndex] = useState(0)

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const prevTestimonial = () => {
    setTestimonialIndex((prev) =>
      prev === 0 ? studentTestimonials.length - 1 : prev - 1
    )
  }

  const nextTestimonial = () => {
    setTestimonialIndex((prev) =>
      prev === studentTestimonials.length - 1 ? 0 : prev + 1
    )
  }

  return (
    <div className="relative overflow-hidden bg-[#040a18] text-white">
      {/* Deep ambient background glows matching mockup */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[850px] -translate-x-1/2 rounded-full bg-[#0066ff]/20 blur-[140px]" />
      <div className="pointer-events-none absolute top-[700px] -left-36 h-[400px] w-[450px] rounded-full bg-[#00c8ff]/10 blur-[130px]" />
      <div className="pointer-events-none absolute top-[1400px] -right-36 h-[450px] w-[450px] rounded-full bg-[#0066ff]/15 blur-[140px]" />

      {/* ======================================================== */}
      {/* 1. HERO SECTION                                          */}
      {/* ======================================================== */}
      <section className="relative pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-6">
            {/* Hero Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 xl:col-span-6"
            >
              {/* Badge: ✦ Learn • Practice • Grow */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-[#071330]/90 px-3.5 py-1 text-[11px] font-semibold text-cyan-400 shadow-sm backdrop-blur-md">
                <Sparkles size={13} className="text-cyan-400" />
                <span>Learn • Practice • Grow</span>
              </div>

              {/* Main Headline */}
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-5xl xl:text-6xl leading-[1.12]">
                Upgrade Your Skills <br />
                with{' '}
                <span className="text-[#00c8ff] drop-shadow-[0_0_25px_rgba(0,200,255,0.45)]">
                  EduLearn
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-4 max-w-lg text-sm text-slate-300 sm:text-base leading-relaxed">
                Access world-class courses, learn at your own pace, and achieve
                your goals with expert instructors.
              </p>

              {/* Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  to="/courses"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#0070f3] px-7 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-blue-600/35 transition duration-200 hover:bg-[#005cd4] hover:scale-105 active:scale-95"
                >
                  Explore Courses
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>

              {/* Quick Stats Row */}
              <div className="mt-10 flex flex-wrap items-center gap-7 sm:gap-10">
                {/* 50K+ Active Students */}
                <div className="flex items-center gap-3">
                  <img
                    src="/icon-active-students.png"
                    alt="Active Students"
                    className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_0_10px_rgba(0,180,255,0.65)]"
                  />
                  <div>
                    <div className="text-lg sm:text-xl font-bold text-white leading-tight">50K+</div>
                    <div className="text-[11px] sm:text-xs text-slate-300">Active Students</div>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-blue-500/20 ml-2" />
                </div>

                {/* 1K+ Courses */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-cyan-400 ring-1 ring-blue-500/30">
                    <svg className="h-5 w-5 text-cyan-400 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">1K+</div>
                    <div className="text-[11px] text-slate-400">Courses</div>
                  </div>
                </div>

                {/* 4.8 Average Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30">
                    <Star size={20} className="fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-white">4.8</div>
                    <div className="text-[11px] text-slate-400">Average Rating</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hero Right Visual (EXACT girl with headphones, laptop, coffee mug, books, and cards) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative flex items-center justify-center lg:col-span-6 xl:col-span-6"
            >
              <div className="relative w-full max-w-[560px] overflow-hidden">
                <img
                  src="/hero-girl-blended.png"
                  alt="Student learning on EduLearn with headphones"
                  className="w-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. EXPLORE POPULAR CATEGORIES SECTION                    */}
      {/* ======================================================== */}
      <section className="relative py-14 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Header Row */}
          <div className="relative mb-10 flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Center Section Title with top tag */}
            <div className="text-center md:mx-auto">
              <div className="text-[11px] font-semibold tracking-wider text-cyan-400 uppercase">
                — Browse Categories —
              </div>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Explore Popular Categories
              </h2>
            </div>

            {/* Right Button: View All Categories */}
            <div className="md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2">
              <Link
                to="/courses"
                className="group inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-[#081534] px-4 py-1.5 text-xs font-semibold text-slate-200 shadow-sm transition hover:border-cyan-400 hover:bg-[#0c1f4e] hover:text-white"
              >
                View All Categories
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-1 text-cyan-400"
                />
              </Link>
            </div>
          </div>

          {/* 4 Popular Categories Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon
              return (
                <Link
                  key={cat.name}
                  to={cat.href}
                  className="group relative flex flex-col items-center justify-center rounded-2xl border border-blue-500/20 bg-[#071330]/90 p-5 sm:p-6 text-center shadow-lg transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/60 hover:bg-[#0b1d48] hover:shadow-cyan-500/15"
                >
                  {/* Glowing Icon Container */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/15 text-cyan-400 ring-1 ring-blue-500/20 transition duration-300 group-hover:scale-110 group-hover:bg-[#0070f3] group-hover:text-white group-hover:ring-cyan-300">
                    <Icon size={22} />
                  </div>

                  {/* Title */}
                  <span className="mt-3.5 text-xs sm:text-sm font-semibold leading-tight text-slate-200 transition group-hover:text-white">
                    {cat.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. POPULAR COURSES SECTION                                */}
      {/* ======================================================== */}
      <section className="relative py-14 border-t border-white/[0.06] bg-[#030917]/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-cyan-400">
                — Our Top Courses —
              </div>
              <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Popular Courses
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">
                Start learning from the best courses, designed by industry experts.
              </p>
            </div>

            <Link
              to="/courses"
              className="group inline-flex items-center gap-1.5 self-start rounded-full border border-blue-500/30 bg-[#081534] px-4 py-1.5 text-xs font-semibold text-slate-200 shadow-sm transition hover:border-cyan-400 hover:bg-[#0c1f4e] hover:text-white sm:self-auto"
            >
              View All Courses
              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-1 text-cyan-400"
              />
            </Link>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {popularCourses.map((c) => {
              const isSaved = !!wishlist[c.id]
              return (
                <div
                  key={c.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-blue-500/20 bg-[#071330]/95 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-blue-900/30"
                >
                  {/* Card Thumbnail Container */}
                  <div className="relative aspect-[15/7] w-full overflow-hidden bg-slate-900">
                    <img
                      src={c.image}
                      alt={c.title.replace('\n', ' ')}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Best Seller Badge */}
                    {c.bestseller && (
                      <span className="absolute right-10 top-2.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-0.5 text-[9px] font-bold tracking-wide text-white shadow-md">
                        Best Seller
                      </span>
                    )}

                    {/* Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(c.id)}
                      aria-label="Save to wishlist"
                      className="absolute right-2.5 top-2.5 flex h-6.5 w-6.5 items-center justify-center rounded-full bg-[#040916]/70 text-white backdrop-blur-md transition hover:bg-[#040916] hover:text-rose-400"
                    >
                      <Heart
                        size={13}
                        className={isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}
                      />
                    </button>
                  </div>

                  {/* Card Body - Exactly matching the image 2-row layout */}
                  <div className="flex flex-1 flex-col p-4">
                    {/* Course Title */}
                    <h3 className="line-clamp-2 min-h-[2.5rem] text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition whitespace-pre-line leading-snug">
                      <Link to={`/courses/${c.id}`}>{c.title}</Link>
                    </h3>

                    {/* Row 1: Left = Rating & Reviews, Right = Prices */}
                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span className="font-bold text-amber-300">{c.rating}</span>
                        <span className="text-slate-400 text-[10px]">({c.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-white text-xs">{c.price}</span>
                        <span className="text-[10px] text-slate-500 line-through">{c.originalPrice}</span>
                      </div>
                    </div>

                    {/* Row 2: Left = Duration & Lessons, Right = Enroll Now button */}
                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-white/[0.06]">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <Clock size={11} className="text-cyan-400" />
                        <span>{c.duration}</span>
                        <span>•</span>
                        <span>{c.lessons}</span>
                      </div>

                      <Link
                        to={`/courses/${c.id}`}
                        className="rounded-lg bg-[#0070f3] px-3.5 py-1 text-xs font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-[#005cd4]"
                      >
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. WHY CHOOSE EDULEARN SECTION                           */}
      {/* ======================================================== */}
      <section id="about" className="relative py-16 border-t border-white/[0.06] scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Heading, description, CTA */}
            <div className="lg:col-span-4">
              <div className="text-[11px] font-semibold tracking-wider text-cyan-400 uppercase">
                — Why Choose EduLearn —
              </div>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl leading-tight">
                Your Learning <br />
                Partner for <span className="text-[#00c8ff]">Life</span>
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                We're committed to providing the best learning experience with
                innovative tools and expert guidance.
              </p>
              <div className="mt-6">
                <Link
                  to="/courses"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#0070f3] px-5 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-[#005cd4]"
                >
                  Learn More
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>

            {/* Center Column: 3D Holographic Laptop Projection */}
            <div className="relative flex items-center justify-center lg:col-span-4">
              <div className="relative mx-auto w-full max-w-[320px] sm:max-w-sm">
                {/* Glowing cyan backplate */}
                <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-2xl" />
                <div className="relative overflow-hidden rounded-2xl border border-cyan-400/30 bg-[#06122e] p-2 shadow-2xl shadow-blue-900/50">
                  <img
                    src="/laptop-hologram.jpg"
                    alt="EduLearn 3D Holographic Learning"
                    className="h-auto w-full rounded-xl object-contain shadow-lg"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: 4 Feature Pillars (2x2 Grid) */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:col-span-4">
              {features.map((f) => {
                const Icon = f.icon
                return (
                  <div
                    key={f.title}
                    className="flex flex-col rounded-2xl border border-blue-500/20 bg-[#071330]/90 p-4 shadow-lg transition duration-200 hover:border-cyan-400/40 hover:bg-[#091b42]"
                  >
                    {/* Cyan circular glowing icon */}
                    <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20 text-cyan-400 ring-1 ring-cyan-400/30">
                      <Icon size={18} />
                    </div>
                    <h4 className="text-xs font-bold text-white">{f.title}</h4>
                    <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. TESTIMONIALS SECTION ("What Our Students Say")        */}
      {/* ======================================================== */}
      <section id="reviews" className="relative py-16 border-t border-white/[0.06] bg-[#030917]/50 scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Center Heading */}
          <div className="text-center">
            <div className="text-[11px] font-semibold tracking-wider text-cyan-400 uppercase">
              — Students Love EduLearn —
            </div>
            <h2 className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              What Our Students Say
            </h2>
          </div>

          {/* Testimonials Carousel / Grid with Left & Right arrows */}
          <div className="relative mt-10 flex items-center justify-center">
            {/* Left Carousel Arrow */}
            <button
              onClick={prevTestimonial}
              aria-label="Previous testimonial"
              className="absolute -left-3 z-10 hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-blue-500/40 bg-[#071330] text-white shadow-md transition hover:border-cyan-400 hover:bg-[#0a1c44] hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={16} />
            </button>

            {/* 3 Testimonials Cards in a row */}
            <div className="grid w-full gap-5 sm:px-8 md:grid-cols-3">
              {studentTestimonials.map((t) => (
                <div
                  key={t.id}
                  className="flex flex-col justify-between rounded-2xl border border-blue-500/20 bg-[#071330]/90 p-5 shadow-xl transition-all duration-300 hover:border-cyan-400/40 hover:-translate-y-1 hover:shadow-cyan-900/20"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Student Portrait Avatar */}
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-12 w-12 shrink-0 rounded-full border border-cyan-400/50 object-cover shadow-sm"
                    />

                    <div>
                      {/* Quote */}
                      <p className="text-[11px] text-slate-300 leading-relaxed italic">
                        "{t.quote}"
                      </p>

                      {/* Author Name */}
                      <div className="mt-2 text-xs font-bold text-white">
                        — {t.name}
                      </div>

                      {/* 5 Gold Stars */}
                      <div className="mt-1 flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Carousel Arrow */}
            <button
              onClick={nextTestimonial}
              aria-label="Next testimonial"
              className="absolute -right-3 z-10 hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-blue-500/40 bg-[#071330] text-white shadow-md transition hover:border-cyan-400 hover:bg-[#0a1c44] hover:scale-105 active:scale-95"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. CTA BANNER: READY TO START YOUR LEARNING JOURNEY?      */}
      {/* ======================================================== */}
      <section className="relative py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-blue-400/30 bg-gradient-to-r from-[#00389e] via-[#0047b8] to-[#0055d4] p-5 shadow-2xl sm:px-8 sm:py-6">
            {/* Background cyan light aura & streaks */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-400/10 via-transparent to-transparent" />

            {/* Right Artwork: 3D Graduation Cap & Diploma Scroll spanning right side */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 hidden h-full w-[280px] select-none md:block lg:w-[340px] xl:w-[420px]">
              <img
                src="/cta-cap-perfect.png"
                alt="EduLearn Graduation Cap and Certificate"
                className="h-full w-full object-cover object-left"
              />
            </div>

            <div className="relative z-10 flex flex-col items-center justify-between gap-5 sm:flex-row sm:pr-4 md:pr-[260px] lg:pr-[320px] xl:pr-[380px]">
              {/* Left Group: Golden Trophy + Headline */}
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                {/* 3D Golden Championship Trophy Icon */}
                <img
                  src="/cta-trophy-perfect.png"
                  alt="Trophy"
                  className="h-10 w-10 shrink-0 object-contain drop-shadow-md sm:h-12 sm:w-12"
                />

                <div>
                  <h3 className="text-base font-bold text-white sm:text-lg lg:text-xl tracking-tight">
                    Ready to Start Your Learning Journey?
                  </h3>
                  <p className="mt-0.5 text-xs text-blue-100 sm:text-sm">
                    Join thousands of learners and build a brighter future with EduLearn.
                  </p>
                </div>
              </div>

              {/* Get Started Free Pill Button */}
              <Link
                to="/register"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0084ff] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-950/40 transition-all duration-200 hover:bg-[#0073e6] hover:scale-105 active:scale-95 sm:ml-4"
              >
                Get Started Free
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* VIDEO DEMO MODAL                                         */}
      {/* ======================================================== */}
      <AnimatePresence>
        {videoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-blue-500/30 bg-[#091535] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <PlayCircle size={18} className="text-cyan-400" />
                  EduLearn Platform Tour
                </div>
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="EduLearn Video Tour"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
