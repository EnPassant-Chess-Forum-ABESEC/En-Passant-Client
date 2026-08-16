import QueriesTab from "@/components/admin/QueriesTab";

export const metadata = {
  title: "User Queries | Admin Dashboard",
};

export default function QueriesPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <QueriesTab />
    </div>
  );
}
