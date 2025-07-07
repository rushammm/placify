interface StatsCardProps {
  title: string;
  value: number;
  description: string;
}

export function StatsCard({ title, value, description }: StatsCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="bg-white/10 dark:bg-white/5 backdrop-blur-lg border border-white/20 dark:border-white/10 text-black dark:text-white rounded-2xl p-6 shadow-xl shadow-black/5 hover:shadow-black/10 transition-all duration-300 hover:bg-white/15 dark:hover:bg-white/10">
      <div className="text-center">
        <div className="text-3xl font-bold tracking-tight text-[#45cee3] mb-2">
          {formatNumber(value)}
        </div>
        <h3 className="text-lg font-medium tracking-tight text-black dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </div>
    </div>
  );
}
