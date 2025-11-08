import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import DashboardLayout from "@/DashboardLayout"
import Breadcrumb from "@/Breadcrumb"
import Link from "next/link"
import { use } from "react"

interface SiteRoomDetailPageProps {
  params: Promise<{
    id: string
    roomId: string
  }>
}

export default async function SiteRoomDetailPage({ params }: SiteRoomDetailPageProps) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Check if user has admin privileges
  if (session.user?.role !== 'SUPER_ADMIN' && session.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const { id: siteId, roomId } = await params

  // Get room with site and assets
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      site: true,
      assets: {
        include: {
          images: true,
          _count: {
            select: { images: true }
          }
        }
      }
    }
  })

  if (!room || room.siteId !== siteId) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Room Not Found</h1>
            <Link href={`/sites/${siteId}/rooms`} className="text-indigo-600 hover:text-indigo-900">
              Back to Rooms
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sites", href: "/sites" },
    { label: room.site.name, href: `/sites/${room.site.id}` },
    { label: "Rooms", href: `/sites/${room.site.id}/rooms` },
    { label: `Room ${room.name}` }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      OCCUPIED: { color: 'bg-green-100 text-green-800', label: 'Occupied' },
      VACANT: { color: 'bg-red-100 text-red-800', label: 'Vacant' },
      READY: { color: 'bg-yellow-100 text-yellow-800', label: 'Ready' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.READY
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Room {room.name}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  {room.site.name} • {getStatusBadge(room.status)}
                </p>
              </div>
              <div className="flex space-x-3">
                <Link
                  href={`/sites/${room.site.id}/rooms/${room.id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit Room
                </Link>
                <Link
                  href={`/assets/new?roomId=${room.id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Asset
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Room Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Detailed information about this room
              </p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Room Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {room.name}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Site</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <Link 
                      href={`/sites/${room.site.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      {room.site.name}
                    </Link>
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {getStatusBadge(room.status)}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Tenant Information</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {room.tenantName ? (
                      <div>
                        <p>{room.tenantName}</p>
                        {room.tenantPhone && <p className="text-gray-500">{room.tenantPhone}</p>}
                      </div>
                    ) : (
                      <span className="text-gray-500">No tenant assigned</span>
                    )}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Assets</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {room.assets.length > 0 ? (
                      <div className="space-y-4">
                        {room.assets.map((asset) => (
                          <div key={asset.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="text-sm font-medium text-gray-900">
                                    {asset.brand} {asset.type.replace('_', ' ')}
                                  </h4>
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {asset.assetNumber}
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                                  <div>
                                    <span className="font-medium">Model:</span> {asset.manufacturerPart}
                                  </div>
                                  <div>
                                    <span className="font-medium">Serial:</span> {asset.serialNumber}
                                  </div>
                                  <div>
                                    <span className="font-medium">Installed:</span> {new Date(asset.installedDate).toLocaleDateString()}
                                  </div>
                                  <div>
                                    <span className="font-medium">Added:</span> {new Date(asset.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                                
                                {asset.images.length > 0 && (
                                  <div className="mt-2">
                                    <span className="text-xs font-medium text-gray-500">Images: {asset.images.length}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-col space-y-1 ml-4">
                                <Link
                                  href={`/assets/${asset.id}`}
                                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  View Details
                                </Link>
                                <Link
                                  href={`/assets/${asset.id}/edit`}
                                  className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Edit
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500 mb-4">No assets assigned to this room.</p>
                        <Link
                          href={`/assets/new?roomId=${room.id}`}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Add First Asset
                        </Link>
                      </div>
                    )}
                  </dd>
                </div>

                {room.notes && (
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {room.notes}
                    </dd>
                  </div>
                )}

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(room.createdAt).toLocaleDateString()}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(room.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Link
              href={`/sites/${room.site.id}/rooms`}
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              ← Back to Rooms
            </Link>
            <Link
              href={`/sites/${room.site.id}`}
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              Back to Site Details
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}