# Next.js App Router Course - Starter

This is the starter template for the Next.js App Router Course. It contains the starting code for the dashboard application.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

## Lessons Learned

### Chapter 2 - CSS styling

Using the filename `COMPONENT_NAME.module.css` and then importing the file and using it like this:
```
(...)
import styles from "@/app/ui/COMPONENT_NAME.module.css";
(...)

<div className={styles.CLASS_NAME_IN_CSS_FILE}>Some Text</div>
```
Allows contextual usage of classes (auto-complete babyyy) and forces the class to be used only for the current component (i.e. `Angular`'s default `View Encapsulation`).

The `clsx` library allows adding conditional classes more easily:
```
<span
  className={clsx(
    "inline-flex items-center",               /** <- default classes **/
    {
      "bg-gray-100": status === "pending",    /** <- conditional class **/
      "bg-green-500": status === "paid",      /** <- conditional class **/
    },
  )}
>
    {status}
  )}
</span>
```

### Chapter 3 - Optimizing fonts and images

The `next/font` module automatically optimizes fonts - it downloads them at build time and hosts them with other static assets. It provides an easy way to add and use Google fonts:
```
import { NAME_OF_FONT } from "next/font/google";

export const name_of_font = NAME_OF_FONT({
  weight: ["400", "700"],
  subsets: ["latin"],
});
```

`Next.js` provides an `Image` component that comes with automatic image optimization:
```
(...)
import Image from "next/image";
(...)

<Image
  src="/IMAGE_NAME.png"
  width={1000}
  height={760}
  alt="A suitable image description"
/>
```

### Chapter 4 - Creating layouts and pages

Routing in `Next.js` is achieved using file-system routing:
- `app/page.tsx` - route `/`
- `app/dashboard/page.tsx` - route `/dashboard`
- `app/dashboard/customers/page.tsx` - route `/dashboard/customers`
- `app/dashboard/invoices/page.tsx` - route `/dashboard/invoices`

The `page.tsx` component is the route page, the `layout.tsx` component is the UI shared between the current route and its sub-routes. Creating a `layout.tsx` in `app/dashboard` shares that UI between the dashboard page and all its sub-pages.

Any UI that is added to the `RootLayout` component will be shared across all pages in the application. This component can be used to modify the `html` and `body` tags, and add metadata.

### Chapter 5 - Navigating between pages

The `Link` component (at `next/link`) allows changing pages without a full-page reload. Next.js preloads the content of `Links` when they become available in the page, making transitions between pages instant. The `usePathname()` hook provides a way to obtain the current route being accessed.

### Chapter 6 - Setting up the database

`Vercel` integrates directly with `Node.js` projects, allowing for an easy setup of a Postgres database.

The `route.ts` filename provides a public server-side endpoint, using the same file-system routing as the routes in Chapter 4.

### Chapter 7 - Fetching data

Components can be `async`, allowing the render to happen only when all promises within have been resolved. This also creates some problems:
- Sequential `await` instructions require each data retrieval to end before starting the next one(s).
- Any slow requests will hold the loading of the entire page.
- Data updates will not be reflected in the page automatically.

### Chapter 8 - Static and dynamic rendering

Static rendering allows for faster loads and reduced server load (content cached), but does not work for heavily personalized pages (can't be shared between different users). Dynamic rendering allows rendering to happen just-in-time, but forces the application to be as fast as the slowest data fetch.

### Chapter 9 - Streaming

The `loading.tsx` file allows for a transition state between the load of the data and the generated UI. It is shown during the preparation of the upcoming `page.tsx` (`async/await`), and allows interaction with the remaining UI during that time.

When attempting to add a `loading.tsx` file to a route but not all of its children, we can create a route group by creating a new folder "(A_GIVEN_NAME)" (usually "overview") inside the route and moving the route-specific files to it (like `loading.tsx` and `page.tsx`). These files will then NOT be shared with the route's children, and folders enclosed in parentheses are not included in the URL path, so it's also a nice way to organize content.

By moving data requests further down into the components, we can achieve incremental loading of the page since each component will render itself when ready. To make sure the parent component does not hang while waiting for children components to resolve, we use `<Suspense />`:
```
(...)
import { Suspense } from "react";
(...)

<Suspense fallback={<ComponentSkeleton />}>
  <Component />
</Suspense>
```

### Chapter 10 - Partial pre-rendering (PPR)

PPR is an experimental feature from `Next.js` that pre-renders static content and defers the dynamic parts until the user requests them. To use this feature:
- Add flag `ppr: "incremental"` in the `experimental` object within `next.config.mjs`.
- Add `export const experimental_ppr = true;` in the `layout.tsx` file of routes that should use PPR.

This feature depends on the usage of `Suspense` to determine which parts are static and which are dynamic.

### Chapter 11 - Adding search and pagination

The `"use client";` instruction defines client components, allowing the use of events listeners and hooks.

Search params can be used to keep search consistent between client and server. To update search params use this strategy:
```
"use client;"

(...)

const searchParams = useSearchParams();     // get search params
const pathname = usePathname();             // get current route (e.g. /dashboard/invoices)
const { replace } = useRouter();            // method to update URL without reloading page

const handleUserAction = () => {
  const params = new URLSearchParams(searchParams);

  params.set('param', 'new value');

  replace(`${pathname}?${params.toString()}`);
};
```

When using server components (components that require API calls), accessing search params is possible using page props. `page.tsx` files can have parameters (see [page props](https://nextjs.org/docs/app/api-reference/file-conventions/page#props)), although `Next.js` is missing interfaces for them.

The library `use-debounce` provides an easy way to debounce function calls:
```
(...)
import { useDebouncedCallback } from "use-debounce";
(...)

const normalFunction = (...params) => {
  // Do stuff
};

const debouncedFunction = useDebouncedCallback(normalFunction, 400);
```

### Chapter 12 - Mutating data

React Server Actions are functions that run directly on the server. To achieve this, there are 2 ways: adding `"use server";` at the top of the action, or adding `"use server";` to the beginning of the file that will contain the actions.

The `<form>`'s `action` attribute in React can invoke functions that automatically receive the native `FormData` object:
```
const handleSubmit = (formData: FormData) => {
  "use server";

  // Mutate data...
};

(...)

<form action={handleSubmit}>
  (...)
</form>
```

To create a dynamic route segment (e.g. `/your-path/{id}/edit`):
- Add a folder called `[id]` within `/your-path`.
- Add a folder called `edit` within `/your-path/[id]`.
- Add a file `page.tsx` within `/your-path/[id]/edit`.
- Access the `id` parameter using the page's `params` prop:
```
export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  (...)
}
```

To define a data structure using `Zod`, and then use it for input validation, do the following:
```
(...)
import { z } from "zod";
(...)

const formSchema = z.object({
  id: z.string(),
  amount: z.coerce.number(),
  status: z.enum(["pending", "paid"]),
});

const actionXptoSchema = formSchema.omit({ id: true });

(...)

export async function doSomethingInDatabase(formData: FormData) {
  const { amount, status } = actionXptoSchema.parse({
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  (...)
}
```

`Next.js` has client-side router caching, so when data changes, the route's cache needs to be revalidated. When calling `revalidatePath` on the current page, the page's data is reloaded. To issue a revalidation of a path, simply call `revalidatePath('/path/to/revalidate')` (import it from `next/cache`).

When invoking server actions that have extra arguments, use `bind`:
```
const id = 123; // Example
const doServerActionWithId = serverActionWithId.bind(null, id);

(...)

<form action={doServerActionWithId}>
  (...)
</form>
```
The action's signature will then become `serverActionWithId(id: string, formData: FormData)`.

### Chapter 13 - Handling errors

SQL statements should be within a try/catch block, and errors should return an object containing details of the error. To handle a response from a server action, we can use the hook `useActionState` (requires a client component). When using the `useActionState`, the server action's signature changes to `serverAction(previousState: any, formData: FormData)`. The implementation works like this:
```
"use client";

import { useActionState } from "react";

const initialState = {
  message: "",
};

export default function Component() {
  let [state, formAction] = useActionState(serverAction, initialState);

  (...)

  <form action={formAction}>
    (...)
  </form>
}
```

The `error.tsx` file (must be a client component) handles any and all errors thrown within a route. To implement it:
```
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
    (...)
}
```
The `error.tsx` page will catch any errors within the route where it exists, and any of its children routes as well. The `reset()` function can be used to attempt to recover from the error by re-rendering the route where `error.tsx` is placed in.

To handle 404 errors, we can use `Next.js`'s `notFound()` function, imported from `next/navigation`. To customize the 404 page, we can create a `not-found.tsx` page. The `not-found.tsx` page will take precedence over the `error.tsx` page.
