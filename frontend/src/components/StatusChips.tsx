import { BadgeCheck, Bot, Clock, ShieldAlert, ShieldCheck, XCircle, FileQuestion, CheckCircle2 } from 'lucide-react';
import type { AuditStatus, BadgeStatus, ProjectVerification } from '@/lib/types';
import { Chip } from './ui';

export function AuditChip({ status }: { status: AuditStatus }) {
  if (status === 'VERIFIED') return <Chip tone="good" icon={<ShieldCheck className="h-3 w-3" />}>Verified</Chip>;
  if (status === 'FLAGGED_FRAUD') return <Chip tone="bad" icon={<ShieldAlert className="h-3 w-3" />}>Flagged</Chip>;
  return <Chip tone="warn" icon={<Clock className="h-3 w-3" />}>Self-declared</Chip>;
}

export function ProjectVerificationChip({ status }: { status: ProjectVerification }) {
  if (status === 'TEACHER_APPROVED') return <Chip tone="good" icon={<BadgeCheck className="h-3 w-3" />}>Teacher approved</Chip>;
  if (status === 'AI_ANALYZED') return <Chip tone="accent" icon={<Bot className="h-3 w-3" />}>AI analyzed</Chip>;
  return <Chip tone="neutral" icon={<FileQuestion className="h-3 w-3" />}>Unverified</Chip>;
}

export function BadgeStatusChip({ status }: { status: BadgeStatus }) {
  if (status === 'APPROVED') return <Chip tone="good" icon={<CheckCircle2 className="h-3 w-3" />}>Approved</Chip>;
  if (status === 'REJECTED') return <Chip tone="bad" icon={<XCircle className="h-3 w-3" />}>Rejected</Chip>;
  return <Chip tone="warn" icon={<Clock className="h-3 w-3" />}>Pending review</Chip>;
}
