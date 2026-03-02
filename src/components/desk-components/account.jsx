

const Account = async({user}) => {
  
  return (
    <div className="rounded-t-lg bg-sky-500 p-4">
      <div className="h-10 w-10 rounded-full bg-sky-300"></div>
      <h2 className="text-sky-50 font-medium">{user?.length ? user[0].username: "loading..."}</h2>
    </div>
  );
};

export default Account;
