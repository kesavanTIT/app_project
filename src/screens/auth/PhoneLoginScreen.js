// ─── FoodRush — Phone Login Screen (Swiggy-style Layout) ─────────────────────
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, ChevronDown } from 'lucide-react-native';

const { height } = Dimensions.get('window');

const BRAND   = '#06201E'; // Deep dark teal
const BRAND_D = '#0A3A36'; // Rich emerald teal
const ACCENT  = '#36D1A0'; // Mint green accent from screenshot
const WHITE   = '#FFFFFF';
const TEXT    = '#1A1A1A';
const GREY    = '#686B78';
const BORDER  = '#D8D8D8';
const DISBTN  = '#E8E8E8';
const DTEXT   = '#93959F';
const SHEET   = '#FFFFFF';

export default function PhoneLoginScreen({ onContinue }) {
  const [phone, setPhone]   = useState('');
  const [focused, setFocused] = useState(false);

  const isValid = phone.length === 10 && /^\d{10}$/.test(phone);

  // Floating label animation
  const labelAnim = useRef(new Animated.Value(0)).current;

  // Sheet slide-up animation
  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  // Button bounce when valid
  const btnScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: focused || phone.length > 0 ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [focused, phone]);

  useEffect(() => {
    if (isValid) {
      Animated.sequence([
        Animated.spring(btnScale, { toValue: 0.97, useNativeDriver: true, speed: 20 }),
        Animated.spring(btnScale, { toValue: 1,    useNativeDriver: true, speed: 20 }),
      ]).start();
    }
  }, [isValid]);

  const labelTop   = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [16, -9] });
  const labelSize  = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 11] });
  const labelColor = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [GREY, ACCENT] });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND} />

      {/* ── Dark Teal Header ─────────────────────────────────────────────── */}
      <LinearGradient colors={[BRAND, BRAND_D]} style={s.header}>
        {/* Logo */}
        <View style={s.logoWrap}>
          <View style={s.logoCircle}>
            <Zap size={32} color={ACCENT} fill={ACCENT} strokeWidth={0} />
          </View>
        </View>

        {/* Tagline */}
        <Text style={s.tagline}>
          One app for food, grocery, dining {'\n'}&amp; more in minutes!
        </Text>
      </LinearGradient>

      {/* ── White Bottom Sheet ──────────────────────────────────────────── */}
      <KeyboardAvoidingView
        style={s.sheetOuter}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View
          style={[s.sheet, { transform: [{ translateY: slideAnim }], opacity: fadeAnim }]}
        >
          {/* Title */}
          <Text style={s.title}>Enter your number</Text>

          {/* Phone Input */}
          <View style={[s.inputBox, focused && s.inputBoxActive]}>
            {/* Floating label */}
            <Animated.Text
              style={[
                s.floatLabel,
                {
                  top:             labelTop,
                  fontSize:        labelSize,
                  color:           labelColor,
                  backgroundColor: WHITE,
                  paddingHorizontal: 3,
                },
              ]}
            >
              Mobile Number
            </Animated.Text>

            {/* Dial code */}
            <TouchableOpacity style={s.dialWrap} activeOpacity={0.7}>
              <Text style={s.flag}>🇮🇳</Text>
              <Text style={s.dialCode}>+91</Text>
              <ChevronDown size={14} color={GREY} strokeWidth={2} />
            </TouchableOpacity>

            {/* Divider */}
            <View style={s.divider} />

            {/* Input */}
            <TextInput
              style={s.input}
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              selectionColor={ACCENT}
              cursorColor={ACCENT}
              returnKeyType="done"
            />
          </View>

          {/* Continue Button */}
          <Animated.View style={{ transform: [{ scale: btnScale }] }}>
            <TouchableOpacity
              style={[s.btn, isValid && s.btnActive]}
              disabled={!isValid}
              activeOpacity={0.85}
              onPress={() => onContinue && onContinue(phone)}
            >
              <Text style={[s.btnTxt, isValid && s.btnTxtActive]}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Legal */}
          <Text style={s.legal}>
            By clicking, I accept the{' '}
            <Text style={s.link}>Privacy policy</Text>,{'\n'}
            <Text style={s.link}>FoodRush terms of use</Text>
            {' '}and{' '}
            <Text style={s.link}>Instamart terms of use</Text>
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BRAND },

  // ── Header ──────────────────────────────────────────────────────────────────
  header: {
    height: height * 0.38,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  logoWrap: { marginBottom: 16 },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  tagline: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.95,
  },

  // ── Sheet ────────────────────────────────────────────────────────────────────
  sheetOuter: {
    flex: 1,
    backgroundColor: SHEET,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  sheet: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT,
    letterSpacing: -0.3,
    marginBottom: 24,
  },

  // ── Input ────────────────────────────────────────────────────────────────────
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 12,
    marginBottom: 28,
    position: 'relative',
    backgroundColor: WHITE,
  },
  inputBoxActive: { borderColor: ACCENT },
  floatLabel: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
    fontWeight: '500',
  },
  dialWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingRight: 4,
  },
  flag:     { fontSize: 20 },
  dialCode: { fontSize: 15, fontWeight: '700', color: TEXT },
  divider: {
    width: 1.5,
    height: 22,
    backgroundColor: BORDER,
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: TEXT,
    letterSpacing: 0.5,
    height: '100%',
  },

  // ── Button ───────────────────────────────────────────────────────────────────
  btn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: DISBTN,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  btnActive: {
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  btnTxt:       { fontSize: 15, fontWeight: '700', color: DTEXT },
  btnTxtActive: { color: BRAND, fontWeight: '800' },

  // ── Legal ─────────────────────────────────────────────────────────────────────
  legal: {
    fontSize: 12,
    color: GREY,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  link: {
    fontWeight: '700',
    color: TEXT,
    textDecorationLine: 'underline',
  },
});
