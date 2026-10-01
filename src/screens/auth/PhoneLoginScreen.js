// ─── FoodRush — Mobile Login Screen (Thick Royal Navy Blue Theme) ─────────────
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { ArrowLeft } from 'lucide-react-native';

const NAVY       = '#0D1B3E'; // Thick Royal Navy Blue
const DEEP_NAVY  = '#08122B'; // Deepest Navy
const BLUE_ACCENT= '#2563EB'; // Electric Royal Blue
const WHITE      = '#FFFFFF';
const DARK       = '#0F172A';
const GREY       = '#64748B';
const LIGHT      = '#F8FAFC';
const BORDER     = '#E2E8F0';
const DISBTN     = '#CBD5E1';
const DISTXT     = '#94A3B8';

export default function PhoneLoginScreen({ onContinue, onBack }) {
  const [phone, setPhone] = useState('');

  // Validate 10-digit Indian phone number
  const isValid = phone.length === 10 && /^\d{10}$/.test(phone);

  const handleSendOTP = () => {
    if (isValid) {
      onContinue(phone);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={DEEP_NAVY} />

      {/* Top Banner Header - Thick Royal Navy Blue */}
      <LinearGradient
        colors={[NAVY, DEEP_NAVY]}
        style={styles.heroBanner}
      >
        <View style={styles.brandRow}>
          {onBack && (
            <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
              <ArrowLeft size={22} color={WHITE} strokeWidth={2.5} />
            </TouchableOpacity>
          )}
          <Text style={styles.brandLogo}>🛵 FoodRush</Text>
        </View>
        <Text style={styles.heroTitle}>ACCOUNT LOGIN</Text>
        <Text style={styles.heroSub}>Enter your phone number to get instant OTP</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Main Phone Card */}
        <View style={styles.card}>
          <Text style={styles.inputLabel}>Enter Mobile Number</Text>

          <View style={styles.inputRow}>
            {/* Country Code Pill */}
            <View style={styles.countryPill}>
              <Text style={styles.flagEmoji}>🇮🇳</Text>
              <Text style={styles.countryCode}>+91</Text>
            </View>

            {/* 10-digit Phone TextInput */}
            <TextInput
              style={styles.phoneInput}
              placeholder="98765 43210"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={10}
              value={phone}
              onChangeText={(txt) => setPhone(txt.replace(/[^0-9]/g, ''))}
              autoFocus
            />
          </View>

          {/* Continue / Get OTP Button - Thick Navy Blue */}
          <TouchableOpacity
            style={[styles.continueBtn, !isValid && styles.continueBtnDisabled]}
            onPress={handleSendOTP}
            disabled={!isValid}
            activeOpacity={0.88}
          >
            <Text style={[styles.continueTxt, !isValid && styles.continueTxtDisabled]}>
              GET OTP ➔
            </Text>
          </TouchableOpacity>

        </View>

        {/* Professional Trust Badges */}
        <View style={styles.trustGrid}>
          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>⚡</Text>
            <View>
              <Text style={styles.trustTitle}>Fast Delivery</Text>
              <Text style={styles.trustSub}>In 20-30 Mins</Text>
            </View>
          </View>

          <View style={styles.trustItem}>
            <Text style={styles.trustIcon}>🛡️</Text>
            <View>
              <Text style={styles.trustTitle}>100% Secure</Text>
              <Text style={styles.trustSub}>Instant SMS OTP</Text>
            </View>
          </View>
        </View>

        {/* Terms Footer */}
        <View style={styles.footer}>
          <Text style={styles.termsText}>
            By continuing, you agree to FoodRush's{'\n'}
            <Text style={styles.link}>Terms of Service</Text> & <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  heroBanner: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    fontSize: 22,
    fontWeight: '900',
    color: WHITE,
    letterSpacing: -0.5,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: WHITE,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  heroSub: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: DARK,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  countryPill: {
    height: 52,
    paddingHorizontal: 14,
    backgroundColor: LIGHT,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    gap: 6,
  },
  flagEmoji: {
    fontSize: 18,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '700',
    color: DARK,
  },
  phoneInput: {
    flex: 1,
    height: 52,
    backgroundColor: LIGHT,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 17,
    fontWeight: '700',
    color: DARK,
    borderWidth: 1,
    borderColor: BORDER,
    letterSpacing: 1,
  },
  continueBtn: {
    height: 54,
    backgroundColor: NAVY,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  continueBtnDisabled: {
    backgroundColor: DISBTN,
    elevation: 0,
    shadowOpacity: 0,
  },
  continueTxt: {
    fontSize: 16,
    fontWeight: '800',
    color: WHITE,
    letterSpacing: 0.5,
  },
  continueTxtDisabled: {
    color: DISTXT,
  },
  trustGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trustIcon: {
    fontSize: 22,
  },
  trustTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: DARK,
  },
  trustSub: {
    fontSize: 10,
    color: GREY,
  },
  footer: {
    alignItems: 'center',
  },
  termsText: {
    fontSize: 11,
    color: GREY,
    textAlign: 'center',
    lineHeight: 16,
  },
  link: {
    color: NAVY,
    fontWeight: '700',
  },
});
