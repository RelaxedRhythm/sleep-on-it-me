const Account = ({ user }) => {
  return (
    <div className="flex gap-4 rounded-t-lg bg-purple-500 p-4 font-semibold tracking-wide text-purple-50">
      <div className="h-10 w-10 rounded-full bg-purple-50"></div>
      <div className="">
        <h2>{user}</h2>
      </div>
    </div>
  );
};

export default Account;
