// components/leads/assign-lead-dialog.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AssignLeadFormData, assignLeadSchema } from '@/lib/schemas';
import {
  assignLead,
  getAvailableUsersForLeads,
  unassignLead,
} from '@/lib/data/leads/assign-lead';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage?: string | null;
  role: string;
}

interface AssignLeadDialogProps {
  leadId: string;
  currentAssignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string | null;
  } | null;
  onAssignmentChange?: () => void;
}

export function AssignLeadDialog({
  leadId,
  currentAssignedTo,
  onAssignmentChange,
}: AssignLeadDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const form = useForm<AssignLeadFormData>({
    resolver: zodResolver(assignLeadSchema),
    defaultValues: {
      leadId,
      assignedToUserId: currentAssignedTo?.id || '',
    },
  });

  // Fetch available users when dialog opens
  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const result = await getAvailableUsersForLeads();
      if (result.success && result.data) {
        setUsers(result.data);
      } else {
        toast.error('Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setUsersLoading(false);
    }
  };

  async function onSubmit(data: AssignLeadFormData) {
    setLoading(true);
    const toastId = toast.loading('Assigning lead...');

    try {
      const result = await assignLead(data);

      if (result?.error) {
        toast.error('Failed to assign lead', {
          id: toastId,
          description: result.error,
        });
        return;
      }

      toast.success('Lead assigned successfully', {
        id: toastId,
      });

      form.reset();
      setOpen(false);
      onAssignmentChange?.();
    } catch (error) {
      console.error('Error assigning lead:', error);
      toast.error('Failed to assign lead', {
        id: toastId,
        description: 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleUnassign = async () => {
    setLoading(true);
    const toastId = toast.loading('Unassigning lead...');

    try {
      // You'll need to create an unassignLead server action
      const result = await unassignLead(leadId);

      if (result?.error) {
        toast.error('Failed to unassign lead', {
          id: toastId,
          description: result.error,
        });
        return;
      }

      toast.success('Lead unassigned successfully', {
        id: toastId,
      });

      setOpen(false);
      onAssignmentChange?.();
    } catch (error) {
      console.error('Error unassigning lead:', error);
      toast.error('Failed to unassign lead', {
        id: toastId,
        description: 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users className="w-4 h-4" />
          {currentAssignedTo ? 'Reassign' : 'Assign'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentAssignedTo ? 'Reassign Lead' : 'Assign Lead'}
          </DialogTitle>
          <DialogDescription>
            {currentAssignedTo
              ? `Currently assigned to ${currentAssignedTo.firstName} ${currentAssignedTo.lastName}`
              : 'Assign this lead to a team member'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="assignedToUserId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={usersLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {usersLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                      ) : (
                        users.map((user) => (
                          <SelectItem
                            key={user.id}
                            value={user.id}
                            className=" cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage
                                  src={user.profileImage || ''}
                                  className="object-cover"
                                />
                                <AvatarFallback className="text-xs">
                                  {user.firstName.charAt(0)}
                                  {user.lastName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span>
                                {user.firstName} {user.lastName}
                              </span>

                              <Badge variant="outline" className="ml-2 text-xs">
                                {user.role}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 justify-between">
              <div>
                {currentAssignedTo && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUnassign}
                    disabled={loading}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Unassign
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !form.watch('assignedToUserId')}
                >
                  {loading ? 'Assigning...' : 'Assign Lead'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
