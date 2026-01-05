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
  Layout,
  Server,
  Layers,
  Building2,
  Box,
  GitMerge,
  Key,
  Mail,
  Search,
  FileText,
  Zap,
} from 'lucide-react';
import { COMPONENT_LIBRARY, ARCHITECTURE_TEMPLATES } from '@/data/components';
import { ComponentType, COMPONENT_CATEGORIES } from '@/types';
import { cn } from '@/lib/utils';

interface ComponentLibraryProps {
  onDragStart: (componentType: ComponentType) => void;
  onTemplateDrop?: (templateId: string) => void;
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
  GitMerge,
  Key,
  Mail,
  Search,
  FileText,
  Zap,
};

const templateIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Workflow,
  MessagesSquare,
  Smartphone,
  Database,
  Cloud,
  HardDrive,
  Layers,
  Building2,
  Box,
  Server,
  Layout,
};

export function ComponentLibrary({ onDragStart, onTemplateDrop }: ComponentLibraryProps) {
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

  const groupedTemplates = useMemo(() => {
    const groups: Record<string, typeof ARCHITECTURE_TEMPLATES> = {};
    ARCHITECTURE_TEMPLATES.forEach((template) => {
      if (!groups[template.category]) {
        groups[template.category] = [];
      }
      groups[template.category].push(template);
    });
    return groups;
  }, []);

  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Prebuilt Architectures</h2>
        <p className="text-sm text-muted-foreground">
          Drag templates to create complete architectures
        </p>
      </div>

      {Object.entries(groupedTemplates).map(([category, templates]) => (
        <div key={category}>
          <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-3">
            {category}
          </h3>
          <div className="space-y-2">
            {templates.map((template) => {
              const Icon = templateIconMap[template.icon] || Layout;
              return (
                <div
                  key={template.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('templateId', template.id);
                    e.dataTransfer.setData('isTemplate', 'true');
                    onTemplateDrop?.(template.id);
                  }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-xl cursor-grab',
                    'border border-purple-500/30 bg-purple-500/5',
                    'hover:bg-purple-500/10 hover:border-purple-500/50',
                    'active:cursor-grabbing transition-all duration-200',
                    'hover:-translate-y-0.5 hover:shadow-md'
                  )}
                >
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Icon className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{template.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {template.description}
                    </p>
                    <p className="text-xs text-purple-500/70 mt-1">
                      {template.components.length} components
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div className="border-t pt-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Components</h2>
          <p className="text-sm text-muted-foreground">
            Drag individual components onto the canvas
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
                      e.dataTransfer.setData('isTemplate', 'false');
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
    </div>
  );
}
