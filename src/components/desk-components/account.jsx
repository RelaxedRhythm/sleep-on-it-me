const Account = async({fetchUser}) => {
  
  return (
    <div className="rounded-t-lg bg-sky-500 p-4">
      <div className="h-10 w-10 rounded-full bg-sky-300"></div>
      <h2 className="text-sky-50 font-medium">{fetchUser[0].username}</h2>
    </div>
  );
};

export default Account;
