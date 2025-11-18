export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthGuard requiredRole="client" requireActive>{children}</AuthGuard>
}
