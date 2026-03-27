export function InputGroupLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 pt-1 pb-0.5">
      <div className="w-0.5 h-3.5 rounded-full bg-primary-500 dark:bg-primary-400" />
      <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
        {label}
      </span>
    </div>
  )
}
