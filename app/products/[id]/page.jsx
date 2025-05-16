import { products } from '../../data/products'

export async function generateMetadata({ params }) {
  // For metadata generation, params is already resolved by Next.js
  const product = products.find(p => p.id === params.id)

  return {
    title: `${product?.title || 'Product'} | Mercy Peter Detergents`,
    description: product?.description || 'Explore our powerful, mess-free detergents designed for everyday use.'
  }
}

// Main product page component
export default function ProductPage({ params }) {
  // Pass the ID directly to avoid issues with object serialization
  return <ProductClient id={params.id} />
}

// Import the client component at the end to avoid circular dependencies
import ProductClient from './ProductClient'
