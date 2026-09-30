// ─── FoodRush — OTP Verification Screen (Swiggy-style) ───────────────────────
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
import { Zap, Edit2 } from 'lucide-react-native';

const { height } = Dimensions.get('window');

const BRAND   = '#06201E'; // Deep dark teal
const BRAND_D = '#0A3A36'; // Rich emerald teal
const ACCENT  = '#36D1A0'; // Mint green accent from screenshot
const WHITE   = '#FFFFFF';
const TEXT    = '#1A1A1A';
const GREY    = '#686B78';
const BORDER  = '#D8D8D8';
const BG      = '#F2F2F7';
const DISBTN  = '#E8E8E8';
const DTEXT   = '#93959F';

const OTP_LENGTH = 6;
const MOCK_OTP   = '123456'; // any 6-digit input works for mock

export default function OTPScreen({ phone, onVerified, onBack }) {
  const [otp, setOtp]         = useState(['', '', '', '', '', '']);
  const [activeIdx, setActive] = useState(0);
  const [timer, setTimer]     = useState(30);
  const [canResend, setResend] = useState(false);

  const inputRefs = useRef([]);
  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  // Entry animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),
    ]).start();
    // Focus first box
    setTimeout(() => inputRefs.current[0]?.focus(), 500);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) { setResend(true); return; }
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const timerStr = `${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(timer % 60).padStart(2, '0')}`;

  const handleChange = (val, idx) => {
    const digit = val.replace(/[^0-9]/g, '').slice(-1);
    const next  = [...otp];
    next[idx] = digit;
    setOtp(next);

    if (digit && idx < OTP_LENGTH - 1) {
      inputRefs.current[idx + 1]?.focus();
      setActive(idx + 1);
    }

    // Mock verify — any 6 digits
    if (next.every(d => d !== '')) {
      setTimeout(() => onVerified && onVerified(next.join('')), 200);
    }
  };

  const handleKeyPress = (e, idx) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[idx] && idx > 0) {
      const next = [...otp];
      next[idx - 1] = '';
      setOtp(next);
      inputRefs.current[idx - 1]?.focus();
      setActive(idx - 1);
    }
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setResend(false);
    setActive(0);
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={BRAND} />

      {/* ── Dark Teal Header ──────────────────────────────────────────── */}
      <LinearGradient colors={[BRAND, BRAND_D]} style={s.header}>
        <View style={s.logoCircle}>
          <Zap size={32} color={ACCENT} fill={ACCENT} strokeWidth={0} />
        </View>
        <Text style={s.tagline}>
          One app for food, grocery, dining {'\n'}&amp; more in minutes!
        </Text>
      </LinearGradient>

      {/* ── White Sheet ─────────────────────────────────────────────────── */}
      <KeyboardAvoidingView
        style={s.sheetOuter}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View
          style={[s.sheet, { transform: [{ translateY: slideAnim }], opacity: fadeAnim }]}
        >
          {/* Title */}
          <Text style={s.title}>Enter verification code</Text>

          {/* Sent to */}
          <View style={s.sentRow}>
            <Text style={s.sentTxt}>Sent to +91 {phone}</Text>
            <TouchableOpacity onPress={onBack} style={s.editBtn}>
              <Edit2 size={14} color={ACCENT} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* OTP Boxes */}
          <View style={s.otpRow}>
            {otp.map((digit, idx) => (
              <View
                key={idx}
                style={[
                  s.otpBox,
                  activeIdx === idx && s.otpBoxActive,
                  digit !== '' && s.otpBoxFilled,
                ]}
              >
                <TextInput
                  ref={r => (inputRefs.current[idx] = r)}
                  style={s.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={val => handleChange(val, idx)}
                  onKeyPress={e => handleKeyPress(e, idx)}
                  onFocus={() => setActive(idx)}
                  selectionColor={ACCENT}
                  caretHidden={true}
                />
              </View>
            ))}
          </View>

          {/* Timer */}
          <View style={s.timerRow}>
            {!canResend ? (
              <Text style={s.timerTxt}>
                Get verification code again in{' '}
                <Text style={s.timerCount}>{timerStr}</Text>
              </Text>
            ) : (
              <Text style={s.resendTxt}>Didn't receive the code?</Text>
            )}
          </View>

          {/* Resend buttons */}
          <View style={s.resendRow}>
            <TouchableOpacity
              style={[s.resendBtn, canResend && s.resendBtnActive]}
              onPress={handleResend}
              activeOpacity={canResend ? 0.8 : 1}
            >
              <Text style={[s.resendBtnTxt, canResend && s.resendBtnTxtActive]}>
                Get via SMS
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.resendBtn, canResend && s.resendBtnActive]}
              activeOpacity={canResend ? 0.8 : 1}
            >
              <Text style={[s.resendBtnTxt, canResend && s.resendBtnTxtActive]}>
                Get via Call
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: BRAND },

  // ── Header ───────────────────────────────────────────────────────────────────
  header: {
    height: height * 0.32,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 18,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
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
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
  },
  sheet: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 28,
  },

  // ── Title ───────────────────────────────────────────────────────────────────
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT,
    letterSpacing: -0.3,
    marginBottom: 8,
  },

  // ── Sent to row ──────────────────────────────────────────────────────────────
  sentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    gap: 8,
  },
  sentTxt: { fontSize: 14, color: GREY, fontWeight: '500' },
  editBtn: {
    padding: 4,
  },

  // ── OTP Row ──────────────────────────────────────────────────────────────────
  otpRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  otpBox: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxActive: {
    borderColor: ACCENT,
    borderWidth: 2,
  },
  otpBoxFilled: {
    borderColor: ACCENT,
    backgroundColor: '#EBFBF7',
  },
  otpInput: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT,
    textAlign: 'center',
    width: '100%',
    height: '100%',
    padding: 0,
  },

  // ── Timer ────────────────────────────────────────────────────────────────────
  timerRow: { alignItems: 'center', marginBottom: 20 },
  timerTxt:  { fontSize: 13, color: GREY },
  timerCount:{ color: ACCENT, fontWeight: '700' },
  resendTxt: { fontSize: 13, color: GREY },

  // ── Resend buttons ───────────────────────────────────────────────────────────
  resendRow: {
    flexDirection: 'row',
    gap: 12,
  },
  resendBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: DISBTN,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resendBtnActive: {
    backgroundColor: ACCENT,
    shadowColor: ACCENT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  resendBtnTxt:       { fontSize: 14, fontWeight: '600', color: DTEXT },
  resendBtnTxtActive: { color: BRAND, fontWeight: '800' },
});
