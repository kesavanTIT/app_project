import React, { createContext, useContext, useReducer, useCallback } from 'react';

const CartContext = createContext(null);

// ── Reducer ───────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }

    case 'REMOVE_ITEM': {
      const existing = state.items.find(i => i.id === action.id);
      if (!existing) return state;
      if (existing.qty === 1) {
        return { ...state, items: state.items.filter(i => i.id !== action.id) };
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, qty: i.qty - 1 } : i
        ),
      };
    }

    case 'CLEAR_CART':
      return { ...state, items: [], restaurantId: null, restaurantName: '' };

    case 'SET_RESTAURANT':
      return { ...state, restaurantId: action.id, restaurantName: action.name };

    default:
      return state;
  }
}

const initialState = {
  items: [],
  restaurantId: null,
  restaurantName: '',
};

// ── Provider ──────────────────────────────────────────────────────────────────
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = useCallback((item, restaurantId, restaurantName) => {
    // If cart has items from a DIFFERENT restaurant — warn (handled in UI)
    if (state.restaurantId && state.restaurantId !== restaurantId && state.items.length > 0) {
      return false; // Caller should show "Clear cart?" dialog
    }
    if (!state.restaurantId) {
      dispatch({ type: 'SET_RESTAURANT', id: restaurantId, name: restaurantName });
    }
    dispatch({ type: 'ADD_ITEM', item });
    return true;
  }, [state.restaurantId, state.items.length]);

  const removeItem = useCallback((id) => {
    dispatch({ type: 'REMOVE_ITEM', id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const getItemQty = useCallback((id) => {
    return state.items.find(i => i.id === id)?.qty ?? 0;
  }, [state.items]);

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal   = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const value = {
    items: state.items,
    restaurantId: state.restaurantId,
    restaurantName: state.restaurantName,
    totalItems,
    subtotal,
    addItem,
    removeItem,
    clearCart,
    getItemQty,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within <CartProvider>');
  return ctx;
}

export default CartContext;
