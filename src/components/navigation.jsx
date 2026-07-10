"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { navigationLinks } from "@/library/navigation-links";

const Routes = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <ul className="flex items-center justify-center gap-4 text-lg font-semibold text-sky-600">
      {navigationLinks.map((link) => {
        if (link.name === "Logout") {
          return (
            <li key={link.id}>
              <button
                type="button"
                onClick={handleLogout}
                className="font-semibold text-sky-600 transition hover:text-sky-400"
              >
                {link.name}
              </button>
            </li>
          );
        }

        return (
          <li key={link.id}>
            <Link href={link.url} className="hover:text-sky-400">
              {link.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Routes;
