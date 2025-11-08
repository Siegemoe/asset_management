import { auth } from "@/auth"
import { redirect } from "next/navigation"
import DashboardLayout from "@/DashboardLayout"
import EnhancedSitesClient from "./EnhancedSitesClient"
import { prisma } from "@/lib/prisma"

export default async function SitesPage() {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  // Check if user has admin privileges
  if (session.user?.role !== 'SUPER_ADMIN' && session.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  // Get all sites with counts, rooms, and assigned users
  const sites = await prisma.site.findMany({
    include: {
      _count: {
        select: { rooms: true, assets: true }
      },
      rooms: {
        select: {
          id: true,
          name: true,
          status: true
        },
        orderBy: { name: 'asc' }
      }
    },
    orderBy: { name: 'asc' }
  })

  // Get user assignments for each site
  const sitesWithUsers = await Promise.all(
    sites.map(async (site) => {
      const assignedUsers = await prisma.user.findMany({
        where: {
          siteIds: {
            contains: site.id
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      })
      return {
        ...site,
        createdAt: site.createdAt.toISOString(),
        updatedAt: site.updatedAt.toISOString(),
        status: 'ACTIVE', // Default status since Prisma schema doesn't include status field
        assignedUsers
      }
    })
  )

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Sites Management</h1>
            <a
              href="/sites/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add New Site
            </a>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Manage locations, assign users, and control site status.
          </p>
        </div>

        <EnhancedSitesClient initialSites={sitesWithUsers} />
      </div>
    </DashboardLayout>
  )
}