type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

const statusConfig: Record<BookingStatus, { label: string; className: string }> = {
  PENDING: { label: '待確認', className: 'bg-yellow-100 text-yellow-800' },
  CONFIRMED: { label: '已確認', className: 'bg-blue-100 text-blue-800' },
  IN_PROGRESS: { label: '進行中', className: 'bg-purple-100 text-purple-800' },
  COMPLETED: { label: '已完成', className: 'bg-green-100 text-green-800' },
  CANCELLED: { label: '已取消', className: 'bg-gray-100 text-gray-600' },
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}
