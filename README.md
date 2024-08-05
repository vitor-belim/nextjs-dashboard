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
