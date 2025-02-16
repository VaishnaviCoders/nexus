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
export function CreateNoticeButton({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled>
          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
          Please wait
        </Button>
      ) : (
        <Button type="submit" onClick={onClick} disabled={disabled}>
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

export function CreateGradeButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button variant="destructive" type="submit" disabled={pending}>
          <Loader2 className="animate-spin" />
          Creating Grade...
        </Button>
      ) : (
        <Button variant="destructive" type="submit" disabled={pending}>
          Create Grade
        </Button>
      )}
    </>
  );
}
export function DeleteGradeButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button variant="destructive" type="submit" disabled={pending}>
          <Loader2 className="animate-spin" />
          Deleting...
        </Button>
      ) : (
        <Button variant="destructive" type="submit" disabled={pending}>
          Delete Grade
        </Button>
      )}
    </>
  );
}
export function CreateSectionButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button variant="destructive" type="submit" disabled={pending}>
          <Loader2 className="animate-spin" />
          Creating...
        </Button>
      ) : (
        <Button variant="destructive" type="submit" disabled={pending}>
          Create Section
        </Button>
      )}
    </>
  );
}
export function DeleteSectionButton() {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button variant="destructive" type="submit" disabled={pending}>
          <Loader2 className="animate-spin" />
          Deleting...
        </Button>
      ) : (
        <Button variant="destructive" type="submit" disabled={pending}>
          Delete Section
        </Button>
      )}
    </>
  );
}

export function CreateStudentButton() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button variant="default" type="submit" disabled={pending}>
          <Loader2 className="animate-spin" />
          Creating...
        </Button>
      ) : (
        <Button variant="default" type="submit" disabled={pending}>
          Create Student
        </Button>
      )}
    </>
  );
}
