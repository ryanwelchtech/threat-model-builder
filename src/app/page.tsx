'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import {
  Sun,
  Moon,
  Shield,
  Download,
  Upload,
  Trash2,
  FileJson,
  FileText,
  Menu,
  X,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ComponentLibrary } from '@/components/sidebar/ComponentLibrary';
import { ThreatPanel } from '@/components/panel/ThreatPanel';
import { useThreatModelStore } from '@/store/threatModelStore';
import { ComponentType } from '@/types';
import { downloadJson, exportToPdf } from '@/lib/utils';
import { toast } from 'sonner';
import { Database } from 'lucide-react';

const ThreatCanvas = dynamic(
  () => import('@/components/canvas/ThreatCanvas').then((mod) => mod.ThreatCanvas),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center">Loading canvas...</div> }
);

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [draggingComponent, setDraggingComponent] = useState<ComponentType | null>(null);

  const {
    modelName,
    setModelName,
    exportModel,
    importModel,
    loadDemo,
    clearModel,
    getAllThreats,
    getAllMitigations,
    nodes,
  } = useThreatModelStore();

  const allThreats = getAllThreats();
  const allMitigations = getAllMitigations();
  const implementedMitigations = allMitigations.filter((m) => m.status === 'implemented');
  const criticalThreats = allThreats.filter((t) => t.severity === 'critical');

  const handleExport = useCallback(() => {
    const model = exportModel();
    downloadJson(model, `${modelName.toLowerCase().replace(/\s+/g, '-')}.json`);
    toast.success('Threat model exported successfully');
  }, [exportModel, modelName]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const model = JSON.parse(text);
        importModel(model);
        toast.success('Threat model imported successfully');
      } catch {
        toast.error('Failed to import threat model');
      }
    };
    input.click();
  }, [importModel]);

  const handleClear = useCallback(() => {
    if (confirm('Are you sure you want to clear the entire threat model?')) {
      clearModel();
      toast.success('Threat model cleared');
    }
  }, [clearModel]);

  const handleLoadDemo = useCallback(() => {
    if (nodes.length > 0 && !confirm('This will replace your current diagram. Continue?')) {
      return;
    }
    loadDemo();
    toast.success('Demo architecture loaded');
  }, [loadDemo, nodes]);

  const handlePdfExport = useCallback(async () => {
    const model = exportModel();
    const threatList = model.threats.map((t) => ({
      title: t.title,
      severity: t.severity,
      category: t.category,
      description: t.description,
    }));
    const implementedCount = model.mitigations.filter((m) => m.status === 'implemented').length;
    const coverage = model.mitigations.length > 0
      ? Math.round((implementedCount / model.mitigations.length) * 100)
      : 0;

    await exportToPdf(
      model.metadata.name,
      {
        totalThreats: model.summary.totalThreats,
        criticalThreats: model.summary.criticalThreats,
        highThreats: model.summary.highThreats,
        mediumThreats: model.summary.mediumThreats,
        lowThreats: model.summary.lowThreats,
        mitigationCoverage: coverage,
      },
      threatList,
      `${modelName.toLowerCase().replace(/\s+/g, '-')}-report.pdf`
    );
    toast.success('PDF report exported successfully');
  }, [exportModel, modelName]);

  const handleDragStart = useCallback((componentType: ComponentType) => {
    setDraggingComponent(componentType);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <nav className="glass-card h-16 border-b flex items-center px-4 gap-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex-1" />

        {/* Stats */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1.5 rounded-lg bg-muted">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </div>
            <span className="font-medium">{allThreats.length}</span>
            <span className="text-muted-foreground">threats</span>
          </div>

          {criticalThreats.length > 0 && (
            <Badge variant="critical">
              {criticalThreats.length} critical
            </Badge>
          )}

          <div className="flex items-center gap-2 text-sm">
            <div className="p-1.5 rounded-lg bg-muted">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
            <span className="font-medium">
              {implementedMitigations.length}/{allMitigations.length}
            </span>
            <span className="text-muted-foreground">mitigated</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleLoadDemo}>
            <Database className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Demo</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handlePdfExport}>
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">PDF Report</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Upload className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Import</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Component Library */}
        <aside
          className={`glass-card border-r w-80 flex-shrink-0 overflow-y-auto transition-all duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full absolute lg:relative lg:translate-x-0'
          }`}
        >
          <ComponentLibrary onDragStart={handleDragStart} onTemplateDrop={() => {}} />
        </aside>

        {/* Canvas */}
        <main className="flex-1 relative">
          {nodes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md">
                <Shield className="h-16 w-16 mx-auto mb-6 text-muted-foreground/50" />
                <h2 className="text-2xl font-semibold mb-2">Start Building</h2>
                <p className="text-muted-foreground mb-6">
                  Drag components from the sidebar to create your architecture diagram.
                  Threats will be automatically identified based on component types.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>Application</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span>Infrastructure</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>External</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          <ThreatCanvas />
        </main>

        {/* Right Panel - Threat Details */}
        <aside
          className={`glass-card border-l w-80 flex-shrink-0 overflow-hidden transition-all duration-300 ${
            panelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <ThreatPanel />
        </aside>
      </div>
    </div>
  );
}
