import { Loader2 } from "lucide-react";

const variants = {
  primary:
    "bg-ink text-white shadow-soft hover:-translate-y-0.5 hover:bg-slate-900 disabled:hover:translate-y-0",
  secondary:
    "bg-white/70 text-ink ring-1 ring-white/70 hover:-translate-y-0.5 hover:bg-white disabled:hover:translate-y-0",
  subtle: "bg-ink/5 text-ink hover:bg-ink/10",
};

export default function Button({
  as: Element = "button",
  children,
  className = "",
  icon: Icon,
  isLoading = false,
  variant = "primary",
  ...props
}) {
  const elementProps = Element === "button" ? { type: "button", ...props } : props;

  return (
    <Element
      className={[
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      ].join(" ")}
      {...elementProps}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : Icon ? <Icon className="h-4 w-4" /> : null}
      <span>{children}</span>
    </Element>
  );
}
