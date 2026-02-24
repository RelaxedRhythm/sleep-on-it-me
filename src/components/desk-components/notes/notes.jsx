const Note = () => {
  return (
    <div className="rounded-sm bg-green-500 px-4 py-1 hover:cursor-pointer">
      Note
    </div>
  );
};

const Pomodoro = ({ children }) => {
  return (
    <div className="space-y-4 rounded-md border-2 border-green-500 bg-green-300 pb-4">
      <h3 className="bg-green-500 p-2 text-center font-semibold tracking-wide">
        Pomodoro
      </h3>
      <div className="flex flex-col gap-2 px-4">{children}</div>
    </div>
  );
};

const Session = ({ children }) => {
  return (
    <div className="px-4">
      <h2 className="w-1/2 rounded-md bg-orange-400 py-1 text-center">
        Session
      </h2>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
};

const Notes = () => {
  return (
    <div className="bg-stone-700 py-4 text-white">
      <Session>
        <Pomodoro>
          <Note />
          <Note />
          <Note />
        </Pomodoro>

        {/* {data.map((note) => (
          <Note
            key={note.id}
            
            onClick={() => onSelect(note.title)}
          >
            {note.title}
          </div>
        ))} */}
      </Session>
    </div>
  );
};

export default Notes;
