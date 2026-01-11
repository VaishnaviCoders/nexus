import Link from 'next/link';

const APP_URL = 'https://shiksha.cloud/';

const links = [
  {
    title: 'Features',
    href: `${APP_URL}/features`,
  },
  {
    title: 'Solution',
    href: `${APP_URL}/features`,
  },
  {
    title: 'Blogs',
    href: `${APP_URL}/blogs`,
  },
  {
    title: 'Pricing',
    href: '#',
  },
  {
    title: 'Support',
    href: `${APP_URL}/support`,
  },
  {
    title: 'Founder',
    href: `${APP_URL}/founder`,
  },
];

export default function Footer() {
  return (
    <footer className="border-b bg-white py-12 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap justify-between gap-6">
          <span className="text-muted-foreground order-last block text-center text-sm md:order-first">
            © {new Date().getFullYear()}{' '}
            <Link href={APP_URL} className="hover:text-primary underline">
              Shiksha.cloud
            </Link>{' '}
            All rights reserved
          </span>
          <div className="order-first flex flex-wrap justify-center gap-6 text-sm md:order-last">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-primary block duration-150"
              >
                <span>{link.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
