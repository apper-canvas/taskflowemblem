const Textarea = ({ error, className = '', ...props }) => {
  const baseClasses = "w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 outline-none resize-none"
  const errorClasses = error ? "border-error focus:ring-error/50" : "border-gray-300"
  
  return (
    <div>
      <textarea 
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  )
}

export default Textarea