"use client";

import { Category } from "@/models/category.model";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  categories: Category[];
};

const Filter = ({ categories }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // console.log({ categories });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(searchParams);
    if (
      value === "Type" ||
      value === "All Filters" ||
      value === "Sort By"
    ) {
      params.delete(name);
    } else if (value === "Category") {
      // Set default category to "all-products" when Category is selected
      params.set(name, "all-products");
    } else {
      params.set(name, value);
    }
    // console.log("Filter Params:", params.toString());
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mt-12 flex justify-between">
      <div className="flex gap-6 flex-wrap">
        <select
          name="type"
          id=""
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          onChange={handleFilterChange}
          suppressHydrationWarning
        >
          <option value="Type">Type</option>
          <option value="physical">Physical</option>
          <option value="digital">Digital</option>
        </select>
        <input
          type="text"
          name="min"
          placeholder="min price"
          className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"
          onChange={handleFilterChange}
          suppressHydrationWarning
        />
        <input
          type="text"
          name="max"
          placeholder="max price"
          className="text-xs rounded-2xl pl-2 w-24 ring-1 ring-gray-400"
          onChange={handleFilterChange}
          suppressHydrationWarning
        />
        {/* TODO: Filter Categories */}
        <select
          name="cat"
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          onChange={handleFilterChange}
          suppressHydrationWarning
        >
          <option value="Category">Category</option>
          {categories.map((cat: any) => (
            <option key={cat._id ?? cat.id} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          name=""
          id=""
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-[#EBEDED]"
          suppressHydrationWarning
        >
          <option>All Filters</option>
        </select>
      </div>
      <div className="">
        <select
          name="sort"
          id=""
          className="py-2 px-4 rounded-2xl text-xs font-medium bg-white ring-1 ring-gray-400"
          onChange={handleFilterChange}
          suppressHydrationWarning
        >
          <option>Sort By</option>
          <option value="asc price">Price (low to high)</option>
          <option value="desc price">Price (high to low)</option>
          <option value="asc lastUpdated">Newest</option>
          <option value="desc lastUpdated">Oldest</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
