import { Sidebar } from "./Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div
        className={(
          "flex-1 w-[80%] transition-[margin] duration-200 ease-out lg:ml-20"
        )}
      >
        {children}
      </div>
    </div>
  );
}