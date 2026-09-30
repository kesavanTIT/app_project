// ─── FoodRush — Home Screen ────────────────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, StatusBar, Platform, FlatList,
} from 'react-native';
import { MapPin, Search, Mic, ChevronDown, ChevronRight, Star, Clock, Zap } from 'lucide-react-native';
import { RESTAURANTS } from '../../data/mockData';

const BRAND  = '#FF5722';
const WHITE  = '#FFFFFF';
const TEXT   = '#1A1A1A';
const GREY   = '#686B78';
const BORDER = '#E8E8E8';
const BG     = '#F2F2F7';
const GREEN  = '#1BA672';

const CATEGORIES = ['All', 'Store', 'Offers', 'Bolt ⚡', 'Food'];

// ── Veg/NonVeg dot ────────────────────────────────────────────────────────────
const VegDot = ({ veg }) => (
  <View style={[dot.box, { borderColor: veg ? GREEN : BRAND }]}>
    <View style={[dot.inner, { backgroundColor: veg ? GREEN : BRAND }]} />
  </View>
);
const dot = StyleSheet.create({
  box:   { width: 14, height: 14, borderWidth: 1.5, borderRadius: 2, alignItems: 'center', justifyContent: 'center' },
  inner: { width: 7, height: 7, borderRadius: 3.5 },
});

// ── Restaurant Card ───────────────────────────────────────────────────────────
function RestaurantCard({ restaurant, onPress }) {
  const { name, location, cuisine, rating, time, offer, emoji, tag } = restaurant;
  return (
    <TouchableOpacity style={rc.card} onPress={onPress} activeOpacity={0.85}>
      {/* Image area */}
      <View style={rc.imgWrap}>
        <Text style={rc.emoji}>{emoji}</Text>
        {tag && (
          <View style={rc.tag}>
            <Zap size={10} color={WHITE} fill={WHITE} strokeWidth={0} />
            <Text style={rc.tagTxt}>{tag}</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={rc.info}>
        <View style={rc.row}>
          <Text style={rc.name} numberOfLines={1}>{name}</Text>
          <View style={rc.ratingBadge}>
            <Star size={10} color={WHITE} fill={WHITE} strokeWidth={0} />
            <Text style={rc.ratingTxt}>{rating}</Text>
          </View>
        </View>
        <Text style={rc.cuisine} numberOfLines={1}>{cuisine}</Text>
        <Text style={rc.meta}>{time} • {location}</Text>
        {offer && (
          <View style={rc.offerRow}>
            <Text style={rc.offerIcon}>%</Text>
            <Text style={rc.offerTxt}>{offer}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
const rc = StyleSheet.create({
  card:       { backgroundColor: WHITE, borderRadius: 14, marginHorizontal: 16, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: BORDER },
  imgWrap:    { height: 140, backgroundColor: '#FFF5F0', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  emoji:      { fontSize: 60 },
  tag:        { position: 'absolute', bottom: 8, left: 8, backgroundColor: TEXT, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', gap: 3 },
  tagTxt:     { color: WHITE, fontSize: 10, fontWeight: '700' },
  info:       { padding: 12 },
  row:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  name:       { fontSize: 16, fontWeight: '800', color: TEXT, flex: 1 },
  ratingBadge:{ backgroundColor: GREEN, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: 8 },
  ratingTxt:  { color: WHITE, fontSize: 11, fontWeight: '700' },
  cuisine:    { fontSize: 12.5, color: GREY, marginBottom: 3 },
  meta:       { fontSize: 12, color: GREY, marginBottom: 6 },
  offerRow:   { flexDirection: 'row', alignItems: 'center', gap: 5, borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 8 },
  offerIcon:  { backgroundColor: BRAND, color: WHITE, fontSize: 9, fontWeight: '900', width: 16, height: 16, borderRadius: 3, textAlign: 'center', lineHeight: 16 },
  offerTxt:   { fontSize: 12, fontWeight: '700', color: TEXT },
});

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function HomeScreen({ location, onSelectRestaurant, onOpenOrders, cartCount }) {
  const [activeTab, setActiveTab] = useState('Food');
  const [activeCategory, setCategory] = useState('All');
  const [vegOnly, setVeg] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = RESTAURANTS.filter(r => {
    if (vegOnly && !r.veg) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) &&
        !r.cuisine.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeCategory === 'Bolt ⚡' && r.tag !== 'BOLT') return false;
    if (activeCategory === 'Offers' && !r.offer) return false;
    return true;
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>

        {/* ── Location Header ──────────────────────────────────────────── */}
        <View style={s.header}>
          <TouchableOpacity style={s.locationRow}>
            <View>
              <View style={s.locationTop}>
                <Text style={s.locationLabel}>Info</Text>
                <ChevronDown size={14} color={TEXT} strokeWidth={2.5} />
              </View>
              <Text style={s.locationAddr} numberOfLines={1}>
                {location?.area || 'Pandiyan Nagar, Dindigul...'}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={s.headerRight}>
            <View style={s.freeTag}><Text style={s.freeTxt}>FREE</Text></View>
            <TouchableOpacity style={s.avatarCircle} onPress={onOpenOrders}>
              <Text style={{ fontSize: 18 }}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Sticky: Food / Instamart tabs ───────────────────────────── */}
        <View style={s.tabsWrap}>
          {['Food', 'Instamart'].map(tab => (
            <TouchableOpacity
              key={tab}
              style={[s.tab, activeTab === tab && s.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={s.tabEmoji}>{tab === 'Food' ? '🍔' : '🛒'}</Text>
              <Text style={[s.tabTxt, activeTab === tab && s.tabTxtActive]}>{tab}</Text>
              {tab === 'Instamart' && (
                <View style={s.minsBadge}><Text style={s.minsTxt}>8 mins</Text></View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Search bar ──────────────────────────────────────────────── */}
        <View style={s.searchRow}>
          <View style={s.searchBox}>
            <Search size={18} color={GREY} strokeWidth={2} />
            <TextInput
              style={s.searchInput}
              placeholder={`Search for '${activeTab === 'Food' ? 'Pizza' : 'Groceries'}'`}
              placeholderTextColor={GREY}
              value={search}
              onChangeText={setSearch}
            />
            <Mic size={18} color={BRAND} strokeWidth={2} />
          </View>
          <TouchableOpacity
            style={[s.vegToggle, vegOnly && s.vegToggleOn]}
            onPress={() => setVeg(v => !v)}
          >
            <Text style={s.vegTxt}>VEG</Text>
            <View style={[s.vegDot, vegOnly && s.vegDotOn]} />
          </TouchableOpacity>
        </View>

        {/* ── Category chips ──────────────────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipScroll}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[s.chip, activeCategory === cat && s.chipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[s.chipTxt, activeCategory === cat && s.chipTxtActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Offer Banner ─────────────────────────────────────────────── */}
        <View style={s.offerBanner}>
          <View style={s.offerBannerContent}>
            <Text style={s.bannerEmoji}>🍔</Text>
            <View>
              <Text style={s.bannerBig}>70% OFF</Text>
              <Text style={s.bannerSub}>UP TO ₹140</Text>
            </View>
            <Text style={s.bannerPizza}>🍕</Text>
          </View>
        </View>

        {/* ── Promo cards ──────────────────────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.promoScroll}>
          {[
            { label: 'Get\n70% OFF', emoji: '🏷️', color: '#FF5722' },
            { label: 'Purattasi\nSpecials', emoji: '🌿', color: '#2E7D32' },
            { label: 'Flavourful\nDeals', emoji: '🔥', color: '#1565C0' },
            { label: 'Free\nTreats', emoji: '🎁', color: '#6A1B9A' },
          ].map((p, i) => (
            <TouchableOpacity key={i} style={[s.promoCard, { backgroundColor: p.color }]}>
              <Text style={s.promoEmoji}>{p.emoji}</Text>
              <Text style={s.promoTxt}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Section header ───────────────────────────────────────────── */}
        <View style={s.sectionRow}>
          <Text style={s.sectionTitle}>Top Rated Near You</Text>
          <TouchableOpacity style={s.seeAll}>
            <Text style={s.seeAllTxt}>See all</Text>
            <ChevronRight size={14} color={BRAND} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* ── Restaurant List ──────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Text style={s.emptyEmoji}>🍽️</Text>
            <Text style={s.emptyTxt}>No restaurants found</Text>
          </View>
        ) : (
          filtered.map(r => (
            <RestaurantCard
              key={r.id}
              restaurant={r}
              onPress={() => onSelectRestaurant(r)}
            />
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  // Header
  header:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 56 : 16, paddingBottom: 12, backgroundColor: WHITE },
  locationRow:  { flex: 1 },
  locationTop:  { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationLabel:{ fontSize: 18, fontWeight: '800', color: TEXT },
  locationAddr: { fontSize: 12, color: GREY, marginTop: 2, maxWidth: 220 },
  headerRight:  { flexDirection: 'row', alignItems: 'center', gap: 10 },
  freeTag:      { backgroundColor: '#E8F5E9', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  freeTxt:      { fontSize: 11, fontWeight: '800', color: GREEN },
  avatarCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: BG, alignItems: 'center', justifyContent: 'center' },

  // Tabs
  tabsWrap:     { flexDirection: 'row', backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: BORDER },
  tab:          { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6 },
  tabActive:    { borderBottomWidth: 2.5, borderBottomColor: BRAND },
  tabEmoji:     { fontSize: 18 },
  tabTxt:       { fontSize: 14, fontWeight: '600', color: GREY },
  tabTxtActive: { color: BRAND, fontWeight: '800' },
  minsBadge:    { backgroundColor: '#E8F5E9', borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2 },
  minsTxt:      { fontSize: 10, fontWeight: '700', color: GREEN },

  // Search
  searchRow:    { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: WHITE, gap: 10 },
  searchBox:    { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: BG, borderRadius: 10, paddingHorizontal: 12, height: 46, gap: 8 },
  searchInput:  { flex: 1, fontSize: 14, color: TEXT },
  vegToggle:    { borderWidth: 1.5, borderColor: BORDER, borderRadius: 8, padding: 7, alignItems: 'center' },
  vegToggleOn:  { borderColor: GREEN },
  vegTxt:       { fontSize: 10, fontWeight: '800', color: TEXT, marginBottom: 3 },
  vegDot:       { width: 16, height: 9, borderRadius: 5, backgroundColor: BORDER },
  vegDotOn:     { backgroundColor: GREEN },

  // Chips
  chipScroll:   { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: WHITE },
  chip:         { paddingHorizontal: 14, paddingVertical: 6, marginHorizontal: 4, borderRadius: 20, borderWidth: 1.5, borderColor: BORDER, backgroundColor: WHITE },
  chipActive:   { borderColor: TEXT, backgroundColor: TEXT },
  chipTxt:      { fontSize: 13, fontWeight: '600', color: GREY },
  chipTxtActive:{ color: WHITE },

  // Banner
  offerBanner:       { marginHorizontal: 16, marginTop: 12, marginBottom: 8, backgroundColor: '#1B1F3B', borderRadius: 14, overflow: 'hidden' },
  offerBannerContent:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  bannerEmoji:       { fontSize: 36 },
  bannerBig:         { fontSize: 28, fontWeight: '900', color: '#FFD700', letterSpacing: -0.5 },
  bannerSub:         { fontSize: 12, fontWeight: '700', color: WHITE, letterSpacing: 1 },
  bannerPizza:       { fontSize: 36 },

  // Promo
  promoScroll:  { paddingHorizontal: 12, paddingVertical: 8 },
  promoCard:    { width: 100, marginHorizontal: 4, borderRadius: 12, padding: 12, alignItems: 'center', gap: 6 },
  promoEmoji:   { fontSize: 24 },
  promoTxt:     { fontSize: 11, fontWeight: '700', color: WHITE, textAlign: 'center', lineHeight: 15 },

  // Section
  sectionRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: TEXT },
  seeAll:       { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllTxt:    { fontSize: 13, fontWeight: '700', color: BRAND },

  // Empty
  empty:        { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji:   { fontSize: 48, marginBottom: 12 },
  emptyTxt:     { fontSize: 16, color: GREY, fontWeight: '600' },
});
