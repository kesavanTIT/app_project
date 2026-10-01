// ─── FoodRush — Location Screen (Thick Royal Navy Blue Theme) ───────────────
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, Animated, ScrollView,
  Platform, ActivityIndicator,
} from 'react-native';
import {
  Search, MapPin, Navigation2, Plus,
  Home, Briefcase, Star, ChevronRight, ArrowLeft,
} from 'lucide-react-native';

const NAVY   = '#0D1B3E'; // Thick Royal Navy Blue
const WHITE  = '#FFFFFF';
const TEXT   = '#0F172A';
const GREY   = '#64748B';
const BORDER = '#E2E8F0';
const BG     = '#F4F7FC';

// ── Styles Defined at Top to Avoid Hoisting ReferenceErrors ──────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: WHITE },

  topBar: {
    paddingTop: Platform.OS === 'ios' ? 58 : 24,
    paddingBottom: 14,
    paddingHorizontal: 16,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { fontSize: 20, fontWeight: '800', color: TEXT, letterSpacing: -0.3 },
  topSub:   { fontSize: 13, color: GREY, marginTop: 1 },

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
  detectTxt: { flex: 1, fontSize: 14, fontWeight: '700', color: NAVY },

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
    backgroundColor: WHITE,
    borderTopWidth: 1, borderBottomWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 16,
  },

  // Address Row
  addrRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, gap: 14,
  },
  addrIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: BG, alignItems: 'center', justifyContent: 'center',
  },
  addrInfo:  { flex: 1 },
  addrLabel: { fontSize: 14, fontWeight: '700', color: TEXT },
  addrText:  { fontSize: 12, color: GREY, marginTop: 2 },

  // Nearby Row
  nrRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, gap: 14,
  },
  nrIconWrap: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center',
  },
  nrInfo:  { flex: 1 },
  nrArea:  { fontSize: 14, fontWeight: '700', color: TEXT },
  nrFull:  { fontSize: 12, color: GREY, marginTop: 2 },

  rowDivider: { height: 1, backgroundColor: BORDER },
});

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
      <ChevronRight size={16} color={GREY} strokeWidth={1.8} />
    </TouchableOpacity>
  );
}

// ── Nearby Row ────────────────────────────────────────────────────────────────
function NearbyRow({ area, full, onPress }) {
  return (
    <TouchableOpacity style={s.nrRow} onPress={onPress} activeOpacity={0.75}>
      <View style={s.nrIconWrap}>
        <MapPin size={18} color={NAVY} strokeWidth={2} />
      </View>
      <View style={s.nrInfo}>
        <Text style={s.nrArea}>{area}</Text>
        <Text style={s.nrFull} numberOfLines={1}>{full}</Text>
      </View>
      <ChevronRight size={16} color={GREY} strokeWidth={1.8} />
    </TouchableOpacity>
  );
}

// ── Main Location Screen ──────────────────────────────────────────────────────
export default function LocationScreen({ onLocationGranted, onBack }) {
  const [query, setQuery]         = useState('');
  const [detecting, setDetecting] = useState(false);

  const slideAnim = useRef(new Animated.Value(40)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleDetectLocation = () => {
    setDetecting(true);
    setTimeout(() => {
      setDetecting(false);
      onLocationGranted(MOCK_LOCATION);
    }, 1200);
  };

  const handleSelectArea = (item) => {
    onLocationGranted({
      area:    item.area,
      address: item.full || item.address,
      coords:  MOCK_LOCATION.coords,
    });
  };

  const filteredAreas = NEARBY_AREAS.filter(
    a => a.area.toLowerCase().includes(query.toLowerCase()) ||
         a.full.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      <View style={s.topBar}>
        {onBack && (
          <TouchableOpacity style={s.topBackBtn} onPress={onBack} activeOpacity={0.7}>
            <ArrowLeft size={20} color={TEXT} strokeWidth={2.2} />
          </TouchableOpacity>
        )}
        <View style={{ flex: 1 }}>
          <Text style={s.topTitle}>Select Your Location</Text>
          <Text style={s.topSub}>Choose address for fast delivery</Text>
        </View>
      </View>

      <Animated.View style={[s.body, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* Search Box */}
          <View style={s.searchBox}>
            <Search size={18} color={GREY} strokeWidth={2} />
            <TextInput
              style={s.searchInput}
              placeholder="Search area, street, landmark..."
              placeholderTextColor={GREY}
              value={query}
              onChangeText={setQuery}
            />
          </View>

          {/* Use Current Location */}
          <TouchableOpacity
            style={s.detectBtn}
            onPress={handleDetectLocation}
            disabled={detecting}
            activeOpacity={0.8}
          >
            {detecting ? (
              <ActivityIndicator size="small" color={NAVY} />
            ) : (
              <Navigation2 size={20} color={NAVY} strokeWidth={2.2} />
            )}
            <Text style={s.detectTxt}>
              {detecting ? 'Detecting location…' : 'Use current location'}
            </Text>
            {!detecting && <ChevronRight size={16} color={NAVY} strokeWidth={2} />}
          </TouchableOpacity>

          {/* Add New Address */}
          <TouchableOpacity style={s.addBtn} activeOpacity={0.8} onPress={() => onLocationGranted(MOCK_LOCATION)}>
            <Plus size={18} color={TEXT} strokeWidth={2.5} />
            <Text style={s.addTxt}>Add new address</Text>
          </TouchableOpacity>

          <View style={s.divider} />

          {/* Nearby Areas */}
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

          {/* Saved Addresses */}
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
