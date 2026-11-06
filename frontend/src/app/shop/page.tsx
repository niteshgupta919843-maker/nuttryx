import React from 'react';
import { fetchServerProducts } from '@/lib/server-api';
import ShopClient from './ShopClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ShopPage() {
  const liveProducts = await fetchServerProducts();
  return <ShopClient initialProducts={liveProducts} />;
}
