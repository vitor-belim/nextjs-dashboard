import { fetchCustomerById } from "@/app/lib/data/data-customers";
import Form from "@/app/ui/customers/edit-form";
import Breadcrumbs from "@/app/ui/shared/breadcrumbs";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Customer",
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  let customer = await fetchCustomerById(id);

  if (!customer) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Customers", href: "/dashboard/customers" },
          {
            label: "Edit Customer",
            href: `/dashboard/customers/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form customer={customer} />
    </main>
  );
}
