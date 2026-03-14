"use client";
import {
  deleteTodos,
  fetchTodo,
  writeTodo,
  updateTodo,
} from "@/library/actions";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
export default function ToDo() {
  const [tasks, setTask] = useState([
    {
      id: 1,
      name: "",
      status: false,
    },
  ]);

  async function onload() {
    const task = await fetchTodo();
    setTask(
      task.map((item) => ({
        id: item.id,
        name: item.task ?? "",
        status: item.status,
      })),
    );
  }
  useEffect(() => {
    onload();
  }, []);

  const handleAddTask = async () => {
    const newTask = {
      name: "",
      status: false,
    };
    const createdTask = await writeTodo([newTask]);
    console.log(tasks);
    setTask((prevTasks) => [
      ...prevTasks,
      {
        id: Number(createdTask.id),
        name: createdTask.task,
        status: createdTask.status,
      },
    ]);
  };

  const handleCheck = async (e, id) => {
    const updatedStatus = e.target.checked;
    setTask((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, status: updatedStatus } : task,
      ),
    );
    // Find current task name (we must send both fields)
    const currentTask = tasks.find((t) => t.id === id);

    await updateTodo(id, currentTask.name, updatedStatus);
  };

  const handleInput = (e, id) => {
    setTask((items) =>
      items.map((item) =>
        item.id === id ? { ...item, name: e.target.value } : item,
      ),
    );
  };
  const handleSave = async (e, id) => {
    const updatedTask = tasks.find((t) => t.id === id);

    await updateTodo(id, updatedTask.name, updatedTask.status);
  };

  const handleDelete = async (id) => {
    console.log("clicked");
    const numericId = Number(id);
    await deleteTodos(numericId);
    setTask((tasks) => tasks.filter((task) => task.id !== numericId));
  };
  // const items=fetchTodo
  return (
    <div className="mt-4 h-95">
      <ul className="h-11/13 overflow-y-scroll rounded-xl bg-lime-50 py-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="group flex max-w-72 items-center gap-2 rounded-sm px-2 py-1 text-stone-700 hover:bg-amber-200"
          >
            <input
              type="checkbox"
              className="size-6"
              checked={task.status}
              onChange={(e) => handleCheck(e, task.id)}
            />
            <input
              type="text"
              defaultValue={"task 1"}
              onChange={(e) => handleInput(e, task.id)}
              onBlur={(e) => handleSave(e, task.id)}
            />
            <div className="ml-auto flex gap-2">
              <Trash2
                size={20}
                className="relative z-50 text-red-400 hover:cursor-pointer"
                onClick={() => handleDelete(task.id)}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="py-4">
        <button
          className="m-2 w-full rounded-xl bg-lime-500 p-2 font-semibold tracking-wide text-lime-50 hover:cursor-pointer"
          onClick={handleAddTask}
        >
          Add Task
        </button>
      </div>
    </div>
  );
}
