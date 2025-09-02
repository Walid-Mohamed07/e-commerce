import { dbConnect } from "@/util/db_connection";
import { Product } from "@/models/Product";
import { getProducts } from "@/features/product/services/product";
import Skeleton from "@/components/Skeleton";
import ProductListComponent from "@/features/product/components/ProductListComponent";

const PRODUCT_PER_PAGE = 8;

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
  const skip =
    searchParams?.page && limit
      ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
      : 0;
  const queryLimit = limit || PRODUCT_PER_PAGE;

  // // Convert searchParams to a plain object
  // const paramsObj: Record<string, string> = {};
  // searchParams.forEach((value, key) => {
  //   paramsObj[key] = value;
  // });

  const payload = {
    query: JSON.stringify(query),
    sort: 1,
    skip: 0,
    limit: 8,
  };

  // Fetch products
  let products = [];
  let isLoading = true;
  try {
    products = await getProducts(payload);
    isLoading = false;
  } catch (error) {
    // handle error if needed
    isLoading = false;
  }

  // Count total products for pagination
  const totalProducts = await Product.countDocuments(query);

  return (
    <ProductListComponent
      products={products}
      isLoading={isLoading}
      totalProducts={totalProducts}
    />
  );
};

export default ProductList;
