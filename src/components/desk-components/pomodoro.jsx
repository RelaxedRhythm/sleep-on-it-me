"use client";

import { useEffect, useRef, useState } from "react";
import { VolumeX, Volume2 } from "lucide-react";

import ToDo from "./to-do";
function Controls({ onReset, onStart, isStarted, isPaused }) {
  return (
    <div className=" ">
      {isStarted ? (
        <div className="flex gap-4">
          {" "}
          <button
            onClick={onReset}
            className="mt-3 w-full rounded-xl bg-orange-400 p-2 font-semibold tracking-wide text-orange-50 hover:cursor-pointer"
          >
            Reset
          </button>
          <button
            onClick={onStart}
            className="mt-3 w-full rounded-xl bg-orange-400 p-2 font-semibold tracking-wide text-orange-50 hover:cursor-pointer"
          >
            {!isPaused ? "Pause" : "Resume"}
          </button>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={onStart}
            className="mt-3 w-full rounded-lg bg-orange-400 p-2 font-semibold tracking-wide text-orange-50 hover:cursor-pointer"
          >
            Start
          </button>
        </div>
      )}
    </div>
  );
}

function TimerDisplay({
  mode,
  timeLeft,
  pomodoro,
  session,
  audioRef,
  onSound,
  sound,
}) {
  function formatTime(timeLeft) {
    let mins = Math.floor(timeLeft / 60);
    let secs = Math.floor(timeLeft % 60);
    return `${String(mins).padStart(2, 0)}:${String(secs).padStart(2, 0)}`;
  }

  return (
    <div className="relative h-54 w-full overflow-hidden rounded-xl bg-orange-50">
      <div className="relative flex h-10 w-full items-center justify-center bg-orange-400 text-center font-medium text-orange-50">
        <p>TASK 1</p>
        <button
          onClick={onSound}
          className="absolute right-0 flex size-10 items-center justify-center rounded-full bg-orange-400 p-2 text-center text-7xl hover:cursor-pointer"
        >
          {sound ? <Volume2 /> : <VolumeX />}
        </button>
      </div>

      <div className="flex flex-col items-center gap-2 p-4 text-6xl text-orange-400">
        <p>{formatTime(timeLeft)}</p>
      </div>
      <p className="text-s text-center font-medium text-orange-400">
        Mode: {mode}
      </p>
      <div className="flex items-center justify-between font-medium">
        <p className="absolute bottom-0 left-0 bg-orange-400 px-4 py-1 text-orange-50">
          {" "}
          Pomodori: {pomodoro}{" "}
        </p>

        <p className="absolute right-0 bottom-0 bg-orange-400 px-4 py-1 text-orange-50">
          {" "}
          Sessions: {session}{" "}
        </p>
      </div>

      <audio ref={audioRef} src="./bell.mp3" preload="auto" />
    </div>
  );
}

export default function Pomodoro() {
  const timers = {
    shortBreak: 300,
    longBreak: 900,
    study: 1500,
  };

  const [mode, setMode] = useState("study"); // shortbreak || longbreak
  const [timeLeft, setTimeLeft] = useState(timers.study); //to update timer
  const [isPaused, setIsPaused] = useState(false); // see if timer paused
  const [pomodoro, setPomodoros] = useState(1); //count number of pomodoro
  const [session, setSessions] = useState(1); // count number of sessions
  const [isStarted, setIsStarted] = useState(false);
  const [sound, setSound] = useState(true);

  const audioRef = useRef(null);

  useEffect(() => {
    if (!isStarted || isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isStarted, timeLeft]);

  const playSound = () => {
    if (!sound) return;
    audioRef.current.currentTime = 0; // restart sound
    audioRef.current.play().catch((err) => {
      console.log("play error", err);
    });
  };

  const handleSessionComplete = () => {
    if (mode === "study") {
      const next = pomodoro + 1;
      if (next === 5) {
        setPomodoros(0);
        setSessions(session + 1);
        setMode("longBreak");
        setTimeLeft(timers.longBreak);
      } else {
        setPomodoros(next);
        setMode("shortBreak");
        setTimeLeft(timers.shortBreak);
      }
    } else {
      setMode("study");
      setTimeLeft(timers.study);
    }
  };

  useEffect(() => {
    if (timeLeft === 0) {
      playSound();
      handleSessionComplete();
    }
  }, [timeLeft]);

  const reset = () => {
    setIsStarted(false);
    setTimeLeft(timers[mode]);
    setIsPaused(true);
  };
  //

  const start = () => {
    if (!isStarted) {
      setIsStarted(true);
      setIsPaused(false);
    } else {
      setIsPaused((prev) => !prev);
    }
  };

  const onSound = () => {
    setSound(!sound);
  };

  return (
    <div className="min-w-80 rounded-xl bg-lime-100 p-4">
      <TimerDisplay
        timeLeft={timeLeft}
        mode={mode}
        pomodoro={pomodoro}
        session={session}
        audioRef={audioRef}
        sound={sound}
        onSound={onSound}
      />

      <Controls
        onReset={reset}
        onStart={start}
        onSound={onSound}
        isStarted={isStarted}
        isPaused={isPaused}
        sound={sound}
      />
      <ToDo />
    </div>
  );
}
