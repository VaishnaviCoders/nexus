"use client"

import { useState } from "react"
import { Users, Eye, Pencil, Trash2, Plus, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RolesAccessData } from "./AdminSettings"

interface RolesAccessSettingsProps {
  data: RolesAccessData
}

export default function RolesAccessSettings({ data }: RolesAccessSettingsProps) {
  const [formData, setFormData] = useState(data)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Roles & Access Control</h2>
        <p className="text-sm text-muted-foreground">Manage user roles and permissions with RBAC.</p>
      </div>

      {/* User Roles Card */}
      <div className="rounded-lg border border-border bg-card">
        <div className="p-6">
          <h3 className="text-base font-medium text-foreground">User Roles</h3>
          <p className="mt-1 text-sm text-muted-foreground">Define roles and assign permissions to control access.</p>
          <div className="mt-6 rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-[1fr,80px,1fr,100px] gap-4 bg-muted/50 px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              <span>Role</span>
              <span>Users</span>
              <span>Permissions</span>
              <span>Actions</span>
            </div>
            {formData.roles.map((role, i) => (
              <div
                key={role.id}
                className={cn(
                  "grid grid-cols-[1fr,80px,1fr,100px] gap-4 px-4 py-4 text-sm items-center",
                  i !== 0 && "border-t border-border",
                )}
              >
                <div className="flex items-center gap-3">
                  <Checkbox />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{role.name}</span>
                      {role.type === "System" && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          System
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{role.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{role.users}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.length > 3 ? (
                    <Badge variant="outline" className="text-xs">
                      {role.permissions.length} permissions
                    </Badge>
                  ) : (
                    role.permissions.map((perm) => (
                      <Badge key={perm} variant="outline" className="text-xs">
                        {perm}
                      </Badge>
                    ))
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{formData.roles.length} roles configured</span>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Role
            </Button>
          </div>
        </div>
      </div>

      {/* Default Role & Manual Approval Cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card">
          <div className="p-6">
            <h3 className="text-base font-medium text-foreground">Default User Role</h3>
            <p className="mt-1 text-sm text-muted-foreground">Role assigned to new users by default.</p>
            <div className="mt-6">
              <Select
                value={formData.defaultRole}
                onValueChange={(value) => setFormData({ ...formData, defaultRole: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="p-6">
            <h3 className="text-base font-medium text-foreground">Require Role Assignment</h3>
            <p className="mt-1 text-sm text-muted-foreground">Require admin approval for new users.</p>
            <div className="mt-6">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Manual approval</p>
                </div>
                <Switch
                  checked={formData.requireManualApproval}
                  onCheckedChange={(checked) => setFormData({ ...formData, requireManualApproval: checked })}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button>Save</Button>
      </div>
    </div>
  )
}
