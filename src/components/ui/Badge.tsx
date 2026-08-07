export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-muted-bg text-foreground",
    success: "bg-green-100 text-success",
    warning: "bg-amber-100 text-amber-800",
    danger: "bg-red-100 text-danger",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
