interface Props {
  errors: string[]
}
export const ErrorBox = ({ errors }: Props) => {
  return (
    <div>
      {errors.length > 0 && (
        <div className="mb-4">
          <h3 className="text-red-500">Form Errors:</h3>
          <ul className="list-inside list-disc">
            {errors.map((error, index) => (
              <li key={index} className="text-red-500">
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
