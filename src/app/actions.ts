'use server'

import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import { getStore } from '@netlify/blobs';
import { headers } from 'next/headers';

export async function submitFeedback(formData: FormData) {
    try {
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const phone = formData.get('phone') as string;
        const email = formData.get('email') as string;
        const type = formData.get('type') as string;
        const content = formData.get('content') as string;
        const cvFile = formData.get('cv');

        let cvUrl = null;

        if (cvFile && typeof cvFile !== 'string' && cvFile.size > 0) {
            const arrayBuffer = await cvFile.arrayBuffer();
            const uniqueFilename = `${Date.now()}-${cvFile.name.replace(/\s+/g, '_')}`;

            const isNetlify = !!process.env.NETLIFY;
            const hasNetlifyCreds = !!(process.env.NETLIFY_SITE_ID && process.env.NETLIFY_AUTH_TOKEN);
            const useBlobs = isNetlify || hasNetlifyCreds;

            let cvPath = '';
            if (useBlobs) {
                const store = getStore('cvs');
                await store.set(uniqueFilename, arrayBuffer);
                cvPath = `/api/blobs/${uniqueFilename}?store=cvs`;
            } else {
                // Save file locally in public/uploads for development purposes
                const uploadDir = path.join(process.cwd(), 'public', 'uploads');
                
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }
                
                const filepath = path.join(uploadDir, uniqueFilename);
                fs.writeFileSync(filepath, Buffer.from(arrayBuffer));
                
                cvPath = `/uploads/${uniqueFilename}`;
            }

            // Convert to absolute URL using headers so it's fully accessible from the admin portal
            try {
                const host = (await headers()).get('host') || 'localhost:3000';
                const protocol = host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https';
                cvUrl = `${protocol}://${host}${cvPath}`;
            } catch (headerErr) {
                console.warn('Could not read request headers for absolute CV URL, using relative path:', headerErr);
                cvUrl = cvPath;
            }
        }

        // Save to database using Prisma
        await prisma.contactSubmission.create({
            data: {
                firstName,
                lastName,
                phone,
                email,
                type,
                content,
                cvUrl,
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Error saving submission:', error);
        return { success: false, error: 'Failed to save submission' };
    }
}
