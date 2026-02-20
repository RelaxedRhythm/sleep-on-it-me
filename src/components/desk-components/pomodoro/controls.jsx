import { timers } from "@/library/pomodoro-timer"
import { GiSoundOn,GiSoundOff } from "react-icons/gi"
export function Controls({ onReset, onPause, onStart,onSound,sound, isStarted,isPaused }) {

    return (
        <div >
            {
                isStarted ? (<div>  <button onClick={onReset} className="w-30 rounded-xl bg-blue-400 p-5 text-lg font-semibold tracking-wide text-blue-50 hover:cursor-pointer m-5">Reset</button>
                    <button onClick={onStart} className="w-30 rounded-xl bg-blue-400 p-5 text-lg font-semibold tracking-wide text-blue-50 hover:cursor-pointer m-5">{!isPaused?"Pause":"Resume"}</button></div>)
                    : (<button onClick={onStart}
                    className="w-30 rounded-xl bg-blue-400 p-5 text-lg font-semibold tracking-wide text-blue-50 hover:cursor-pointer m-5">Start</button>)
            }
            {/* <button onClick={onReset} className="w-30 rounded-xl bg-blue-400 p-5 text-lg font-semibold tracking-wide text-blue-50 hover:cursor-pointer m-5">Reset</button>
            <button onClick={onStart} className="w-30 rounded-xl bg-blue-400 p-5 text-lg font-semibold tracking-wide text-blue-50 hover:cursor-pointer m-5">Pause</button> */}

             <button onClick={onSound} className="w-20 h-15 rounded-xl text-7xl bg-blue-400 hover:cursor-pointer m-5 " >{sound?<GiSoundOn size={25}  />:<GiSoundOff size={25} /> }</button>

        </div>
    )
}