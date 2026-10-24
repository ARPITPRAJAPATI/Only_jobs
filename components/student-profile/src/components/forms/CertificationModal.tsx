'use client';

import { useState } from 'react';
import { isHttpUrl } from '@/lib/utils';
import { useStudent } from '../store';
import { useToast } from '../toast';
import { Button, Field, Modal } from '../ui';

export function CertificationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="Add external certification" description="AWS, Azure, NPTEL, Coursera and more. Internal certificates are issued automatically.">
      <Form onClose={onClose} />
    </Modal>
  );
}

function Form({ onClose }: { onClose: () => void }) {
  const { addCertification } = useStudent();
  const toast = useToast();
  const [title, setTitle] = useState('');
  const [org, setOrg] = useState('');
  const [url, setUrl] = useState('');
  const [date, setDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = 'Required';
    if (!org.trim()) err.org = 'Required';
    if (!date) err.date = 'Pick the issue date';
    if (url && !isHttpUrl(url)) err.url = 'Must be a valid http(s) URL';
    setErrors(err);
    if (Object.keys(err).length) return;
    if (addCertification({ title: title.trim(), issuingOrg: org.trim(), credentialUrl: url.trim() || null, issueDate: new Date(date + 'T00:00:00Z').toISOString() })) {
      toast('Certification added.');
      onClose();
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Certification title" error={errors.title}>
        <input className="input" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="AWS Certified Solutions Architect" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Issuing organisation" error={errors.org}>
          <input className="input" value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Amazon Web Services" />
        </Field>
        <Field label="Issue date" error={errors.date}>
          <input type="date" className="input" value={date} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDate(e.target.value)} />
        </Field>
      </div>
      <Field label="Credential URL" error={errors.url} hint="Optional — link to Credly, NPTEL, Coursera…">
        <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
      </Field>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">Add certification</Button>
      </div>
    </form>
  );
}
