import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem('thread_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('thread_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to sync cart with localStorage', e);
    }
  }, [cartItems]);

  const addToCart = (product, selectedVariant, quantity = 1) => {
    const variantId = selectedVariant ? selectedVariant.id : 'standard';
    const itemId = `${product.id}_${variantId}`;

    const effectivePrice = Number(product.discountPrice ?? product.price) + 
      (selectedVariant && Number(selectedVariant.additionalPrice) ? Number(selectedVariant.additionalPrice) : 0);

    const availableStock = selectedVariant ? selectedVariant.stock : product.stock;

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.itemId === itemId);
      if (existing) {
        const newQuantity = Math.min(existing.quantity + quantity, availableStock);
        return prevItems.map((item) =>
          item.itemId === itemId ? { ...item, quantity: newQuantity } : item,
        );
      } else {
        return [
          ...prevItems,
          {
            itemId,
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            imageUrl: product.images && product.images.length > 0 ? product.images[0].url : '',
            variantId: selectedVariant ? selectedVariant.id : null,
            size: selectedVariant ? selectedVariant.size : null,
            color: selectedVariant ? selectedVariant.color : null,
            unitPrice: effectivePrice,
            quantity: Math.min(quantity, availableStock),
            availableStock,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.itemId === itemId) {
          const clampedQty = Math.min(quantity, item.availableStock);
          return { ...item, quantity: clampedQty };
        }
        return item;
      }),
    );
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item.itemId !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const shippingFee = subtotal >= 300 || subtotal === 0 ? 0 : 15;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = parseFloat((subtotal + shippingFee + tax).toFixed(2));
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        subtotal,
        shippingFee,
        tax,
        total,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
