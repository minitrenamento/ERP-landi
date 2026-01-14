import React from 'react';
import { MOCK_PROJECTS } from '../constants';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const Projects: React.FC = () => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'In Progress': return 'text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30';
      case 'Completed': return 'text-green-600 dark:text-green-300 bg-green-50 dark:bg-green-900/30';
      case 'On Hold': return 'text-orange-600 dark:text-orange-300 bg-orange-50 dark:bg-orange-900/30';
      default: return 'text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700';
    }
  };

  return (
    <div className="space-y-6" id="printable-area">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Projetos</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Acompanhamento de entregas e prazos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {MOCK_PROJECTS.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{project.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{project.clientName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1 text-gray-600 dark:text-gray-300">
                <span>Progresso</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    project.progress === 100 ? 'bg-green-500' : 'bg-brand-500'
                  }`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock size={16} className="text-gray-400" />
                <span>Prazo: {new Date(project.deadline).toLocaleDateString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(project.budget)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;