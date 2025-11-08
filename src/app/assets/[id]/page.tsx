import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"

interface AssetPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AssetDetailPage({ params }: AssetPageProps) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Await params in Next.js 13+ app router
  const resolvedParams = await params

  // Get asset with authorization check
  const user = await prisma.user.findUnique({
    where: { id: session.user!.id },
    select: { role: true, siteIds: true }
  })

  if (!user) {
    redirect('/login')
  }

  const asset = await prisma.asset.findUnique({
    where: { id: resolvedParams.id },
    include: {
      site: true,
      room: true,
      images: true,
      user: { select: { name: true, email: true } }
    }
  })

  if (!asset) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Asset Not Found</h1>
          <Link href="/assets" className="text-indigo-600 hover:text-indigo-900">
            Back to Assets
          </Link>
        </div>
      </div>
    )
  }

  // Check authorization
  const userSiteIds = user.siteIds ? JSON.parse(user.siteIds) : []
  if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
    if (user.role === 'SITE_MANAGER' && (userSiteIds as string[]).includes(asset.siteId) === false) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized</h1>
            <p className="text-gray-600 mb-4">You do not have permission to view this asset.</p>
            <Link href="/assets" className="text-indigo-600 hover:text-indigo-900">
              Back to Assets
            </Link>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <Link
              href="/assets"
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              ← Back to Assets
            </Link>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Asset {asset.assetNumber}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Detailed information about this asset
              </p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      asset.type === 'WASHER' ? 'bg-blue-100 text-blue-800' :
                      asset.type === 'DRYER' ? 'bg-green-100 text-green-800' :
                      asset.type === 'DISH_WASHER' ? 'bg-yellow-100 text-yellow-800' :
                      asset.type === 'REFRIGERATOR' ? 'bg-red-100 text-red-800' :
                      asset.type === 'AIR_CONDITIONER' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {asset.type.replace('_', ' ')}
                    </span>
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Brand</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {asset.brand}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Manufacturer Part</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {asset.manufacturerPart}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Serial Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {asset.serialNumber}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Site</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {asset.site.name}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Room Number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {asset.room.name}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Installed Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(asset.installedDate).toLocaleDateString()}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Added by</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {asset.user.name}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Images</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {asset.images.length > 0 ? (
                      <div className="flex flex-wrap gap-4">
                        {asset.images.map((image) => (
                          <Image
                            key={image.id}
                            src={image.url}
                            alt={`${asset.brand} image`}
                            width={100}
                            height={100}
                            className="rounded-lg object-cover"
                          />
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-500">No images available</span>
                    )}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </dd>
                </div>

                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(asset.updatedAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
              <Link
                href={`/assets/${asset.id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit Asset
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}