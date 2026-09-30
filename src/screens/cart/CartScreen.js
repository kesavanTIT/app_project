// ─── FoodRush — Cart / Checkout Screen ────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar, Platform, Alert,
} from 'react-native';
import {
  ArrowLeft, Plus, Minus, Tag, ChevronRight,
  MapPin, Clock, Zap, Leaf, Gift,
} from 'lucide-react-native';

const BRAND  = '#FF5722';
const WHITE  = '#FFFFFF';
const TEXT   = '#1A1A1A';
const GREY   = '#686B78';
const BORDER = '#E8E8E8';
const BG     = '#F2F2F7';
const GREEN  = '#1BA672';

const PLATFORM_FEE = 6;
const GST_RATE     = 0.05;
const PACKAGING    = 10;
const DELIVERY_FEE = 0; // free

const DELIVERY_TYPES = [
  { id: 'bolt',     icon: Zap,  label: 'Bolt ⚡', sub: 'Lightning fast delivery', time: '10-15 mins', color: BRAND },
  { id: 'eco',      icon: Leaf, label: 'Eco Saver', sub: 'Lesser CO₂ by order grouping', time: '10-20 mins', color: GREEN },
];

const PAYMENT_METHODS = ['BHIM UPI', 'Google Pay', 'PhonePe', 'Cash on Delivery', 'Card'];

// ── Stepper ───────────────────────────────────────────────────────────────────
function CartStepper({ qty, onAdd, onRemove }) {
  return (
    <View style={cs.stepper}>
      <TouchableOpacity onPress={onRemove} style={cs.stepBtn}>
        <Minus size={14} color={WHITE} strokeWidth={3} />
      </TouchableOpacity>
      <Text style={cs.stepQty}>{qty}</Text>
      <TouchableOpacity onPress={onAdd} style={cs.stepBtn}>
        <Plus size={14} color={WHITE} strokeWidth={3} />
      </TouchableOpacity>
    </View>
  );
}
const cs = StyleSheet.create({
  stepper: { flexDirection: 'row', backgroundColor: BRAND, borderRadius: 8, overflow: 'hidden', alignItems: 'center' },
  stepBtn: { paddingHorizontal: 10, paddingVertical: 8 },
  stepQty: { fontSize: 13, fontWeight: '800', color: WHITE, minWidth: 20, textAlign: 'center' },
});

// ── Section Block ─────────────────────────────────────────────────────────────
function SectionBlock({ title, children }) {
  return (
    <View style={sc.block}>
      <Text style={sc.title}>{title}</Text>
      {children}
    </View>
  );
}
const sc = StyleSheet.create({
  block: { backgroundColor: WHITE, marginBottom: 8, paddingVertical: 14, paddingHorizontal: 16 },
  title: { fontSize: 13, fontWeight: '800', color: TEXT, letterSpacing: 0.3, marginBottom: 12, textTransform: 'uppercase' },
});

// ── Main ─────────────────────────────────────────────────────────────────────
export default function CartScreen({ cart, restaurant, location, onAdd, onRemove, onBack, onPlaceOrder }) {
  const [deliveryType, setDeliveryType] = useState('bolt');
  const [payMethod, setPayMethod]       = useState('BHIM UPI');
  const [couponApplied, setCouponApplied] = useState(true);

  const subtotal  = cart.reduce((sum, i) => sum + i.discounted * i.qty, 0);
  const savings   = cart.reduce((sum, i) => sum + (i.price - i.discounted) * i.qty, 0);
  const gst       = Math.round(subtotal * GST_RATE);
  const platformFeeWithGst = PLATFORM_FEE + Math.round(PLATFORM_FEE * 0.18);
  const discount  = couponApplied ? Math.min(savings, Math.round(subtotal * 0.30)) : 0;
  const total     = subtotal + PACKAGING + platformFeeWithGst + gst - discount;

  const handlePlaceOrder = () => {
    Alert.alert('Order Placed! 🎉', `Your order of ₹${total} has been placed successfully!`, [
      { text: 'Track Order', onPress: () => onPlaceOrder && onPlaceOrder({ items: cart, cart, restaurant, location, total, payMethod, deliveryType }) },
    ]);
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity onPress={onBack} style={s.backBtn}>
          <ArrowLeft size={22} color={TEXT} strokeWidth={2} />
        </TouchableOpacity>
        <View>
          <Text style={s.headerTitle}>{restaurant?.name}</Text>
          <Text style={s.headerSub}>
            <MapPin size={11} color={GREY} strokeWidth={2} />
            {'  '}{location?.area || 'Pandiyan Nagar'}  ›
          </Text>
        </View>
        <View style={s.savedBadge}>
          <Text style={s.savedTxt}>₹{savings} saved!</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── Cart Items ───────────────────────────────────────────────── */}
        <SectionBlock title="">
          {cart.map((item, i) => (
            <View key={item.id}>
              <View style={s.cartItem}>
                {/* Veg indicator */}
                <View style={[s.vegDot, { borderColor: item.veg ? GREEN : BRAND }]}>
                  <View style={[s.vegInner, { backgroundColor: item.veg ? GREEN : BRAND }]} />
                </View>
                <Text style={s.itemName} numberOfLines={2}>{item.name}</Text>
                <View style={s.itemRight}>
                  <CartStepper
                    qty={item.qty}
                    onAdd={() => onAdd(item)}
                    onRemove={() => onRemove(item.id)}
                  />
                  <Text style={s.itemPrice}>₹{item.discounted * item.qty}</Text>
                </View>
              </View>
              {i < cart.length - 1 && <View style={s.cartDivider} />}
            </View>
          ))}

          {/* Cooking requests / cutlery */}
          <View style={s.extras}>
            <TouchableOpacity style={s.extraBtn}>
              <Text style={s.extraTxt}>✏️ Cooking requests</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.extraBtn}>
              <Text style={s.extraTxt}>☐ Cutlery Needed</Text>
            </TouchableOpacity>
          </View>
        </SectionBlock>

        {/* ── Savings Corner ──────────────────────────────────────────── */}
        <SectionBlock title="SAVINGS CORNER">
          {/* Apply coupon */}
          <TouchableOpacity style={s.couponRow}>
            <View style={s.couponIcon}>
              <Tag size={16} color={WHITE} strokeWidth={2} />
            </View>
            <Text style={s.couponLabel}>Apply Coupon</Text>
            <ChevronRight size={16} color={GREY} strokeWidth={2} />
          </TouchableOpacity>

          <View style={s.rowDivider} />

          {/* Applied coupon */}
          {couponApplied && (
            <View style={s.appliedRow}>
              <View style={s.couponIcon}>
                <Gift size={16} color={WHITE} strokeWidth={2} />
              </View>
              <View style={s.appliedInfo}>
                <Text style={s.appliedTxt}>₹{discount} saved with 'Items starting ₹69'</Text>
              </View>
              <Text style={s.appliedBadge}>✓ Applied</Text>
            </View>
          )}

          <View style={s.rowDivider} />

          {/* Reward */}
          <TouchableOpacity style={s.rewardRow}>
            <View style={[s.couponIcon, { backgroundColor: '#7C4DFF' }]}>
              <Gift size={16} color={WHITE} strokeWidth={2} />
            </View>
            <Text style={s.rewardTxt}>Get 75% off - Place 1 more order to unlock this reward!</Text>
            <ChevronRight size={16} color={GREY} strokeWidth={2} />
          </TouchableOpacity>
        </SectionBlock>

        {/* ── Delivery Options ─────────────────────────────────────────── */}
        <SectionBlock title="">
          <View style={s.deliveryTabs}>
            {['Delivery Type', 'Tip', 'Instructions'].map(t => (
              <TouchableOpacity key={t} style={[s.deliveryTab, t === 'Delivery Type' && s.deliveryTabActive]}>
                <Text style={[s.deliveryTabTxt, t === 'Delivery Type' && s.deliveryTabTxtActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {DELIVERY_TYPES.map((dt, i) => {
            const isActive = deliveryType === dt.id;
            return (
              <TouchableOpacity
                key={dt.id}
                style={s.deliveryOption}
                onPress={() => setDeliveryType(dt.id)}
                activeOpacity={0.8}
              >
                <View style={[s.radio, isActive && s.radioActive]}>
                  {isActive && <View style={s.radioInner} />}
                </View>
                <View style={s.deliveryInfo}>
                  <View style={s.deliveryLabelRow}>
                    <dt.icon size={14} color={dt.color} fill={dt.id === 'bolt' ? dt.color : 'none'} strokeWidth={2} />
                    <Text style={s.deliveryLabel}>{dt.label}</Text>
                  </View>
                  <Text style={s.deliverySub}>{dt.sub}</Text>
                </View>
                <Text style={[s.deliveryTime, { color: dt.color }]}>{dt.time}</Text>
              </TouchableOpacity>
            );
          })}
        </SectionBlock>

        {/* ── Bill Details ─────────────────────────────────────────────── */}
        <SectionBlock title="BILL DETAILS">
          <View style={s.billRow}>
            <Text style={s.billLabel}>Item Total</Text>
            <Text style={s.billVal}>₹{subtotal}</Text>
          </View>
          <View style={s.billRow}>
            <Text style={s.billLabel}>Restaurant Packaging</Text>
            <Text style={s.billVal}>₹{PACKAGING}</Text>
          </View>
          <View style={s.billRow}>
            <Text style={s.billLabel}>Platform fee with GST</Text>
            <Text style={s.billVal}>₹{platformFeeWithGst.toFixed(2)}</Text>
          </View>
          {couponApplied && (
            <View style={s.billRow}>
              <Text style={s.billLabel}>Discount Applied (MISSEDYOU)</Text>
              <Text style={[s.billVal, { color: GREEN }]}>-₹{discount}</Text>
            </View>
          )}
          <View style={s.billRow}>
            <Text style={s.billLabel}>Delivery Fee (FREE) | {restaurant?.distance || '1.8 kms'}</Text>
            <View style={s.freeDelivRow}>
              <Text style={s.strikeThrough}>₹{26}</Text>
              <Text style={[s.billVal, { color: GREEN, marginLeft: 6 }]}>FREE</Text>
            </View>
          </View>
          <View style={s.billRow}>
            <Text style={s.billLabel}>Taxes</Text>
            <Text style={s.billVal}>₹{gst}</Text>
          </View>
          <View style={s.billDivider} />
          <View style={s.billTotalRow}>
            <Text style={s.billTotalLabel}>Bill Total</Text>
            <Text style={s.billTotalVal}>₹{total}</Text>
          </View>
        </SectionBlock>

        {/* ── Payment ──────────────────────────────────────────────────── */}
        <View style={s.paySection}>
          <Text style={s.payLabel}>PAY USING</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.payScroll}>
            {PAYMENT_METHODS.map(pm => (
              <TouchableOpacity
                key={pm}
                style={[s.payChip, payMethod === pm && s.payChipActive]}
                onPress={() => setPayMethod(pm)}
              >
                <Text style={[s.payChipTxt, payMethod === pm && s.payChipTxtActive]}>{pm}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* ── Pay Button ───────────────────────────────────────────────────── */}
      <View style={s.payFooter}>
        <View>
          <Text style={s.payFooterMethod}>▲ PAY USING</Text>
          <Text style={s.payFooterMethodName}>{payMethod}</Text>
        </View>
        <TouchableOpacity style={s.payBtn} onPress={handlePlaceOrder} activeOpacity={0.85}>
          <Text style={s.payBtnTxt}>Pay ₹{total}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingTop: Platform.OS === 'ios' ? 56 : 18, paddingBottom: 14,
    backgroundColor: WHITE, borderBottomWidth: 1, borderBottomColor: BORDER,
  },
  backBtn:      { padding: 4 },
  headerTitle:  { fontSize: 16, fontWeight: '800', color: TEXT },
  headerSub:    { fontSize: 12, color: GREY, marginTop: 2 },
  savedBadge:   { marginLeft: 'auto', backgroundColor: '#FFF0EC', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  savedTxt:     { fontSize: 11, fontWeight: '700', color: BRAND },

  // Cart items
  cartItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 10 },
  vegDot:   { width: 16, height: 16, borderWidth: 1.5, borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
  vegInner: { width: 8, height: 8, borderRadius: 4 },
  itemName: { flex: 1, fontSize: 14, fontWeight: '600', color: TEXT },
  itemRight: { alignItems: 'flex-end', gap: 4 },
  itemPrice: { fontSize: 13, fontWeight: '700', color: TEXT },
  cartDivider: { height: 1, backgroundColor: BORDER },

  // Extras
  extras: { flexDirection: 'row', gap: 10, marginTop: 14 },
  extraBtn: { flex: 1, borderWidth: 1, borderColor: BORDER, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  extraTxt: { fontSize: 12, color: GREY, fontWeight: '500' },

  // Savings
  couponRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  couponIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: BRAND, alignItems: 'center', justifyContent: 'center' },
  couponLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: TEXT },
  appliedRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  appliedInfo: { flex: 1 },
  appliedTxt:  { fontSize: 13, fontWeight: '600', color: TEXT },
  appliedBadge: { fontSize: 13, fontWeight: '700', color: GREEN },
  rewardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  rewardTxt: { flex: 1, fontSize: 13, color: TEXT, lineHeight: 18 },
  rowDivider: { height: 1, backgroundColor: BORDER, marginVertical: 12 },

  // Delivery
  deliveryTabs: { flexDirection: 'row', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: BORDER },
  deliveryTab: { flex: 1, alignItems: 'center', paddingBottom: 10 },
  deliveryTabActive: { borderBottomWidth: 2, borderBottomColor: TEXT },
  deliveryTabTxt: { fontSize: 13, fontWeight: '600', color: GREY },
  deliveryTabTxtActive: { color: TEXT, fontWeight: '800' },
  deliveryOption: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: BORDER, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: BRAND },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: BRAND },
  deliveryInfo: { flex: 1, gap: 3 },
  deliveryLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  deliveryLabel: { fontSize: 14, fontWeight: '700', color: TEXT },
  deliverySub:   { fontSize: 12, color: GREY },
  deliveryTime:  { fontSize: 13, fontWeight: '700' },

  // Bill
  billRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  billLabel:    { fontSize: 13, color: GREY, flex: 1 },
  billVal:      { fontSize: 13, fontWeight: '600', color: TEXT },
  freeDelivRow: { flexDirection: 'row', alignItems: 'center' },
  strikeThrough:{ fontSize: 12, color: GREY, textDecorationLine: 'line-through' },
  billDivider:  { height: 1, backgroundColor: BORDER, marginVertical: 12 },
  billTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  billTotalLabel: { fontSize: 15, fontWeight: '800', color: TEXT },
  billTotalVal:   { fontSize: 15, fontWeight: '800', color: TEXT },

  // Payment
  paySection: { backgroundColor: WHITE, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8 },
  payLabel:   { fontSize: 11, fontWeight: '700', color: GREY, letterSpacing: 0.8, marginBottom: 10 },
  payScroll:  {},
  payChip: {
    borderWidth: 1.5, borderColor: BORDER, borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, backgroundColor: WHITE,
  },
  payChipActive:  { borderColor: BRAND, backgroundColor: '#FFF0EC' },
  payChipTxt:     { fontSize: 13, fontWeight: '600', color: GREY },
  payChipTxtActive: { color: BRAND, fontWeight: '700' },

  // Footer
  payFooter: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: WHITE, borderTopWidth: 1, borderTopColor: BORDER,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: Platform.OS === 'ios' ? 30 : 16,
  },
  payFooterMethod:     { fontSize: 10, color: GREY, fontWeight: '600' },
  payFooterMethodName: { fontSize: 14, fontWeight: '800', color: TEXT, marginTop: 2 },
  payBtn: {
    backgroundColor: GREEN, borderRadius: 10,
    paddingHorizontal: 28, paddingVertical: 14,
  },
  payBtnTxt: { fontSize: 15, fontWeight: '800', color: WHITE },
});
