'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { FeeSenseAgent } from '@/generated/prisma/client';

const chartData = [
  { time: '00:00', executions: 10, successful: 10 },
  { time: '04:00', executions: 20, successful: 19 },
  { time: '08:00', executions: 35, successful: 34 },
  { time: '12:00', executions: 28, successful: 27 },
  { time: '16:00', executions: 42, successful: 41 },
  { time: '20:00', executions: 31, successful: 30 },
  { time: '24:00', executions: 25, successful: 25 },
];

export default function AgentDetailView({ agent }: { agent: FeeSenseAgent }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Runs', value: agent.totalRuns, subtext: 'all time' },
          {
            label: 'Successful',
            value: agent.successfulRuns,
            subtext: `${((agent.successfulRuns / agent.totalRuns) * 100).toFixed(1)}% success`,
          },
          { label: 'Failed', value: agent.failedRuns, subtext: 'last 30 days' },
          {
            label: 'Avg Time',
            value: `${agent.totalRuns / agent.successfulRuns}s`,
            subtext: 'per execution',
          },
        ].map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
          >
            <Card className="p-4">
              <p className="text-xs text-muted-foreground">{metric.label}</p>
              <p className="mt-2 text-2xl font-bold text-foreground">
                {metric.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {metric.subtext}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Execution Timeline Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground">
            Execution Timeline (24h)
          </h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid var(--color-border)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="successful"
                  stroke="var(--color-chart-1)"
                  name="Successful"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground">
            Recent Activity
          </h3>
          <div className="mt-4 space-y-3">
            {[
              {
                time: '2 hours ago',
                event: 'Agent ran successfully',
                status: 'success',
              },
              {
                time: '6 hours ago',
                event: 'Configuration updated',
                status: 'info',
              },
              { time: '1 day ago', event: 'Agent re-enabled', status: 'info' },
            ].map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + idx * 0.05 }}
                className="flex items-center justify-between border-b border-border py-3 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {activity.event}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
                <Badge
                  variant={
                    activity.status === 'success' ? 'default' : 'secondary'
                  }
                >
                  {activity.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
