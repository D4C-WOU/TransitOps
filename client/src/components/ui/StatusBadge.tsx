import clsx from "clsx";

type Props = { status: string };

const styles: Record<string, string> = {
  available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  on_trip: "bg-blue-50 text-blue-700 ring-blue-200",
  in_shop: "bg-amber-50 text-amber-700 ring-amber-200",
  retired: "bg-slate-100 text-slate-600 ring-slate-200",
  off_duty: "bg-slate-100 text-slate-600 ring-slate-200",
  suspended: "bg-red-50 text-red-700 ring-red-200",
  draft: "bg-slate-100 text-slate-600 ring-slate-200",
  dispatched: "bg-blue-50 text-blue-700 ring-blue-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  active: "bg-amber-50 text-amber-700 ring-amber-200",
  closed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function StatusBadge({ status }: Props) {
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1", styles[status] || styles.draft)}>
      {status.replace(/_/g, " ")}
    </span>
  );
}