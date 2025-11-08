import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import DashboardLayout from "@/DashboardLayout"
import Breadcrumb from "@/Breadcrumb"
import Link from "next/link"
import { use } from "react"

interface SiteRoomsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SiteRoomsPage({ params }: SiteRoomsPageProps) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Check if user has admin privileges
  if (session.user?.role !== 'SUPER_ADMIN' && session.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const { id: siteId } = await params

  // Get site with rooms
  const site = await prisma.site.findUnique({
    where: { id: siteId },
    include: {
      rooms: {
        orderBy: { name: 'asc' }
      }
    }
  })

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
    { label: site.name, href: `/sites/${site.id}` },
    { label: "Rooms" }
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
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Rooms in {site.name}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Manage rooms for {site.name}. Total rooms: {site.rooms.length}
                </p>
              </div>
              <Link
                href={`/sites/${site.id}/rooms/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add New Room
              </Link>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {site.rooms.map((room) => (
                <li key={room.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            Room {room.name}
                          </h4>
                          {getStatusBadge(room.status)}
                        </div>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          {room.tenantName && (
                            <span>Tenant: {room.tenantName}</span>
                          )}
                          {room.tenantPhone && (
                            <span>{room.tenantPhone}</span>
                          )}
                        </div>
                        {room.notes && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">{room.notes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/sites/${site.id}/rooms/${room.id}`}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          View
                        </Link>
                        <Link
                          href={`/sites/${site.id}/rooms/${room.id}/edit`}
                          className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            {site.rooms.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                No rooms found. <Link href={`/sites/${site.id}/rooms/new`} className="text-indigo-600 hover:text-indigo-900">Add one</Link>
              </div>
            )}
          </div>

          <div className="mt-6">
            <Link
              href={`/sites/${site.id}`}
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              ← Back to Site Details
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}