"use client";

import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/media";

export default function ItemCard({ item, priority = false }) {
  const img = getImageUrl(item);

  return (
    <Link
      href={`/listing/${item.id}`}
      className="block rounded-xl border bg-white transition hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-t-xl bg-gray-100 relative">
        <Image
          src={img}
          alt={item?.title || "Listing"}
          fill
          className="object-cover"
          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
          priority={priority}
          loading={priority ? "eager" : undefined}
        />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
          {item?.title || "Untitled"}
        </h3>
      </div>
    </Link>
  );
}
