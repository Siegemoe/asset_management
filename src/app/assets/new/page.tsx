"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Breadcrumb from "@/Breadcrumb"

const assetSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  manufacturerPart: z.string().min(1, "Manufacturer part number is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  siteId: z.string().min(1, "Site is required"),
  roomId: z.string().min(1, "Room is required"),
  installedDate: z.string().min(1, "Installed date is required"),
  type: z.enum(["WASHER", "DRYER", "DISH_WASHER", "REFRIGERATOR", "AIR_CONDITIONER", "OVEN_STOVE"]),
  imageUrl: z.string().optional(),
})

type AssetFormData = z.infer<typeof assetSchema>

interface Site {
  id: string
  name: string
}

interface Room {
  id: string
  name: string
  siteId: string
}

export default function NewAssetPage() {
  const router = useRouter()
  const [sites, setSites] = useState<Site[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
  })

  const watchedSiteId = watch("siteId")

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await fetch('/api/sites')
        if (response.ok) {
          const data = await response.json()
          setSites(data)
        } else {
          console.error('Failed to fetch sites')
        }
      } catch (error) {
        console.error('Error fetching sites:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSites()
  }, [])

  useEffect(() => {
    if (watchedSiteId) {
      const fetchRooms = async () => {
        try {
          const response = await fetch(`/api/sites/${watchedSiteId}/rooms`)
          if (response.ok) {
            const data = await response.json()
            setRooms(data)
          } else {
            setRooms([])
          }
        } catch (error) {
          console.error('Error fetching rooms:', error)
          setRooms([])
        }
      }
      fetchRooms()
    } else {
      setRooms([])
    }
  }, [watchedSiteId])

  const onSubmit = async (data: AssetFormData) => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/assets')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create asset')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while creating the asset')
    } finally {
      setSubmitting(false)
    }
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Assets", href: "/assets" },
    { label: "Add New Asset" }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Add New Asset
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Fill in the details for the new appliance asset.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Asset Type</label>
                <select
                  {...register("type")}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                >
                  <option value="">Select type</option>
                  <option value="WASHER">Washer</option>
                  <option value="DRYER">Dryer</option>
                  <option value="DISH_WASHER">Dish Washer</option>
                  <option value="REFRIGERATOR">Refrigerator</option>
                  <option value="AIR_CONDITIONER">Air Conditioner</option>
                  <option value="OVEN_STOVE">Oven/Stove</option>
                </select>
                {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Brand</label>
                <input
                  {...register("brand")}
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
                {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Manufacturer Part Number</label>
                <input
                  {...register("manufacturerPart")}
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
                {errors.manufacturerPart && <p className="mt-1 text-sm text-red-600">{errors.manufacturerPart.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                <input
                  {...register("serialNumber")}
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
                {errors.serialNumber && <p className="mt-1 text-sm text-red-600">{errors.serialNumber.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Site</label>
                <select
                  {...register("siteId")}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                >
                  <option value="">Select site</option>
                  {sites.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name}
                    </option>
                  ))}
                </select>
                {errors.siteId && <p className="mt-1 text-sm text-red-600">{errors.siteId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Room</label>
                <select
                  {...register("roomId")}
                  disabled={!watchedSiteId || rooms.length === 0}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">{!watchedSiteId ? "Select site first" : rooms.length === 0 ? "No rooms available" : "Select room"}</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
                {errors.roomId && <p className="mt-1 text-sm text-red-600">{errors.roomId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Installed Date</label>
                <input
                  {...register("installedDate")}
                  type="date"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
                {errors.installedDate && <p className="mt-1 text-sm text-red-600">{errors.installedDate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
                <input
                  {...register("imageUrl")}
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
                />
                {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/assets"
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {submitting ? 'Creating...' : 'Create Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
