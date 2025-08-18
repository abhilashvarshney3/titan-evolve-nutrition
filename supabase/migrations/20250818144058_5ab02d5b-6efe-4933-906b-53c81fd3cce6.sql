-- Create database functions for review operations
CREATE OR REPLACE FUNCTION public.get_reviews(product_id_param UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  product_id UUID,
  rating INTEGER,
  title TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  is_verified_purchase BOOLEAN,
  is_approved BOOLEAN,
  helpful_count INTEGER,
  first_name TEXT,
  last_name TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    r.id,
    r.user_id,
    r.product_id,
    r.rating,
    r.title,
    r.comment,
    r.created_at,
    r.updated_at,
    r.is_verified_purchase,
    r.is_approved,
    r.helpful_count,
    p.first_name,
    p.last_name
  FROM reviews r
  LEFT JOIN profiles p ON r.user_id = p.id
  WHERE r.product_id = product_id_param 
    AND r.is_approved = true
  ORDER BY r.created_at DESC;
$$;

-- Create function to submit a new review
CREATE OR REPLACE FUNCTION public.create_review(
  user_id_param UUID,
  product_id_param UUID,
  rating_param INTEGER,
  title_param TEXT,
  comment_param TEXT
)
RETURNS UUID
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
DECLARE
  new_review_id UUID;
BEGIN
  -- Check if user already has a review for this product
  IF EXISTS (
    SELECT 1 FROM reviews 
    WHERE user_id = user_id_param AND product_id = product_id_param
  ) THEN
    RAISE EXCEPTION 'User already has a review for this product';
  END IF;

  -- Insert new review
  INSERT INTO reviews (user_id, product_id, rating, title, comment)
  VALUES (user_id_param, product_id_param, rating_param, title_param, comment_param)
  RETURNING id INTO new_review_id;
  
  RETURN new_review_id;
END;
$$;

-- Create function to update a review
CREATE OR REPLACE FUNCTION public.update_review(
  review_id UUID,
  new_rating INTEGER,
  new_title TEXT,
  new_comment TEXT
)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
BEGIN
  -- Check if review exists and user owns it
  IF NOT EXISTS (
    SELECT 1 FROM reviews 
    WHERE id = review_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Review not found or access denied';
  END IF;

  -- Update the review
  UPDATE reviews 
  SET 
    rating = new_rating,
    title = new_title,
    comment = new_comment,
    updated_at = now()
  WHERE id = review_id;
  
  RETURN TRUE;
END;
$$;

-- Create function to delete a review
CREATE OR REPLACE FUNCTION public.delete_review(review_id UUID)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
BEGIN
  -- Check if review exists and user owns it
  IF NOT EXISTS (
    SELECT 1 FROM reviews 
    WHERE id = review_id AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Review not found or access denied';
  END IF;

  -- Delete the review
  DELETE FROM reviews WHERE id = review_id;
  
  RETURN TRUE;
END;
$$;

-- Create function for admin to get all reviews
CREATE OR REPLACE FUNCTION public.get_all_reviews()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  product_id UUID,
  rating INTEGER,
  title TEXT,
  comment TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  is_verified_purchase BOOLEAN,
  is_approved BOOLEAN,
  helpful_count INTEGER,
  first_name TEXT,
  last_name TEXT,
  product_name TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    r.id,
    r.user_id,
    r.product_id,
    r.rating,
    r.title,
    r.comment,
    r.created_at,
    r.updated_at,
    r.is_verified_purchase,
    r.is_approved,
    r.helpful_count,
    p.first_name,
    p.last_name,
    pr.name as product_name
  FROM reviews r
  LEFT JOIN profiles p ON r.user_id = p.id
  LEFT JOIN products pr ON r.product_id = pr.id
  ORDER BY r.created_at DESC;
$$;

-- Create function for admin to approve/disapprove reviews
CREATE OR REPLACE FUNCTION public.admin_update_review_status(
  review_id UUID,
  is_approved_param BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE PLPGSQL
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user is admin
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin role required.';
  END IF;

  -- Update review approval status
  UPDATE reviews 
  SET 
    is_approved = is_approved_param,
    updated_at = now()
  WHERE id = review_id;
  
  RETURN TRUE;
END;
$$;

-- Create function to get product review statistics
CREATE OR REPLACE FUNCTION public.get_product_review_stats(product_id_param UUID)
RETURNS TABLE (
  total_reviews INTEGER,
  average_rating NUMERIC,
  rating_1 INTEGER,
  rating_2 INTEGER,
  rating_3 INTEGER,
  rating_4 INTEGER,
  rating_5 INTEGER
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT 
    COUNT(*)::INTEGER as total_reviews,
    ROUND(AVG(rating), 2) as average_rating,
    COUNT(CASE WHEN rating = 1 THEN 1 END)::INTEGER as rating_1,
    COUNT(CASE WHEN rating = 2 THEN 1 END)::INTEGER as rating_2,
    COUNT(CASE WHEN rating = 3 THEN 1 END)::INTEGER as rating_3,
    COUNT(CASE WHEN rating = 4 THEN 1 END)::INTEGER as rating_4,
    COUNT(CASE WHEN rating = 5 THEN 1 END)::INTEGER as rating_5
  FROM reviews 
  WHERE product_id = product_id_param 
    AND is_approved = true;
$$;