'use client';

import { useThreatModelStore } from '@/store/threatModelStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { STRIDE_DESCRIPTIONS, ThreatSeverity } from '@/types';
import {
  AlertTriangle,
  Shield,
  Trash2,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const severityOrder: ThreatSeverity[] = ['critical', 'high', 'medium', 'low', 'info'];

export function ThreatPanel() {
  const { getSelectedNode, updateMitigation, removeThreat, deleteNode, selectedNodeId } =
    useThreatModelStore();
  const [expandedThreats, setExpandedThreats] = useState<string[]>([]);

  const selectedNode = getSelectedNode();

  const toggleThreat = (threatId: string) => {
    setExpandedThreats((prev) =>
      prev.includes(threatId) ? prev.filter((id) => id !== threatId) : [...prev, threatId]
    );
  };

  if (!selectedNode) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a component to view threats</p>
        </div>
      </div>
    );
  }

  const { threats, mitigations, label, componentType } = selectedNode.data;

  const sortedThreats = [...threats].sort(
    (a, b) => severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );

  return (
    <div className="p-4 h-full overflow-y-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{label}</h2>
          <p className="text-sm text-muted-foreground capitalize">
            {componentType.replace(/([A-Z])/g, ' $1').trim()}
          </p>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => selectedNodeId && deleteNode(selectedNodeId)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{threats.length}</p>
                <p className="text-xs text-muted-foreground">Threats</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{mitigations.length}</p>
                <p className="text-xs text-muted-foreground">Mitigations</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Threats */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Identified Threats</h3>
        <div className="space-y-2">
          {sortedThreats.map((threat) => {
            const isExpanded = expandedThreats.includes(threat.id);
            const strideInfo = STRIDE_DESCRIPTIONS[threat.category];
            const linkedMitigations = mitigations.filter((m) =>
              threat.mitigationIds.includes(m.id)
            );

            return (
              <div
                key={threat.id}
                className="border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleThreat(threat.id)}
                  className="w-full p-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Badge variant={threat.severity}>{threat.severity}</Badge>
                  <span className="flex-1 text-left text-sm font-medium truncate">
                    {threat.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      selectedNodeId && removeThreat(selectedNodeId, threat.id);
                    }}
                  >
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 border-t bg-muted/30">
                    <div className="pt-3">
                      <Badge variant="outline" className="mb-2">
                        {strideInfo.name}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {threat.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Likelihood:</span>{' '}
                        <span className="font-medium capitalize">{threat.likelihood}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Impact:</span>{' '}
                        <span className="font-medium capitalize">{threat.impact}</span>
                      </div>
                      {threat.cweId && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">CWE:</span>{' '}
                          <span className="font-mono">{threat.cweId}</span>
                        </div>
                      )}
                    </div>

                    {linkedMitigations.length > 0 && (
                      <div>
                        <p className="text-xs font-medium mb-2">Mitigations:</p>
                        <div className="space-y-1">
                          {linkedMitigations.map((mit) => (
                            <div
                              key={mit.id}
                              className="flex items-center gap-2 text-xs p-2 bg-background rounded"
                            >
                              {mit.status === 'implemented' ? (
                                <CheckCircle className="h-3 w-3 text-green-500" />
                              ) : mit.status === 'planned' ? (
                                <Clock className="h-3 w-3 text-yellow-500" />
                              ) : (
                                <XCircle className="h-3 w-3 text-red-500" />
                              )}
                              <span className="flex-1 truncate">{mit.title}</span>
                              <select
                                value={mit.status}
                                onChange={(e) =>
                                  selectedNodeId &&
                                  updateMitigation(selectedNodeId, mit.id, {
                                    status: e.target.value as 'implemented' | 'planned' | 'not-implemented',
                                  })
                                }
                                className="text-xs bg-transparent border rounded px-1"
                              >
                                <option value="not-implemented">Not Implemented</option>
                                <option value="planned">Planned</option>
                                <option value="implemented">Implemented</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
