/** SkeletonRow — row-style loading placeholder */
const SkeletonRow = () => (
  <div className="skeleton-row" aria-hidden="true">
    <div className="skeleton skeleton-row__circle" />
    <div className="skeleton-row__body">
      <div className="skeleton skeleton-row__title" />
      <div className="skeleton skeleton-row__sub" />
    </div>
  </div>
);

export default SkeletonRow;
