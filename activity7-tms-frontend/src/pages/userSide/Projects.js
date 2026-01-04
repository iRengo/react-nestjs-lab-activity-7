import React from 'react';
import PageHeader from '../../components/common/PageHeader';

const mockProjects = [
  { id: 1, name: 'Website Redesign', role: 'Contributor', progress: '65%' },
  { id: 2, name: 'Mobile Launch', role: 'Reviewer', progress: '40%' },
  { id: 3, name: 'Client Onboarding', role: 'Owner', progress: '90%' },
];

const Projects = () => {
  return (
    <section className="space-y-6">
      <PageHeader
        title="My Projects"
        subtitle="View the initiatives you are contributing to."
      />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Project</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Role</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {mockProjects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{project.name}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{project.role}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{project.progress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Projects;
