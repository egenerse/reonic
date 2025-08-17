import { Button } from "./Button"

export type ButtonInGroup = {
  label: string
  onClick: () => void
  id: string
}

interface Props {
  buttons: ButtonInGroup[]
  selectedId?: string
  className?: string
}

export const ButtonGroup: React.FC<Props> = ({
  buttons,
  selectedId,
  className,
}) => {
  return (
    <div
      className={`group flex flex-wrap justify-center bg-white p-2 ${className} `}
    >
      {buttons.map((button, index) => (
        <Button
          variant="secondary"
          key={index}
          onClick={button.onClick}
          className={`rounded-none bg-transparent text-black hover:bg-blue-100 ${button.id === selectedId ? "border-b-4 border-b-blue-500" : "opacity-50"}`}
        >
          {button.label}
        </Button>
      ))}
    </div>
  )
}
