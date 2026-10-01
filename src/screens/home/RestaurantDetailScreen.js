// ─── FoodRush — Restaurant Detail Screen ──────────────────────────────────────
import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  StatusBar, Platform, Animated, TextInput,
} from 'react-native';
import {
  ArrowLeft, Star, Clock, ChevronDown, MapPin,
  Plus, Minus, Search, ShoppingBag, Zap, Shield,
} from 'lucide-react-native';
import { MENU } from '../../data/mockData';

const BRAND  = '#0D1B3E';
const WHITE  = '#FFFFFF';
const TEXT   = '#1A1A1A';
const GREY   = '#686B78';
const BORDER = '#E8E8E8';
const BG     = '#F2F2F7';
const GREEN  = '#1BA672';

// ── Veg / Non-veg indicator ───────────────────────────────────────────────────
const VegBadge = ({ veg }) => (
  <View style={[vb.box, { borderColor: veg ? GREEN : BRAND }]}>
    <View style={[vb.dot, { backgroundColor: veg ? GREEN : BRAND }]} />
  </View>
);
const vb = StyleSheet.create({
  box: { width: 16, height: 16, borderWidth: 1.5, borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

// ── Qty Stepper ───────────────────────────────────────────────────────────────
function Stepper({ qty, onAdd, onRemove }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pulse = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true, speed: 30 }),
      Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, speed: 30 }),
    ]).start();
  };

  if (qty === 0) {
    return (
      <TouchableOpacity
        style={st.addBtn}
        onPress={() => { pulse(); onAdd(); }}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Text style={st.addTxt}>ADD</Text>
        </Animated.View>
        <Plus size={10} color={BRAND} strokeWidth={3} style={{ position: 'absolute', top: 3, right: 3 }} />
      </TouchableOpacity>
    );
  }
  return (
    <Animated.View style={[st.stepper, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPress={() => { pulse(); onRemove(); }} style={st.stepBtn}>
        <Minus size={14} color={WHITE} strokeWidth={3} />
      </TouchableOpacity>
      <Text style={st.stepQty}>{qty}</Text>
      <TouchableOpacity onPress={() => { pulse(); onAdd(); }} style={st.stepBtn}>
        <Plus size={14} color={WHITE} strokeWidth={3} />
      </TouchableOpacity>
    </Animated.View>
  );
}
const st = StyleSheet.create({
  addBtn: {
    borderWidth: 1.5, borderColor: BRAND, borderRadius: 8,
    paddingHorizontal: 20, paddingVertical: 8, position: 'relative',
    backgroundColor: WHITE,
  },
  addTxt: { fontSize: 13, fontWeight: '800', color: BRAND },
  stepper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: BRAND, borderRadius: 8, overflow: 'hidden',
  },
  stepBtn: { paddingHorizontal: 10, paddingVertical: 8 },
  stepQty: { fontSize: 14, fontWeight: '800', color: WHITE, minWidth: 22, textAlign: 'center' },
});

// ── Menu Item Card ─────────────────────────────────────────────────────────────
function MenuItem({ item, qty, onAdd, onRemove }) {
  return (
    <View style={mi.row}>
      <View style={mi.left}>
        <VegBadge veg={item.veg} />
        {item.popular && (
          <View style={mi.popularBadge}>
            <Text style={mi.popularTxt}>⚡ BESTSELLER</Text>
          </View>
        )}
        <Text style={mi.name}>{item.name}</Text>
        <Text style={mi.priceRow}>
          <Text style={mi.discounted}>₹{item.discounted}  </Text>
          <Text style={mi.original}>₹{item.price}</Text>
        </Text>
        {item.desc ? <Text style={mi.desc} numberOfLines={2}>{item.desc}</Text> : null}
      </View>
      <View style={mi.right}>
        <View style={mi.emojiBox}>
          <Text style={mi.emoji}>🍽️</Text>
        </View>
        <View style={{ marginTop: -12 }}>
          <Stepper qty={qty} onAdd={onAdd} onRemove={onRemove} />
        </View>
      </View>
    </View>
  );
}
const mi = StyleSheet.create({
  row:         { flexDirection: 'row', paddingVertical: 18, paddingHorizontal: 16, gap: 12 },
  left:        { flex: 1, gap: 5 },
  right:       { width: 100, alignItems: 'center' },
  popularBadge:{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  popularTxt:  { fontSize: 10, fontWeight: '700', color: '#E65100' },
  name:        { fontSize: 15, fontWeight: '700', color: TEXT, lineHeight: 21 },
  priceRow:    {},
  discounted:  { fontSize: 14, fontWeight: '800', color: TEXT },
  original:    { fontSize: 12, color: GREY, textDecorationLine: 'line-through' },
  desc:        { fontSize: 12, color: GREY, lineHeight: 17 },
  emojiBox:    { width: 90, height: 80, borderRadius: 12, backgroundColor: '#FFF5F0', alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  emoji:       { fontSize: 36 },
});

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function RestaurantDetailScreen({ restaurant, cart, onAdd, onRemove, onBack, onViewCart }) {
  const [search, setSearch] = useState('');
  const { id, name, location, cuisine, rating, time, distance, offer, offerCode, minOrder, tag } = restaurant;

  const sections = MENU[id] || [];

  const getQty = useCallback((itemId) => {
    const found = cart.find(c => c.id === itemId);
    return found ? found.qty : 0;
  }, [cart]);

  const cartTotal = cart.reduce((sum, i) => sum + i.discounted * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const filteredSections = sections.map(sec => ({
    ...sec,
    items: search.trim()
      ? sec.items.filter(it => it.name.toLowerCase().includes(search.toLowerCase()))
      : sec.items,
  })).filter(sec => sec.items.length > 0);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <ArrowLeft size={22} color={TEXT} strokeWidth={2} />
        </TouchableOpacity>
        <View style={s.headerIcons}>
          <TouchableOpacity style={s.headerIconBtn}>
            <Search size={20} color={TEXT} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Restaurant Info Card ─────────────────────────────────────── */}
        <View style={s.infoCard}>
          {/* Seal */}
          <View style={s.sealRow}>
            <Shield size={14} color="#1565C0" fill="#1565C0" strokeWidth={0} />
            <Text style={s.sealTxt}>FoodRush Seal</Text>
          </View>

          <View style={s.nameRow}>
            <Text style={s.restName}>{name}</Text>
            <View style={s.ratingBadge}>
              <Star size={11} color={WHITE} fill={WHITE} strokeWidth={0} />
              <Text style={s.ratingTxt}>{rating}</Text>
            </View>
          </View>

          <Text style={s.ratingMeta}>{(rating * 50).toFixed(0)}+ ratings</Text>

          <View style={s.metaRow}>
            <Clock size={13} color={GREY} strokeWidth={2} />
            <Text style={s.metaTxt}>{time}</Text>
            <Text style={s.metaDot}>•</Text>
            <MapPin size={13} color={GREY} strokeWidth={2} />
            <Text style={s.metaTxt}>{location}</Text>
          </View>

          {offer && (
            <View style={s.offerRow}>
              <View style={s.offerBadge}>
                <Text style={s.offerBadgeTxt}>%</Text>
              </View>
              <Text style={s.offerTxt}>{offer}</Text>
              <Text style={s.offerCode}>{offerCode}</Text>
              <Text style={s.offerDivider}> | </Text>
              <Text style={s.offerMin}>ABOVE ₹{minOrder}</Text>
            </View>
          )}

          {/* Free delivery banner */}
          <View style={s.freeBanner}>
            <Text style={s.freeBannerTxt}>
              🎉 Free Delivery + Extra 10% off above ₹300
            </Text>
            <View style={s.oneBadge}><Text style={s.oneTxt}>one</Text></View>
          </View>
        </View>

        {/* ── Filters ─────────────────────────────────────────────────── */}
        <View style={s.filterRow}>
          <View style={s.searchSmall}>
            <Search size={14} color={GREY} strokeWidth={2} />
            <TextInput
              style={s.searchSmallInput}
              placeholder="Search for dishes"
              placeholderTextColor={GREY}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          {tag && (
            <View style={s.filterChip}>
              <Zap size={12} color={TEXT} fill={TEXT} strokeWidth={0} />
              <Text style={s.filterChipTxt}>{tag} · {time.split('-')[0]} Mins</Text>
            </View>
          )}
        </View>

        {/* ── Free Item Banner ─────────────────────────────────────────── */}
        <View style={s.freeItemBanner}>
          <Text style={s.freeItemEmoji}>🎁</Text>
          <View style={s.freeItemInfo}>
            <Text style={s.freeItemTitle}>FREE item for you!</Text>
            <View style={s.freeItemRow}>
              <VegBadge veg={true} />
              <Text style={s.freeItemName}>Soft drink (250ml) • ₹30</Text>
            </View>
            <Text style={s.freeItemClaim}>Add items above ₹{minOrder} to claim</Text>
          </View>
        </View>

        {/* ── Menu Sections ────────────────────────────────────────────── */}
        {filteredSections.map((sec, si) => (
          <View key={sec.section}>
            {/* Section header */}
            <TouchableOpacity style={s.sectionHeader} activeOpacity={0.85}>
              <Text style={s.sectionTitle}>{sec.section}</Text>
              <ChevronDown size={18} color={TEXT} strokeWidth={2} />
            </TouchableOpacity>

            {/* Items */}
            {sec.items.map((item, ii) => (
              <View key={item.id}>
                <MenuItem
                  item={item}
                  qty={getQty(item.id)}
                  onAdd={() => onAdd(item)}
                  onRemove={() => onRemove(item.id)}
                />
                {ii < sec.items.length - 1 && <View style={s.itemDivider} />}
              </View>
            ))}

            {si < filteredSections.length - 1 && <View style={s.sectionDivider} />}
          </View>
        ))}

        <View style={{ height: cartCount > 0 ? 90 : 40 }} />
      </ScrollView>

      {/* ── Floating Cart Bar ────────────────────────────────────────────── */}
      {cartCount > 0 && (
        <TouchableOpacity style={s.cartBar} onPress={onViewCart} activeOpacity={0.9}>
          <View style={s.cartBarLeft}>
            <Text style={s.cartBarCount}>{cartCount} item{cartCount > 1 ? 's' : ''} added</Text>
            <Text style={s.cartBarFrom}>from {name}</Text>
          </View>
          <View style={s.cartBarRight}>
            <Text style={s.cartBarTotal}>₹{cartTotal}</Text>
            <Text style={s.cartBarCta}>View Cart ›</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: WHITE },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 12, paddingTop: Platform.OS === 'ios' ? 56 : 16, paddingBottom: 10,
    backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  backBtn:       { padding: 6 },
  headerIcons:   { flexDirection: 'row', gap: 4 },
  headerIconBtn: { padding: 6 },

  // Info card
  infoCard: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  sealRow:  { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  sealTxt:  { fontSize: 12, fontWeight: '700', color: '#1565C0' },
  nameRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  restName: { fontSize: 22, fontWeight: '800', color: TEXT, flex: 1, lineHeight: 28 },
  ratingBadge: { backgroundColor: GREEN, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: 10, marginTop: 4 },
  ratingTxt:   { color: WHITE, fontSize: 13, fontWeight: '800' },
  ratingMeta:  { fontSize: 12, color: GREY, marginTop: 3, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 12 },
  metaTxt: { fontSize: 13, color: GREY, fontWeight: '500' },
  metaDot: { color: GREY, fontSize: 12 },
  offerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 8 },
  offerBadge: { backgroundColor: BRAND, width: 20, height: 20, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  offerBadgeTxt: { color: WHITE, fontSize: 10, fontWeight: '900' },
  offerTxt:  { fontSize: 13, fontWeight: '700', color: TEXT },
  offerCode: { fontSize: 12, color: GREY },
  offerDivider: { color: BORDER },
  offerMin:  { fontSize: 12, color: GREY },

  freeBanner: {
    backgroundColor: '#FFF8F6', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#FFCCBC',
  },
  freeBannerTxt: { fontSize: 12, fontWeight: '600', color: '#BF360C', flex: 1 },
  oneBadge: { backgroundColor: '#FF1744', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 8 },
  oneTxt:   { color: WHITE, fontSize: 11, fontWeight: '800' },

  // Filters
  filterRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: BORDER,
    borderBottomWidth: 1, borderBottomColor: BORDER,
    backgroundColor: WHITE,
  },
  searchSmall: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: BG, borderRadius: 8, paddingHorizontal: 10, height: 38,
  },
  searchSmallInput: { flex: 1, fontSize: 13, color: TEXT },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1.5, borderColor: BORDER, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  filterChipTxt: { fontSize: 12, fontWeight: '600', color: TEXT },

  // Free item
  freeItemBanner: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    margin: 16, padding: 14, backgroundColor: '#FFF8F6',
    borderRadius: 12, borderWidth: 1, borderColor: '#FFCCBC',
  },
  freeItemEmoji: { fontSize: 24 },
  freeItemInfo:  { flex: 1, gap: 4 },
  freeItemTitle: { fontSize: 14, fontWeight: '800', color: TEXT },
  freeItemRow:   { flexDirection: 'row', alignItems: 'center', gap: 6 },
  freeItemName:  { fontSize: 13, color: TEXT, fontWeight: '500' },
  freeItemClaim: { fontSize: 12, color: BRAND, fontWeight: '600' },

  // Section
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#FAFAFA',
  },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: TEXT },

  // Dividers
  itemDivider:    { height: 1, backgroundColor: BORDER, marginHorizontal: 16 },
  sectionDivider: { height: 8, backgroundColor: BG },

  // Cart bar
  cartBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#1BA672', paddingHorizontal: 20, paddingVertical: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  cartBarLeft:  {},
  cartBarCount: { fontSize: 15, fontWeight: '800', color: WHITE },
  cartBarFrom:  { fontSize: 11, color: 'rgba(255,255,255,0.8)', marginTop: 1 },
  cartBarRight: { alignItems: 'flex-end' },
  cartBarTotal: { fontSize: 14, fontWeight: '800', color: WHITE },
  cartBarCta:   { fontSize: 14, fontWeight: '800', color: WHITE },
});
