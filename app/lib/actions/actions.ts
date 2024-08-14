"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const revalidateAndRedirect = async (path: string) => {
  revalidatePath(path);
  redirect(path);
};
