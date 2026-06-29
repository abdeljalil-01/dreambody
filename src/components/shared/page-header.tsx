interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {/* Decorative accent */}
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-block h-[3px] w-6 rounded-full bg-primary/60" />
          <span className="inline-block h-[3px] w-2 rounded-full bg-primary/30" />
        </div>
        <h1 className="text-[clamp(1.6rem,3.5vw,2.1rem)] font-bold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
