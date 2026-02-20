export const rotate = (matrix) => {
    // Transpose
    const rotatedMatrix = matrix.map((_, index) =>
        matrix.map(col => col[index])
    );
    // Reverse each row
    return rotatedMatrix.map(row => row.reverse());
};
