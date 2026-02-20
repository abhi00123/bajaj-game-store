import React from 'react';

const Tetromino = ({ shape, color, pos, gridWidth, gridHeight, className = "" }) => {
    if (!shape) return null;

    return (
        <>
            {shape.map((row, y) =>
                row.map((value, x) => {
                    if (value !== 0) {
                        const gridX = x + pos.x;
                        const gridY = y + pos.y;

                        // Only render if within vertical bounds (visible part of grid)
                        if (gridY >= 0 && gridY < gridHeight) {
                            return (
                                <div
                                    key={`${gridX}-${gridY}`}
                                    className={`absolute tetris-block rounded-[1px] bg-${color} ${className}`}
                                    style={{
                                        width: `${100 / gridWidth}%`,
                                        height: `${100 / gridHeight}%`,
                                        left: `${(gridX / gridWidth) * 100}%`,
                                        top: `${(gridY / gridHeight) * 100}%`,
                                        transition: 'top 0.1s linear, left 0.1s ease-out'
                                    }}
                                >
                                </div>
                            );
                        }
                    }
                    return null;
                })
            )}
        </>
    );
};

export default React.memo(Tetromino);
