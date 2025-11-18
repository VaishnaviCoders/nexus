'use client';

import type { FeeSenseReport } from '@/generated/prisma/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, AlertTriangle, Users } from 'lucide-react';

interface FeeSenseAgentReportsProps {
  reports: FeeSenseReport[];
}

export default function FeeSenseAgentReports({
  reports,
}: FeeSenseAgentReportsProps) {
  const handleDownload = (reportId: string) => {
    // TODO: Implement report download
    console.log('Downloading report:', reportId);
  };

  return (
    <div className="space-y-4">
      {reports.length === 0 ? (
        <Card className="border border-border bg-card p-8 text-center">
          <p className="text-muted-foreground">No reports available yet</p>
        </Card>
      ) : (
        reports.map((report) => (
          <Card
            key={report.id}
            className="border border-border bg-card overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Report · {new Date(report.reportDate).toLocaleDateString()}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Generated {new Date(report.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  onClick={() => handleDownload(report.id)}
                  variant="outline"
                  size="sm"
                  className="border-border"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-background rounded-lg p-4 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <p className="text-xs text-muted-foreground">
                      Students At Risk
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {report.totalStudentsAtRisk}
                  </p>
                </div>

                <div className="bg-background rounded-lg p-4 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <p className="text-xs text-muted-foreground">
                      Critical Risk
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-red-500">
                    {report.highRiskCount || 0}
                  </p>
                </div>

                <div className="bg-background rounded-lg p-4 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-yellow-500" />
                    <p className="text-xs text-muted-foreground">
                      Total Overdue
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    ₹{(report.totalOverdueAmount || 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-background rounded-lg p-4 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-green-500" />
                    <p className="text-xs text-muted-foreground">Emails Sent</p>
                  </div>
                  <p className="text-2xl font-bold text-green-500">
                    {report.emailsSent || 0}
                  </p>
                </div>
              </div>

              {report.insights &&
                typeof report.insights === 'object' &&
                'trends' in report.insights && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <h4 className="font-semibold text-foreground mb-3">
                      Insights & Recommendations
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Trends
                        </p>
                        <ul className="text-sm text-foreground space-y-1">
                          {Array.isArray((report.insights as any).trends) &&
                            (report.insights as any).trends
                              .slice(0, 2)
                              .map((trend: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{trend}</span>
                                </li>
                              ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">
                          Recommendations
                        </p>
                        <ul className="text-sm text-foreground space-y-1">
                          {Array.isArray(
                            (report.insights as any).recommendations
                          ) &&
                            (report.insights as any).recommendations
                              .slice(0, 2)
                              .map((rec: string, i: number) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-green-500 mt-1">•</span>
                                  <span>{rec}</span>
                                </li>
                              ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </Card>
        ))
      )}
    </div>
  );
}
