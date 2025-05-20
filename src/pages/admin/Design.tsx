
import { AdminLayout } from "@/components/layout/AdminLayout";
import { StoreBuilder } from "@/components/design/StoreBuilder";

const Design = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dizajner prodavnice</h1>
        </div>
        <StoreBuilder />
      </div>
    </AdminLayout>
  );
};

export default Design;
