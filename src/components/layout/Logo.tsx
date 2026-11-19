import { Link } from 'react-router-dom'

export const Logo = ({ to = '/', tagline }: { to?: string; tagline?: boolean }) => (
  <Link to={to} className="flex items-center gap-2.5 font-bold text-white group select-none">
    <div className="relative flex h-8 w-9.5 shrink-0 items-center justify-center transition duration-200 group-hover:scale-105">
      <img
        src="/logo-cap.png"
        alt="EduLearn Cap Logo"
        className="h-full w-full object-contain drop-shadow-[0_2px_10px_rgba(0,180,255,0.5)]"
      />
    </div>
    <div className="leading-tight">
      <span className="block text-lg font-extrabold tracking-tight text-white">
        Edu<span className="text-[#00d2ff]">L</span>earn
      </span>
      {tagline && (
        <span className="block text-[10px] font-normal text-slate-400">
          Learn Today. Build Tomorrow.
        </span>
      )}
    </div>
  </Link>
)
