// ─── FoodRush — Premium Onboarding Screen (Thick Navy Blue Theme) ─────────────
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const NAVY = '#0D1B3E';
const GOURMET_PIZZA_BG = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format&fit=crop';
let localAsset = null;
try {
  localAsset = require('../../../assets/onboarding_bg.png');
} catch (e) {}

export default function OnboardingScreen({ onStart }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Dark Gourmet Pizza Background */}
      <ImageBackground
        source={localAsset || { uri: GOURMET_PIZZA_BG }}
        style={styles.bgImage}
        resizeMode="cover"
      >
        {/* Dark Vignette Gradient Overlay */}
        <LinearGradient
          colors={['rgba(13,27,62,0.35)', 'rgba(13,27,62,0.70)', 'rgba(8,18,43,0.96)']}
          style={styles.gradient}
        >
          {/* Bottom Content Box */}
          <View style={styles.contentBox}>

            {/* Main Title */}
            <Text style={styles.title}>
              Welcome to{'\n'}FoodRush!
            </Text>

            {/* Subtitle / Tagline */}
            <Text style={styles.subtitle}>
              Satisfy your cravings with fresh, hot & delicious meals delivered right to your doorstep in 20 minutes.
            </Text>

            {/* Thick Royal Navy Blue Pill Button with White Circle Arrow */}
            <TouchableOpacity
              style={styles.btnPill}
              onPress={onStart}
              activeOpacity={0.88}
            >
              <View style={styles.arrowCircle}>
                <Text style={styles.arrowIcon}>➔</Text>
              </View>
              <Text style={styles.btnText}>Get Started...!</Text>
            </TouchableOpacity>

          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08122B',
  },
  bgImage: {
    width: width,
    height: height,
    justifyContent: 'flex-end',
  },
  gradient: {
    width: '100%',
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 50 : 40,
    paddingTop: 120,
    justifyContent: 'flex-end',
  },
  contentBox: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 36,
  },
  btnPill: {
    width: '100%',
    height: 58,
    backgroundColor: NAVY,
    borderRadius: 29,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    justifyContent: 'center',
    elevation: 8,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  arrowCircle: {
    position: 'absolute',
    left: 8,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    fontSize: 18,
    color: NAVY,
    fontWeight: '900',
  },
  btnText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
