'use client';

import { useState } from 'react';
import type { Badge } from '@/lib/types';
import { isHttpUrl } from '@/lib/utils';
import { BadgeIcon } from '../BadgeIcon';
import { useStudent } from '../store';
import { useToast } from '../toast';
import { Button, Field, Modal } from '../ui';

export function BadgeRequestModal({ badge, onClose }: { badge: Badge | null; onClose: () => void }) {
  return (
    <Modal open={!!badge} onClose={onClose} title="Request badge verification" description="A TPO / admin reviews your proof from the central queue.">
      {badge && <Form badge={badge} onClose={onClose} />}
    </Modal>
  );
}

function Form({ badge, onClose }: { badge: Badge; onClose: () => void }) {
  const { requestBadge } = useStudent();
  const toast = useToast();
  const [proof, setProof] = useState('');
  const [error, setError] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isHttpUrl(proof.trim())) {
      setError('Paste a valid http(s) link — contest page, profile, PR, or Drive link.');
      return;
    }
    if (requestBadge(badge.id, proof.trim())) {
      toast(`"${badge.title}" sent for review.`);
      onClose();
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-center gap-4 rounded-2xl bg-surface2 p-4">
        <BadgeIcon iconUrl={badge.iconUrl} />
        <div>
          <p className="font-semibold">{badge.title}</p>
          <p className="text-xs text-muted">{badge.description}</p>
        </div>
      </div>
      <Field label="Proof URL" error={error} hint="Publicly viewable evidence the reviewer can open.">
        <input className="input" autoFocus value={proof} onChange={(e) => setProof(e.target.value)} placeholder="https://…" />
      </Field>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Submit for review</Button>
      </div>
    </form>
  );
}
