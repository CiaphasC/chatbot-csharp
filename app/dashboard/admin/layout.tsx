import { AuthGuard } from '@/components/auth/auth-guard'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard requiredRole="admin">{children}</AuthGuard>
}
