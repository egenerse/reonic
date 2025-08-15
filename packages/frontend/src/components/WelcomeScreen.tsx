import { Button } from "./buttons/Button"

interface Props {
  onGetStarted: () => void
}

export const WelcomeScreen: React.FC<Props> = ({ onGetStarted }) => {
  return (
    <div className="mb-40 flex min-h-screen flex-col items-center justify-center bg-blue-50 text-center">
      <div className="p-8">
        <h1 className="mb-4 text-4xl font-bold">Reonic Parking Lot App</h1>
        <p className="mt-6 text-lg">
          Simulate EV charging scenarios with customizable parameters, and
          explore results in a virtual diagram.
        </p>
      </div>

      <Button onClick={onGetStarted}>Get Started</Button>
    </div>
  )
}
