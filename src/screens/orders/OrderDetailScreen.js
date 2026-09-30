// ─── FoodRush — Order Detail / Bill Screen ─────────────────────────────────────
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Platform,
} from 'react-native';
import {
  ArrowLeft, MoreVertical, MapPin, Navigation2,
  CheckCircle, Clock,
} from 'lucide-react-native';

const BRAND  = '#FF5722';
const WHITE  = '#FFFFFF';
const TEXT   = '#1A1A1A';
const GREY   = '#686B78';
const BORDER = '#E8E8E8';
const BG     = '#F2F2F7';
const GREEN  = '#1BA672';

// ── Veg/NonVeg badge ─────────────────────────────────────────────────────────
const VegBadge = ({ veg }) => (
  <View style={[vb.box, { borderColor: veg ? GREEN : BRAND }]}>
    <View style={[vb.dot, { backgroundColor: veg ? GREEN : BRAND }]} />
  </View>
);
const vb = StyleSheet.create({
  box: { width: 16, height: 16, borderWidth: 1.5, borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8,  height: 8,  borderRadius: 4 },
});

// ── Bill Row ──────────────────────────────────────────────────────────────────
function BillRow({ label, value, isDiscount, isFree, isTotal }) {
  return (
    <View style={[br.row, isTotal && br.totalRow]}>
      <Text style={[br.label, isTotal && br.totalLabel]}>{label}</Text>
      <View style={br.valueWrap}>
        {isFree && <Text style={br.strikeVal}>{value.strike}  </Text>}
        <Text style={[
          br.value,
          isDiscount && { color: GREEN },
          isFree      && { color: GREEN },
          isTotal     && br.totalVal,
        ]}>
          {isFree ? 'FREE' : value}
        </Text>
      </View>
    </View>
  );
}
const br = StyleSheet.create({
  row:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  label:      { fontSize: 13, color: GREY, flex: 1, lineHeight: 18 },
  valueWrap:  { flexDirection: 'row', alignItems: 'center' },
  value:      { fontSize: 13, fontWeight: '600', color: TEXT },
  strikeVal:  { fontSize: 12, color: GREY, textDecorationLine: 'line-through' },
  totalRow:   { borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 14, marginTop: 4 },
  totalLabel: { fontSize: 15, fontWeight: '800', color: TEXT },
  totalVal:   { fontSize: 15, fontWeight: '800', color: TEXT },
});

// ── Conversation Thread ───────────────────────────────────────────────────────
function ConversationThread({ title, subtitle, onPress }) {
  return (
    <TouchableOpacity style={ct.row} onPress={onPress} activeOpacity={0.75}>
      <View style={ct.info}>
        <Text style={ct.title}>{title}</Text>
        <Text style={ct.sub}>{subtitle}</Text>
        <View style={ct.activeDot} />
      </View>
      <Text style={ct.arrow}>›</Text>
    </TouchableOpacity>
  );
}
const ct = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: BORDER },
  info:     { flex: 1 },
  title:    { fontSize: 14, fontWeight: '600', color: TEXT },
  sub:      { fontSize: 12, color: GREY, marginTop: 3 },
  activeDot:{ width: 24, height: 3, backgroundColor: GREEN, borderRadius: 2, marginTop: 8 },
  arrow:    { fontSize: 22, color: GREY },
});

// ── Main ─────────────────────────────────────────────────────────────────────
export default function OrderDetailScreen({ order, onBack }) {
  // If order is from "place order" flow, use it directly; else use past order mock
  const o = order || {
    id: '245934512124379',
    restaurantName: 'Hotel Vaigai',
    restaurantAddr: 'AMC Road-18/4, WEST CAR STREET DINDIGUL',
    emoji: '🍛',
    deliveryAddress: 'Pandiyan Nagar Near St. Joseph Hospital, Nehruji Nagar, Dindigul, Tamil Nadu 624001, India',
    deliveryPartner: 'Surya Nicolas Johnson Selvam',
    deliveredAt: 'August 17, 5:05 PM',
    isOnTime: true,
    items: [
      { name: 'Parotta', qty: 3, price: 24, discounted: 24, veg: true },
      { name: '10 Parotta With Chicken Gravy', qty: 1, price: 340, discounted: 268, veg: false },
    ],
    subtotal: 340,
    packaging: 10,
    platformFee: 17.58,
    discount: 11999,    // display only
    discountLabel: '-₹11999',
    discountCode: 'MISSEDYOU',
    deliveryFee: 0,
    deliveryDist: '1.8 kms',
    taxes: 13.90,
    payMethod: 'Cash',
    total: 196,
  };

  // Extract items safely (supports both past orders with .items and cart checkout with .cart)
  const items           = o.items || o.cart || [];
  const restaurantName  = o.restaurantName || o.restaurant?.name || 'Hotel Vaigai';
  const restaurantAddr  = o.restaurantAddr || o.restaurant?.address || 'AMC Road, Dindigul';
  const deliveryAddress = o.deliveryAddress || (o.location ? `${o.location.address || 'Pandiyan Nagar'}, Dindigul` : 'Pandiyan Nagar, Dindigul');
  const deliveredAt     = o.deliveredAt || 'Just now';
  const deliveryPartner = o.deliveryPartner || 'Surya Nicolas Johnson Selvam';

  const displayDiscount = o.discountLabel || `-₹${o.discount || 0}`;
  const subtotalCalc    = items.reduce((s, i) => s + (i.discounted || i.price || 0) * (i.qty || 1), 0);

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <ArrowLeft size={22} color={TEXT} strokeWidth={2} />
        </TouchableOpacity>
        <View style={s.headerMid}>
          <Text style={s.headerOrderId}>ORDER #{o.id || '245934512124379'}</Text>
          <Text style={s.headerMeta}>Delivered · {items.length} Items · ₹{o.total}</Text>
        </View>
        <TouchableOpacity style={s.backBtn}>
          <Text style={s.helpLink}>HELP</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* ── Restaurant & Delivery Address ─────────────────────────────── */}
        <View style={s.addressCard}>
          {/* Restaurant */}
          <View style={s.addrRow}>
            <View style={s.addrDotWrap}>
              <View style={s.dotOrange} />
              <View style={s.addrLine} />
            </View>
            <View style={s.addrInfo}>
              <TouchableOpacity>
                <Text style={s.addrTitle}>{restaurantName}</Text>
              </TouchableOpacity>
              <Text style={s.addrText}>{restaurantAddr}</Text>
            </View>
          </View>

          {/* Delivery location */}
          <View style={[s.addrRow, { marginTop: 8 }]}>
            <View style={s.addrDotWrap}>
              <Navigation2 size={16} color={BRAND} strokeWidth={2} fill={BRAND} />
            </View>
            <View style={s.addrInfo}>
              <Text style={s.addrInfoLabel}>Info</Text>
              <Text style={s.addrText}>{deliveryAddress}</Text>
            </View>
          </View>
        </View>

        {/* ── Delivery Status ──────────────────────────────────────────── */}
        <View style={s.statusCard}>
          <View style={s.statusRow}>
            <CheckCircle size={20} color={GREEN} fill={GREEN} strokeWidth={0} />
            <View style={s.statusInfo}>
              <Text style={s.statusTitle}>Order delivered on {deliveredAt}</Text>
              <Text style={s.statusBy}>by {deliveryPartner}</Text>
            </View>
            {(o.isOnTime ?? true) && (
              <View style={s.onTimeBadge}>
                <Clock size={11} color={WHITE} strokeWidth={2.5} />
                <Text style={s.onTimeTxt}>ON TIME</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Bill Details ─────────────────────────────────────────────── */}
        <View style={s.billCard}>
          <Text style={s.billTitle}>BILL DETAILS</Text>

          {/* Items */}
          {items.map((item, i) => (
            <View key={i} style={s.billItemRow}>
              <VegBadge veg={item.veg} />
              <Text style={s.billItemName}>{item.name} x {item.qty}</Text>
              <Text style={s.billItemPrice}>₹{(item.discounted || item.price || 0) * (item.qty || 1)}</Text>
            </View>
          ))}

          <View style={s.sectionDivider} />

          {/* Charges */}
          <BillRow label="Item Total"                 value={`₹${subtotalCalc}`} />
          <BillRow label="Restaurant Packaging"       value={`₹${o.packaging || 10}`} />
          <BillRow label="Platform fee with GST"      value={`₹${o.platformFee || 17.58}`} />
          <BillRow
            label={`Discount Applied (${o.discountCode || 'MISSEDYOU'})`}
            value={displayDiscount}
            isDiscount
          />
          <BillRow
            label={`Delivery Fee (FREE with FoodRush One) | ${o.deliveryDist || '1.8 kms'}`}
            value={{ strike: '₹26' }}
            isFree
          />
          {o.discount > 0 && (
            <BillRow label="Extra discount for you" value={`-₹65`} isDiscount />
          )}
          <BillRow label="Taxes" value={`₹${o.taxes || 13.90}`} />

          {/* Total */}
          <BillRow
            label={`Paid Via ${o.payMethod || 'Cash'}`}
            value={`₹${o.total}`}
            isTotal
          />
        </View>

        {/* ── Conversation Threads ─────────────────────────────────────── */}
        <View style={s.threadsCard}>
          <Text style={s.threadsTitle}>ALL CONVERSATION THREADS</Text>
          <ConversationThread
            title="I want to cancel my order"
            subtitle={`Order #${o.id || '245934512124379'} | August 17, 4:43 PM`}
          />
        </View>

        {/* ── Reorder ───────────────────────────────────────────────────── */}
        <TouchableOpacity style={s.reorderBtn} activeOpacity={0.85}>
          <Text style={s.reorderTxt}>REORDER</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingTop: Platform.OS === 'ios' ? 56 : 18, paddingBottom: 14,
    backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  backBtn:       { padding: 4 },
  headerMid:     { flex: 1 },
  headerOrderId: { fontSize: 15, fontWeight: '800', color: TEXT },
  headerMeta:    { fontSize: 12, color: GREY, marginTop: 2 },
  helpLink:      { fontSize: 14, fontWeight: '800', color: BRAND },

  // Address card
  addressCard: {
    backgroundColor: WHITE, margin: 16, borderRadius: 14,
    padding: 16, borderWidth: 1, borderColor: BORDER,
  },
  addrRow:    { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  addrDotWrap:{ alignItems: 'center', paddingTop: 3 },
  dotOrange:  { width: 12, height: 12, borderRadius: 6, backgroundColor: BRAND },
  addrLine:   { width: 1.5, height: 30, backgroundColor: BORDER, marginTop: 4 },
  addrInfo:   { flex: 1 },
  addrTitle:  { fontSize: 14, fontWeight: '800', color: BRAND },
  addrInfoLabel: { fontSize: 12, fontWeight: '700', color: GREY, marginBottom: 2 },
  addrText:   { fontSize: 12, color: GREY, lineHeight: 18 },

  // Status
  statusCard: {
    backgroundColor: WHITE, marginHorizontal: 16, marginBottom: 16,
    borderRadius: 14, padding: 16, borderWidth: 1, borderColor: BORDER,
  },
  statusRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  statusInfo: { flex: 1 },
  statusTitle:{ fontSize: 14, fontWeight: '600', color: TEXT },
  statusBy:   { fontSize: 12, color: GREY, marginTop: 3 },
  onTimeBadge:{ backgroundColor: '#1565C0', flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  onTimeTxt:  { fontSize: 10, fontWeight: '800', color: WHITE },

  // Bill
  billCard: {
    backgroundColor: WHITE, marginHorizontal: 16, marginBottom: 16,
    borderRadius: 14, padding: 16, borderWidth: 1, borderColor: BORDER,
  },
  billTitle: { fontSize: 12, fontWeight: '800', color: GREY, letterSpacing: 0.8, marginBottom: 16, textTransform: 'uppercase' },
  billItemRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  billItemName:  { flex: 1, fontSize: 13, color: TEXT, fontWeight: '500' },
  billItemPrice: { fontSize: 13, fontWeight: '700', color: TEXT },
  sectionDivider: { height: 1, backgroundColor: BORDER, marginVertical: 14 },

  // Threads
  threadsCard: {
    backgroundColor: WHITE, marginHorizontal: 16, marginBottom: 16,
    borderRadius: 14, borderWidth: 1, borderColor: BORDER, overflow: 'hidden',
  },
  threadsTitle: {
    fontSize: 12, fontWeight: '800', color: GREY, letterSpacing: 0.8,
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, textTransform: 'uppercase',
  },

  // Reorder
  reorderBtn: {
    marginHorizontal: 16, marginBottom: 8, borderWidth: 1.5,
    borderColor: BORDER, borderRadius: 12, paddingVertical: 16, alignItems: 'center',
    backgroundColor: WHITE,
  },
  reorderTxt: { fontSize: 15, fontWeight: '800', color: BRAND },
});
