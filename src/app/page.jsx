"use client"
import './globals.css';


function Login () {
  return (
    
      <form className="w-100 flex flex-col justify-center  gap-4 p-4 m-[20] border border-gray-500 rounded-sm">
        <p className="text-3xl text-center">Sign In</p>
        <p className="text-gray-500 text-sm text-center">Enter your credentials to continue</p>
        <input className='border border-gray-500 rounded-sm p-2 m-[8]' placeholder="username" type="text"/>
        <input className='border border-gray-500 rounded-sm p-2 m-[8]' type="password" placeholder="password" />
        <button className="bg-blue-500 p-3 rounded-l text-white">Sign In</button> <button>Make new account</button>
      </form>
    
  );
}

function SignUp () { 
  return (      <form className="w-100 flex flex-col justify-center  gap-4 p-4 m-[20] border border-gray-500 rounded-sm">
        <p className="text-3xl text-center">Sign In</p>
        
        
        <p className="text-gray-500 text-sm text-center">Enter your credentials to continue</p>
        <input className='border border-gray-500 rounded-sm p-2 m-[8]' placeholder="username" type="text"/>
        <input className='border border-gray-500 rounded-sm p-2 m-[8]' type="password" placeholder="password" />
        <button className="bg-blue-500 p-3 rounded-l text-white">Sign In</button> <button>Make new account</button>
      </form>)
}

// export const metadata = {
//   title: "Sleep on it!",
//   description: "The best productive learning app on the market",
// };
export default function Home() {
  return (
    <main className="flex justify-center h-[96vh] items-center">
      {/* <div>Hello world!</div> */}
      <Login />

    </main>
  );
}
