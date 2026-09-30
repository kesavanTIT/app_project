// ─── FoodRush — Location Screen (Swiggy-style) ───────────────────────────────
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, Animated, ScrollView,
  Platform, ActivityIndicator,
} from 'react-native';
import {
  Search, MapPin, Navigation2, Plus,
  Home, Briefcase, Star, ChevronRight, MoreVertical,
} from 'lucide-react-native';

const BRAND  = '#FF5722';
const WHITE  = '#FFFFFF';
const TEXT   = '#1A1A1A';
const GREY   = '#686B78';
const BORDER = '#E8E8E8';
const BG     = '#F2F2F7';

// Mock address that gets "detected"
const MOCK_LOCATION = {
  area:    'Pandiyan Nagar',
  address: 'Near St. Joseph Hospital, Nehruji Nagar, Dindigul, Tamil Nadu 624001, India',
  coords:  { latitude: 10.3673, longitude: 77.9803 },
};

const SAVED_ADDRESSES = [
  { Icon: Home,      label: 'Home',  address: 'Anna Nagar, Chennai, Tamil Nadu 600040' },
  { Icon: Briefcase, label: 'Work',  address: 'NSN College, Kalvi Nagar, Karur, Tamil Nadu' },
  { Icon: Star,      label: 'Other', address: 'Coimbatore, Tamil Nadu 641001' },
];

const NEARBY_AREAS = [
  { area: 'Pandiyan Nagar', full: 'Near St. Joseph Hospital, Dindigul' },
  { area: 'AMC Road',       full: 'AMC Road, Dindigul, Tamil Nadu 624001' },
  { area: 'Nehruji Nagar',  full: 'Nehruji Nagar, Dindigul, Tamil Nadu 624001' },
  { area: 'Dindigul Town',  full: 'Main Road, Dindigul, Tamil Nadu 624001' },
];

// ── Address Row ───────────────────────────────────────────────────────────────
function AddressRow({ Icon, label, address, onPress }) {
  return (
    <TouchableOpacity style={s.addrRow} onPress={onPress} activeOpacity={0.75}>
      <View style={s.addrIconWrap}>
        <Icon size={18} color={GREY} strokeWidth={1.8} />
      </View>
      <View style={s.addrInfo}>
        <Text style={s.addrLabel}>{label}</Text>
        <Text style={s.addrText} numberOfLines={1}>{address}</Text>
      </View>
      <MoreVertical size={16} color={GREY} strokeWidth={1.8} />
    </TouchableOpacity>
  );
}

// ── Nearby Row ────────────────────────────────────────────────────────────────
function NearbyRow({ area, full, onPress }) {
  return (
    <TouchableOpacity style={s.nearbyRow} onPress={onPress} activeOpacity={0.75}>
      <View style={s.nearbyIconWrap}>
        <MapPin size={16} color={BRAND} strokeWidth={2} />
      </View>
      <View style={s.nearbyInfo}>
        <Text style={s.nearbyArea}>{area}</Text>
        <Text style={s.nearbyFull} numberOfLines={1}>{full}</Text>
      </View>
      <ChevronRight size={16} color={GREY} strokeWidth={2} />
    </TouchableOpacity>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function LocationScreen({ onLocationGranted }) {
  const [search, setSearch]     = useState('');
  const [detecting, setDetecting] = useState(false);

  const slideAnim = useRef(new Animated.Value(50)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 380, delay: 60, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 380, delay: 60, useNativeDriver: true }),
    ]).start();
  }, []);

  // Simulate GPS detection with mock data
  const handleDetect = () => {
    setDetecting(true);
    setTimeout(() => {
      setDetecting(false);
      onLocationGranted && onLocationGranted(MOCK_LOCATION);
    }, 1400);
  };

  const handleSelectArea = (item) => {
    onLocationGranted && onLocationGranted({
      area:    item.area,
      address: item.full,
      coords:  MOCK_LOCATION.coords,
    });
  };

  const filteredAreas = search.trim()
    ? NEARBY_AREAS.filter(a =>
        a.area.toLowerCase().includes(search.toLowerCase()) ||
        a.full.toLowerCase().includes(search.toLowerCase())
      )
    : NEARBY_AREAS;

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <View style={s.topBar}>
        <Text style={s.topTitle}>Select Your Location</Text>
        <Text style={s.topSub}>Where should we deliver to?</Text>
      </View>

      <Animated.View style={[s.body, { transform: [{ translateY: slideAnim }], opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── Search ────────────────────────────────────────────────────── */}
          <View style={s.searchBox}>
            <Search size={18} color={GREY} strokeWidth={2} />
            <TextInput
              style={s.searchInput}
              placeholder="Search an area or address…"
              placeholderTextColor={GREY}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
          </View>

          {/* ── Detect Location ───────────────────────────────────────────── */}
          <TouchableOpacity
            style={s.detectBtn}
            onPress={handleDetect}
            activeOpacity={0.8}
            disabled={detecting}
          >
            {detecting ? (
              <ActivityIndicator size="small" color={BRAND} />
            ) : (
              <Navigation2 size={18} color={BRAND} strokeWidth={2} fill={BRAND} />
            )}
            <Text style={s.detectTxt}>
              {detecting ? 'Detecting location…' : 'Use current location'}
            </Text>
            {!detecting && <ChevronRight size={16} color={BRAND} strokeWidth={2} />}
          </TouchableOpacity>

          {/* ── Add New Address ───────────────────────────────────────────── */}
          <TouchableOpacity style={s.addBtn} activeOpacity={0.8}>
            <Plus size={18} color={TEXT} strokeWidth={2.5} />
            <Text style={s.addTxt}>Add new address</Text>
          </TouchableOpacity>

          <View style={s.divider} />

          {/* ── Nearby Areas ──────────────────────────────────────────────── */}
          {filteredAreas.length > 0 && (
            <>
              <Text style={s.sectionHead}>NEARBY AREAS</Text>
              <View style={s.listCard}>
                {filteredAreas.map((item, i) => (
                  <View key={item.area}>
                    <NearbyRow
                      area={item.area}
                      full={item.full}
                      onPress={() => handleSelectArea(item)}
                    />
                    {i < filteredAreas.length - 1 && <View style={s.rowDivider} />}
                  </View>
                ))}
              </View>
            </>
          )}

          {/* ── Saved Addresses ───────────────────────────────────────────── */}
          <Text style={[s.sectionHead, { marginTop: 20 }]}>SAVED ADDRESSES</Text>
          <View style={s.listCard}>
            {SAVED_ADDRESSES.map((a, i) => (
              <View key={a.label}>
                <AddressRow
                  Icon={a.Icon}
                  label={a.label}
                  address={a.address}
                  onPress={() => handleSelectArea({ area: a.label, full: a.address })}
                />
                {i < SAVED_ADDRESSES.length - 1 && <View style={s.rowDivider} />}
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: WHITE },

  topBar: {
    paddingTop: Platform.OS === 'ios' ? 58 : 24,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  topTitle: { fontSize: 20, fontWeight: '800', color: TEXT, letterSpacing: -0.3 },
  topSub:   { fontSize: 13, color: GREY, marginTop: 3 },

  body: { flex: 1 },

  // Search
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: BG, borderRadius: 10,
    marginHorizontal: 16, marginTop: 16, marginBottom: 10,
    paddingHorizontal: 12, height: 48, gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14, color: TEXT },

  // Detect
  detectBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginBottom: 2,
    paddingVertical: 14, paddingHorizontal: 4,
  },
  detectTxt: { flex: 1, fontSize: 14, fontWeight: '700', color: BRAND },

  // Add new
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, paddingVertical: 14, paddingHorizontal: 4,
  },
  addTxt: { fontSize: 14, fontWeight: '700', color: TEXT },

  divider: { height: 8, backgroundColor: BG, marginVertical: 8 },

  sectionHead: {
    fontSize: 11, fontWeight: '700', color: GREY,
    letterSpacing: 1, marginHorizontal: 16, marginBottom: 8,
  },

  listCard: {
    backgroundColor: WHITE, marginHorizontal: 16,
    borderRadius: 12, borderWidth: 1, borderColor: BORDER,
    overflow: 'hidden', marginBottom: 4,
  },

  // Nearby row
  nearbyRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 14, gap: 12,
  },
  nearbyIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#FFF0EC', alignItems: 'center', justifyContent: 'center',
  },
  nearbyInfo: { flex: 1 },
  nearbyArea: { fontSize: 14, fontWeight: '700', color: TEXT, marginBottom: 2 },
  nearbyFull: { fontSize: 12, color: GREY },

  // Address row
  addrRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 14, gap: 12,
  },
  addrIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: BG, alignItems: 'center', justifyContent: 'center',
  },
  addrInfo: { flex: 1 },
  addrLabel: { fontSize: 14, fontWeight: '700', color: TEXT, marginBottom: 2 },
  addrText:  { fontSize: 12, color: GREY },

  rowDivider: { height: 1, backgroundColor: BORDER, marginLeft: 62 },
});
