interface SectionTitleProps {
  title: string;
}

export default function SectionTitle({ title }: SectionTitleProps) {
  return (
    <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-200 mb-4">
      {title}
    </h2>
  );
}