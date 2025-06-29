import ComingSoon from '@/components/Coming-soon';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings, WalletCards } from 'lucide-react';

const ParentSettings = async () => {
  return (
    <div className="px-4 space-y-4">
      <Card className="px-4 py-3">
        <CardTitle className="text-lg">Parent Settings</CardTitle>
        <CardDescription>
          Manage your profile and management settings
        </CardDescription>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-6 border rounded-lg">
          <div>
            <h2 className="text-lg font-semibold">
              {' '}
              Salary / Payout Information
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure your salary and payout information
            </p>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 bg-transparent"
              >
                <Settings className="h-4 w-4" />
                Payout Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader className="space-y-3">
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <WalletCards className="h-5 w-5" />
                  Payout Settings
                </DialogTitle>
                <DialogDescription>
                  Configure your salary and payout information
                </DialogDescription>
              </DialogHeader>
              <ComingSoon />
            </DialogContent>
          </Dialog>
          {/* <TeacherPayoutConfig organization={organization} />  */}
        </div>

        {/* Add more settings sections here */}
      </div>
    </div>
  );
};

export default ParentSettings;
