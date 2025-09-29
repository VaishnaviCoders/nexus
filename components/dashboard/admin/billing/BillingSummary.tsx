"use client";

import { Progress } from "@/components/ui/progress";
import { formatCurrencyINWithSymbol } from "@/lib/utils";
import React from "react";

type ChannelKey = "email" | "sms" | "whatsapp" | "push";

type ChannelStats = {
  units: number;
  cost: number;
};

type BillingSummaryData = {
  channelSummary: Record<ChannelKey, ChannelStats>;
  totalStorageMB: number | string; // UI accepts either (function returns string)
  totalCost: number;
};

export type BillingSummaryProps = {
  data: BillingSummaryData;
  className?: string;
};

const CHANNEL_LABELS: Record<ChannelKey, string> = {
  email: "Email",
  sms: "SMS",
  whatsapp: "WhatsApp",
  push: "Push",
};

const formatNumber = (n: number) => new Intl.NumberFormat(undefined).format(n);


export const BillingSummary: React.FC<BillingSummaryProps> = ({ data, className }) => {
  const { channelSummary, totalStorageMB, totalCost } = data;

  const channelRows = (Object.keys(channelSummary) as ChannelKey[]).map((key) => ({
    key,
    label: CHANNEL_LABELS[key],
    units: channelSummary[key].units || 0,
    cost: channelSummary[key].cost || 0,
  }));

  const totalUnits = channelRows.reduce((s, r) => s + r.units, 0);

  return (
    <section className={"w-full space-y-6 " + (className || "")}>
      {/* Top summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">Total Storage Used</div>
          <div className="mt-1 text-2xl font-semibold">{typeof totalStorageMB === "string" ? totalStorageMB : totalStorageMB.toFixed(2)} MB</div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
            {/* Simple visual bar based on arbitrary cap (e.g., 10240 MB = 10 GB) */}
            {(() => {
              const cap = 1024; // 10240 = 10 GB reference bar // 1024 = 1 GB reference bar
              const used = Number(totalStorageMB) || 0;
              const pct = Math.min(100, Math.round((used / cap) * 100));
              return <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />;
            })()}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Reference bar vs 1GB</p>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">Total Messages (All Channels)</div>
          <div className="mt-1 text-2xl font-semibold">{formatNumber(totalUnits)}</div>
        </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="text-sm text-muted-foreground">Total Cost</div>
          <div className="mt-1 text-2xl font-semibold">{formatCurrencyINWithSymbol(totalCost)}</div>
        </div>
      </div>

      {/* Channels table */}
      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="border-b p-4">
          <h3 className="text-base font-medium">Channel Usage</h3>
          <p className="text-sm text-muted-foreground">Units sent and corresponding cost per channel</p>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3 font-medium">Channel</th>
                <th className="p-3 font-medium">Units</th>
                <th className="p-3 font-medium">Cost</th>
                <th className="p-3 font-medium">Proportion</th>
              </tr>
            </thead>
            <tbody>
              {channelRows.map((row) => {
                const proportion = totalUnits > 0 ? Math.round((row.units / totalUnits) * 100) : 0;
                return (
                  <tr key={row.key} className="border-t">
                    <td className="p-3">{row.label}</td>
                    <td className="p-3 tabular-nums">{formatNumber(row.units)}</td>
                    <td className="p-3 tabular-nums">{formatCurrencyINWithSymbol(row.cost)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          {/* <div className="h-full rounded-full bg-primary" style={{ width: `${share}%` }} /> */}
                          <Progress value={proportion} className="h-2" />
                        </div>
                        <span className="w-10 shrink-0 text-right tabular-nums">{proportion}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t bg-muted/30">
                <td className="p-3 font-medium">Total</td>
                <td className="p-3 font-semibold tabular-nums">{formatNumber(totalUnits)}</td>
                <td className="p-3 font-semibold tabular-nums">{formatCurrencyINWithSymbol(totalCost)}</td>
                <td className="p-3" />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </section>
  );
};

export default BillingSummary;