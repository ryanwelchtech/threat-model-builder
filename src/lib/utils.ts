import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function calculateRiskScore(
  likelihood: 'high' | 'medium' | 'low',
  impact: 'high' | 'medium' | 'low'
): number {
  const likelihoodValues = { high: 3, medium: 2, low: 1 };
  const impactValues = { high: 3, medium: 2, low: 1 };
  return likelihoodValues[likelihood] * impactValues[impact];
}

export function getRiskLevel(score: number): 'critical' | 'high' | 'medium' | 'low' {
  if (score >= 9) return 'critical';
  if (score >= 6) return 'high';
  if (score >= 3) return 'medium';
  return 'low';
}

export function downloadJson(data: object, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export async function exportToPdf(
  title: string,
  summary: {
    totalThreats: number;
    criticalThreats: number;
    highThreats: number;
    mediumThreats: number;
    lowThreats: number;
    mitigationCoverage: number;
  },
  threats: Array<{
    title: string;
    severity: string;
    category: string;
    description: string;
    mitigationStatus?: string;
  }>,
  filename: string
): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const doc = new jsPDF();
  let yPos = 20;
  const margin = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, margin, yPos);
  yPos += 15;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
  yPos += 20;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Summary', margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Threats: ${summary.totalThreats}`, margin, yPos);
  yPos += 6;
  doc.text(`Critical: ${summary.criticalThreats}  |  High: ${summary.highThreats}  |  Medium: ${summary.mediumThreats}  |  Low: ${summary.lowThreats}`, margin, yPos);
  yPos += 6;
  doc.text(`Mitigation Coverage: ${summary.mitigationCoverage}%`, margin, yPos);
  yPos += 15;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Threat Report', margin, yPos);
  yPos += 10;

  for (const threat of threats) {
    if (yPos > 260) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');

    const severityColor = threat.severity === 'critical' ? '#ef4444' :
                          threat.severity === 'high' ? '#f97316' :
                          threat.severity === 'medium' ? '#eab308' : '#3b82f6';
    doc.setTextColor(0, 0, 0);
    doc.text(`[${threat.severity.toUpperCase()}] ${threat.title}`, margin, yPos);
    yPos += 6;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Category: ${threat.category}`, margin, yPos);
    yPos += 5;

    const descLines = doc.splitTextToSize(threat.description, contentWidth);
    doc.text(descLines, margin, yPos);
    yPos += descLines.length * 4 + 5;

    doc.setTextColor(0, 0, 0);
    yPos += 5;
  }

  doc.save(filename);
}
