export default function Title({ title }: { title: string }) {
  return (
    <h2 className="text-xl font-bold dark:text-neutral-100 text-neutral-800 mb-2">
      {title}
    </h2>
  );
}