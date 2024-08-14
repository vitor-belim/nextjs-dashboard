import { fetchAllCustomers } from "@/app/lib/data/data-customers";
import { fetchInvoiceById } from "@/app/lib/data/data-invoices";
import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/shared/breadcrumbs";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Invoice",
};

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  let [invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchAllCustomers(),
  ]);

  if (!invoice) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
