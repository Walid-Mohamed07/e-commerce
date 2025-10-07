"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const SearchBar = () => {
  // const router = useRouter();
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const params = new URLSearchParams(searchParams);

    if (name) {
      // router.push(`/list?name=${name}`);
      params.set("name", name);
    } else {
      params.delete("name");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <form
      className="flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1"
      onSubmit={handleSearch}
    >
      <input
        type="text"
        name="name"
        placeholder="Search"
        className="flex-1 bg-transparent outline-none"
      />
      <button className="cursor-pointer">
        <Image src="/search.png" alt="" width={16} height={16} />
      </button>
    </form>
  );
};

export default SearchBar;
