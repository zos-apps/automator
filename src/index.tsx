import React, { useState } from 'react';

interface Workflow {
  id: string;
  name: string;
  actions: Action[];
}

interface Action {
  id: string;
  type: string;
  name: string;
  config: Record<string, unknown>;
}

const AVAILABLE_ACTIONS = [
  { type: 'files', name: 'Get Specified Files', icon: '📁' },
  { type: 'rename', name: 'Rename Files', icon: '✏️' },
  { type: 'copy', name: 'Copy Files', icon: '📋' },
  { type: 'move', name: 'Move Files', icon: '📦' },
  { type: 'compress', name: 'Create Archive', icon: '🗜️' },
  { type: 'text', name: 'Get Text', icon: '📝' },
  { type: 'replace', name: 'Find & Replace', icon: '🔍' },
  { type: 'shell', name: 'Run Shell Script', icon: '💻' },
  { type: 'notify', name: 'Display Notification', icon: '🔔' },
  { type: 'email', name: 'Send Email', icon: '📧' },
  { type: 'http', name: 'HTTP Request', icon: '🌐' },
  { type: 'delay', name: 'Pause', icon: '⏸️' },
];

const Automator: React.FC = () => {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    { id: '1', name: 'Untitled Workflow', actions: [] }
  ]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<string>('1');
  const [showLibrary, setShowLibrary] = useState(true);

  const currentWorkflow = workflows.find(w => w.id === selectedWorkflow);

  const addAction = (type: string, name: string) => {
    if (!currentWorkflow) return;
    const newAction: Action = {
      id: Date.now().toString(),
      type,
      name,
      config: {}
    };
    setWorkflows(workflows.map(w => 
      w.id === selectedWorkflow 
        ? { ...w, actions: [...w.actions, newAction] }
        : w
    ));
  };

  const removeAction = (actionId: string) => {
    setWorkflows(workflows.map(w => 
      w.id === selectedWorkflow 
        ? { ...w, actions: w.actions.filter(a => a.id !== actionId) }
        : w
    ));
  };

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="h-12 bg-gradient-to-b from-gray-200 to-gray-300 border-b flex items-center px-4 gap-2">
        <button className="px-3 py-1 bg-white rounded shadow text-sm hover:bg-gray-50">
          ▶️ Run
        </button>
        <button className="px-3 py-1 bg-white rounded shadow text-sm hover:bg-gray-50">
          ⏹️ Stop
        </button>
        <div className="flex-1" />
        <button 
          onClick={() => setShowLibrary(!showLibrary)}
          className="px-3 py-1 bg-white rounded shadow text-sm hover:bg-gray-50"
        >
          📚 Library
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Actions Library */}
        {showLibrary && (
          <div className="w-64 bg-white border-r overflow-auto">
            <div className="p-2 bg-gray-100 font-semibold text-sm">Actions</div>
            {AVAILABLE_ACTIONS.map(action => (
              <div
                key={action.type}
                draggable
                onClick={() => addAction(action.type, action.name)}
                className="p-2 border-b hover:bg-blue-50 cursor-pointer flex items-center gap-2"
              >
                <span>{action.icon}</span>
                <span className="text-sm">{action.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Workflow Canvas */}
        <div className="flex-1 p-4 overflow-auto">
          <input
            type="text"
            value={currentWorkflow?.name || ''}
            onChange={(e) => setWorkflows(workflows.map(w => 
              w.id === selectedWorkflow ? { ...w, name: e.target.value } : w
            ))}
            className="text-xl font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 outline-none mb-4 w-full"
          />

          {currentWorkflow?.actions.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-6xl mb-4">🤖</div>
              <div>Drag actions here to build your workflow</div>
              <div className="text-sm mt-2">or click an action in the library</div>
            </div>
          ) : (
            <div className="space-y-3">
              {currentWorkflow?.actions.map((action, index) => (
                <div key={action.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">{index + 1}</span>
                      <span className="font-medium">{action.name}</span>
                    </div>
                    <button 
                      onClick={() => removeAction(action.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Configure this action...
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Automator;
