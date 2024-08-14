"use server";

import { revalidateAndRedirect } from "@/app/lib/actions/actions";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type CustomerFormState =
  | {
      errors?: {
        name?: string[];
        email?: string[];
      };
      message?: string | null;
    }
  | undefined;

const customerFormSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Please enter at least one name." }),
  email: z.string().email({
    message: "Please enter a valid e-mail.",
  }),
  image_url: z.string(),
});

const CreateCustomer = customerFormSchema.omit({ id: true, image_url: true });
const UpdateCustomer = customerFormSchema.omit({ id: true, image_url: true });

export async function createCustomer(
  _prevState: CustomerFormState,
  formData: FormData,
) {
  const validatedFields = CreateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Customer.",
    };
  }

  const { name, email } = validatedFields.data;
  const imageUrl = "";

  try {
    await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${name}, ${email}, ${imageUrl})
    `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Customer.",
    };
  }

  await revalidateAndRedirect("/dashboard/customers");
}

export async function updateCustomer(
  id: string,
  _prevState: CustomerFormState,
  formData: FormData,
) {
  const validatedFields = UpdateCustomer.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Customer.",
    };
  }

  const { name, email } = validatedFields.data;
  const imageUrl = "";

  try {
    await sql`
        UPDATE customers
        SET name = ${name}, email = ${email}, image_url = ${imageUrl}
        WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Customer.",
    };
  }

  await revalidateAndRedirect("/dashboard/customers");
}

export async function deleteCustomer(id: string) {
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
  } catch (error) {
    return {
      message: "Database Error: Failed to Delete Invoice.",
    };
  }

  revalidatePath("/dashboard/customers");
}
