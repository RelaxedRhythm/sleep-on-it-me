import Link from "next/link";
import { navigationLinks } from "@/library/navigation-links";

const Routes = () => {
  return (
    <ul className="flex items-center justify-center gap-4 text-lg font-semibold text-sky-600">
      {navigationLinks.map((link) => (
        <li key={link.id}>
          <Link href={link.url} className="hover:text-sky-400">
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Routes;
