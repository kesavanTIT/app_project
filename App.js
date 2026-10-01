// ─── FoodRush — App Entry Point (Full Stack Navigation & Hardware Back Button) ──
import React, { useState, useReducer, useCallback, useEffect } from 'react';
import { BackHandler } from 'react-native';

import OnboardingScreen       from './src/screens/auth/OnboardingScreen';
import PhoneLoginScreen       from './src/screens/auth/PhoneLoginScreen';
import OTPScreen              from './src/screens/auth/OTPScreen';
import LocationScreen         from './src/screens/auth/LocationScreen';
import HomeScreen             from './src/screens/home/HomeScreen';
import RestaurantDetailScreen from './src/screens/home/RestaurantDetailScreen';
import CartScreen             from './src/screens/cart/CartScreen';
import OrdersScreen           from './src/screens/orders/OrdersScreen';
import OrderDetailScreen      from './src/screens/orders/OrderDetailScreen';

// ─── Cart Reducer (Multi-Restaurant Unified Cart Support) ──────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i => i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i),
        };
      }
      const itemWithStore = {
        ...action.item,
        qty: 1,
        restaurantId:   action.restaurant?.id || 'r1',
        restaurantName: action.restaurant?.name || 'KFC - Fast Food',
        restaurantEmoji:action.restaurant?.emoji || '🍗',
      };
      return {
        ...state,
        items: [...state.items, itemWithStore],
      };
    }
    case 'REMOVE': {
      const existing = state.items.find(i => i.id === action.id);
      if (!existing) return state;
      if (existing.qty === 1) return { ...state, items: state.items.filter(i => i.id !== action.id) };
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: i.qty - 1 } : i) };
    }
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  // Navigation stack history
  const [history, setHistory] = useState(['onboarding']);

  // Auth state
  const [phone, setPhone]       = useState('');
  const [location, setLocation] = useState(null);

  // Restaurant state
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  // Order state (placed order & viewed order)
  const [placedOrder, setPlacedOrder] = useState(null);
  const [viewedOrder, setViewedOrder] = useState(null);

  // Multi-Restaurant Unified Cart
  const [cartState, cartDispatch] = useReducer(cartReducer, { items: [] });

  // Current Active Screen
  const currentScreen = history[history.length - 1] || 'onboarding';

  // Navigation Stack Helpers
  const pushScreen = useCallback((screenName) => {
    setHistory(prev => [...prev, screenName]);
  }, []);

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, prev.length - 1);
    });
  }, []);

  const resetTo = useCallback((screenName) => {
    setHistory([screenName]);
  }, []);

  // ── Hardware Back Button Handler ──────────────────────────────────────────────
  useEffect(() => {
    const onBackPress = () => {
      if (history.length > 1) {
        goBack();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [history, goBack]);

  // Cart helpers with Multi-restaurant store binding
  const handleAddItem = useCallback((item) => {
    cartDispatch({ type: 'ADD', item, restaurant: selectedRestaurant });
  }, [selectedRestaurant]);

  const handleRemoveItem = useCallback((id) => {
    cartDispatch({ type: 'REMOVE', id });
  }, []);

  // ── Screen Renderer ─────────────────────────────────────────────────────────
  switch (currentScreen) {

    // Onboarding screen
    case 'onboarding':
      return (
        <OnboardingScreen
          onStart={() => pushScreen('phone')}
        />
      );

    // Mobile login screen
    case 'phone':
      return (
        <PhoneLoginScreen
          onContinue={(phoneNumber) => {
            setPhone(phoneNumber);
            pushScreen('otp');
          }}
          onBack={goBack}
        />
      );

    // OTP verification screen
    case 'otp':
      return (
        <OTPScreen
          phone={phone}
          onVerified={() => pushScreen('location')}
          onBack={goBack}
        />
      );

    // Location selection screen
    case 'location':
      return (
        <LocationScreen
          onLocationGranted={(loc) => {
            setLocation(loc);
            resetTo('home'); // Reset history stack to root Home screen
          }}
          onBack={goBack}
        />
      );

    // Home screen
    case 'home':
      return (
        <HomeScreen
          location={location}
          onSelectRestaurant={(r) => {
            setSelectedRestaurant(r);
            pushScreen('restaurant');
          }}
          onOpenOrders={() => pushScreen('orders')}
          cartCount={cartState.items.reduce((s, i) => s + i.qty, 0)}
        />
      );

    // Restaurant detail screen
    case 'restaurant':
      return (
        <RestaurantDetailScreen
          restaurant={selectedRestaurant}
          cart={cartState.items}
          onAdd={handleAddItem}
          onRemove={handleRemoveItem}
          onBack={goBack}
          onViewCart={() => pushScreen('cart')}
        />
      );

    // Cart / Checkout screen
    case 'cart':
      return (
        <CartScreen
          cart={cartState.items}
          restaurant={selectedRestaurant}
          location={location}
          onAdd={handleAddItem}
          onRemove={handleRemoveItem}
          onBack={goBack}
          onPlaceOrder={(orderData) => {
            setPlacedOrder(orderData);
            cartDispatch({ type: 'CLEAR' });
            pushScreen('order-detail');
          }}
        />
      );

    // Past orders screen
    case 'orders':
      return (
        <OrdersScreen
          onBack={goBack}
          onViewBill={(order) => {
            setViewedOrder(order);
            pushScreen('order-detail');
          }}
          onReorder={(order) => {
            const itemsToReorder = order.items || order.cart || [];
            itemsToReorder.forEach(it => {
              cartDispatch({
                type: 'ADD',
                item: {
                  ...it,
                  price: it.price || 150,
                  discounted: it.discounted || it.price || 120,
                  veg: it.veg ?? true,
                },
                restaurant: {
                  id: order.restaurantId || 'r1',
                  name: order.restaurantName,
                  emoji: order.emoji || '🍛',
                },
              });
            });
            pushScreen('cart');
          }}
        />
      );

    // Order detail / Bill screen
    case 'order-detail':
      return (
        <OrderDetailScreen
          order={viewedOrder || placedOrder}
          onBack={() => {
            setViewedOrder(null);
            goBack();
          }}
        />
      );

    default:
      return null;
  }
}
