const Account = ({ user }) => {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-violet-600 p-3 font-semibold tracking-wide text-violet-50">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 font-bold text-violet-700">
        {user?.username?.[0]?.toUpperCase() || "U"}
      </div>
      <div>
        <h2 className="text-sm">{user?.username || "Account"}</h2>
        <p className="text-xs text-violet-100">Signed in</p>
      </div>
    </div>
  );
};

export default Account;
