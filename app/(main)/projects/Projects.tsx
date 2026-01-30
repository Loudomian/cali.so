import { ProjectCard } from '~/app/(main)/projects/ProjectCard'
import { getSettings } from '~/data/settings'

export function Projects() {
  const settings = getSettings()
  const projects = settings.projects

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
    >
      {projects.map((project) => (
        <ProjectCard project={project} key={project.id} />
      ))}
    </ul>
  )
}

