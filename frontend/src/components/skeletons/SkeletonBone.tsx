interface SkeletonBoneProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export default function SkeletonBone({
  width = "100%",
  height = 16,
  borderRadius = 6,
  className = "",
}: SkeletonBoneProps) {
  return (
    <div
      className={`skeleton-bone ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}
