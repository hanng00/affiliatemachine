import type { RobotVacuumProduct, UserReview } from "@/config/affiliates";

interface ReviewCardProps {
  review: UserReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <blockquote className="rounded-xl bg-gray-50 p-6">
      <p className="text-gray-700 leading-relaxed">"{review.text}"</p>
      <footer className="mt-4 text-sm text-gray-500">
        {review.author}, {review.location} <span className="text-gray-400">via {review.source}</span>
      </footer>
    </blockquote>
  );
}

interface FeatureBadgesProps {
  product: RobotVacuumProduct;
}

export function FeatureBadges({ product }: FeatureBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {product.petFriendly && (
        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          Husdjursvänlig
        </span>
      )}
      {product.hasSelfEmpty && (
        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          Självtömmande
        </span>
      )}
      {product.hasMopping && (
        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          Moppfunktion
        </span>
      )}
      {product.hasObstacleAvoidance && (
        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          Hinderdetektering
        </span>
      )}
      {product.noiseLevel && parseInt(product.noiseLevel) <= 65 && (
        <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
          Tyst drift
        </span>
      )}
    </div>
  );
}

interface SpecGridProps {
  product: RobotVacuumProduct;
}

export function SpecGrid({ product }: SpecGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {product.suctionPower && (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{product.suctionPower}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Sugkraft</div>
        </div>
      )}
      {product.batteryLife && (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{product.batteryLife}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Batteri</div>
        </div>
      )}
      {product.noiseLevel && (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{product.noiseLevel}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Ljudnivå</div>
        </div>
      )}
      {product.dustbinSize && (
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">{product.dustbinSize}</div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Dammbehållare</div>
        </div>
      )}
    </div>
  );
}

interface CategoryCardProps {
  title: string;
  description: string;
  href: string;
  highlight?: string;
}

export function CategoryCard({ title, description, href, highlight }: CategoryCardProps) {
  return (
    <a
      href={href}
      className="group block rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
          {highlight && (
            <p className="mt-2 text-sm font-medium text-gray-700">{highlight}</p>
          )}
        </div>
        <svg className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}
