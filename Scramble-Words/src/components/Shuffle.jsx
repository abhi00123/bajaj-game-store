import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

const Shuffle = ({
    text,
    className = '',
    style = {},
    shuffleDirection = 'up',
    duration = 0.4,
    ease = 'power3.out',
    onShuffleComplete,
    shuffleTimes = 3,
    stagger = 0.04,
    colorFrom,
    colorTo,
    tag = 'span',
}) => {
    const containerRef = useRef(null);
    const [displayChars, setDisplayChars] = useState([]);
    const [settled, setSettled] = useState(false);
    const completedRef = useRef(false);

    const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    const getRandomChar = useCallback(() => {
        return CHARSET[Math.floor(Math.random() * CHARSET.length)];
    }, []);

    useEffect(() => {
        if (!text) return;
        completedRef.current = false;

        const chars = text.split('');
        setSettled(false);
        setDisplayChars(chars.map(() => getRandomChar()));

        const totalCycles = Math.max(1, shuffleTimes);
        const charTimers = [];
        let settledCount = 0;

        chars.forEach((finalChar, index) => {
            const delay = index * stagger * 1000;
            let cycleCount = 0;

            const timer = setTimeout(() => {
                const interval = setInterval(() => {
                    cycleCount++;

                    if (cycleCount >= totalCycles) {
                        clearInterval(interval);
                        setDisplayChars(prev => {
                            const next = [...prev];
                            next[index] = finalChar;
                            return next;
                        });

                        settledCount++;
                        if (settledCount === chars.length && !completedRef.current) {
                            completedRef.current = true;
                            setTimeout(() => {
                                setSettled(true);
                                if (onShuffleComplete) onShuffleComplete();
                            }, 100);
                        }
                    } else {
                        setDisplayChars(prev => {
                            const next = [...prev];
                            next[index] = CHARSET[Math.floor(Math.random() * CHARSET.length)];
                            return next;
                        });
                    }
                }, (duration * 1000) / totalCycles);

                charTimers.push(interval);
            }, delay);

            charTimers.push(timer);
        });

        if (containerRef.current) {
            const charEls = containerRef.current.querySelectorAll('.shuffle-char');

            const fromVars = {};
            const toVars = {
                duration: duration,
                ease: ease,
                stagger: stagger,
            };

            if (shuffleDirection === 'up') {
                fromVars.y = 20;
                fromVars.opacity = 0;
                toVars.y = 0;
                toVars.opacity = 1;
            } else if (shuffleDirection === 'down') {
                fromVars.y = -20;
                fromVars.opacity = 0;
                toVars.y = 0;
                toVars.opacity = 1;
            } else if (shuffleDirection === 'left') {
                fromVars.x = 20;
                fromVars.opacity = 0;
                toVars.x = 0;
                toVars.opacity = 1;
            } else {
                fromVars.x = -20;
                fromVars.opacity = 0;
                toVars.x = 0;
                toVars.opacity = 1;
            }

            if (charEls.length > 0) {
                gsap.fromTo(charEls, fromVars, toVars);
            }

            if (colorFrom && colorTo && charEls.length > 0) {
                gsap.fromTo(charEls,
                    { color: colorFrom },
                    { color: colorTo, duration: duration, ease: ease, stagger: stagger }
                );
            }
        }

        return () => {
            charTimers.forEach(t => {
                clearTimeout(t);
                clearInterval(t);
            });
        };
    }, [text]);

    const Tag = tag;

    return (
        <Tag
            ref={containerRef}
            className={`inline-flex flex-wrap justify-center ${className}`}
            style={{
                ...style,
                fontFamily: style.fontFamily || 'inherit',
            }}
        >
            {displayChars.map((char, i) => (
                <span
                    key={`${i}-${text && text[i]}`}
                    className={`shuffle-char inline-block ${settled ? 'text-green-300' : 'text-white'}`}
                    style={{
                        transition: settled ? 'color 0.3s ease' : 'none',
                        willChange: 'transform, opacity',
                        minWidth: char === ' ' ? '0.5em' : 'auto',
                    }}
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </Tag>
    );
};

export default Shuffle;
