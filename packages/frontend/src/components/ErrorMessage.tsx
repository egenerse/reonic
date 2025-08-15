import React from "react"

interface Props {
  message: string
}

export const ErrorMessage: React.FC<Props> = ({ message }) => {
  return <div className="flex flex-wrap text-red-500">{message}</div>
}
