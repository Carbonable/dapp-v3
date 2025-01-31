interface ProjectStatusProps {
  status: 'live' | 'paused';
}
export default function ProjectStatus({ status }: ProjectStatusProps) {
  const colorClasses = {
    live: 'bg-green-100/80 text-green-700 border-green-300',
    paused: 'bg-orange-100/80 text-orange-700 border-orange-300'
  };

  return (
    <div className={`
      inline-flex items-center px-3 py-1 
      border rounded-full backdrop-blur-sm
      ${status ? colorClasses[status] : ''}
    `}>
      <div className={`
        w-2 h-2 rounded-full mr-2
        ${status === 'live' ? 'bg-green-500' : 'bg-orange-500'}
      `} />
      <span className="text-xs capitalize">{status}</span>
    </div>
  );
}