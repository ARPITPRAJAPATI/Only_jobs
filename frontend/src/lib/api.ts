import { MOCK_STUDENT } from './mock-data';
import type { Student } from './types';

/**
 * Thin adapter around the backend described in the architecture doc.
 * - NEXT_PUBLIC_API_URL unset  -> app runs on mock data (+ localStorage persistence).
 * - NEXT_PUBLIC_API_URL set    -> reads GET /api/v1/students/:rollNo and pushes best-effort writes.
 * Adjust the endpoints below to match your Express routes.
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');
export const isLive = API_URL.length > 0;
export const DEFAULT_ROLL_NO = process.env.NEXT_PUBLIC_DEFAULT_ROLL_NO ?? MOCK_STUDENT.rollNumber;

async function request<T>(method: string, path: string, body?: unknown): Promise<T | null> {
  if (!isLive) return null;
  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      credentials: 'include',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** GET /api/v1/students/:rollNo — the response may be partial; it is merged over the mock shape. */
export async function fetchStudent(rollNo: string): Promise<Student | null> {
  const data = await request<Partial<Student>>('GET', `/api/v1/students/${encodeURIComponent(rollNo)}`);
  if (!data) return null;
  return { ...MOCK_STUDENT, ...data } as Student;
}

/** GET /api/v1/academics/upload-url?sem=X -> { uploadUrl, fileUrl } (S3 / R2 presigned PUT) */
export async function getUploadUrl(sem: number) {
  return request<{ uploadUrl: string; fileUrl: string }>('GET', `/api/v1/academics/upload-url?sem=${sem}`);
}

export async function putToPresignedUrl(uploadUrl: string, file: File) {
  try {
    const res = await fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type || 'application/pdf' } });
    return res.ok;
  } catch {
    return false;
  }
}

/** Fire-and-forget write; UI stays optimistic. */
export function pushRemote(method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', path: string, body?: unknown) {
  void request(method, path, body);
}
