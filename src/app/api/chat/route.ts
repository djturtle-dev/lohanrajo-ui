import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';

const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    'HTTP-Referer': 'https://lohanrajo-ui.local',
    'X-Title': 'Lohanrajo Chatbot',
  }
});

function stripHtml(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

// Cache database queries daily (86400 seconds) to build the knowledge base
const getCachedKB = unstable_cache(
  async () => {
    try {
      const products = await prisma.product.findMany({
        include: { category: true }
      });
      const aboutContent = await prisma.aboutContent.findFirst();
      return { products, aboutContent };
    } catch (e) {
      console.error('Failed to fetch DB data for chat stream:', e);
      return { products: [], aboutContent: null };
    }
  },
  ['chat-daily-kb'],
  { revalidate: 86400 } // Daily revalidation
);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Fetch cached knowledge base context
    const { products, aboutContent } = await getCachedKB();

    // Format products with HTML tags stripped for clean LLM reading
    const productList = products.map(p => `- ${p.name} (Category: ${p.category?.name || 'N/A'}): ${stripHtml(p.description)}`).join('\n');

    // Format company info
    const companyInfo = `
    Title: ${aboutContent?.title || 'LIAT - LOHANRAJO INDUSTRIES AND TECHNOLOGIES'}
    Established: ${aboutContent?.establishedText || 'Established 1992'}
    Infrastructure: ${aboutContent?.infrastructureContent || ''}
    Vision: ${aboutContent?.visionContent || ''}
    Founders: ${aboutContent?.founderNames || ''}
    `;

    // System prompt with context
    const systemPrompt = `You are a helpful customer support assistant for LOHANRAJO INDUSTRIES AND TECHNOLOGIES PRIVATE LIMITED (LIAT). 
You answer queries accurately based ONLY on the provided context. If a user asks something not in the context, politely let them know you don't have that information.

### COMPANY DETAILS
${companyInfo}

### PRODUCT CATALOG
${productList.length > 0 ? productList : 'No products available at the moment.'}

### CONTACT DETAILS
Primary Facility Address:
Plot No. 213, 214 & 215, 3rd Main Road, Burma Colony,
Perungudi, OMR, Chennai - 600096, Tamil Nadu, India

Phone Numbers:
[+91 44 2496 2590](tel:+914424962590)
[+91 44 2496 2591](tel:+914424962591)

Email:
[lohanrajoliat@gmail.com](mailto:lohanrajoliat@gmail.com)

### INSTRUCTIONS
- Be polite, concise, and professional.
- Use formatting (bullet points, bold text) where appropriate.
- Keep responses short unless the user asks for detailed information.
- Only use the provided company, product, and contact details. Do not make up any information.
- IMPORTANT: When listing products or responding to a product catalog request, always append the token "[PRODUCTS_GRID]" to the end of your response so the UI knows to display the rich product cards.`;

    // Re-enabled streaming mode using streamText for fast typing responses
    const result = streamText({
      model: openrouter('google/gemma-4-31b-it:free'),
      messages,
      system: systemPrompt,
      providerOptions: {
        openrouter: {
          reasoning: true
        }
      }
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error('Stream error:', error);
        return String(error);
      }
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response('Error connecting to chat service', { status: 500 });
  }
}
