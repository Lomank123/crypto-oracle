import { ITokenPairPrice } from '../interfaces/tokenPairPrice.interface';

export function medianPrice(tokenPairPrices: ITokenPairPrice[]): number {
  if (!tokenPairPrices.length) {
    return -1;
  }
  if (tokenPairPrices.length === 1) {
    return tokenPairPrices[0].price;
  }

  const middle = Math.floor(tokenPairPrices.length / 2);

  if (tokenPairPrices.length % 2 === 0) {
    return (
      (tokenPairPrices[middle - 1].price + tokenPairPrices[middle].price) / 2
    );
  }

  return tokenPairPrices[middle].price;
}
