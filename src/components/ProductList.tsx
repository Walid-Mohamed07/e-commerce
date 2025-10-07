import { dbConnect } from "@/util/db_connection";
// import { products } from "@wix/stores";
import { Product } from "@/models/Product";
import { getProducts } from "@/features/product/services/product";
import Skeleton from "@/components/Skeleton";
import ProductListComponent from "@/features/product/components/ProductListComponent";
import { ProductsQueryResult } from "@/models/product.model";

const PRODUCT_PER_PAGE = 4;

const ProductList = async ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {
  // Connect to MongoDB
  await dbConnect();

  // Build the query object
  const query: any = {};
  if (searchParams?.name) {
    query.name = `${searchParams.name}`;
  }
  if (searchParams?.cat) {
    query.cat = searchParams.cat;
  }
  if (searchParams?.type) {
    query.type = `${searchParams.type}`;
  }
  if (searchParams?.min || searchParams?.max) {
    searchParams?.min ? (query.min = parseFloat(searchParams.min)) : null;
    searchParams?.max ? (query.max = parseFloat(searchParams.max)) : null;
  }
  if (searchParams?.sort) {
    query.sort = `${searchParams.sort}`;
  }

  // Pagination and sorting
  const page = Math.max(1, parseInt(searchParams?.page ?? "1", 10) || 1);
  const queryLimit = limit || PRODUCT_PER_PAGE;
  const skip = (page - 1) * queryLimit;

  // // Convert searchParams to a plain object
  // const paramsObj: Record<string, string> = {};
  // searchParams.forEach((value, key) => {
  //   paramsObj[key] = value;
  // });

  // console.log("skip, limit:", skip, queryLimit);

  const payload = {
    query: JSON.stringify(query),
    sort: 1,
    skip,
    limit: queryLimit,
  };

  // Fetch products
  const products = [];
  // let products: ProductsQueryResult = {
  //   items: [],
  //   totalCount: 0,
  //   totalPages: 0,
  //   currentPage: 0,
  //   hasNext: () => false,
  //   hasPrev: () => false,
  //   length: 0,
  //   pageSize: 0,
  //   next: async () => products,
  //   prev: async () => products,
  // };
  let isLoading = true;
  try {
    products.push(await getProducts(payload));
    isLoading = false;
  } catch (error) {
    // handle error if needed
    isLoading = false;
  }

  // console.log("Products fetched:", products);

  return (
    <ProductListComponent products={products[0] || {}} isLoading={isLoading} />
  );
};

export default ProductList;
