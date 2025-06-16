const Select = ({ error, className = '', children, ...props }) => {
  const baseClasses = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none bg-white"
  const errorClasses = error ? "border-error focus:ring-error/50" : "border-gray-300"
  
  return (
    <div>
      <select 
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  )
}

export default Select