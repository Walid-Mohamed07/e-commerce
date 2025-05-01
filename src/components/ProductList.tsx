import { dbConnect } from "@/util/db_connection";
import { Product } from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";

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
    query.name = { $regex: searchParams.name, $options: "i" };
  }
  if (categoryId) {
    query.collectionIds = categoryId;
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
      ? parseInt(searchParams.page) * (limit || PRODUCT_PER_PAGE)
      : 0;
  const sort: any = {};
  if (searchParams?.sort) {
    const [sortType, sortBy] = searchParams.sort.split(" ");
    sort[sortBy] = sortType === "asc" ? 1 : -1;
  }

  // Fetch products from MongoDB
  const products = await Product.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit || PRODUCT_PER_PAGE);

  // Count total products for pagination
  const totalProducts = await Product.countDocuments(query);

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {products.map((product: any) => (
        <Link
          href={"/" + product.slug}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
          key={product._id}
        >
          <div className="relative w-full h-80">
            <Image
              src={product.media?.mainMedia?.image?.url || "/product.png"}
              alt=""
              fill
              sizes="25vw"
              className="absolute bg-slate-100 bject-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
            />
            {product.media?.items && (
              <Image
                src={product.media?.items[1]?.image?.url || "/product.png"}
                alt=""
                fill
                sizes="25vw"
                className="absolute bg-slate-100 object-cover rounded-md"
              />
            )}
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{product.name}</span>
            <span className="font-semibold">
              ${product.priceData?.discountedPrice}
            </span>
          </div>
          {product.additionalInfoSections && (
            <div
              className="text-sm tex--gray-500"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(
                  product.additionalInfoSections.find(
                    (section: any) => section.title === "Short Description"
                  )?.description || ""
                ),
              }}
            ></div>
          )}
          <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-white">
            Add to Cart
          </button>
        </Link>
      ))}
      {searchParams?.cat || searchParams?.name ? (
        <Pagination
          currentPage={searchParams?.page || 0}
          hasPrev={skip > 0}
          hasNext={skip + (limit || PRODUCT_PER_PAGE) < totalProducts}
        />
      ) : null}
    </div>
  );
};

export default ProductList;
