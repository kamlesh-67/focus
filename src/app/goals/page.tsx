import { getProjects } from '@/app/actions/projects';
import { Target, Sparkles } from 'lucide-react';
import { ProjectCard } from '@/components/projects/project-card';
import { FAB } from '@/components/ui/fab';

export default async function GoalsPage() {
  const projects = await getProjects();

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
      <header className="mb-10">
        <h1 className="text-4xl font-black tracking-tighter mb-2">Goals & Projects</h1>
        <p className="text-muted-foreground font-medium italic">"Think big, start small, act now."</p>
      </header>

      <div className="grid gap-8">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="py-24 text-center border-2 border-dashed border-border/40 rounded-[3rem] bg-accent/5 flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center text-indigo-500 mb-2">
              <Target size={40} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black tracking-tight">No active goals</h3>
            <p className="text-muted-foreground font-bold max-w-[280px]">
              Break down your vision into manageable projects. What's your next big milestone?
            </p>
          </div>
        )}
      </div>

      <FAB />
    </div>
  );
}
