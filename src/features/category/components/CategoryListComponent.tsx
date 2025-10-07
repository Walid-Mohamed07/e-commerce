import "./hover.css";
import "./CategoryListComponent.css";
import Skeleton from "@/components/Skeleton";
import Image from "next/image";
import Link from "next/link";
import { getCategories } from "../services/category";
import { Suspense, use } from "react";
// import { ErrorBoundary } from "next/dist/client/components/error-boundary";

const CategoryListComponent = (prop: any) => {
  //   const {
  //     data: categories,
  //     isLoading: isCategoriesLoading,
  //     error: categoriesError,
  //   } = useQuery({
  //     queryKey: [QueryKey.CATEGORY],
  //     queryFn: () => getCategories(),
  //   });

  const categories = use(getCategories(prop));

  return (
    // <ErrorBoundary
    //   errorComponent={({ error }) => (
    //     <div className="text-red-500">
    //       Error loading categories: {error.message}
    //     </div>
    //   )}
    // >
    // <Suspense fallback={<Skeleton />}>
    <div className="px-4 pt-6 overflow-x-scroll scrollbar-hide hover:bg-red-600">
      <div className="flex gap-4 md:gap-8 mt-6">
        {categories.map((item: any) => (
          <Link
            href={`/list?cat=${item.slug}`}
            className="flex-shrink w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
            key={item._id}
          >
            <div className="relative bg-slate-100 w-full hoverScale transition-transform duration-200 ease-in-out">
              <Image
                src={item.media.mainMedia?.image?.url || "/category.png"}
                alt=""
                fill
                sizes="20vw"
                className="object-cover"
              />
            </div>
            <h1 className="mt-8 font-light text-xl tracking-wide">
              {item.name}
            </h1>
          </Link>
        ))}
      </div>
    </div>
    // </Suspense>
    // </ErrorBoundary>
  );
};

export default CategoryListComponent;
