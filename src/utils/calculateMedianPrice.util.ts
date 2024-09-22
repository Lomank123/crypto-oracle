export function calculateMedianPrice(sortedPrices: number[]): number {
  const length = sortedPrices.length;

  if (!length) {
    return -1;
  }
  if (length === 1) {
    return sortedPrices[0];
  }

  const middle = Math.floor(length / 2);

  if (length % 2 === 0) {
    return (sortedPrices[middle - 1] + sortedPrices[middle]) / 2;
  }

  return sortedPrices[middle];
}
