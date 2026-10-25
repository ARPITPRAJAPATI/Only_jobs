'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { DEFAULT_ROLL_NO, fetchStudent, isLive, pushRemote } from '@/lib/api';
import { BADGE_CATALOG, MOCK_STUDENT } from '@/lib/mock-data';
import type { AcademicSemester, Badge, Certification, EditableProfileFields, Project, Student } from '@/lib/types';
import { MAX_PROJECTS, uid } from '@/lib/utils';
import { useToast } from './toast';

const KEY = 'sp:student:v1';

export type SemesterInput = Omit<AcademicSemester, 'id' | 'auditStatus' | 'auditedBy' | 'teacherReview'> & { id?: string };
export type ProjectInput = Omit<Project, 'id' | 'createdAt' | 'aiPlagScore' | 'isTeacherApproved' | 'teacherRemarks'> & { id?: string };
export type CertificationInput = Omit<Certification, 'id'> & { isInternalCourse?: boolean; certificateHash?: string | null };

interface StudentCtx {
  student: Student;
  catalog: Badge[];
  ready: boolean;
  source: 'mock' | 'api';
  updateProfile: (patch: Partial<EditableProfileFields>) => boolean;
  saveSemester: (input: SemesterInput) => boolean;
  removeSemester: (id: string) => boolean;
  saveProject: (input: ProjectInput) => boolean;
  removeProject: (id: string) => boolean;
  requestBadge: (badgeId: string, proofUrl: string) => boolean;
  withdrawBadge: (badgeId: string) => boolean;
  addCertification: (input: CertificationInput) => boolean;
  removeCertification: (id: string) => boolean;
  /** demo helpers (what a TPO "FLAGGED_FRAUD" click does server-side) */
  setFrozen: (frozen: boolean) => void;
  resetDemo: () => void;
}

const Ctx = createContext<StudentCtx | null>(null);

export function StudentProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [student, setStudent] = useState<Student>(MOCK_STUDENT);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<'mock' | 'api'>('mock');
  const hydrated = useRef(false);

  /* Hydrate: live API first (if configured), otherwise localStorage, otherwise mock. */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (isLive) {
        const remote = await fetchStudent(DEFAULT_ROLL_NO);
        if (!cancelled && remote) {
          setStudent(remote);
          setSource('api');
        } else if (!cancelled) {
          toast('Could not reach the API — showing demo data.', 'info');
        }
      } else {
        try {
          const raw = localStorage.getItem(KEY);
          if (raw && !cancelled) setStudent({ ...MOCK_STUDENT, ...(JSON.parse(raw) as Student) });
        } catch {
          /* ignore corrupt storage */
        }
      }
      if (!cancelled) {
        hydrated.current = true;
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Persist demo edits locally. */
  useEffect(() => {
    if (!hydrated.current || isLive) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(student));
    } catch {
      /* quota */
    }
  }, [student]);

  const guard = useCallback(() => {
    if (student.isAccountFrozen) {
      toast('Your account is frozen. Contact the TPO office to resolve the audit.', 'error');
      return false;
    }
    return true;
  }, [student.isAccountFrozen, toast]);

  const updateProfile = useCallback<StudentCtx['updateProfile']>(
    (patch) => {
      if (!guard()) return false;
      setStudent((s) => ({ ...s, ...patch }));
      pushRemote('PATCH', '/api/v1/students/me', patch);
      return true;
    },
    [guard],
  );

  const saveSemester = useCallback<StudentCtx['saveSemester']>(
    (input) => {
      if (!guard()) return false;
      setStudent((s) => {
        const existing = s.academics.find((a) => a.semesterNumber === input.semesterNumber);
        const next: AcademicSemester = existing
          ? { ...existing, ...input, id: existing.id, auditStatus: 'SELF_DECLARED', auditedBy: null }
          : { ...input, id: uid(), auditStatus: 'SELF_DECLARED', auditedBy: null, teacherReview: null };
        const rest = s.academics.filter((a) => a.semesterNumber !== input.semesterNumber);
        return { ...s, academics: [...rest, next].sort((a, b) => a.semesterNumber - b.semesterNumber) };
      });
      pushRemote('PUT', `/api/v1/academics/${input.semesterNumber}`, input);
      return true;
    },
    [guard],
  );

  const removeSemester = useCallback<StudentCtx['removeSemester']>(
    (id) => {
      if (!guard()) return false;
      setStudent((s) => ({ ...s, academics: s.academics.filter((a) => a.id !== id) }));
      pushRemote('DELETE', `/api/v1/academics/${id}`);
      return true;
    },
    [guard],
  );

  const saveProject = useCallback<StudentCtx['saveProject']>(
    (input) => {
      if (!guard()) return false;
      if (!input.id && student.projects.length >= MAX_PROJECTS) {
        toast(`You can pin at most ${MAX_PROJECTS} projects. Remove one first.`, 'error');
        return false;
      }
      setStudent((s) => {
        if (input.id) {
          return { ...s, projects: s.projects.map((p) => (p.id === input.id ? { ...p, ...input, id: p.id } : p)) };
        }
        const project: Project = {
          ...input,
          id: uid(),
          createdAt: new Date().toISOString(),
          aiPlagScore: null,
          isTeacherApproved: false,
          teacherRemarks: null,
        };
        return { ...s, projects: [...s.projects, project] };
      });
      pushRemote(input.id ? 'PUT' : 'POST', input.id ? `/api/v1/projects/${input.id}` : '/api/v1/projects', input);
      return true;
    },
    [guard, student.projects.length, toast],
  );

  const removeProject = useCallback<StudentCtx['removeProject']>(
    (id) => {
      if (!guard()) return false;
      setStudent((s) => ({ ...s, projects: s.projects.filter((p) => p.id !== id) }));
      pushRemote('DELETE', `/api/v1/projects/${id}`);
      return true;
    },
    [guard],
  );

  const requestBadge = useCallback<StudentCtx['requestBadge']>(
    (badgeId, proofUrl) => {
      if (!guard()) return false;
      setStudent((s) => {
        const rest = s.badges.filter((b) => b.badgeId !== badgeId); // re-apply replaces a rejected request
        return { ...s, badges: [...rest, { id: uid(), badgeId, status: 'PENDING', proofUrl }] };
      });
      pushRemote('POST', `/api/v1/badges/${badgeId}/request`, { proofUrl });
      return true;
    },
    [guard],
  );

  const withdrawBadge = useCallback<StudentCtx['withdrawBadge']>(
    (badgeId) => {
      if (!guard()) return false;
      setStudent((s) => ({ ...s, badges: s.badges.filter((b) => b.badgeId !== badgeId) }));
      pushRemote('DELETE', `/api/v1/badges/${badgeId}/request`);
      return true;
    },
    [guard],
  );

  const addCertification = useCallback<StudentCtx['addCertification']>(
    (input) => {
      if (!guard()) return false;
      setStudent((s) => ({
        ...s,
        certifications: [
          ...s.certifications,
          {
            ...input,
            id: uid(),
            isInternalCourse: input.isInternalCourse ?? false,
            certificateHash: input.certificateHash ?? null,
          },
        ],
      }));
      pushRemote('POST', '/api/v1/certifications', input);
      return true;
    },
    [guard],
  );

  const removeCertification = useCallback<StudentCtx['removeCertification']>(
    (id) => {
      if (!guard()) return false;
      setStudent((s) => ({ ...s, certifications: s.certifications.filter((c) => c.id !== id) }));
      pushRemote('DELETE', `/api/v1/certifications/${id}`);
      return true;
    },
    [guard],
  );

  const setFrozen = useCallback((frozen: boolean) => {
    setStudent((s) => ({
      ...s,
      isAccountFrozen: frozen,
      pendingFine: frozen ? 500 : 0,
      fraudRemarks: frozen ? 'Fake academic marks detected during verification.' : null,
    }));
  }, []);

  const resetDemo = useCallback(() => {
    setStudent(MOCK_STUDENT);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    toast('Demo data restored.', 'info');
  }, [toast]);

  const value = useMemo<StudentCtx>(
    () => ({
      student,
      catalog: BADGE_CATALOG,
      ready,
      source,
      updateProfile,
      saveSemester,
      removeSemester,
      saveProject,
      removeProject,
      requestBadge,
      withdrawBadge,
      addCertification,
      removeCertification,
      setFrozen,
      resetDemo,
    }),
    [student, ready, source, updateProfile, saveSemester, removeSemester, saveProject, removeProject, requestBadge, withdrawBadge, addCertification, removeCertification, setFrozen, resetDemo],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStudent() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStudent must be used inside <StudentProvider>');
  return ctx;
}
