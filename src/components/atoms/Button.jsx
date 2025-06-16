import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  
  const variantClasses = {
    primary: "gradient-primary text-white hover:shadow-lg focus:ring-primary/50",
    secondary: "gradient-accent text-white hover:shadow-lg focus:ring-accent/50",
    outline: "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary/50",
    ghost: "text-gray-600 hover:bg-gray-100 focus:ring-primary/50"
  }
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }
  
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={classes}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button