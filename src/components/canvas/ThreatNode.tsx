'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
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
  AlertTriangle,
  GitMerge,
  Key,
  Mail,
  Search,
  FileText,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThreatNodeData, ComponentType } from '@/types';
import { Badge } from '@/components/ui/badge';

const iconMap: Record<ComponentType, React.ComponentType<{ className?: string }>> = {
  webApplication: Globe,
  mobileApp: Smartphone,
  apiGateway: Workflow,
  database: Database,
  cache: HardDrive,
  messageQueue: MessagesSquare,
  externalService: Cloud,
  userActor: User,
  trustBoundary: Shield,
  loadBalancer: GitMerge,
  dns: Globe,
  fileStorage: HardDrive,
  cdn: Zap,
  authService: Key,
  emailService: Mail,
  searchService: Search,
  loggingService: FileText,
};

const categoryColors: Record<string, string> = {
  application: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  infrastructure: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  external: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
  boundary: 'from-gray-500/20 to-gray-600/20 border-gray-500/30 border-dashed',
};

function ThreatNodeComponent({ data, selected }: NodeProps<ThreatNodeData>) {
  const Icon = iconMap[data.componentType] || Globe;
  const threatCount = data.threats?.length || 0;
  const criticalThreats = data.threats?.filter((t) => t.severity === 'critical').length || 0;
  const highThreats = data.threats?.filter((t) => t.severity === 'high').length || 0;

  const category =
    data.componentType === 'trustBoundary'
      ? 'boundary'
      : ['webApplication', 'mobileApp', 'apiGateway'].includes(data.componentType)
      ? 'application'
      : ['database', 'cache', 'messageQueue'].includes(data.componentType)
      ? 'infrastructure'
      : 'external';

  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !w-3 !h-3" />
      <div
        className={cn(
          'px-4 py-3 rounded-xl border-2 min-w-[180px] transition-all duration-300',
          'bg-gradient-to-br backdrop-blur-sm shadow-lg',
          categoryColors[category],
          selected && 'ring-2 ring-blue-500 ring-offset-2 ring-offset-background scale-105'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-background/50">
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm break-words">{data.label}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {data.componentType.replace(/([A-Z])/g, ' $1').trim()}
            </p>
          </div>
        </div>

        {threatCount > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-xs text-muted-foreground">{threatCount} threats</span>
            {criticalThreats > 0 && (
              <Badge variant="critical" className="text-[10px] px-1.5 py-0">
                {criticalThreats} critical
              </Badge>
            )}
            {highThreats > 0 && (
              <Badge variant="high" className="text-[10px] px-1.5 py-0">
                {highThreats} high
              </Badge>
            )}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !w-3 !h-3" />
    </>
  );
}

export const ThreatNode = memo(ThreatNodeComponent);
