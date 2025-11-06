
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  Icon: LucideIcon;
}

export function DashboardCard({
  title,
  description,
  href,
  Icon,
}: DashboardCardProps) {
  return (
    <Link href={href} className="block h-full">
      <Card className="group h-full transform-gpu transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-xl">
        <CardHeader className="flex flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="h-8 w-8" />
          </div>
          <CardTitle className="font-headline text-xl font-semibold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
