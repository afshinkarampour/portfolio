import Sidebar from "@/components/admin/layout/sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
