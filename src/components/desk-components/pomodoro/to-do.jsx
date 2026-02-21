"use client";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
export default function ToDo() {
  const [tasks, addTask] = useState([
    {
      id: 1,
      name: "Task 1",
    },
    {
      id: 2,
      name: "Task 2",
    },
  ]);

  const handleTask = () => {
    console.log(tasks);
    addTask([
      ...tasks,
      {
        id: tasks.length + 1,
        name: `Task ${tasks.length + 1}`,
      },
    ]);
  };

  return (
    <div>
      <ul>
        {tasks.map((task) => (
          <li
            key={task.id}
            className="group flex items-center gap-2 rounded-sm px-2 py-1 font-semibold text-stone-700 hover:bg-amber-200"
          >
            <input type="checkbox" className="size-5" /> {task.name}
            <div className="ml-auto hidden gap-2 group-hover:flex">
              <Pencil size={20} className="hover:cursor-pointer" />
              <Trash2 size={20} className="text-red-400 hover:cursor-pointer" />
            </div>
          </li>
        ))}
      </ul>
      <div>
        <button
          className="rounded-sm bg-blue-400 p-2 hover:cursor-pointer"
          onClick={handleTask}
        >
          AddTask
        </button>
      </div>
    </div>
  );
}
