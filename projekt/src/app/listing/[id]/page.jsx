import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchListingById, fetchListings } from "@/lib/apiClient";
import { getImageUrl } from "@/lib/media";
import ItemCard from "@/components/ItemCard";
import ProposeButton from "@/components/ProposeButton";

export default async function ListingDetail({ params }) {
  const { id } = params;                
  const item = await fetchListingById(id);

  if (!item) notFound();

  const sellerKey = String(
    item?.userId ?? item?.user?.id ?? item?.sellerId ?? item?.ownerId ?? ""
  );

  const all = await fetchListings();
  const others = sellerKey
    ? all
        .filter(
          (x) =>
            String(x.id) !== String(item.id) &&
            String(x?.userId ?? x?.user?.id ?? x?.sellerId ?? x?.ownerId ?? "") ===
              sellerKey
        )
        .slice(0, 3) 
    : [];

  const img = getImageUrl(item);
  const createdAt = item?.createdAt || item?.created_at || item?.date || null;
  const nicDate = createdAt ? new Date(createdAt).toISOString().slice(0, 10) : null;

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border bg-gray-50 overflow-hidden">
          <div className="relative aspect-[4/3]">
            <Image
              src={img}
              alt={item?.title || "Listing"}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 600px, 100vw"
              priority
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">{item?.title || "Listing Title"}</h1>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {item?.description || "No description provided."}
          </p>
          {nicDate && <p className="text-sm text-gray-500">On SwapHub since {nicDate}</p>}
          <ProposeButton listingId={item?.id} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Other items from this Swapper</h2>
        {others.length === 0 ? (
          <div className="text-gray-600">No other item from this user.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map((o) => (
              <ItemCard key={o.id} item={o} />
            ))}
          </div>
        )}
      </section>

      <div>
        <Link href="/" className="text-sm underline hover:no-underline">
          ← Back to listings
        </Link>
      </div>
    </div>
  );
}
