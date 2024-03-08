export function getRandomFloat(min: number, max: number, decimals = 2) {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}
