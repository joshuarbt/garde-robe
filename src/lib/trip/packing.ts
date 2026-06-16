export function computePackingProgress(
  items: { isPacked: boolean }[],
): { packedCount: number; totalCount: number } {
  const totalCount = items.length;
  const packedCount = items.filter((item) => item.isPacked).length;
  return { packedCount, totalCount };
}
