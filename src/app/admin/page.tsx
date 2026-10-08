import type { Metadata } from 'next';
import AdminDashboard from '@/components/AdminDashboard';
import { AdminLogin } from '@/components/AdminLogin';
import { hasAdminSession, isAdminConfigured } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const metadata: Metadata = { title: 'Painel administrativo', robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!(await hasAdminSession())) return <AdminLogin available={isAdminConfigured()} />;
  return <AdminDashboard />;
}
