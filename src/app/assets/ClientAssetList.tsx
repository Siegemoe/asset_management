"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface Asset {
  id: string
  assetNumber: string
  brand: string
  type: string
  room: {
    name: string
  }
  site: {
    name: string
  }
  images: {
    id: string
    url: string
  }[]
}

interface ClientAssetListProps {
  assets: Asset[]
}

export default function ClientAssetList({ assets }: ClientAssetListProps) {
  const router = useRouter()
  const [deletingAssetId, setDeletingAssetId] = useState<string | null>(null)

  const handleDelete = async (assetId: string) => {
    if (!confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
      return
    }

    setDeletingAssetId(assetId)
    try {
      const response = await fetch(`/api/assets/${assetId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh() // Refresh the page to update the list
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete asset')
      }
    } catch (error) {
      console.error('Error deleting asset:', error)
      alert('An error occurred while deleting the asset')
    } finally {
      setDeletingAssetId(null)
    }
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {assets.map((asset) => (
          <li key={asset.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="shrink-0 h-10 w-10">
                    {asset.images && asset.images.length > 0 ? (
                      <Image
                        className="h-10 w-10 rounded-lg object-cover"
                        src={asset.images[0]?.url || '/placeholder.png'}
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
                  <div className="ml-4">
                    <div className="flex items-center">
                      <p className="text-sm font-medium text-gray-900">{asset.assetNumber}</p>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        asset.type === 'WASHER' ? 'bg-blue-100 text-blue-800' :
                        asset.type === 'DRYER' ? 'bg-green-100 text-green-800' :
                        asset.type === 'DISH_WASHER' ? 'bg-yellow-100 text-yellow-800' :
                        asset.type === 'REFRIGERATOR' ? 'bg-red-100 text-red-800' :
                        asset.type === 'AIR_CONDITIONER' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {asset.type.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {asset.brand} • {asset.site.name} • Room {asset.room.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/assets/${asset.id}`}
                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                  >
                    View
                  </Link>
                  <Link
                    href={`/assets/${asset.id}/edit`}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    disabled={deletingAssetId === asset.id}
                    className="text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50"
                  >
                    {deletingAssetId === asset.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {assets.length === 0 && (
        <div className="px-4 py-8 text-center text-gray-500">
          No assets found. <Link href="/assets/new" className="text-indigo-600 hover:text-indigo-900">Add one</Link>
        </div>
      )}
    </div>
  )
}