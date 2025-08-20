import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface DatabaseProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  category_id?: string;
  stock_quantity: number;
  is_featured: boolean;
  is_new: boolean;
  image_url?: string;
  sku?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseProductVariant {
  id: string;
  product_id: string;
  variant_name: string;
  flavor?: string;
  size: string;
  price: number;
  stock_quantity: number;
  sku?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface DatabaseVariantImage {
  id: string;
  variant_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at?: string;
}

export interface ProductWithVariantsAndImages extends DatabaseProduct {
  variants: (DatabaseProductVariant & { images: DatabaseVariantImage[] })[];
}

export const useProducts = () => {
  const [products, setProducts] = useState<ProductWithVariantsAndImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch products with variants and images
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          product_variants:product_variants(
            *,
            variant_images:variant_images(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Transform the data to match our interface
      const transformedProducts: ProductWithVariantsAndImages[] = (productsData || []).map(product => ({
        ...product,
        variants: (product.product_variants || []).map((variant: any) => ({
          ...variant,
          images: variant.variant_images || []
        }))
      }));

      setProducts(transformedProducts);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Listen for admin updates
    const handleProductsUpdated = () => {
      fetchProducts();
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, []);

  const refetch = () => {
    fetchProducts();
  };

  return {
    products,
    loading,
    error,
    refetch
  };
};

export const useProduct = (productId: string) => {
  const [product, setProduct] = useState<ProductWithVariantsAndImages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      setError(null);

      const { data: productData, error: productError } = await supabase
        .from('products')
        .select(`
          *,
          product_variants:product_variants(
            *,
            variant_images:variant_images(*)
          )
        `)
        .eq('id', productId)
        .single();

      if (productError) throw productError;

      if (productData) {
        const transformedProduct: ProductWithVariantsAndImages = {
          ...productData,
          variants: (productData.product_variants || []).map((variant: any) => ({
            ...variant,
            images: variant.variant_images || []
          }))
        };
        setProduct(transformedProduct);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();

    // Listen for admin updates
    const handleProductsUpdated = () => {
      fetchProduct();
    };

    window.addEventListener('productsUpdated', handleProductsUpdated);
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdated);
    };
  }, [productId]);

  const refetch = () => {
    fetchProduct();
  };

  return {
    product,
    loading,
    error,
    refetch
  };
};