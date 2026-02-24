import "../globals.css";

export const metadata = {
  title: "Sleep on it! | HOME",
  description: "The best productive learning app on the market",
};

function Welcome() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="relative grid w-full max-w-5xl grid-rows-[auto_auto_1fr_auto] gap-4 border p-4">
        {/* Header */}
        <div className="text-center text-lg font-semibold text-white">
          Home/welcome
        </div>

        {/* Date & Time */}
        <div className="mx-auto w-fit rounded bg-blue-500 px-4 py-2">
          todays date and time
        </div>

        {/* Main content */}
        <div className="grid grid-cols-[200px_1fr] gap-4">
          {/* Welcome box */}
          <div className="flex h-40 w-full items-center justify-center rounded-lg bg-pink-300 text-center">
            Welcome
            <br />
            (Name!)
          </div>

          {/* Learning streak box */}
          <div className="flex flex-col justify-between rounded-lg border p-4">
            <div className="mb-2 rounded border p-2 text-sm">
              LearningStreak
              <div className="mt-2 text-xs">
                {"{Topic} {Some motivation}"}
                <br />
                This will take you back to what you were doing
              </div>
            </div>
            <div className="mt-auto">Summary?/Suggestions?</div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-start gap-4">
          <button className="rounded bg-red-300 px-4 py-2">
            new note-book
          </button>
          <button className="rounded bg-red-300 px-4 py-2">
            Continue where you left off
          </button>
        </div>

        {/* Small circle at top-right */}
        <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-pink-300"></div>
      </div>
    </div>
  );
}

export default Welcome;
