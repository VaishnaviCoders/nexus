'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSidebar } from '@/hooks/use-sidebar';
import { useStore } from '@/hooks/use-store';
import LatestNotification from '@/app/components/dashboardComponents/LatestNotification';
// import { ContentLayout } from '@/components/dashboard-layout/content-layout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function SettingPage() {
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { settings, setSettings } = sidebar;

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Sidebar Preferences</Button>
        </DialogTrigger>
        <DialogContent>
          <div className="mb-2 flex flex-col items-center gap-2">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full border"
              aria-hidden="true"
            >
              <svg
                className="stroke-zinc-800 dark:stroke-zinc-100"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
              </svg>
            </div>
            <DialogHeader>
              <DialogTitle className="sm:text-center">
                Manage You Sidebar Settings
              </DialogTitle>
              <DialogDescription className="sm:text-center">
                We manage and store your sidebar settings preferences
              </DialogDescription>
            </DialogHeader>
            <TooltipProvider>
              <div className="flex gap-6 mt-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is-hover-open"
                        onCheckedChange={(x) => setSettings({ isHoverOpen: x })}
                        checked={settings.isHoverOpen}
                      />
                      <Label htmlFor="is-hover-open">Hover Open</Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      When hovering on the sidebar in mini state, it will open
                    </p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="disable-sidebar"
                        onCheckedChange={(x) => setSettings({ disabled: x })}
                        checked={settings.disabled}
                      />
                      <Label htmlFor="disable-sidebar">Disable Sidebar</Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Hide sidebar</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </DialogContent>
      </Dialog>

      <LatestNotification className="bg-white" />
    </>
  );
}
