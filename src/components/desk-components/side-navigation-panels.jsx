const SidePanel = ({ children, label }) => {
  return (
    <div className="relative min-h-full min-w-80">
      <h2 className="absolute top-0 left-0 z-10 m-2 rounded-sm bg-stone-700/60 px-2 py-0.5 text-sm font-semibold tracking-wider text-white text-shadow-2xs">
        {label}
      </h2>
      <div className="flex h-full flex-col">{children}</div>
    </div>
  );
};

export default SidePanel;
