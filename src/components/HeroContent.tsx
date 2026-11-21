'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './HeroSection.module.css';

interface HeroContentProps {
    heading?: React.ReactNode;
}

export default function HeroContent({ heading }: HeroContentProps) {
    return (
        <div className={styles.heroContainer}>
            <div className={styles.heroContent}>
                {/* 1. Heading */}
                <h1 className={styles.heading}>
                    {heading || (
                        <>
                            Precision in <span className="text-brand-accent">Metal Arts</span>
                        </>
                    )}
                </h1>

                {/* 2. Short Red Underline Bar */}
                <div className={styles.underlineBar} aria-hidden="true" />

                {/* 3. Pill-shaped Button with Red Gradient */}
                <Link href="/products" className={styles.ctaButton}>
                    <span>Explore products</span>
                    <ArrowRight className={styles.ctaArrow} />
                </Link>

                {/* 4. Thin Light Gray Divider Line */}
                <div className={styles.dividerLine} aria-hidden="true" />

                {/* 5. Stats Row */}
                <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>50+</span>
                        <span className={styles.statLabel}>Industries</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>100%</span>
                        <span className={styles.statLabel}>Satisfaction</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
