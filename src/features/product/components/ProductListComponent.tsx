"use client";

import "./hover.css";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
// import Pagination from "@/components/Pagination";
// import ErrorToast from "@/components/Toast/ErrorToast";
import Skeleton from "@/components/Skeleton";
import Pagination from "@/components/Pagination";
import { Product, ProductsQueryResult } from "@/models/product.model";

function ProductListComponent({
  products,
  isLoading,
}: {
  products: ProductsQueryResult;
  isLoading: boolean;
}) {
  if (isLoading) return <Skeleton />;
  {
    /* <ErrorToast errorMsg={productsError?.message} /> */
  }
  return (
    // <>
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {/* {!isProductsLoading && products?.length === 0 ? (
        <div className="w-full flex justify-center">
        <span className="text-gray-500">No products found</span>
        </div>
        ) : ( */}
      {products.items.map((product: Product) => (
        // <ProductCard key={product._id} product={product} />
        <Link
          key={product._id}
          href={`/${product.slug}`}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
        >
          <div className="relative h-64 w-full">
            <Image
              className="absolute w-full h-full hoverNone opacity-100 bg-slate-100 object-cover rounded-md z-10 transition-transform duration-300 ease-in-out"
              src={product.media?.mainMedia?.image?.url || "/product.png"}
              alt=""
              // fill
              width={300}
              height={300}
              // sizes="15vw"
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
          <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs opacity-100 hover:bg-lama hover:text-white hover:opacity-0">
            Add to Cart
          </button>
        </Link>
      ))}
      <Pagination
        currentPage={products.currentPage || 0}
        hasNext={products.currentPage! < products.totalPages!}
        hasPrev={products.currentPage! > 1}
      />
      {/* {searchParams?.cat || searchParams?.name ? (
        <Pagination
          currentPage={searchParams?.page || 0}
          hasPrev={skip > 0}
          hasNext={skip + (limit || PRODUCT_PER_PAGE) < totalProducts}
        />
        ) : null} */}
    </div>
    // </>
  );
}

export default ProductListComponent;
