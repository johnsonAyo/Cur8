"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    side?: "top" | "bottom";
    align?: "start" | "center" | "end";
}

export function Tooltip({
    content,
    children,
    className = "",
    side = "top",
    align = "center"
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, height: 0, width: 0, right: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.top + window.scrollY,
                left: rect.left + window.scrollX,
                right: rect.right + window.scrollX,
                width: rect.width,
                height: rect.height,
            });
        }
    };

    const handleMouseEnter = () => {
        updatePosition();
        setIsVisible(true);
    };

    useEffect(() => {
        if (isVisible) {
            window.addEventListener('scroll', updatePosition);
            window.addEventListener('resize', updatePosition);
        }
        return () => {
            window.removeEventListener('scroll', updatePosition);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isVisible]);

    const getPositionStyle = () => {
        let top = side === "top" ? coords.top - 8 : coords.top + coords.height + 8;
        let left = coords.left + coords.width / 2;
        let transform = side === "top" ? 'translate(-50%, -100%)' : 'translate(-50%, 0)';

        if (align === "start") {
            left = coords.left;
            transform = side === "top" ? 'translate(0, -100%)' : 'translate(0, 0)';
        } else if (align === "end") {
            left = coords.right;
            transform = side === "top" ? 'translate(-100%, -100%)' : 'translate(-100%, 0)';
        }

        return {
            top: `${top}px`,
            left: `${left}px`,
            transform
        };
    };

    const tooltipContent = isVisible && mounted && (
        <div
            className="fixed z-[9999] pointer-events-none"
            style={getPositionStyle()}
        >
            <div className={`w-max max-w-[90vw] p-4 bg-zinc-900 text-zinc-50 text-xs rounded-xl shadow-2xl border border-zinc-800 ring-1 ring-white/10 animate-in fade-in zoom-in ${side === "top" ? "slide-in-from-bottom-2" : "slide-in-from-top-2"} duration-200 whitespace-normal relative`}>
                {content}
                <div className={`absolute border-8 border-transparent ${side === "top" ? "top-full border-t-zinc-900" : "bottom-full border-b-zinc-900"} ${align === "center" ? "left-1/2 -translate-x-1/2" :
                        align === "start" ? "left-4" : "right-4"
                    }`} />
            </div>
        </div>
    );

    return (
        <>
            <div
                ref={triggerRef}
                className={`inline-block ${className}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={() => setIsVisible(false)}
            >
                {children}
            </div>
            {mounted && createPortal(tooltipContent, document.body)}
        </>
    );
}
