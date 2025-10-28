import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";

const baseItemClasses =
  "group flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors";

const activeItemClasses = "bg-primary/10 text-foreground shadow-sm";
const inactiveItemClasses =
  "text-muted-foreground hover:bg-muted/40 hover:text-foreground";

function Sidebar({
  title = "Panel",
  subtitle,
  items = [],
  footer,
  className
}) {
  return (
    <aside
      className={cn(
        "hidden w-64 shrink-0 border-r border-border bg-card/70 backdrop-blur md:flex",
        className
      )}
    >
      <div className="flex h-full w-full flex-col">
        <div className="border-b border-border px-6 py-5">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map(({ to, label, badge, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(baseItemClasses, isActive ? activeItemClasses : inactiveItemClasses)
              }
            >
              <span>{label}</span>
              {badge ? (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                  {badge}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        {footer ? (
          <div className="border-t border-border px-6 py-4 text-xs text-muted-foreground">
            {footer}
          </div>
        ) : null}
      </div>
    </aside>
  );
}

export { Sidebar };

