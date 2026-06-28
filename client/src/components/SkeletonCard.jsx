/**
 * SkeletonCard — Loading placeholder that mimics the shape of a TaskCard.
 * Renders via CSS animation (shimmer effect) while tasks are loading.
 */
const SkeletonCard = () => (
  <div className="skeleton-card" aria-hidden="true">
    <div className="skeleton-card__stripe" />
    <div className="skeleton-card__content">
      <div className="skeleton-card__header">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--badge" />
      </div>
      <div className="skeleton skeleton--text" />
      <div className="skeleton skeleton--text skeleton--text-short" />
      <div className="skeleton-card__footer">
        <div className="skeleton skeleton--date" />
        <div className="skeleton skeleton--actions" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
