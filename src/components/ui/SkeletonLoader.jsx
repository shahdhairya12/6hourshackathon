export default function SkeletonLoader() {
  return (
    <div
      role="status"
      aria-label="Loading module content..."
      className="space-y-6 animate-pulse"
    >
      <div className="h-44 rounded-[24px] bg-slate-900/50 border border-white/[0.06] shimmer-bg" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-64 rounded-[24px] bg-slate-900/40 border border-white/[0.06] shimmer-bg" />
        <div className="h-64 rounded-[24px] bg-slate-900/40 border border-white/[0.06] shimmer-bg" />
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
