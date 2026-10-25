'use client';

import { ShieldAlert } from 'lucide-react';
import { useStudent } from './store';

export function FrozenBanner() {
  const { student } = useStudent();
  if (!student.isAccountFrozen) return null;
  return (
    <div role="alert" className="flex animate-fade-up flex-col gap-1 rounded-3xl bg-bad p-5 text-white shadow-card sm:flex-row sm:items-center sm:gap-4">
      <ShieldAlert className="h-7 w-7 shrink-0" />
      <div className="flex-1">
        <p className="font-bold">Your account is frozen pending a disciplinary review</p>
        <p className="text-sm opacity-90">{student.fraudRemarks ?? 'An academic record was flagged during a TPO audit.'} Profile editing and nightly sync are disabled.</p>
      </div>
      <div className="rounded-2xl bg-white/15 px-4 py-2 text-sm font-semibold">Pending fine: ₹{student.pendingFine.toLocaleString('en-IN')}</div>
    </div>
  );
}
