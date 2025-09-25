export function getImageUrl(item) {
  const url =
    item?.asset?.url ||
    item?.asset?.href ||
    item?.assets?.[0]?.url ||
    item?.assets?.[0]?.href ||
    item?.imageUrl ||
    null;

  return url && typeof url === "string" ? url : null;
}