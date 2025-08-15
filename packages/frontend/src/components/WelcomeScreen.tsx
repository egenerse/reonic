export const WelcomeScreen = () => {
  const onGetStarted = () => {
    document
      .getElementById("single-simulation")
      ?.scrollIntoView({ behavior: "smooth" })
  }
  return (
    <div className="mb-40 flex min-h-screen flex-col items-center justify-center bg-blue-50 text-center">
      <div className="p-8">
        <h1 className="mb-4 text-4xl font-bold">Reonic Parking Lot App</h1>
        <p className="mt-6 text-lg">
          Simulate EV charging scenarios with customizable parameters, and
          explore results in a virtual diagram.
        </p>
      </div>

      <button
        className="min-w-40 rounded bg-blue-600 px-4 py-2 text-white"
        onClick={onGetStarted}
      >
        Get Started
      </button>
    </div>
  )
}
