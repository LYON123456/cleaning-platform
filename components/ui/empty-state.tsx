interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm mb-6 max-w-sm">{description}</p>}
      {action && (
        <button onClick={action.onClick} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700">
          {action.label}
        </button>
      )}
    </div>
  )
}
