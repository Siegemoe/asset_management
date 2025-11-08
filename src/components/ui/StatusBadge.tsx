interface StatusBadgeProps {
  status: string
  type?: 'site' | 'room' | 'asset'
  className?: string
}

const siteStatusConfig = {
  ACTIVE: { color: 'bg-green-100 text-green-800', label: 'Active' },
  SUSPENDED: { color: 'bg-yellow-100 text-yellow-800', label: 'Suspended' },
  ARCHIVED: { color: 'bg-gray-100 text-gray-800', label: 'Archived' },
}

const roomStatusConfig = {
  OCCUPIED: { color: 'bg-green-100 text-green-800', label: 'Occupied' },
  VACANT: { color: 'bg-red-100 text-red-800', label: 'Vacant' },
  READY: { color: 'bg-yellow-100 text-yellow-800', label: 'Ready' },
}

const assetStatusConfig = {
  ACTIVE: { color: 'bg-green-100 text-green-800', label: 'Active' },
  MAINTENANCE: { color: 'bg-yellow-100 text-yellow-800', label: 'Maintenance' },
  RETIRED: { color: 'bg-gray-100 text-gray-800', label: 'Retired' },
}

export default function StatusBadge({ status, type = 'site', className = '' }: StatusBadgeProps) {
  let config: Record<string, { color: string; label: string }>
  
  if (type === 'room') {
    config = roomStatusConfig
  } else if (type === 'asset') {
    config = assetStatusConfig
  } else {
    config = siteStatusConfig
  }

  const statusConfig = config[status] || { color: 'bg-gray-100 text-gray-800', label: status }
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color} ${className}`}>
      {statusConfig.label}
    </span>
  )
}