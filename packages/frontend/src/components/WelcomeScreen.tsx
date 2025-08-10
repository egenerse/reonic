export const WelcomeScreen = () => {
  const onGetStarted = () => {
    // Logic to navigate to the simulation form or start the simulation
    document
      .getElementById("single-simulation")
      ?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center text-center mb-40">
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-4">Reonic Parking Lot App</h1>
        <p className="text-lg mt-6">
          Simulate EV charging scenarios with customizable parameters, and
          explore results in a virtual diagram.
        </p>
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={onGetStarted}
      >
        Get Started
      </button>
    </div>
  );
};
