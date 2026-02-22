"use client";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export default function ToDo() {
  const [tasks, setTask] = useState([]);

  const handleTaskAdd = () => {
    setTask([
      ...tasks,
      {
        id: tasks.length + 1,
        name: `Task ${tasks.length + 1}`,
      },
    ]);
  };

  function handleTaskEdit(e, id) {
    setTask((tasks) =>
      tasks.map((item) => {
        if (item.id === id) {
          return { ...item, name: e.target.value };
        } else {
          return item;
        }
      }),
    );
  }

  const handleTaskDelete = (id) => {
    setTask((tasks) => tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="mt-4 h-95">
      <ul className="h-11/13 overflow-y-scroll border-t-2 border-b-2 border-stone-300 bg-white py-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="group flex max-w-72 items-center rounded-sm px-2 py-1 text-stone-700 hover:bg-amber-200"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="size-5"
                // onChange={(e) => handleCheck(e, task.id)}
              />
              <input
                type="text"
                className="w-2/3"
                defaultValue={task.name}
                onChange={(e) => handleTaskEdit(e, task.id)}
              />
            </div>

            <div className="ml-auto hidden gap-2 group-hover:flex">
              <Trash2
                size={20}
                className="text-red-400 hover:cursor-pointer"
                onClick={() => handleTaskDelete(task.id)}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="py-4">
        <button
          className="w-full rounded-sm bg-blue-400 p-2 text-blue-50 hover:cursor-pointer"
          onClick={handleTaskAdd}
        >
          Add Task
        </button>
      </div>
    </div>
  );
}
