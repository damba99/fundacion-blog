export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border py-16 px-6 text-center">
      <p className="text-base font-medium text-foreground">{title}</p>
      {description && (
        <p className="max-w-md text-sm text-muted">{description}</p>
      )}
    </div>
  );
}
