import { cloneElement, forwardRef, isValidElement } from "react";
import { cn } from "../../lib/utils";

const baseStyles =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variantStyles = {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline:
    "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
};

const sizeStyles = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-6 text-base",
  icon: "h-9 w-9"
};

const Button = forwardRef(
  (
    { className, variant = "default", size = "default", asChild = false, children, ...props },
    ref
  ) => {
    const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

    if (asChild && isValidElement(children)) {
      return cloneElement(children, {
        className: cn(classes, children.props.className),
        ref,
        ...props
      });
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
