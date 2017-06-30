const RANDOM_NUMBERS_COUNT = 2048;
const randomNumbers = Array(RANDOM_NUMBERS_COUNT).fill(0).map(() => (Math.random() * 255 << 0));
let randomIndex = 0;

export default function random() {
  randomIndex++;
  if (randomIndex > RANDOM_NUMBERS_COUNT) randomIndex = 0;
  return randomNumbers[randomIndex];
}
