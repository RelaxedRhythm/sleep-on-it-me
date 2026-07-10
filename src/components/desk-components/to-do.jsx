"use client";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteTodos, writeTodo, updateTodo } from "@/library/actions";

export default function ToDo({ todos = [] }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks(
      todos.map((task) => ({
        id: task.id,
        name: task.task || "",
        status: Boolean(task.status),
      })),
    );
  }, [todos]);

  const handleAddTask = async () => {
    const newTask = { name: "", status: false };
    const createdTask = await writeTodo(newTask);
    if (!createdTask) return;

    setTasks((prevTasks) => [
      ...prevTasks,
      {
        id: createdTask.id,
        name: createdTask.task || "",
        status: Boolean(createdTask.status),
      },
    ]);
  };

  const handleToggleStatus = async (id, checked) => {
    const currentTask = tasks.find((task) => task.id === id);
    if (!currentTask) return;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, status: checked } : task,
      ),
    );

    await updateTodo(id, currentTask.name, checked);
  };

  const handleTaskNameChange = (id, value) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, name: value } : task,
      ),
    );
  };

  const handleSaveTask = async (id) => {
    const taskToSave = tasks.find((task) => task.id === id);
    if (!taskToSave) return;

    await updateTodo(id, taskToSave.name, taskToSave.status);
  };

  const handleDelete = async (id) => {
    await deleteTodos(id);
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  return (
    <div className="mt-4 h-95">
      <ul className="h-11/13 overflow-y-scroll rounded-xl bg-lime-50 py-4">
        {tasks.length === 0 ? (
          <li className="px-4 py-2 text-gray-500">No tasks yet.</li>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              className="group flex max-w-72 items-center gap-2 rounded-sm px-2 py-1 text-stone-700 hover:bg-amber-200"
            >
              <input
                type="checkbox"
                className="size-6"
                checked={task.status}
                onChange={(e) => handleToggleStatus(task.id, e.target.checked)}
              />
              <input
                type="text"
                className="flex-1 bg-transparent outline-none"
                value={task.name}
                onChange={(e) => handleTaskNameChange(task.id, e.target.value)}
                onBlur={() => handleSaveTask(task.id)}
                placeholder="New task"
              />
              <div className="ml-auto flex gap-2">
                <Trash2
                  size={20}
                  className="relative z-50 text-red-400 hover:cursor-pointer"
                  onClick={() => handleDelete(task.id)}
                />
              </div>
            </li>
          ))
        )}
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
