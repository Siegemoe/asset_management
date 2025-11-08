"use client"

import { useState, useEffect } from "react"
import { use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/DashboardLayout"
import Breadcrumb from "@/Breadcrumb"
import Image from "next/image"

interface Room {
  id: string
  name: string
  status: string
  tenantName: string | null
  tenantPhone: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  site: {
    id: string
    name: string
  }
  assets: Array<{
    id: string
    assetNumber: string
    brand: string
    type: string
    images: Array<{
      url: string
    }>
  }>
}

interface RoomPageProps {
  params: Promise<{
    id: string
  }>
}

export default function RoomDetailPage({ params }: RoomPageProps) {
  const router = useRouter()
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const { id: roomId } = use(params)

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}`)
        if (response.ok) {
          const data = await response.json()
          setRoom(data)
        } else {
          console.error('Failed to fetch room')
          router.push('/rooms')
        }
      } catch (error) {
        console.error('Error fetching room:', error)
        router.push('/rooms')
      } finally {
        setLoading(false)
      }
    }

    if (roomId) {
      fetchRoom()
    }
  }, [roomId, router])

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

  const getAssetTypeBadge = (type: string) => {
    const typeConfig = {
      WASHER: { color: 'bg-blue-100 text-blue-800', label: 'Washer' },
      DRYER: { color: 'bg-green-100 text-green-800', label: 'Dryer' },
      DISH_WASHER: { color: 'bg-yellow-100 text-yellow-800', label: 'Dish Washer' },
      REFRIGERATOR: { color: 'bg-red-100 text-red-800', label: 'Refrigerator' },
      AIR_CONDITIONER: { color: 'bg-purple-100 text-purple-800', label: 'Air Conditioner' },
      OVEN_STOVE: { color: 'bg-gray-100 text-gray-800', label: 'Oven/Stove' },
    }
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.WASHER
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Manage Rooms", href: "/rooms" },
    { label: room?.name || "Room Details" }
  ]

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading room...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!room) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Room Not Found</h1>
            <Link href="/rooms" className="text-indigo-600 hover:text-indigo-900">
              Back to Rooms
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Room {room.name}
                  </h1>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Located at {room.site.name}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Link
                    href={`/rooms/${room.id}/edit`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit Room
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {getStatusBadge(room.status)}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Site</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {room.site.name}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Tenant Information</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {room.tenantName ? (
                      <div>
                        <p><strong>Name:</strong> {room.tenantName}</p>
                        {room.tenantPhone && (
                          <p><strong>Phone:</strong> {room.tenantPhone}</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">No tenant assigned</span>
                    )}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Notes</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {room.notes || <span className="text-gray-500">No notes</span>}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Associated Assets</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {room.assets.length > 0 ? (
                      <div className="space-y-4">
                        {room.assets.map((asset) => (
                          <div key={asset.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-md">
                            <div className="shrink-0">
                              {asset.images.length > 0 ? (
                                <Image
                                  className="h-10 w-10 rounded-lg object-cover"
                                  src={asset.images?.[0]?.url || '/placeholder.png'}
                                  alt={asset.brand}
                                  width={40}
                                  height={40}
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-500 text-xs">No Image</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium text-gray-900">{asset.assetNumber}</p>
                                {getAssetTypeBadge(asset.type)}
                              </div>
                              <p className="text-sm text-gray-500">{asset.brand}</p>
                            </div>
                            <Link
                              href={`/assets/${asset.id}`}
                              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                            >
                              View Asset
                            </Link>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">No assets assigned to this room</span>
                    )}
                  </dd>
                </div>

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
        </div>
      </div>
    </DashboardLayout>
  )
}