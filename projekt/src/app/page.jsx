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



    const all =await fetchListings();
    const filtered = search ? all.filter((item) =>
        item?.title || ""). toLowerCase().includes(search.toLowerCase())||
        (item?.description || "").toLowerCase().includes(search.toLowerCase())
        : all;
    const total = filtered.length;
    const start = (page - 1) * perPage;
    const items = filtered.slice(start, start + perPage);

    return (