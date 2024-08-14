import { fetchCustomersPages } from "@/app/lib/data/data-customers";
import { CreateCustomer } from "@/app/ui/customers/buttons";
import { CustomersTableSkeleton } from "@/app/ui/customers/skeletons";
import CustomersTable from "@/app/ui/customers/table";
import { lusitana } from "@/app/ui/fonts";
import Search from "@/app/ui/search";
import Pagination from "@/app/ui/shared/pagination";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Customers",
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
  const limit = 5;

  const totalPages = await fetchCustomersPages(query, limit);

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Customers
      </h1>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search customers..." />
        <CreateCustomer />
      </div>

      <Suspense
        key={query + currentPage}
        fallback={<CustomersTableSkeleton rows={limit} />}
      >
        <CustomersTable
          query={query}
          currentPage={currentPage}
          limit={limit}
        ></CustomersTable>
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
