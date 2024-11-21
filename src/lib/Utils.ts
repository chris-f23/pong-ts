export function randomFloat(min: number, max: number) {
  if (typeof min !== "number" || typeof max !== "number") {
    throw new Error();
  }

  if (Number.isNaN(min) || Number.isNaN(max)) {
    throw new Error();
  }

  if (min > max) {
    throw new Error();
  }

  return Math.random() * (max - min) + min;
}

export function randomInt(min: number, max: number) {
  const float = randomFloat(min, max);
  return Math.round(float);
}

export function randomBoolean() {
  return randomInt(0, 100) >= 50;
}
