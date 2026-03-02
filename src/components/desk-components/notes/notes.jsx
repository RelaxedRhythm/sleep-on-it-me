import { Clock12, NotepadText } from "lucide-react";
import Image from "next/image";

const Note = ({ title }) => {
  return (
    <div className="flex items-center gap-2 rounded-sm bg-orange-400 px-4 py-1 hover:cursor-pointer hover:bg-orange-50 hover:text-orange-400 hover:shadow">
      <NotepadText />
      {title}
    </div>
  );
};

const Pomodoro = ({ children }) => {
  return (
    <div className="space-y-4 rounded-md border-2 border-orange-400 bg-orange-100 pb-4 text-orange-50">
      <div className="flex items-center justify-center gap-2 bg-orange-400 p-2">
        <div className="relative size-6 object-fill">
          <Image src="/tomato.png" fill alt="tomato" sizes="24px" />
        </div>
        <h3 className="font-semibold tracking-wide">Pomodoro</h3>
      </div>
      <div className="flex flex-col gap-2 px-4">{children}</div>
    </div>
  );
};

const Session = ({ children }) => {
  return (
    <>
      <h2 className="mt-4 flex w-1/2 items-center justify-center gap-2 rounded-md bg-lime-500 px-2 py-1 text-lime-50">
        <Clock12 size={20} /> Session
      </h2>
      <div className="flex flex-col gap-2 px-4">{children}</div>
    </>
  );
};

const Notes = () => {
  return (
    <>
      <div className="h-10 rounded-b-lg bg-sky-500"></div>
      <div className="overflow-y-scroll pb-4 font-semibold">
        <Session>
          <Pomodoro>
            <Note />
            <Note />
            <Note />
          </Pomodoro>
          <Pomodoro>
            <Note />
            <Note />
          </Pomodoro>
          <Pomodoro>
            <Note />
            <Note />
            <Note />
            <Note />
          </Pomodoro>
          <Pomodoro>
            <Note />
            <Note />
          </Pomodoro>
        </Session>
        <Session>
          <Pomodoro>
            <Note />
            <Note />
          </Pomodoro>
        </Session>
      </div>
    </>
  );
};

export default Notes;
export { Note };
