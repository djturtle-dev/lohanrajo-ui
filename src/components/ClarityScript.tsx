'use client';

import { useEffect } from 'react';

export default function ClarityScript() {
    useEffect(() => {
        const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

        if (!projectId) {
            console.warn('Clarity project ID not found in environment variables');
            return;
        }

        // Initialize Microsoft Clarity
        (function(c: any, l: any, a: any, r: any, i: any) {
            c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments); };
            const t = l.createElement(r);
            t.async = 1;
            t.src = 'https://web.clarity.ms/collect?v=' + i;
            const y = l.getElementsByTagName(r)[0];
            y.parentNode.insertBefore(t, y);
        })(window, document, 'clarity', 'script', projectId);
    }, []);

    return null;
}
