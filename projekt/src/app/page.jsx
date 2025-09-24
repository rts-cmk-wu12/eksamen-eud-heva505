import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import ItemCard from "@/components/ItemCard";
import { fetchListings } from "@/lib/apiClient";
import FilterPanel from "@/components/FilterPanel";
import SortChips from "@/components/SortChips";

export default async function Home({ searchParams }) {
  const parms = await searchParams;
  const page = Math.max(1, Number(parms?.page) || 1);
  const perPage = 6;
  const search = parms?.search || "";

  // Fetch all listings and apply search filter UI-filtering
  const all = await fetchListings();
  const filtered = search
    ? all
        .filter((item) => item?.title || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (item?.description || "").toLowerCase().includes(search.toLowerCase())
    : all;
  const total = filtered.length;
  const start = (page - 1) * perPage;
  const items = filtered.slice(start, start + perPage);

  return (
    <div className="flex gap-6">
      {/*left filter panel*/}
      <FilterPanel />

      {/*right content */}
      <div className="flex-1 min-w-0">
        {/*search and sort*/}
        <div className="flex items-center justify-between gap-4 mb-4">
          <SearchBar />
          <SortChips />
        </div>

        {/*items grid*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center text-gray-600 py-16">
              No items found.
            </div>
          )}
        </div>

        {/*pagination*/}
        <Pagination page={page} perPage={perPage} total={total} />
      </div>
    </div>
  );
}
