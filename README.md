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
