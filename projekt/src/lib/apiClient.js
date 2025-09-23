const BASE_URL =  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';


/* Listings */
export async function fetchListings(parms = {}) {
    const res = await fetch(makeUrl("/api/v1/listings", parms),{
        cache: 'no-store',
    });
    if (!res.ok) throw new Error("could not fetch listings");
    const data = await res.json();
    return Array.isArray(data) ? data : [];

    } 
export async function fetchListingById(id) {
    const res = await fetch(makeUrl(`/api/v1/listings/${id}`),{
        cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
}



