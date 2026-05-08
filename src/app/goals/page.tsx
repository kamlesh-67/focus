import { getProjects } from '@/app/actions/projects';
import { Target, Plus } from 'lucide-react';
import { ProjectCard } from '@/components/projects/project-card';
import { FAB } from '@/components/ui/fab';

export default async function GoalsPage() {
  const projects = await getProjects();

  return (
    <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Goals & Projects</h1>
          <p className="text-muted-foreground">Track your long-term progress.</p>
        </div>
      </header>

      <div className="grid gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-border/30 rounded-3xl bg-card/50">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Target className="text-primary" size={32} />
            </div>
            <h3 className="text-lg font-semibold">No active goals</h3>
            <p className="text-muted-foreground max-w-xs mx-auto mt-2">
              Break down your big ideas into manageable projects and tasks.
            </p>
          </div>
        )}
      </div>

      <FAB />
    </div>
  );
}
