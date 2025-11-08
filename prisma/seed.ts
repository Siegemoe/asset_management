import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create sample sites
  const mainBuilding = await prisma.site.create({
    data: {
      name: 'Main Building',
      address: '123 Main St, Anytown, USA',
    },
  })

  const annexBuilding = await prisma.site.create({
    data: {
      name: 'Annex Building',
      address: '456 Oak Ave, Anytown, USA',
    },
  })

  console.log('✅ Created sample sites:', { mainBuilding, annexBuilding })

  // Create sample rooms for each site
  const mainBuildingRooms = await Promise.all([
    prisma.room.create({
      data: {
        name: '101',
        siteId: mainBuilding.id,
      },
    }),
    prisma.room.create({
      data: {
        name: '102',
        siteId: mainBuilding.id,
      },
    }),
    prisma.room.create({
      data: {
        name: '2A',
        siteId: mainBuilding.id,
      },
    }),
  ])

  const annexBuildingRooms = await Promise.all([
    prisma.room.create({
      data: {
        name: '201',
        siteId: annexBuilding.id,
      },
    }),
    prisma.room.create({
      data: {
        name: '202',
        siteId: annexBuilding.id,
      },
    }),
  ])

  console.log('✅ Created sample rooms:', { mainBuildingRooms, annexBuildingRooms })

  // Note: Users are created automatically via Google OAuth
  console.log('📝 Note: Users are created automatically via Google OAuth')
  console.log('🎉 Seed completed! Sites and rooms are ready for use.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
