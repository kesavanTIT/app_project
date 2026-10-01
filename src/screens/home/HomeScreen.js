// ─── FoodRush — Premium Thick Royal Navy Blue Home Screen ───────────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Image,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import { RESTAURANTS } from '../../data/mockData';

const { width } = Dimensions.get('window');

const NAVY        = '#0D1B3E'; // Thick Royal Navy Blue Primary
const ELECTRIC_BLUE= '#2563EB'; // Electric Accent Blue
const ICE_BG      = '#F4F7FC'; // Soft Cool Ice-Blue Background
const WHITE       = '#FFFFFF';
const DARK_TEXT   = '#0F172A';
const GREY_TEXT   = '#64748B';
const BORDER_COLOR= '#E2E8F0';
const GOLD_STAR   = '#FFB800';

// 4 Promotional Hero Banners for Horizontal Swiping Carousel
const HERO_BANNERS = [
  {
    id: 'b1',
    tag: 'LIMITED TIME ⚡',
    title: 'CRISPY.\nJUICY.\nIRRESISTIBLE.',
    subtitle: '100% Real Chicken. Made Fresh Always.',
    btnText: 'Order Now ➔',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&auto=format&fit=crop',
  },
  {
    id: 'b2',
    tag: 'WEEKEND SPECIAL 🔥',
    title: 'FLAME-GRILLED\nZINGER BURGER',
    subtitle: 'Double Patty + Melted Cheese Sauce.',
    btnText: 'Claim 40% OFF ➔',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop',
  },
  {
    id: 'b3',
    tag: 'ROYAL FEAST 🍛',
    title: 'SPECIAL DUM\nBIRYANI BOWL',
    subtitle: 'Authentic Spices. Free Raitha & Sweet.',
    btnText: 'Explore Menu ➔',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop',
  },
  {
    id: 'b4',
    tag: 'PIZZA FESTIVAL 🍕',
    title: 'CHEESE BURST\nPIZZA CRAZE',
    subtitle: 'Buy 1 Get 1 Free on Large Pizzas.',
    btnText: 'Order Pizza ➔',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop',
  },
];

// Ultra-Modern Category Image Badges
const CATEGORIES = [
  { id: '1', name: 'All', image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&auto=format&fit=crop' },
  { id: '2', name: 'Buckets', image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=200&auto=format&fit=crop' },
  { id: '3', name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop' },
  { id: '4', name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&auto=format&fit=crop' },
  { id: '5', name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop' },
  { id: '6', name: 'Snacks', image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=200&auto=format&fit=crop' },
  { id: '7', name: 'Drinks', image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=200&auto=format&fit=crop' },
  { id: '8', name: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&auto=format&fit=crop' },
];

// Popular Combos
const POPULAR_COMBOS = [
  {
    id: 'c1',
    name: '8 Pcs Chicken Bucket',
    subtitle: '2 Large Fries + 2 Dips + 2 Drinks',
    rating: '4.8 (12.5K+)',
    price: '$24.99',
    badge: 'BESTSELLER',
    badgeColor: NAVY,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop',
    category: 'Buckets',
  },
  {
    id: 'c2',
    name: 'Zinger Burger Combo',
    subtitle: 'Zinger Burger + Fries + Drink',
    rating: '4.7 (8.7K+)',
    price: '$9.99',
    badge: 'POPULAR',
    badgeColor: ELECTRIC_BLUE,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop',
    category: 'Burgers',
  },
  {
    id: 'c3',
    name: '5 Pcs Hot & Crispy',
    subtitle: '5 Pcs Chicken + Fries + Drink',
    rating: '4.6 (6.3K+)',
    price: '$15.99',
    badge: 'SAVE 15%',
    badgeColor: '#1E3A8A',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&auto=format&fit=crop',
    category: 'Buckets',
  },
];

// Rich Food Variety Catalog
const ALL_FOOD_VARIETY = [
  // Buckets & Chicken
  {
    id: 'f1',
    name: 'Ultimate Savings Bucket',
    subtitle: '12 Pcs Crispy Strips + 2 Dips',
    rating: '4.9 (14K+)',
    price: '$19.99',
    badge: 'HOT DEAL',
    badgeColor: NAVY,
    category: 'Buckets',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&auto=format&fit=crop',
  },
  {
    id: 'f2',
    name: 'Smoky BBQ Wings',
    subtitle: '10 Pcs Flame-Grilled BBQ Wings',
    rating: '4.8 (9.2K+)',
    price: '$12.99',
    badge: 'NEW',
    badgeColor: '#10B981',
    category: 'Buckets',
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500&auto=format&fit=crop',
  },

  // Burgers & Wraps
  {
    id: 'f3',
    name: 'Double Cheese Zinger',
    subtitle: 'Double Crispy Patty + Melted Cheese',
    rating: '4.7 (11K+)',
    price: '$8.99',
    badge: 'POPULAR',
    badgeColor: ELECTRIC_BLUE,
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop',
  },
  {
    id: 'f4',
    name: 'Spicy Chicken Wrap',
    subtitle: 'Grilled Chicken, Lettuce & Spicy Mayo',
    rating: '4.8 (7.5K+)',
    price: '$7.99',
    badge: 'CHEF CHOICE',
    badgeColor: '#10B981',
    category: 'Burgers',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=500&auto=format&fit=crop',
  },

  // Biryani & Rice Bowls
  {
    id: 'f5',
    name: 'Special Mutton Biryani',
    subtitle: 'Fragrant Seeraga Samba + Tender Mutton',
    rating: '4.9 (18K+)',
    price: '$14.99',
    badge: 'BESTSELLER',
    badgeColor: NAVY,
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop',
  },
  {
    id: 'f6',
    name: 'Chicken Dum Biryani',
    subtitle: 'Hyderabadi Dum Biryani + Raitha + Gravy',
    rating: '4.8 (15K+)',
    price: '$11.99',
    badge: 'TOP RATED',
    badgeColor: ELECTRIC_BLUE,
    category: 'Biryani',
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop',
  },

  // Pizzas
  {
    id: 'f7',
    name: 'Pepperoni Feast Pizza',
    subtitle: 'Double Pepperoni, Mozzarella & Herb Crust',
    rating: '4.8 (12K+)',
    price: '$13.99',
    badge: 'HOT',
    badgeColor: NAVY,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop',
  },
  {
    id: 'f8',
    name: 'Paneer Tikka Pizza',
    subtitle: 'Spiced Paneer, Capsicum, Onion & Cheese',
    rating: '4.7 (9.1K+)',
    price: '$11.49',
    badge: 'VEG SPECIAL',
    badgeColor: '#10B981',
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop',
  },

  // Snacks & Sides
  {
    id: 'f9',
    name: 'Large French Fries',
    subtitle: 'Golden Salted Crispy Fries + Ketchup',
    rating: '4.8 (22K+)',
    price: '$4.49',
    badge: 'MUST TRY',
    badgeColor: ELECTRIC_BLUE,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop',
  },
  {
    id: 'f10',
    name: 'Popcorn Chicken Bucket',
    subtitle: 'Bite-sized Crispy Chicken Popcorn',
    rating: '4.9 (16K+)',
    price: '$6.99',
    badge: 'BESTSELLER',
    badgeColor: NAVY,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop',
  },

  // Drinks & Desserts
  {
    id: 'f11',
    name: 'Chocolate Lava Cake',
    subtitle: 'Warm Melted Dark Chocolate Center',
    rating: '4.9 (13K+)',
    price: '$4.99',
    badge: 'SWEET DEAL',
    badgeColor: '#6366F1',
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop',
  },
  {
    id: 'f12',
    name: 'Chilled Cold Coffee Shake',
    subtitle: 'Creamy Espresso Cold Coffee Shake',
    rating: '4.8 (10K+)',
    price: '$3.99',
    badge: 'REFRESHING',
    badgeColor: '#06B6D4',
    category: 'Drinks',
    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=500&auto=format&fit=crop',
  },
];

export default function HomeScreen({ location, onSelectRestaurant, onOpenOrders, cartCount = 0 }) {
  const [activeCategory, setActiveCategory]   = useState('All');
  const [activeNav, setActiveNav]             = useState('Home');
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);
  const [search, setSearch]                   = useState('');
  const [refreshing, setRefreshing]           = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 400);
  };

  const handleBannerScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    if (index >= 0 && index < HERO_BANNERS.length) {
      setActiveBannerIdx(index);
    }
  };

  const filteredFoodItems = ALL_FOOD_VARIETY.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = !search || item.name.toLowerCase().includes(search.toLowerCase()) || item.subtitle.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={ICE_BG} />

      {/* Main Scroll Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={NAVY} colors={[NAVY]} />
        }
      >
        {/* ── Top Header ──────────────────────────────────────────── */}
        <View style={s.headerRow}>
          {/* Menu Hamburger */}
          <TouchableOpacity style={s.iconBadgeBtn}>
            <Text style={{ fontSize: 18, color: DARK_TEXT }}>☰</Text>
          </TouchableOpacity>

          {/* Center Brand Titles */}
          <View style={s.logoWrap}>
            <Text style={s.greetingText}>Hello, Foodie Lover! 👋</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 22 }}>🛵</Text>
              <Text style={s.brandTitle}>FOODRUSH</Text>
            </View>
            <Text style={s.brandSub}>Fast • Fresh • Delicious</Text>
          </View>

          {/* Right Notification & Cart Badges */}
          <View style={s.headerRight}>
            <TouchableOpacity style={s.iconBadgeBtn} onPress={onOpenOrders}>
              <Text style={{ fontSize: 18 }}>🔔</Text>
              <View style={s.navyBadgeDot}>
                <Text style={s.navyBadgeTxt}>3</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={s.iconBadgeBtn} onPress={onOpenOrders}>
              <Text style={{ fontSize: 18 }}>🛍️</Text>
              {cartCount > 0 && (
                <View style={s.navyBadgeDot}>
                  <Text style={s.navyBadgeTxt}>{cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Search Bar ────────────────────────────────────────── */}
        <View style={s.searchWrap}>
          <View style={s.searchInputBox}>
            <Text style={{ fontSize: 16, marginRight: 8, color: GREY_TEXT }}>🔍</Text>
            <TextInput
              style={s.searchInput}
              placeholder="Search biryani, burger, pizza, wings..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <TouchableOpacity style={s.filterBtn}>
            <Text style={{ fontSize: 16, color: DARK_TEXT }}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* ── Horizontal Swiping Hero Banners Carousel ─────────── */}
        <View style={s.heroCarouselContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleBannerScroll}
            scrollEventThrottle={16}
          >
            {HERO_BANNERS.map((banner) => (
              <View key={banner.id} style={s.heroBannerCard}>
                <Image source={{ uri: banner.image }} style={s.heroImage} resizeMode="cover" />
                <View style={s.heroOverlay}>
                  <Text style={s.heroTag}>{banner.tag}</Text>
                  <Text style={s.heroTitle}>{banner.title}</Text>
                  <Text style={s.heroSub}>{banner.subtitle}</Text>

                  <TouchableOpacity
                    style={s.orderNowBtn}
                    activeOpacity={0.88}
                    onPress={() => onSelectRestaurant && onSelectRestaurant(RESTAURANTS[0])}
                  >
                    <Text style={s.orderNowTxt}>{banner.btnText}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Dynamic Slider Dots Indicator */}
          <View style={s.bannerDots}>
            {HERO_BANNERS.map((_, i) => (
              <View
                key={i}
                style={[s.bDot, activeBannerIdx === i && s.bDotActive]}
              />
            ))}
          </View>
        </View>

        {/* ── Category Image Pills (With Dynamic Live Filter!) ──── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.categoriesWrap}
        >
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.id}
                style={s.catPill}
                onPress={() => setActiveCategory(cat.name)}
                activeOpacity={0.8}
              >
                <View style={[s.catCircle, isActive && s.catCircleActive]}>
                  <Image source={{ uri: cat.image }} style={s.catImg} resizeMode="cover" />
                </View>
                <Text style={[s.catName, isActive && s.catNameActive]}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Section 1: Popular Combos ──────────────────────────── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Popular Combos</Text>
          <TouchableOpacity onPress={onOpenOrders}>
            <Text style={s.viewAllTxt}>View All ➔</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.combosScroll}
        >
          {POPULAR_COMBOS.map(combo => (
            <TouchableOpacity
              key={combo.id}
              style={s.comboCard}
              activeOpacity={0.9}
              onPress={() => onSelectRestaurant && onSelectRestaurant(RESTAURANTS[0])}
            >
              <View style={[s.cardBadge, { backgroundColor: combo.badgeColor }]}>
                <Text style={s.badgeTxt}>{combo.badge}</Text>
              </View>

              <TouchableOpacity style={s.heartBtn}>
                <Text style={{ fontSize: 13 }}>🤍</Text>
              </TouchableOpacity>

              <Image source={{ uri: combo.image }} style={s.comboImg} resizeMode="cover" />

              <View style={s.comboDetails}>
                <Text style={s.comboName} numberOfLines={1}>{combo.name}</Text>
                <Text style={s.comboSub} numberOfLines={2}>{combo.subtitle}</Text>

                <Text style={s.ratingTxt}>⭐ {combo.rating}</Text>

                <View style={s.priceRow}>
                  <Text style={s.priceTxt}>{combo.price}</Text>

                  <TouchableOpacity
                    style={s.addPlusBtn}
                    activeOpacity={0.8}
                    onPress={() => onSelectRestaurant && onSelectRestaurant(RESTAURANTS[0])}
                  >
                    <Text style={s.addPlusTxt}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Section 2: Explore All Varieties (2-Column Grid) ───── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Explore {activeCategory} Varieties ({filteredFoodItems.length})</Text>
          <TouchableOpacity onPress={() => setActiveCategory('All')}>
            <Text style={s.viewAllTxt}>Show All ➔</Text>
          </TouchableOpacity>
        </View>

        <View style={s.gridContainer}>
          {filteredFoodItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={s.gridCard}
              activeOpacity={0.9}
              onPress={() => onSelectRestaurant && onSelectRestaurant(RESTAURANTS[0])}
            >
              <View style={[s.cardBadge, { backgroundColor: item.badgeColor }]}>
                <Text style={s.badgeTxt}>{item.badge}</Text>
              </View>

              <TouchableOpacity style={s.heartBtn}>
                <Text style={{ fontSize: 13 }}>🤍</Text>
              </TouchableOpacity>

              <Image source={{ uri: item.image }} style={s.gridImg} resizeMode="cover" />

              <View style={s.gridInfo}>
                <Text style={s.gridName} numberOfLines={1}>{item.name}</Text>
                <Text style={s.gridSub} numberOfLines={2}>{item.subtitle}</Text>

                <View style={s.priceRow}>
                  <View>
                    <Text style={s.ratingTxt}>⭐ {item.rating}</Text>
                    <Text style={s.priceTxt}>{item.price}</Text>
                  </View>

                  <TouchableOpacity
                    style={s.addPlusBtn}
                    activeOpacity={0.8}
                    onPress={() => onSelectRestaurant && onSelectRestaurant(RESTAURANTS[0])}
                  >
                    <Text style={s.addPlusTxt}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Section 3: Featured Restaurants Near You ──────────── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Top Restaurants Near You</Text>
        </View>

        <View style={{ paddingHorizontal: 16, gap: 14, marginBottom: 20 }}>
          {RESTAURANTS.map(rest => (
            <TouchableOpacity
              key={rest.id}
              style={s.restFullCard}
              activeOpacity={0.88}
              onPress={() => onSelectRestaurant && onSelectRestaurant(rest)}
            >
              <View style={s.restImgWrap}>
                <Text style={{ fontSize: 44 }}>{rest.emoji || '🍗'}</Text>
                {rest.tag && (
                  <View style={s.restTag}>
                    <Text style={s.restTagTxt}>{rest.tag}</Text>
                  </View>
                )}
              </View>

              <View style={s.restInfo}>
                <View style={s.restRow}>
                  <Text style={s.restName} numberOfLines={1}>{rest.name}</Text>
                  <View style={s.ratingBadge}>
                    <Text style={s.ratingBadgeTxt}>⭐ {rest.rating}</Text>
                  </View>
                </View>
                <Text style={s.restCuisine} numberOfLines={1}>{rest.cuisine}</Text>
                <Text style={s.restMeta}>{rest.time} • {rest.location}</Text>
                {rest.offer && (
                  <View style={s.offerBadge}>
                    <Text style={s.offerTxt}>🏷️ {rest.offer}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Exclusive Offer Banner ────────────────────────────── */}
        <View style={s.exclusiveBanner}>
          <View style={{ flex: 1 }}>
            <Text style={s.exclTag}>EXCLUSIVE OFFER</Text>
            <Text style={s.exclTitle}>Up to 30% OFF</Text>
            <Text style={s.exclSub}>On selected bucket combos & biryani</Text>
            <TouchableOpacity
              style={s.exclBtn}
              onPress={() => onSelectRestaurant && onSelectRestaurant(RESTAURANTS[0])}
            >
              <Text style={s.exclBtnTxt}>Order Now ➔</Text>
            </TouchableOpacity>
          </View>

          <View style={s.exclCircle}>
            <Text style={s.exclDiscTxt}>30%</Text>
            <Text style={s.exclDiscSub}>OFF</Text>
          </View>
        </View>

      </ScrollView>

      {/* ── Bottom Floating Navigation Bar ──────────────────────── */}
      <View style={s.navBar}>
        <TouchableOpacity style={s.navItem} onPress={() => setActiveNav('Home')}>
          <Text style={[s.navIcon, activeNav === 'Home' && s.navIconActive]}>🏠</Text>
          <Text style={[s.navLabel, activeNav === 'Home' && s.navLabelActive]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.navItem}
          onPress={() => onSelectRestaurant && onSelectRestaurant(RESTAURANTS[0])}
        >
          <Text style={[s.navIcon, activeNav === 'Menu' && s.navIconActive]}>🎛️</Text>
          <Text style={[s.navLabel, activeNav === 'Menu' && s.navLabelActive]}>Menu</Text>
        </TouchableOpacity>

        {/* Center Elevated Navy Blue Circle Button */}
        <TouchableOpacity
          style={s.centerNavBtn}
          activeOpacity={0.88}
          onPress={onOpenOrders}
        >
          <View style={s.centerNavInner}>
            <Text style={{ fontSize: 22 }}>🛍️</Text>
          </View>
          <Text style={s.centerNavLabel}>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.navItem} onPress={onOpenOrders}>
          <Text style={[s.navIcon, activeNav === 'Offers' && s.navIconActive]}>🏷️</Text>
          <Text style={[s.navLabel, activeNav === 'Offers' && s.navLabelActive]}>Offers</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.navItem} onPress={onOpenOrders}>
          <Text style={[s.navIcon, activeNav === 'Profile' && s.navIconActive]}>👤</Text>
          <Text style={[s.navLabel, activeNav === 'Profile' && s.navLabelActive]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Stylesheet ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: ICE_BG,
  },
  scrollContent: {
    paddingBottom: 110,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  iconBadgeBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    elevation: 2,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  navyBadgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: NAVY,
    borderRadius: 9,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navyBadgeTxt: {
    fontSize: 10,
    fontWeight: '800',
    color: WHITE,
  },
  logoWrap: {
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 11,
    color: GREY_TEXT,
    fontWeight: '600',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: NAVY,
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: 9,
    fontWeight: '700',
    color: DARK_TEXT,
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  searchInputBox: {
    flex: 1,
    height: 48,
    backgroundColor: WHITE,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: DARK_TEXT,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    elevation: 1,
  },

  // Hero Carousel Styles
  heroCarouselContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  heroBannerCard: {
    width: width - 32,
    marginHorizontal: 16,
    height: 195,
    borderRadius: 22,
    overflow: 'hidden',
    position: 'relative',
    elevation: 5,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 27, 62, 0.55)',
    padding: 20,
    justifyContent: 'center',
  },
  heroTag: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFB800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: WHITE,
    lineHeight: 26,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 11,
    color: '#E2E8F0',
    marginBottom: 14,
    lineHeight: 15,
  },
  orderNowBtn: {
    alignSelf: 'flex-start',
    backgroundColor: NAVY,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  orderNowTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: WHITE,
  },
  bannerDots: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  bDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  bDotActive: {
    width: 18,
    backgroundColor: ELECTRIC_BLUE,
  },

  categoriesWrap: {
    paddingHorizontal: 16,
    gap: 16,
    marginBottom: 24,
  },
  catPill: {
    alignItems: 'center',
  },
  catCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    elevation: 3,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    overflow: 'hidden',
  },
  catCircleActive: {
    borderWidth: 2.5,
    borderColor: NAVY,
    backgroundColor: '#EFF6FF',
  },
  catImg: {
    width: '100%',
    height: '100%',
  },
  catName: {
    fontSize: 11,
    fontWeight: '600',
    color: GREY_TEXT,
  },
  catNameActive: {
    color: NAVY,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: DARK_TEXT,
  },
  viewAllTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
  },
  combosScroll: {
    paddingHorizontal: 16,
    gap: 14,
    marginBottom: 26,
  },
  comboCard: {
    width: width * 0.58,
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 12,
    position: 'relative',
    elevation: 3,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  cardBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 2,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeTxt: {
    fontSize: 9,
    fontWeight: '800',
    color: WHITE,
  },
  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  comboImg: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
  },
  comboDetails: {},
  comboName: {
    fontSize: 14,
    fontWeight: '800',
    color: DARK_TEXT,
    marginBottom: 2,
  },
  comboSub: {
    fontSize: 11,
    color: GREY_TEXT,
    marginBottom: 8,
    lineHeight: 14,
  },
  ratingTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: GOLD_STAR,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTxt: {
    fontSize: 16,
    fontWeight: '900',
    color: DARK_TEXT,
  },
  addPlusBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  addPlusTxt: {
    fontSize: 18,
    fontWeight: '800',
    color: WHITE,
    lineHeight: 20,
  },

  // 2-Column Grid Styles
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  gridCard: {
    width: (width - 36) / 2,
    backgroundColor: WHITE,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    position: 'relative',
    elevation: 3,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  gridImg: {
    width: '100%',
    height: 125,
  },
  gridInfo: {
    padding: 10,
  },
  gridName: {
    fontSize: 13,
    fontWeight: '800',
    color: DARK_TEXT,
    marginBottom: 2,
  },
  gridSub: {
    fontSize: 10,
    color: GREY_TEXT,
    marginBottom: 8,
    height: 28,
  },

  // Full Restaurant Cards
  restFullCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  restImgWrap: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  restTag: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: DARK_TEXT,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  restTagTxt: {
    fontSize: 8,
    color: WHITE,
    fontWeight: '800',
  },
  restInfo: {
    flex: 1,
  },
  restRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  restName: {
    fontSize: 15,
    fontWeight: '800',
    color: DARK_TEXT,
    flex: 1,
  },
  ratingBadge: {
    backgroundColor: '#10B981',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ratingBadgeTxt: {
    fontSize: 10,
    fontWeight: '800',
    color: WHITE,
  },
  restCuisine: {
    fontSize: 11,
    color: GREY_TEXT,
    marginBottom: 2,
  },
  restMeta: {
    fontSize: 11,
    color: GREY_TEXT,
    marginBottom: 4,
  },
  offerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  offerTxt: {
    fontSize: 10,
    fontWeight: '700',
    color: NAVY,
  },

  exclusiveBanner: {
    marginHorizontal: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  exclTag: {
    fontSize: 10,
    fontWeight: '800',
    color: NAVY,
    letterSpacing: 1,
    marginBottom: 2,
  },
  exclTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: DARK_TEXT,
    marginBottom: 2,
  },
  exclSub: {
    fontSize: 12,
    color: GREY_TEXT,
    marginBottom: 10,
  },
  exclBtn: {
    alignSelf: 'flex-start',
    backgroundColor: NAVY,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  exclBtnTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: WHITE,
  },
  exclCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exclDiscTxt: {
    fontSize: 16,
    fontWeight: '900',
    color: WHITE,
  },
  exclDiscSub: {
    fontSize: 10,
    fontWeight: '800',
    color: WHITE,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    backgroundColor: WHITE,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BORDER_COLOR,
    paddingBottom: 10,
    elevation: 10,
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.5,
  },
  navIconActive: {
    opacity: 1,
  },
  navLabel: {
    fontSize: 10,
    color: GREY_TEXT,
    fontWeight: '600',
  },
  navLabelActive: {
    color: NAVY,
    fontWeight: '800',
  },
  centerNavBtn: {
    alignItems: 'center',
    top: -16,
    flex: 1,
  },
  centerNavInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: NAVY,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: WHITE,
  },
  centerNavLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: NAVY,
    marginTop: 2,
  },
});
