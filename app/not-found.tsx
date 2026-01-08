import { EmptyState } from '@/components/ui/empty-state';
import { Mail, Phone, User } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="grid h-screen place-items-center">
      <EmptyState
        title="Page Not Found"
        description="The page you are looking for does not exist."
        icons={[User, Mail, Phone]}
        image="/EmptyStatePageNotFound.png"
        action={{
          label: 'Go to Home',
          href: '/',
        }}
      />
    </div>
  );
}
