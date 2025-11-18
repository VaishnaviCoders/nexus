'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const AGENT_TYPES = [
  {
    id: 'FEE_SENSE',
    name: 'FeeSenseAI',
    description: 'Fee collection and payment reminders',
    icon: '💰',
  },
  {
    id: 'PERFORMANCE_ADVISOR',
    name: 'Performance Advisor',
    description: 'Student performance analysis',
    icon: '📊',
  },
  {
    id: 'ATTENDANCE_MONITOR',
    name: 'Attendance Monitor',
    description: 'Attendance tracking and alerts',
    icon: '📋',
  },
  {
    id: 'ENGAGEMENT_TRACKER',
    name: 'Engagement Tracker',
    description: 'Student engagement monitoring',
    icon: '👥',
  },
  {
    id: 'COMMUNICATION_HUB',
    name: 'Communication Hub',
    description: 'Parent-teacher communication',
    icon: '💬',
  },
  {
    id: 'EXAM_ANALYZER',
    name: 'Exam Analyzer',
    description: 'Exam results analysis',
    icon: '📝',
  },
];

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateAgentDialog({
  open,
  onOpenChange,
}: CreateAgentDialogProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New AI Agent</DialogTitle>
          <DialogDescription>
            Select an agent type to get started
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {AGENT_TYPES.map((type, idx) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSelectedType(type.id)}
                className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                  selectedType === type.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <div>
                      <p className="font-semibold text-foreground">
                        {type.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </div>
                  {selectedType === type.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="rounded-full bg-primary p-1"
                    >
                      <Check className="size-4 text-primary-foreground" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!selectedType}
            onClick={() => {
              console.log('Creating agent:', selectedType);
              onOpenChange(false);
            }}
          >
            Create Agent
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
