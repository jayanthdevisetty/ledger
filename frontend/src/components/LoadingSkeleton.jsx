export default function LoadingSkeleton({ count = 3, type = 'card' }) {
  if (type === 'summary') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="shimmer h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return <div className="shimmer h-48 rounded-2xl" />;
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-4 flex items-center gap-3">
          <div className="shimmer w-11 h-11 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="shimmer h-4 w-3/4 rounded" />
            <div className="shimmer h-3 w-1/2 rounded" />
          </div>
          <div className="space-y-2 text-right">
            <div className="shimmer h-4 w-16 rounded ml-auto" />
            <div className="shimmer h-3 w-12 rounded ml-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}
