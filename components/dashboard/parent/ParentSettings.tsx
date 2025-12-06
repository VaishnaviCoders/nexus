import ComingSoon from '@/components/Coming-soon';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';


const ParentSettings = async () => {
  return (
    <Card className="px-4 py-3">
      <CardTitle className="text-lg">Parent Settings</CardTitle>
      <CardDescription>
        Manage your profile and management settings
      </CardDescription>
      <CardContent>
        <ComingSoon />
      </CardContent>
    </Card>
  );
};

export default ParentSettings;
