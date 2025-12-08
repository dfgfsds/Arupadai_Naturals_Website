// components/AnimatedCursor.tsx
'use client';

import { useEffect, useRef } from 'react';

const AnimatedCursor = () => {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            const cursor = cursorRef.current;
            if (!cursor) return;

            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        };

        document.addEventListener('mousemove', moveCursor);
        return () => document.removeEventListener('mousemove', moveCursor);
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[10002] transition-all duration-150 ease-out transform -translate-x-1/2 -translate-y-1/2"
            style={{
                backgroundImage: "url('/cursor.png')",
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
            }}
        />
    );
};

export default AnimatedCursor;
