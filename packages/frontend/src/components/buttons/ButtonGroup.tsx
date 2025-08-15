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
    <div className={`group flex flex-wrap justify-center ${className}`}>
      {buttons.map((button, index) => (
        <Button
          key={index}
          onClick={button.onClick}
          variant={button.id === selectedId ? "primary" : "secondary"}
          className="rounded-none border-black first:rounded-l-lg last:rounded-r-lg md:not-first:border-l-2"
        >
          {button.label}
        </Button>
      ))}
    </div>
  )
}
