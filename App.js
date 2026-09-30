// ─── FoodRush — App Entry Point (Full Navigation Flow) ────────────────────────
import React, { useState, useReducer, useCallback } from 'react';

import PhoneLoginScreen      from './src/screens/auth/PhoneLoginScreen';
import OTPScreen             from './src/screens/auth/OTPScreen';
import LocationScreen        from './src/screens/auth/LocationScreen';
import HomeScreen            from './src/screens/home/HomeScreen';
import RestaurantDetailScreen from './src/screens/home/RestaurantDetailScreen';
import CartScreen            from './src/screens/cart/CartScreen';
import OrdersScreen          from './src/screens/orders/OrdersScreen';
import OrderDetailScreen     from './src/screens/orders/OrderDetailScreen';

// ─── Cart Reducer ─────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.item.id);
      if (existing) {
        return { ...state, items: state.items.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }], restaurantId: action.restaurantId };
    }
    case 'REMOVE': {
      const existing = state.items.find(i => i.id === action.id);
      if (!existing) return state;
      if (existing.qty === 1) return { ...state, items: state.items.filter(i => i.id !== action.id) };
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: i.qty - 1 } : i) };
    }
    case 'CLEAR':
      return { items: [], restaurantId: null };
    default:
      return state;
  }
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  // Navigation state
  const [screen, setScreen] = useState('phone');

  // Auth state
  const [phone, setPhone]       = useState('');
  const [location, setLocation] = useState(null);

  // Restaurant state
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Order state (placed order)
  const [placedOrder, setPlacedOrder] = useState(null);

  // Viewed bill order (from past orders)
  const [viewedOrder, setViewedOrder] = useState(null);

  // Cart
  const [cartState, cartDispatch] = useReducer(cartReducer, { items: [], restaurantId: null });

  // Cart helpers
  const handleAddItem = useCallback((item) => {
    cartDispatch({ type: 'ADD', item, restaurantId: selectedRestaurant?.id });
  }, [selectedRestaurant]);

  const handleRemoveItem = useCallback((id) => {
    cartDispatch({ type: 'REMOVE', id });
  }, []);

  // ── Screen renderer ──────────────────────────────────────────────────────────
  switch (screen) {

    // Auth flow
    case 'phone':
      return (
        <PhoneLoginScreen
          onContinue={(phoneNumber) => { setPhone(phoneNumber); setScreen('otp'); }}
        />
      );

    case 'otp':
      return (
        <OTPScreen
          phone={phone}
          onVerified={() => setScreen('location')}
          onBack={() => setScreen('phone')}
        />
      );

    case 'location':
      return (
        <LocationScreen
          onLocationGranted={(loc) => { setLocation(loc); setScreen('home'); }}
        />
      );

    // Home
    case 'home':
      return (
        <HomeScreen
          location={location}
          onSelectRestaurant={(r) => {
            setSelectedRestaurant(r);
            // Clear cart if switching restaurants
            if (cartState.restaurantId && cartState.restaurantId !== r.id) {
              cartDispatch({ type: 'CLEAR' });
            }
            setScreen('restaurant');
          }}
          onOpenOrders={() => setScreen('orders')}
          cartCount={cartState.items.reduce((s, i) => s + i.qty, 0)}
        />
      );

    // Restaurant detail
    case 'restaurant':
      return (
        <RestaurantDetailScreen
          restaurant={selectedRestaurant}
          cart={cartState.items}
          onAdd={handleAddItem}
          onRemove={handleRemoveItem}
          onBack={() => setScreen('home')}
          onViewCart={() => setScreen('cart')}
        />
      );

    // Cart / Checkout
    case 'cart':
      return (
        <CartScreen
          cart={cartState.items}
          restaurant={selectedRestaurant}
          location={location}
          onAdd={handleAddItem}
          onRemove={handleRemoveItem}
          onBack={() => setScreen('restaurant')}
          onPlaceOrder={(orderData) => {
            setPlacedOrder(orderData);
            cartDispatch({ type: 'CLEAR' });
            setScreen('order-detail');
          }}
        />
      );

    // Past orders
    case 'orders':
      return (
        <OrdersScreen
          onBack={() => setScreen('home')}
          onViewBill={(order) => { setViewedOrder(order); setScreen('order-detail'); }}
        />
      );

    // Order detail / bill
    case 'order-detail':
      return (
        <OrderDetailScreen
          order={viewedOrder || placedOrder}
          onBack={() => {
            setViewedOrder(null);
            setPlacedOrder(null);
            setScreen('orders');
          }}
        />
      );

    default:
      return null;
  }
}
