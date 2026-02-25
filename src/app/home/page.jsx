import "../globals.css";

export const metadata = {
  title: "Sleep on it! | HOME",
  description: "The best productive learning app on the market",
};

function Welcome() {
  return (
    <div className="mr-auto ml-auto flex h-screen w-8/10 flex-col gap-4 p-4">
      {/* Header */}
      <div className="text-center text-lg font-semibold text-stone-600">
        Home/welcome
      </div>
      {/* <div className="absolute top-4 right-4 size-10 rounded-full bg-pink-300"></div> */}

      {/* Main content */}
      <div className="flex gap-4">
        {/* Welcome box */}
        <div className="flex h-60 min-w-80 items-center justify-center rounded-lg bg-pink-300 text-center">
          Welcome
          <br />
          (Name!)
        </div>

        {/* Learning streak box */}
        <div className="flex w-full flex-col justify-between rounded-lg border p-4">
          Learning Stats
          <div>
            {"{Topic} {Some motivation}"}
            <br />
            This will take you back to what you were doing
          </div>
        </div>
      </div>
      <div className="h-80 w-full rounded-lg bg-sky-400 text-center">
        Summary?/Suggestions?
      </div>

      {/* Buttons */}
      <div className="flex justify-start gap-2">
        <button className="rounded bg-red-300 px-4 py-2">new note-book</button>
        <button className="rounded bg-red-300 px-4 py-2">
          Continue where you left off
        </button>
      </div>

      {/* Small circle at top-right */}
    </div>
  );
}

export default Welcome;
