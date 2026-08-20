interface SkeletonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "sm" | "md" | "lg" | "full";
}
export function SkeletonTable({
  className,
  rounded = "md",
  ...props
}: SkeletonTableProps) {
  const roundedClass = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }[rounded];

  return (
    <div
      className={`
        animate-pulse ${roundedClass}
        bg-gray-200 dark:bg-gray-700
        ${className}
      `}
      {...props}
    />
  );
}
