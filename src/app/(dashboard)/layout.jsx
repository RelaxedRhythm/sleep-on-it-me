import Routes from "@/components/navigation";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Routes />
      {children}
    </>
  );
}