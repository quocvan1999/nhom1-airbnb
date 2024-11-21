import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
});
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
