export default function GlassPanel({ as: Element = "section", children, className = "" }) {
  return <Element className={["glass-panel rounded-2xl", className].join(" ")}>{children}</Element>;
}
