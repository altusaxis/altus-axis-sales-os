'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export interface LeadCard {
  id: string;
  name: string;
  practice: string;
  priorityScore: number;
  warmth: string;
}

const STAGES = ['new', 'contacted', 'responded', 'discovery', 'proposal', 'negotiation', 'won', 'lost'];

export function KanbanPipeline({ initialLeads }: { initialLeads: Record<string, LeadCard[]> }) {
  const [columns, setColumns] = useState(initialLeads);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceIdx = source.droppableId;
    const destIdx = destination.droppableId;

    if (sourceIdx === destIdx) {
      const items = Array.from(columns[sourceIdx]);
      const [reordered] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reordered);
      setColumns({ ...columns, [sourceIdx]: items });
    } else {
      const sourceItems = Array.from(columns[sourceIdx] || []);
      const destItems = Array.from(columns[destIdx] || []);
      const [moved] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, moved);

      setColumns({
        ...columns,
        [sourceIdx]: sourceItems,
        [destIdx]: destItems,
      });

      // Invoke Supabase Status Update API mutation here...
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-6">
        {STAGES.map((stage) => (
          <div key={stage} className="w-72 bg-slate-900 border border-slate-800 rounded-xl flex-shrink-0 flex flex-col max-h-[80vh]">
            <div className="p-3 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{stage}</span>
              <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                {columns[stage]?.length || 0}
              </span>
            </div>

            <Droppable droppableId={stage}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="p-2 space-y-2 flex-1 overflow-y-auto min-h-[150px]">
                  {columns[stage]?.map((lead, idx) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={idx}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-slate-950 border border-slate-800 hover:border-indigo-500/50 p-3 rounded-lg shadow-sm cursor-grab active:cursor-grabbing transition"
                        >
                          <div className="text-sm font-semibold text-slate-200">{lead.name}</div>
                          <div className="text-xs text-slate-400">{lead.practice}</div>
                          <div className="mt-3 flex justify-between items-center text-[10px]">
                            <span className="bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/40 font-mono">
                              Score: {lead.priorityScore}
                            </span>
                            <span className="text-slate-400 uppercase tracking-wider">{lead.warmth}</span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}