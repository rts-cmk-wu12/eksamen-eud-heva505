
export function getImageUrl(item) {
    return (
        item?.assets?.url ||
        item?.assets?.href ||
        item?.assets?.[0]?.url ||
        item?.assets?.[0]?.href ||
        item?.imageUrl ||
        "/placeholder.png"
    );
}