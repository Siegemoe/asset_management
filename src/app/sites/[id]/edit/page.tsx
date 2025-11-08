"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import DashboardLayout from "@/DashboardLayout"
import { use } from "react"

interface Site {
  id: string
  name: string
  address: string | null
  createdAt: string
  updatedAt: string
  _count: {
    rooms: number
    assets: number
  }
}

interface EditSitePageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditSitePage({ params }: EditSitePageProps) {
  const router = useRouter()
  const { id: siteId } = use(params) // Unwrap the Promise
  const [site, setSite] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const fetchSite = async () => {
    try {
      const response = await fetch(`/api/sites/${siteId}`)
      if (response.ok) {
        const siteData = await response.json()
        setSite(siteData)
        setFormData({
          name: siteData.name || "",
          address: siteData.address || ""
        })
      } else {
        console.error('Failed to fetch site')
        router.push('/sites')
      }
    } catch (error) {
      console.error('Error fetching site:', error)
      router.push('/sites')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchSite()
  }, [siteId])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Site name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Site name must be at least 2 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          address: formData.address.trim() || null
        }),
      })

      if (response.ok) {
        alert('Site updated successfully!')
        router.push('/sites')
      } else {
        const error = await response.json()
        setErrors({ general: error.error || 'Failed to update site' })
      }
    } catch (error) {
      console.error('Error updating site:', error)
      setErrors({ general: 'An error occurred while updating the site' })
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
            <p className="mt-4 text-gray-600">Loading site...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!site) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
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

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/sites"
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              ← Back to Sites
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Edit Site: {site.name}
              </h1>
              <p className="text-sm text-gray-600 mb-6">
                Update the site information below.
              </p>

              {errors.general && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Site Name *
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
                    placeholder="Enter site name"
                    required
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                    placeholder="Enter site address (optional)"
                  />
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6">
                  <h3 className="text-sm font-medium text-gray-900">Site Statistics</h3>
                  <dl className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Rooms</dt>
                      <dd className="text-sm text-gray-900">{site._count.rooms}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Assets</dt>
                      <dd className="text-sm text-gray-900">{site._count.assets}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6">
                  <h3 className="text-sm font-medium text-gray-900">Site Details</h3>
                  <dl className="mt-2 grid grid-cols-1 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(site.createdAt).toLocaleDateString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(site.updatedAt).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex justify-end space-x-3">
                  <Link
                    href="/sites"
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