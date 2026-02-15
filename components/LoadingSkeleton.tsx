export function LoadingSkeleton() {
  return (
    <div className="flex flex-col items-center gap-4 animate-pulse">
      <div className="bg-slate-200 rounded-lg w-full max-w-md aspect-square" />
      <div className="flex gap-3">
        <div className="bg-slate-200 rounded-lg h-10 w-32" />
        <div className="bg-slate-200 rounded-lg h-10 w-32" />
      </div>
    </div>
  )
}
