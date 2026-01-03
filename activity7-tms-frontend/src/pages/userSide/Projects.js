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

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Project</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Role</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockProjects.map((project) => (
              <tr key={project.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{project.name}</td>
                <td className="px-4 py-3 text-slate-600">{project.role}</td>
                <td className="px-4 py-3 text-slate-600">{project.progress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Projects;
