'use client';
/* eslint-disable @next/next/no-img-element */
import { Project } from '@/config/projects';
import { cn } from "@heroui/react";
import { useRouter } from 'next/navigation';

export interface ImageCardProps {
  project: Project | undefined;
  canNavigate?: boolean;
}

export function ImageCard({ project, canNavigate = true }: ImageCardProps) {
  const router = useRouter();

  if (!project) return null;

  const handleClick = () => {
    if (!canNavigate) return;
    router.push(`/project/${project.id}`);
  };

  return (
    <div 
      className={cn("relative group overflow-hidden rounded-lg", canNavigate && "cursor-pointer")}
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (!canNavigate) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="relative pb-[100%]">
        <img
          src={`/assets/images/projects/${project.id}.jpg`}
          alt={project.name}
          className={cn("absolute inset-0 w-full h-full object-cover transition-transform duration-300", canNavigate && "group-hover:scale-110")}
        />
        
        <div className={cn("absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent opacity-90 transition-opacity duration-300", canNavigate && "group-hover:opacity-100")}>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className='pl-2'>
              <h3 className="text-2xl font-bold">{project.name}</h3>
              <div>
                <span className="text-neutral-300 text-xs font-semibold">Based in</span>
                <span className="text-neutral-100 text-sm font-bold ml-1">{project.country}</span>
              </div>
              <div>
                <span className="text-neutral-300 text-xs font-semibold">By</span>
                <span className="text-neutral-100 text-sm font-bold ml-1">{project.developer}</span>
              </div>
            </div>
            <div className="flex items-center mt-8 justify-between px-4 py-2 w-full mx-auto bg-opacityLight-10 rounded-lg border border-opacityLight-20 shadow-sm">
              <div>
                <div className="text-neutral-300 text-xs font-semibold">Vintages</div>
                <div className="text-neutral-100 text-sm font-bold">{project.dates}</div>
              </div>
              <div className="text-right">
                <div className="text-neutral-300 text-xs font-semibold">Certified by</div>
                <div className="text-neutral-100 text-sm font-bold">{project.certifier}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}