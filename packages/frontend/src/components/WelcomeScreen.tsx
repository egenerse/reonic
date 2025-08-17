import { Button } from "./buttons/Button"

interface Props {
  onGetStarted: () => void
}

export const WelcomeScreen: React.FC<Props> = ({ onGetStarted }) => {
  return (
    <section className="mb-40 flex min-h-screen flex-col items-center justify-center bg-blue-50 text-center">
      <div className="max-w-4xl p-8">
        <h1 className="mb-6 text-5xl font-bold text-gray-800">
          EV Charging Station Simulator
        </h1>
        <p className="mb-8 text-xl leading-relaxed text-gray-600">
          Design, optimize, and analyze electric vehicle charging infrastructure
          with our comprehensive simulation platform
        </p>

        <p className="mb-8 text-base text-gray-500">
          Perfect for shop owners, facility managers, and EV infrastructure
          developers
        </p>
      </div>

      <Button onClick={onGetStarted}>Start Simulating</Button>
    </section>
  )
}
