'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
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
        {/* <Search className="absolute left-2 top-[50%] -translate-y-[50%] h-4 w-4 text-muted-foreground" /> */}
        <Input
          id="search"
          autoComplete="off"
          className="w-full pr-10 focus:outline-none"
          placeholder="Search students"
          onChange={(e) => {
            setQ(e.target.value);
          }}
          name="q"
          defaultValue={q}
        />
        {isPending && (
          <Search
            className="absolute animate-pulse right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            size={18}
          />
        )}
      </div>
    </form>
  );
}
