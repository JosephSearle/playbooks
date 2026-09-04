import { source } from '@/lib/source';
import { llms } from 'fumadocs-core/source/llms';

export const revalidate = false;

const { index } = llms(source);

export async function GET() {
  return new Response(index(), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
}
