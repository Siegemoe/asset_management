import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import DashboardLayout from "@/DashboardLayout"
import Breadcrumb from "@/Breadcrumb"
import Link from "next/link"
import { use } from "react"
import StatusBadge from "@/components/ui/StatusBadge"

interface SiteDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SiteDetailPage({ params }: SiteDetailPageProps) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Check if user has admin privileges
  if (session.user?.role !== 'SUPER_ADMIN' && session.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const { id: siteIdentifier } = await params

  // Try to find site by ID first, then by name (supports both)
  let site = await prisma.site.findUnique({
    where: { id: siteIdentifier },
    include: {
      rooms: {
        include: {
          _count: {
            select: { assets: true }
          }
        },
        orderBy: { name: 'asc' }
      },
      _count: {
        select: { assets: true }
      }
    }
  })

  // If not found by ID, try by name
  if (!site) {
    site = await prisma.site.findUnique({
      where: { name: siteIdentifier },
      include: {
        rooms: {
          include: {
            _count: {
              select: { assets: true }
            }
          },
          orderBy: { name: 'asc' }
        },
        _count: {
          select: { assets: true }
        }
      }
    })
  }

  if (!site) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Site Not Found</h1>
            <Link href="/sites" className="text-indigo-600 hover:text-indigo-900">
              Back to Sites
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sites", href: "/sites" },
    { label: site.name }
  ]


  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {site.name}
                </h1>
                <div className="mt-2 flex items-center space-x-4">
                  <StatusBadge status={site.status} type="site" />
                  {site.address && (
                    <p className="text-sm text-gray-600">{site.address}</p>
                  )}
                </div>
                <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
                  <span>{site.rooms.length} rooms</span>
                  <span>{site._count.assets} assets</span>
                  <span>Created {new Date(site.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link
                  href={`/sites/${site.id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit Site
                </Link>
                <Link
                  href={`/sites/${site.id}/rooms/new`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Room
                </Link>
              </div>
            </div>
          </div>

          {/* Site Information Card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Site Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Overview and details for this location
              </p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Site Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {site.name}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {site.address || 'No address provided'}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <StatusBadge status={site.status} type="site" />
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Total Assets</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {site._count.assets}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(site.createdAt).toLocaleDateString()}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(site.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Rooms Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Rooms ({site.rooms.length})
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All rooms at this location
                  </p>
                </div>
                <Link
                  href={`/sites/${site.id}/rooms`}
                  className="text-sm text-indigo-600 hover:text-indigo-900"
                >
                  View All Rooms →
                </Link>
              </div>
            </div>
            
            {site.rooms.length > 0 ? (
              <div className="border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {site.rooms.map((room) => (
                    <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          Room {room.name}
                        </h4>
                        <StatusBadge status={room.status} type="room" />
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-3">
                        {room._count.assets} assets
                        {room.tenantName && (
                          <div className="mt-1">Tenant: {room.tenantName}</div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Link
                          href={`/sites/${site.id}/rooms/${room.id}`}
                          className="text-xs text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </Link>
                        <Link
                          href={`/sites/${site.id}/rooms/${room.id}/edit`}
                          className="text-xs text-gray-600 hover:text-gray-900"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 p-6 text-center">
                <p className="text-gray-500">No rooms found at this location.</p>
                <Link
                  href={`/sites/${site.id}/rooms/new`}
                  className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                >
                  Add the first room
                </Link>
              </div>
            )}
          </div>

          <div className="mt-6">
            <Link
              href="/sites"
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              ← Back to Sites
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}