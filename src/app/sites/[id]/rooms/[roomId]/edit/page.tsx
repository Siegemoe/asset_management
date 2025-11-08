"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/DashboardLayout"
import Breadcrumb from "@/Breadcrumb"
import { use } from "react"

interface EditSiteRoomPageProps {
  params: Promise<{
    id: string
    roomId: string
  }>
}

interface Room {
  id: string
  name: string
  status: string
  tenantName: string | null
  tenantPhone: string | null
  notes: string | null
  site: {
    id: string
    name: string
  }
}

export default function EditSiteRoomPage({ params }: EditSiteRoomPageProps) {
  const router = useRouter()
  const { id: siteId, roomId } = use(params)
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    status: "READY",
    tenantName: "",
    tenantPhone: "",
    notes: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}`)
        if (response.ok) {
          const roomData = await response.json()
          setRoom(roomData)
          setFormData({
            name: roomData.name || "",
            status: roomData.status || "READY",
            tenantName: roomData.tenantName || "",
            tenantPhone: roomData.tenantPhone || "",
            notes: roomData.notes || ""
          })
        } else {
          console.error('Failed to fetch room')
          router.push(`/sites/${siteId}/rooms`)
        }
      } catch (error) {
        console.error('Error fetching room:', error)
        router.push(`/sites/${siteId}/rooms`)
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()
  }, [siteId, roomId, router])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Room name is required"
    } else if (formData.name.trim().length < 1) {
      newErrors.name = "Room name must be at least 1 character"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          status: formData.status,
          tenantName: formData.tenantName.trim() || null,
          tenantPhone: formData.tenantPhone.trim() || null,
          notes: formData.notes.trim() || null
        }),
      })

      if (response.ok) {
        alert('Room updated successfully!')
        router.push(`/sites/${siteId}/rooms/${roomId}`)
      } else {
        const error = await response.json()
        setErrors({ general: error.error || 'Failed to update room' })
      }
    } catch (error) {
      console.error('Error updating room:', error)
      setErrors({ general: 'An error occurred while updating the room' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
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
        <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
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
    { label: `Room ${room.name}`, href: `/sites/${room.site.id}/rooms/${room.id}` },
    { label: "Edit" }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Breadcrumb items={breadcrumbItems} />
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Room {room.name}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              {room.site.name}
            </p>
          </div>

          {errors.general && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Room Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`mt-1 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black ${
                      errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Enter room name"
                    required
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  >
                    <option value="READY">Ready</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="VACANT">Vacant</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="tenantName" className="block text-sm font-medium text-gray-700">
                    Tenant Name
                  </label>
                  <input
                    type="text"
                    name="tenantName"
                    id="tenantName"
                    value={formData.tenantName}
                    onChange={(e) => handleInputChange('tenantName', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    placeholder="Enter tenant name"
                  />
                </div>

                <div>
                  <label htmlFor="tenantPhone" className="block text-sm font-medium text-gray-700">
                    Tenant Phone
                  </label>
                  <input
                    type="tel"
                    name="tenantPhone"
                    id="tenantPhone"
                    value={formData.tenantPhone}
                    onChange={(e) => handleInputChange('tenantPhone', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    placeholder="Enter tenant phone number"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    id="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    placeholder="Enter any notes about this room"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href={`/sites/${room.site.id}/rooms/${room.id}`}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}