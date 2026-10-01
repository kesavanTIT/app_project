// ─── FoodRush — Orders Screen (Past Orders) ────────────────────────────────────
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Platform,
} from 'react-native';
import { ArrowLeft, CheckCircle, Star } from 'lucide-react-native';
import { PAST_ORDERS } from '../../data/mockData';

const BRAND  = '#0D1B3E';
const WHITE  = '#FFFFFF';
const TEXT   = '#1A1A1A';
const GREY   = '#686B78';
const BORDER = '#E8E8E8';
const BG     = '#F2F2F7';
const GREEN  = '#1BA672';

// ── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ label }) {
  return (
    <View style={sr.wrap}>
      <Text style={sr.label}>{label}</Text>
      <View style={sr.stars}>
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} size={16} color={BORDER} strokeWidth={1.5} />
        ))}
      </View>
    </View>
  );
}
const sr = StyleSheet.create({
  wrap:  { flex: 1, alignItems: 'center', gap: 6 },
  label: { fontSize: 11, color: GREY, fontWeight: '500' },
  stars: { flexDirection: 'row', gap: 3 },
});

// ── Order Card ────────────────────────────────────────────────────────────────
function OrderCard({ order, onViewBill, onReorder }) {
  return (
    <View style={oc.card}>
      {/* Restaurant row */}
      <View style={oc.topRow}>
        <View style={oc.emojiBox}>
          <Text style={oc.emoji}>{order.emoji}</Text>
        </View>
        <View style={oc.info}>
          <Text style={oc.name}>{order.restaurantName}</Text>
          <Text style={oc.location}>{order.location}</Text>
        </View>
        <View style={oc.statusBadge}>
          <CheckCircle size={14} color={GREEN} fill={GREEN} strokeWidth={0} />
          <Text style={oc.statusTxt}>Delivered</Text>
        </View>
      </View>

      {/* Items */}
      <View style={oc.itemsSection}>
        {(order.items || order.cart || []).map((it, i) => (
          <Text key={i} style={oc.itemTxt}>
            <Text style={oc.itemQty}>{it.qty}x </Text>{it.name}
          </Text>
        ))}
      </View>

      {/* Ratings */}
      <View style={oc.ratingRow}>
        <StarRating label="Your Food Rating" />
        <View style={oc.ratingDivider} />
        <StarRating label="Delivery Rating" />
      </View>

      {/* Footer */}
      <TouchableOpacity style={oc.reorderBtn} onPress={() => onReorder && onReorder(order)} activeOpacity={0.8}>
        <Text style={oc.reorderTxt}>REORDER ›</Text>
      </TouchableOpacity>

      <View style={oc.metaRow}>
        <Text style={oc.metaTxt}>Ordered: {order.orderedAt}</Text>
        <Text style={oc.metaDot}>•</Text>
        <TouchableOpacity onPress={() => onViewBill && onViewBill(order)}>
          <Text style={oc.billLink}>Bill Total: ₹{order.total}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const oc = StyleSheet.create({
  card:         { backgroundColor: WHITE, borderRadius: 16, marginHorizontal: 16, marginBottom: 14, borderWidth: 1, borderColor: BORDER, overflow: 'hidden' },
  topRow:       { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  emojiBox:     { width: 52, height: 52, borderRadius: 12, backgroundColor: '#FFF5F0', alignItems: 'center', justifyContent: 'center' },
  emoji:        { fontSize: 28 },
  info:         { flex: 1 },
  name:         { fontSize: 16, fontWeight: '800', color: TEXT },
  location:     { fontSize: 12, color: GREY, marginTop: 2 },
  statusBadge:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusTxt:    { fontSize: 12, fontWeight: '700', color: GREEN },
  itemsSection: { paddingHorizontal: 14, paddingBottom: 12, gap: 3 },
  itemTxt:      { fontSize: 13, color: GREY },
  itemQty:      { fontWeight: '700', color: TEXT },
  ratingRow:    { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: BORDER, paddingVertical: 14, paddingHorizontal: 14 },
  ratingDivider:{ width: 1, height: 40, backgroundColor: BORDER, marginHorizontal: 8 },
  reorderBtn:   { margin: 12, borderWidth: 1.5, borderColor: '#FFCCBC', borderRadius: 10, paddingVertical: 12, alignItems: 'center', backgroundColor: '#FFF8F6' },
  reorderTxt:   { fontSize: 14, fontWeight: '800', color: BRAND },
  metaRow:      { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingBottom: 12 },
  metaTxt:      { fontSize: 12, color: GREY },
  metaDot:      { fontSize: 12, color: GREY },
  billLink:     { fontSize: 12, fontWeight: '700', color: BRAND },
});

// ── Main ─────────────────────────────────────────────────────────────────────
export default function OrdersScreen({ onBack, onViewBill, onReorder }) {
  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <ArrowLeft size={22} color={TEXT} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>MY ACCOUNT</Text>
        <TouchableOpacity style={s.helpBtn}>
          <Text style={s.helpTxt}>Help  </Text>
          <View style={s.helpBadge}><Text style={s.helpBadgeTxt}>1</Text></View>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 20, paddingBottom: 40 }}>
        <Text style={s.sectionHead}>PAST ORDERS</Text>
        {PAST_ORDERS.map(order => (
          <OrderCard
            key={order.id}
            order={order}
            onViewBill={onViewBill}
            onReorder={onReorder}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingTop: Platform.OS === 'ios' ? 56 : 18, paddingBottom: 14,
    backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '800', color: TEXT, textAlign: 'center', letterSpacing: 0.5 },
  helpBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF0EC', borderRadius: 16, paddingHorizontal: 10, paddingVertical: 5 },
  helpTxt: { fontSize: 13, fontWeight: '600', color: TEXT },
  helpBadge: { backgroundColor: BRAND, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  helpBadgeTxt: { color: WHITE, fontSize: 10, fontWeight: '800' },
  sectionHead: { fontSize: 13, fontWeight: '800', color: TEXT, marginHorizontal: 16, marginBottom: 12, letterSpacing: 0.3 },
});
