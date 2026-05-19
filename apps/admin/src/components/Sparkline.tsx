import { useEffect, useState } from "react";
import { fetchSiteSparkline } from "../api";
import type { DailyMetric } from "../types";

interface SparklineProps {
  siteId: number;
  metric: "clicks" | "impressions" | "revenue";
  width?: number;
  height?: number;
}

export function Sparkline({ siteId, metric, width = 80, height = 24 }: SparklineProps) {
  const [data, setData] = useState<DailyMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteSparkline(siteId, 30)
      .then((res) => {
        setData(res.metrics);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [siteId]);

  if (loading || data.length === 0) {
    return <div className="w-20 h-6 bg-muted rounded animate-pulse" />;
  }

  const values = data.map((d) => d[metric]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const trend = values[values.length - 1] >= values[0];
  const strokeColor = trend ? "#22c55e" : "#ef4444";

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
