import type { LucideIcon } from "lucide-react";

interface EmptyModuleStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryAction?: string;
  secondaryAction?: string;
  helperText?: string;
}

const EmptyModuleState = ({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  helperText,
}: EmptyModuleStateProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>

      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex flex-wrap gap-2">
          {primaryAction && (
            <button
              type="button"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
            >
              {primaryAction}
            </button>
          )}
          {secondaryAction && (
            <button
              type="button"
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {secondaryAction}
            </button>
          )}
        </div>
      )}

      {helperText && <p className="mt-4 text-xs text-muted-foreground">{helperText}</p>}
    </div>
  );
};

export default EmptyModuleState;
