import { fetchInvoicesPages } from "@/app/lib/data/data-invoices";
import { lusitana } from "@/app/ui/fonts";
import { CreateInvoice } from "@/app/ui/invoices/buttons";
import { InvoicesTableSkeleton } from "@/app/ui/invoices/skeletons";
import InvoicesTable from "@/app/ui/invoices/table";
import Search from "@/app/ui/search";
import Pagination from "@/app/ui/shared/pagination";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Invoices",
};

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const limit = 8;

  const totalPages = await fetchInvoicesPages(query, limit);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>

      <Suspense
        key={query + currentPage}
        fallback={<InvoicesTableSkeleton rows={limit} />}
      >
        <InvoicesTable query={query} currentPage={currentPage} limit={limit} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
