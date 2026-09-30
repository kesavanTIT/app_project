import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { COLORS } from '../../constants/colors';

/**
 * ScreenWrapper — wraps every screen with:
 *  - Dark background
 *  - Safe area top/bottom padding
 *  - Status bar dark mode
 *  - Optional scroll (pass scrollable={true})
 */
export default function ScreenWrapper({
  children,
  style,
  noPaddingTop = false,
  noPaddingBottom = false,
  backgroundColor = COLORS.bg.primary,
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: noPaddingTop ? 0 : insets.top,
          paddingBottom: noPaddingBottom ? 0 : (insets.bottom > 0 ? 0 : 0),
        },
        style,
      ]}
    >
      <StatusBar style="light" backgroundColor={backgroundColor} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
