interface KPIProps {
  title: string;
  value: string;
}

export default function KPI({ title, value }: KPIProps) {
  return (
    <div className="p-4">
      <div className="text-lg font-semibold text-neutral-200 dark:text-neutral-600">{title}</div>
      <div className="text-4xl font-bold text-neutral-100 dark:text-neutral-800">{value}</div>
    </div>
  );
}