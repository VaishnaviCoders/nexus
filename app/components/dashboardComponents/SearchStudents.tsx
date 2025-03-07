'use client';

import { Input } from '@/components/ui/input';
import { Loader2, Search } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { searchParams } from '@/lib/searchParams';

import { useQueryState } from 'nuqs';

export default function SearchStudents() {
  // const params = useParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useQueryState(
    'q',
    searchParams.q.withOptions({
      shallow: false,
      startTransition,
    })
  );

  return (
    <form className="">
      <div className="relative w-full flex items-center lg:w-[500px]">
        <Search className="absolute left-2 top-[50%] -translate-y-[50%] h-4 w-4 text-muted-foreground" />
        <Input
          id="search"
          autoComplete="off"
          className="w-full pl-8 focus:outline-none"
          placeholder="Search students"
          onChange={(e) => {
            setQ(e.target.value);
          }}
          name="q"
          defaultValue={q}
          type="search"
        />
        {isPending && <Loader2 className="animate-spin" />}
      </div>
    </form>
  );
}
