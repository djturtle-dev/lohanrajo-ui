"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
    children: React.ReactNode;
    direction?: "up" | "down" | "left" | "right" | "none";
    delay?: number;
    duration?: number;
    className?: string;
    staggerChildren?: boolean;
    staggerAmount?: number;
    childSelector?: string;
    start?: string;
}

export default function ScrollReveal({
    children,
    direction = "up",
    delay = 0,
    duration = 0.8,
    className = "",
    staggerChildren = false,
    staggerAmount = 0.1,
    childSelector,
    start = "top 85%",
}: ScrollRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!containerRef.current) return;

        const getDirection = () => {
            switch (direction) {
                case "up": return { y: 50, x: 0 };
                case "down": return { y: -50, x: 0 };
                case "left": return { x: 50, y: 0 };
                case "right": return { x: -50, y: 0 };
                case "none": return { x: 0, y: 0 };
                default: return { y: 50, x: 0 };
            }
        };

        const dir = getDirection();

        if (staggerChildren) {
            let targets = containerRef.current.children as unknown as HTMLElement[];
            if (childSelector) {
                targets = gsap.utils.toArray(childSelector, containerRef.current);
            }
            gsap.from(targets, {
                opacity: 0,
                x: dir.x,
                y: dir.y,
                duration: duration,
                delay: delay,
                stagger: staggerAmount,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: start,
                    toggleActions: "play none none none",
                },
            });
        } else {
            gsap.from(containerRef.current, {
                opacity: 0,
                x: dir.x,
                y: dir.y,
                duration: duration,
                delay: delay,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: start,
                    toggleActions: "play none none none",
                },
            });
        }
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
}
