import React, { useEffect, useRef } from 'react';

const GameCanvas = ({ canvasRef, canvasWidth, canvasHeight }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container) return;

            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            const aspectRatio = canvasWidth / canvasHeight;
            let displayWidth = containerWidth;
            let displayHeight = containerWidth / aspectRatio;

            if (displayHeight > containerHeight) {
                displayHeight = containerHeight;
                displayWidth = containerHeight * aspectRatio;
            }

            canvas.style.width = `${displayWidth}px`;
            canvas.style.height = `${displayHeight}px`;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [canvasRef, canvasWidth, canvasHeight]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center"
            style={{ background: '#1A2035' }}
        >
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className="shadow-2xl"
                style={{
                    touchAction: 'none',
                    borderRadius: '16px',
                    border: '2px solid rgba(100,120,150,0.3)',
                }}
            />
        </div>
    );
};

export default GameCanvas;
