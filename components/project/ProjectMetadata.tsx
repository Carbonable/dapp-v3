interface ProjectMetadataProps {
  label: string;
  value: string;
}

export default function ProjectMetadata({ label, value }: ProjectMetadataProps) {
  return (
    <div className="border border-opacityDark-40 dark:border-opacityLight-20 rounded-lg p-2 md:p-4">
      <div className="dark:text-neutral-300 font-light text-xs uppercase">{label}</div>
      <div className="dark:text-neutral-100 font-bold md:text-lg">{value}</div>
    </div>
  );
}