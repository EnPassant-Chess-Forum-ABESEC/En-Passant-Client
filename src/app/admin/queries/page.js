import QueriesTab from "@/components/admin/QueriesTab";

export const metadata = {
  title: "User Queries | Admin Dashboard",
};

export default function QueriesPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <QueriesTab />
    </div>
  );
}
