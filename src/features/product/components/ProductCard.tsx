import "./hover.css";
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/models/product.model";
import DOMPurify from "isomorphic-dompurify";
import AddToCartButton from "./AddToCartButton";

interface ProductCardProps {
  product: Product;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]">
      <Link href={`/${product.slug}`} className="w-full flex flex-col gap-4">
        <div className="relative h-64 w-full">
          <Image
            className="absolute w-full h-full opacity-100 bg-slate-100 object-contain rounded-md z-10 hoverNone transition-transform duration-300 ease-in-out"
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
              className="absolute bg-slate-100 object-contain rounded-md"
            />
          )}
        </div>
        <div className="flex justify-between">
          <span className="font-medium">{product.name}</span>
          <span className="font-semibold">
            ${product.price?.discountedPrice}
          </span>
        </div>
        {product.additionalInfoSections && (
          <div
            className="text-sm tex--gray-500"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                product.additionalInfoSections.find(
                  (section: any) => section.title === "Short Description",
                )?.description || "",
              ),
            }}
          ></div>
        )}
      </Link>
      <AddToCartButton
        productId={(product._id ?? product.id)!}
        productName={product.name}
        productData={{
          price: product.price,
          imageUrl: product.media?.mainMedia?.image?.url,
        }}
      />
    </div>
  );
};

export default ProductCard;
