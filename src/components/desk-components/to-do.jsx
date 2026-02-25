"use client";
import { deleteTodos, fetchTodo, writeTodo } from "@/library/actions";
import { Trash2 } from "lucide-react";
import { refresh } from "next/cache";
import { useEffect, useState } from "react";
export default function ToDo() {
  const [tasks, setTask] = useState([
    {
      id: 1,
      name: "",
      status: false,
    },
  ]);

  async function onload(){
      const task=await fetchTodo();
      setTask(task.map(item=>({
        id:Number(item.id),
        name:item.task,
        status:item.status
      })))
      
    };
  useEffect(()=>{
    onload()
  },[]);

  const addTask =async () => {
    const newTask={
      name:'',
      status:false,
    }

    console.log(tasks);
    setTask((prevTasks)=>[
      ...prevTasks,
      newTask
    ]);

    await writeTodo[newTask]
  };

  const handleCheck = async(e, id) => {
    
    setTask((tasks) =>
      tasks.map((task) => 
        task.id === id ? { ...task, status: e.target.checked} : task
      ),
    );
    await writeTodo([{id,status:true}]);
  };

  const handleInput=(e,id)=>{
    setTask((items)=>items.map(item=>
      item.id===id ? {...item,name:e.target.value}: item
    ))
  }

  const handleDelete=async (id)=>{
    console.log("clicked");
    const numericId=Number(id)
    await deleteTodos(numericId);
      setTask(tasks=>
        tasks.filter( task => task.id !== numericId)
      )
  }
  // const items=fetchTodo
  return (
    <div className="mt-4 h-95">
      <ul className="h-11/13 overflow-y-scroll border-t-2 border-b-2 border-stone-300 bg-white py-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="group flex items-center gap-2 rounded-sm px-2 py-1 font-semibold text-stone-700 hover:bg-amber-200"
          >
            <input
              type="checkbox"
              className="size-7"
              checked={task.status}
              onChange={(e) => handleCheck(e, task.id)}
            />
            <input type="text" value={task.name} onChange={(e)=>handleInput(e,task.id)} />
            <div className="ml-auto flex gap-2 ">
              <Trash2 size={20} className="text-red-400  hover:cursor-pointer relative z-50" onClick={()=>handleDelete(task.id)} />
            </div>
          </li>
        ))}
      </ul>
      <div>
        <button
          className="rounded-sm m-2 bg-blue-400 p-2 hover:cursor-pointer"
          onClick={addTask}
        >
          AddTask
        </button>
        
       
      </div>
    </div>
  );
}
