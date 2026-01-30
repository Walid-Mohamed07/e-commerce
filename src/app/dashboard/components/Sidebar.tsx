"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white shadow-md pt-24">
      <nav className="mt-5 grid items-start px-2 text-sm font-medium lg:px-4">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900 hover:bg-gray-200 ${
            pathname === "/dashboard"
              ? "bg-gray-200 text-gray-900"
              : "text-gray-700"
          }`}
        >
          Dashboard
        </Link>
        <Link
          href="/dashboard/orders"
          className={`block px-4 py-2 text-sm rounded-lg transition-all hover:text-gray-900 hover:bg-gray-200 ${
            pathname === "/dashboard/orders"
              ? "bg-gray-200 text-gray-900"
              : "text-gray-700"
          }`}
        >
          Orders
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
