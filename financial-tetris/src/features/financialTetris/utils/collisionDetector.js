export const checkCollision = (currentPiece, grid, { x: moveX, y: moveY }) => {
    const { shape, pos } = currentPiece;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x] !== 0) {
                const newX = x + pos.x + moveX;
                const newY = y + pos.y + moveY;

                // Check bounds
                if (
                    newX < 0 ||
                    newX >= grid[0].length ||
                    newY >= grid.length
                ) {
                    return true;
                }

                // Check if cell is already occupied
                if (newY >= 0 && grid[newY][newX].filled) {
                    return true;
                }
            }
        }
    }
    return false;
};
