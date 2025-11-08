import { auth } from "@/auth"
import { redirect } from "next/navigation"
import DashboardLayout from "@/DashboardLayout"
import SecurityClient from "./SecurityClient"

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic'

export default async function SecurityPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Check if user has security privileges
  if (session.user?.role !== 'SUPER_ADMIN' && session.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return (
    <DashboardLayout>
      <SecurityClient />
    </DashboardLayout>
  )
}