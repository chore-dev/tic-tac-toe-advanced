export const createMatrix = (size: number) => {
  const matrix = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push([i, j] as const);
    }
    matrix.push(row);
  }
  return matrix;
};
