import { dbConnect } from "@/util/db_connection";
import { Category } from "@/models/Category"; // Assuming you have a Category model
import Image from "next/image";
import Link from "next/link";
import { log } from "node:console";

const CategoryList = async () => {
  // Connect to MongoDB
  await dbConnect();

  // Fetch categories from MongoDB
  const categories = await Category.find();

  return (
    <div className="px-4 overflow-x-scroll scrollbar-hide">
      <div className="flex gap-4 md:gap-8">
        {categories.map((item: any) => (
          <Link
            href={`/list?cat=${item.slug}`}
            className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
            key={item._id}
          >
            <div className="relative bg-slate-100 w-full h-64">
              <Image
                src={item.media.mainMedia?.image?.url || "/category.png"}
                alt=""
                fill
                sizes="20vw"
                className="object-contain"
              />
            </div>
            <h1 className="mt-8 font-light text-xl tracking-wide">
              {item.name}
            </h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
