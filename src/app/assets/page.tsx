import Link from "next/link"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { getAssetsForUser } from "@/lib/auth"
import DashboardLayout from "@/DashboardLayout"
import ClientAssetList from "./ClientAssetList"

export default async function AssetsPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Use shared auth utility to get assets with proper authorization
  const assets = await getAssetsForUser(session.user!.id)
  if (!assets) {
    redirect('/login')
  }

  // Sort assets by site name, then by room name
  const sortedAssets = [...assets].sort((a, b) => {
    // First sort by site name
    const siteComparison = a.site.name.localeCompare(b.site.name)
    if (siteComparison !== 0) {
      return siteComparison
    }
    
    // If same site, sort by room name
    // Handle room names that might be alphanumeric (e.g., "101", "2A", "301")
    return a.room.name.localeCompare(b.room.name, undefined, { numeric: true, sensitivity: 'base' })
  })

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link href="/dashboard" className="hover:text-indigo-600">Home</Link>
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Manage Assets</span>
        </nav>

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Manage Assets</h1>
            <Link
              href="/assets/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New Asset
            </Link>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Manage your community appliances and assets.
          </p>
        </div>
        <ClientAssetList assets={sortedAssets} />
      </div>
    </DashboardLayout>
  )
}
