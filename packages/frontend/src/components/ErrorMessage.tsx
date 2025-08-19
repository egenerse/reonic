import React from "react"

interface Props {
  message?: string
  className?: string
}

export const ErrorMessage: React.FC<Props> = ({ message, className }) => {
  if (!message) return null
  return (
    <div className={`flex flex-wrap text-red-500 ${className}`}>{message}</div>
  )
}
