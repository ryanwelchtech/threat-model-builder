'use client';

import { useMemo } from 'react';
import {
  Globe,
  Smartphone,
  Workflow,
  Database,
  HardDrive,
  MessagesSquare,
  Cloud,
  User,
  Shield,
} from 'lucide-react';
import { COMPONENT_LIBRARY } from '@/data/components';
import { ComponentType, COMPONENT_CATEGORIES } from '@/types';
import { cn } from '@/lib/utils';

interface ComponentLibraryProps {
  onDragStart: (componentType: ComponentType) => void;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Smartphone,
  Workflow,
  Database,
  HardDrive,
  MessagesSquare,
  Cloud,
  User,
  Shield,
};

export function ComponentLibrary({ onDragStart }: ComponentLibraryProps) {
  const groupedComponents = useMemo(() => {
    const groups: Record<string, typeof COMPONENT_LIBRARY> = {};
    COMPONENT_LIBRARY.forEach((comp) => {
      if (!groups[comp.category]) {
        groups[comp.category] = [];
      }
      groups[comp.category].push(comp);
    });
    return groups;
  }, []);

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Components</h2>
        <p className="text-sm text-muted-foreground">
          Drag components onto the canvas
        </p>
      </div>

      {Object.entries(groupedComponents).map(([category, components]) => (
        <div key={category}>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-3">
            {COMPONENT_CATEGORIES[category as keyof typeof COMPONENT_CATEGORIES]}
          </h3>
          <div className="space-y-2">
            {components.map((component) => {
              const Icon = iconMap[component.icon];
              return (
                <div
                  key={component.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('componentType', component.id);
                    onDragStart(component.id as ComponentType);
                  }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl cursor-grab',
                    'border border-border bg-background/50',
                    'hover:bg-accent hover:border-accent-foreground/20',
                    'active:cursor-grabbing transition-all duration-200',
                    'hover:-translate-y-0.5 hover:shadow-md'
                  )}
                >
                  <div className="p-2 rounded-lg bg-muted">
                    {Icon && <Icon className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{component.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {component.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
