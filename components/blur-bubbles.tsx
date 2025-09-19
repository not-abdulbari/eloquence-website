"use client"

export default function BlurBubbles() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Neon-violet and neon-orange bubbles with soft float */}
      <div className="absolute left-[6%] top-[12%] h-56 w-56 rounded-full bg-violet-500/25 blur-3xl mix-blend-screen bubble-float" />
      <div className="absolute right-[9%] top-[18%] h-40 w-40 rounded-full bg-orange-400/30 blur-3xl mix-blend-screen bubble-float-slow" />
      <div className="absolute left-[18%] bottom-[14%] h-44 w-44 rounded-full bg-violet-500/20 blur-3xl mix-blend-screen bubble-float-delayed" />
      <div className="absolute right-[22%] bottom-[10%] h-64 w-64 rounded-full bg-orange-400/20 blur-3xl mix-blend-screen bubble-float-fast" />
      <div className="absolute left-[45%] top-[46%] h-24 w-24 rounded-full bg-violet-400/25 blur-3xl mix-blend-screen bubble-float-fast" />
    </div>
  )
}