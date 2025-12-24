import React, { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
  id: number | string;
  title: string;
  price: number; // store price in smallest unit (tugrik)
  quantity: number;
  image?: string;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (id: number | string) => void;
  updateQty: (id: number | string, qty: number) => void;
  clear: () => void;
  total: () => number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cart_v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (e) {
      console.warn("Failed to read cart from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to write cart to localStorage", e);
    }
  }, [items]);

  const add = (item: CartItem) => {
    setItems((cur) => {
      const found = cur.find((c) => c.id === item.id);
      if (found)
        return cur.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + item.quantity } : c
        );
      return [...cur, item];
    });
  };

  const remove = (id: number | string) =>
    setItems((cur) => cur.filter((c) => c.id !== id));
  const updateQty = (id: number | string, qty: number) =>
    setItems((cur) =>
      cur.map((c) => (c.id === id ? { ...c, quantity: qty } : c))
    );
  const clear = () => setItems([]);
  const total = () => items.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, add, remove, updateQty, clear, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export default CartContext;
