"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const assetSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  manufacturerPart: z.string().min(1, "Manufacturer part number is required"),
  serialNumber: z.string().min(1, "Serial number is required"),
  siteId: z.string().min(1, "Site is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  installedDate: z.string().min(1, "Installed date is required"),
  type: z.enum(["WASHER", "DRYER", "DISH_WASHER", "REFRIGERATOR", "AIR_CONDITIONER", "OVEN_STOVE"]),
  imageUrl: z.string().optional(),
})

type AssetFormData = z.infer<typeof assetSchema>

interface AssetPageProps {
  params: Promise<{
    id: string
  }>
}

interface Site {
  id: string
  name: string
}

interface Asset extends AssetFormData {
  id: string
  assetNumber: string
  images: { id: string; url: string }[]
}

export default function EditAssetPage({ params }: AssetPageProps) {
  const router = useRouter()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [assetId, setAssetId] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Await params in Next.js 13+ app router
        const resolvedParams = await params
        setAssetId(resolvedParams.id)
        
        // Fetch asset and sites in parallel
        const [assetResponse, sitesResponse] = await Promise.all([
          fetch(`/api/assets/${resolvedParams.id}`),
          fetch('/api/sites')
        ])

        if (assetResponse.ok && sitesResponse.ok) {
          const assetData = await assetResponse.json()
          const sitesData = await sitesResponse.json()
          
          setAsset(assetData)
          setSites(sitesData)
          
          // Populate form with asset data
          setValue('brand', assetData.brand)
          setValue('manufacturerPart', assetData.manufacturerPart)
          setValue('serialNumber', assetData.serialNumber)
          setValue('siteId', assetData.siteId)
          setValue('roomNumber', assetData.roomNumber)
          setValue('installedDate', assetData.installedDate.split('T')[0]) // Format date for input
          setValue('type', assetData.type)
          setValue('imageUrl', assetData.images.length > 0 ? assetData.images[0].url : '')
        } else {
          console.error('Failed to fetch data')
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params, setValue])

  const onSubmit = async (data: AssetFormData) => {
    setSubmitting(true)
    try {
      const response = await fetch(`/api/assets/${assetId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/assets')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update asset')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while updating the asset')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/assets/${assetId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          router.push('/assets')
        } else {
          const error = await response.json()
          alert(error.error || 'Failed to delete asset')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('An error occurred while deleting the asset')
      }
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!asset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Asset Not Found</h1>
          <Link href="/assets" className="text-indigo-600 hover:text-indigo-900">
            Back to Assets
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white py-8 px-6 shadow-lg rounded-lg">
        <div className="mb-6">
          <div className="mb-4">
            <Link
              href={`/assets/${asset.id}`}
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              ← Back to Asset
            </Link>
          </div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Edit Asset {asset.assetNumber}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Update the details for this asset.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Asset Type</label>
            <select
              {...register("type")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Manufacturer Part Number</label>
            <input
              {...register("manufacturerPart")}
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.manufacturerPart && <p className="mt-1 text-sm text-red-600">{errors.manufacturerPart.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Serial Number</label>
            <input
              {...register("serialNumber")}
              type="text"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.serialNumber && <p className="mt-1 text-sm text-red-600">{errors.serialNumber.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Site</label>
            <select
              {...register("siteId")}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
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
            <label className="block text-sm font-medium text-gray-700">Room Number</label>
            <input
              {...register("roomNumber")}
              type="text"
              placeholder="e.g., 101, 2A"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.roomNumber && <p className="mt-1 text-sm text-red-600">{errors.roomNumber.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Installed Date</label>
            <input
              {...register("installedDate")}
              type="date"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.installedDate && <p className="mt-1 text-sm text-red-600">{errors.installedDate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL (optional)</label>
            <input
              {...register("imageUrl")}
              type="url"
              placeholder="https://example.com/image.jpg"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Asset
            </button>
            <div className="space-x-2">
              <Link
                href={`/assets/${asset.id}`}
                className="bg-gray-200 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {submitting ? 'Updating...' : 'Update Asset'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}