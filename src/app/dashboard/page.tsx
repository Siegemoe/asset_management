import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/DashboardLayout"

export default async function DashboardPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Welcome back, {session.user?.name || 'User'}!</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                  <div className="shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-semibold">A</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Assets</dt>
                    <dd className="text-lg font-medium text-gray-900">Manage your assets</dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="-mt-px flex">
                  <div className="w-full bg-gray-200 rounded-md">
                    <Link href="/assets" className="text-sm text-gray-900 hover:text-gray-700 block text-center py-2">
                      Manage Assets
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {session.user?.role === 'SUPER_ADMIN' || session.user?.role === 'ADMIN' ? (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white font-semibold">U</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Users</dt>
                      <dd className="text-lg font-medium text-gray-900">Manage user accounts</dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="-mt-px flex">
                    <div className="w-full bg-gray-200 rounded-md">
                      <Link href="/admin/users" className="text-sm text-gray-900 hover:text-gray-700 block text-center py-2">
                        Manage Users
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white font-semibold">S</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Sites</dt>
                    <dd className="text-lg font-medium text-gray-900">Manage locations</dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4">
                <div className="-mt-px flex">
                  <div className="w-full bg-gray-200 rounded-md">
                    <Link href="/sites" className="text-sm text-gray-900 hover:text-gray-700 block text-center py-2">
                      Manage Sites
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
