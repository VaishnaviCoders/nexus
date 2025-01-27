'use client';

import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import React from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled>
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button type="submit">{text}</Button>
      )}
    </>
  );
}
export function CreateNoticeButton({ onClick }: { onClick: () => void }) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled>
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button type="submit" onClick={onClick}>
          <Send className="mr-2 h-4 w-4" /> Publish Notice
        </Button>
      )}
    </>
  );
}
export function DeleteNoticeButton({ onClick }: { onClick: () => void }) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled>
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button type="submit" variant="destructive" onClick={onClick}>
          Delete Notice
        </Button>
      )}
    </>
  );
}
