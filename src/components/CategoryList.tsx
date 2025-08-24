import { dbConnect } from "@/util/db_connection";
// import { Category } from "@/models/Category"; // Assuming you have a Category model
// import Image from "next/image";
// import Link from "next/link";
import {
  // dehydrate,
  HydrationBoundary,
  // QueryClient,
  // useQuery,
} from "@tanstack/react-query";
// import { getCategories } from "@/features/category/services/category";
// import { QueryKey } from "@/constants/queryKey";
// import Skeleton from "./Skeleton";
import CategoryListComponent from "@/features/category/components/CategoryListComponent";

const CATEGORY_PER_PAGE = 10;

const CategoryList = async ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId?: string;
  limit?: number;
  searchParams?: any;
}) => {
  // Connect to MongoDB
  await dbConnect();

  // Build the query object
  const query: any = {};
  if (searchParams?.name) {
    query.name = { $regex: searchParams.name, $options: "i" };
  }
  if (categoryId) {
    query.categoryId = categoryId;
  }
  if (searchParams?.type) {
    query.productType = { $in: [searchParams.type] };
  }
  if (searchParams?.min || searchParams?.max) {
    query["priceData.discountedPrice"] = {
      ...(searchParams.min && { $gte: parseFloat(searchParams.min) }),
      ...(searchParams.max && { $lte: parseFloat(searchParams.max) }),
    };
  }

  // Pagination and sorting
  const skip =
    searchParams?.page && limit
      ? parseInt(searchParams.page) * (limit || CATEGORY_PER_PAGE)
      : 0;
  const sort: any = {};
  if (searchParams?.sort) {
    const [sortType, sortBy] = searchParams.sort.split(" ");
    sort[sortBy] = sortType === "asc" ? 1 : -1;
  }
  const queryLimit = limit || CATEGORY_PER_PAGE;

  // const queryClient = new QueryClient();

  const payload = {
    query: query || undefined,
    sort: sort || undefined,
    skip: skip || undefined,
    limit: queryLimit,
  };

  // await queryClient.prefetchQuery({
  //   queryKey: [QueryKey.CATEGORY, payload],
  //   queryFn: () => getCategories(payload),
  // });

  return (
    <HydrationBoundary state={payload}>
      <CategoryListComponent />
    </HydrationBoundary>
  );
};

export default CategoryList;
