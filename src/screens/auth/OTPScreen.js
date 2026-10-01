// ─── FoodRush — OTP Verification Screen (Thick Royal Navy Blue Theme) ─────────
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

import { ArrowLeft } from 'lucide-react-native';

const { height } = Dimensions.get('window');

const NAVY   = '#0D1B3E'; // Thick Royal Navy Blue
const DEEP_NAVY = '#08122B';
const WHITE  = '#FFFFFF';
const TEXT   = '#0F172A';
const GREY   = '#64748B';
const BORDER = '#CBD5E1';
const DISBTN = '#E2E8F0';

const OTP_LENGTH = 6;
const MOCK_OTP   = '123456';

// ── Styles Defined at Top to Avoid Hoisting Errors ────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: NAVY },

  header: {
    height: height * 0.28,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
    position: 'relative',
  },
  topBackBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 36,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  tagline: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.5,
  },

  sheetOuter: {
    flex: 1,
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
    marginBottom: 6,
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 28,
  },
  phoneTxt: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT,
  },
  changeBtn: {
    padding: 4,
  },
  changeTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
  },

  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpBox: {
    width: 46,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxActive: {
    borderColor: NAVY,
    backgroundColor: WHITE,
  },
  otpText: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },

  resendRow: {
    alignItems: 'center',
    marginBottom: 28,
  },
  resendBtn: {},
  resendTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: NAVY,
  },
  resendDisabled: {
    fontSize: 13,
    color: GREY,
  },

  verifyBtn: {
    height: 54,
    backgroundColor: NAVY,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  verifyBtnDisabled: {
    backgroundColor: DISBTN,
    elevation: 0,
  },
  verifyTxt: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '800',
  },
});

export default function OTPScreen({ phone, onVerified, onBack }) {
  const [otp, setOtp]          = useState(['', '', '', '', '', '']);
  const [activeIdx, setActive] = useState(0);
  const [timer, setTimer]      = useState(30);
  const [canResend, setResend]  = useState(false);

  const inputRefs = useRef([]);
  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: 100, useNativeDriver: true }),
      Animated.timing(fadeAnim,  { toValue: 1, duration: 400, delay: 100, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    if (timer <= 0) { setResend(true); return; }
    const id = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < OTP_LENGTH - 1) {
      setActive(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      setActive(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isComplete = otp.join('').length === OTP_LENGTH;

  const handleVerify = () => {
    onVerified();
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(30);
    setResend(false);
    setOtp(['', '', '', '', '', '']);
    setActive(0);
    inputRefs.current[0]?.focus();
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={DEEP_NAVY} />

      {/* Header */}
      <View style={s.header}>
        {onBack && (
          <TouchableOpacity style={s.topBackBtn} onPress={onBack} activeOpacity={0.7}>
            <ArrowLeft size={22} color={WHITE} strokeWidth={2.5} />
          </TouchableOpacity>
        )}
        <View style={s.logoCircle}>
          <Text style={{ fontSize: 32 }}>🛵</Text>
        </View>
        <Text style={s.tagline}>FOODRUSH OTP VERIFICATION</Text>
      </View>

      {/* Sheet */}
      <KeyboardAvoidingView
        style={s.sheetOuter}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Animated.View
          style={[s.sheet, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <Text style={s.title}>Enter OTP Code</Text>

          <View style={s.subRow}>
            <Text style={s.phoneTxt}>Sent to +91 {phone || '9876543210'}</Text>
            <TouchableOpacity onPress={onBack} style={s.changeBtn}>
              <Text style={s.changeTxt}>CHANGE</Text>
            </TouchableOpacity>
          </View>

          {/* OTP Box Inputs */}
          <View style={s.otpRow}>
            {Array(OTP_LENGTH).fill(0).map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[s.otpBox, activeIdx === i && s.otpBoxActive]}
                onPress={() => { setActive(i); inputRefs.current[i]?.focus(); }}
                activeOpacity={0.8}
              >
                <Text style={s.otpText}>{otp[i]}</Text>
                <TextInput
                  ref={el => inputRefs.current[i] = el}
                  style={s.hiddenInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={otp[i]}
                  onChangeText={txt => handleChange(txt, i)}
                  onKeyPress={e => handleKeyPress(e, i)}
                  onFocus={() => setActive(i)}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Resend Timer */}
          <View style={s.resendRow}>
            {canResend ? (
              <TouchableOpacity onPress={handleResend} style={s.resendBtn}>
                <Text style={s.resendTxt}>RESEND OTP</Text>
              </TouchableOpacity>
            ) : (
              <Text style={s.resendDisabled}>Resend OTP in 00:{timer < 10 ? `0${timer}` : timer}</Text>
            )}
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            style={[s.verifyBtn, !isComplete && s.verifyBtnDisabled]}
            disabled={!isComplete}
            onPress={handleVerify}
            activeOpacity={0.88}
          >
            <Text style={s.verifyTxt}>VERIFY & CONTINUE ➔</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
