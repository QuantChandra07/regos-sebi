import clsx from "clsx";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({
  className,
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={clsx(
        "animate-pulse rounded-md bg-gray-800/70",
        className,
      )}
    />
  );
}

export default Skeleton;