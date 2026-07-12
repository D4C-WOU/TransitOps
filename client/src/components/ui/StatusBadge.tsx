import { colorsFor } from "@/lib/statusColors";

type Props = { status: string };

export default function StatusBadge({ status }: Props) {
  const c = colorsFor(status);
  return (
    <span className="status-pill" style={{ color: c.fg, background: c.bg }}>
      <span className="status-dot" style={{ background: c.dot }} />
      {status.replace(/_/g, " ")}
    </span>
  );
}
