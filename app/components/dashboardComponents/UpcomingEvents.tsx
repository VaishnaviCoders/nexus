'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, Users, ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';

// Mock data - replace with actual API calls
const events = [
  {
    id: 1,
    title: 'Parent-Teacher Meeting',
    date: '2024-01-15',
    time: '10:00 AM',
    location: 'Main Auditorium',
    attendees: 150,
    type: 'meeting',
    priority: 'high',
    description: 'Quarterly progress discussion',
  },
  {
    id: 2,
    title: 'Annual Sports Day',
    date: '2024-01-20',
    time: '9:00 AM',
    location: 'Sports Ground',
    attendees: 500,
    type: 'event',
    priority: 'medium',
    description: 'Inter-house sports competition',
  },
  {
    id: 3,
    title: 'Mid-term Examinations',
    date: '2024-01-25',
    time: '9:30 AM',
    location: 'All Classrooms',
    attendees: 1200,
    type: 'exam',
    priority: 'high',
    description: 'Half-yearly assessment',
  },
  {
    id: 4,
    title: 'Science Fair',
    date: '2024-02-01',
    time: '2:00 PM',
    location: 'Science Lab',
    attendees: 80,
    type: 'event',
    priority: 'low',
    description: 'Student project showcase',
  },
];

const priorityColors = {
  high: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
  medium:
    'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800',
  low: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800',
};

const typeColors = {
  meeting: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  event: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  exam: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
};

export function UpcomingEvents() {
  return (
    <Card className="border-0 bg-gradient-to-br from-card via-card to-purple-50/20 dark:to-purple-950/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5" />
            Upcoming Events
          </CardTitle>
          <Link href="/dashboard/holidays">
            <Button variant="outline" size="sm">
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          </Link>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded-lg border bg-background/50 hover:bg-background/80 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      priorityColors[
                        event.priority as keyof typeof priorityColors
                      ]
                    }`}
                  >
                    {event.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  {event.description}
                </p>
              </div>

              <div
                className={`p-1.5 rounded-lg ${
                  typeColors[event.type as keyof typeof typeColors]
                }`}
              >
                <Calendar className="w-3 h-3" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {event.time}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {event.location}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {event.attendees} attendees
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs capitalize">
                {event.type}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                View Details
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ))}

        <Link href="/dashboard/holidays">
          <Button variant="outline" className="w-full group">
            View All Events
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// We can Add
// Weekly Attendance / Report Download Option
// Complaint Summary
