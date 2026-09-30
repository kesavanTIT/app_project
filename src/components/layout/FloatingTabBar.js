import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home,
  Search,
  ShoppingBag,
  ClipboardList,
  User,
} from 'lucide-react-native';
import { COLORS } from '../../constants/colors';
import { FONTS, FONT_SIZES } from '../../constants/typography';
import { useCart } from '../../context/CartContext';

// ─── Tab Config ───────────────────────────────────────────────────────────────
const TAB_CONFIG = [
  { name: 'Home',   Icon: Home,          label: 'Home'   },
  { name: 'Search', Icon: Search,        label: 'Search' },
  { name: 'Cart',   Icon: ShoppingBag,   label: 'Cart',  showBadge: true },
  { name: 'Orders', Icon: ClipboardList, label: 'Orders' },
  { name: 'Profile',Icon: User,          label: 'Me'     },
];

// ─── Custom Floating Tab Bar ───────────────────────────────────────────────────
export default function FloatingTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { totalItems } = useCart();

  const bottomPad = insets.bottom > 0 ? insets.bottom : 10;

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPad }]}>
      <View style={styles.container}>
        {TAB_CONFIG.map((tab, index) => {
          const isFocused = state.index === index;
          const { Icon, label, showBadge } = tab;
          const badgeCount = showBadge ? totalItems : 0;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: state.routes[index]?.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(state.routes[index]?.name);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tab}
              accessibilityRole="button"
              accessibilityLabel={label}
              accessibilityState={isFocused ? { selected: true } : {}}
            >
              {/* Active pill indicator */}
              {isFocused && <View style={styles.activePill} />}

              {/* Icon wrapper */}
              <View style={styles.iconWrap}>
                <Icon
                  size={22}
                  color={isFocused ? COLORS.brand.primary : COLORS.text.muted}
                  strokeWidth={isFocused ? 2.5 : 1.8}
                  fill={isFocused && (tab.name === 'Home' || tab.name === 'Profile') ? COLORS.brand.subtle : 'transparent'}
                />
                {/* Cart badge */}
                {badgeCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {badgeCount > 9 ? '9+' : badgeCount}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.bg.secondary,
    borderTopWidth: 1,
    borderTopColor: COLORS.ui.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  container: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    top: -10,
    width: 32,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.brand.primary,
  },
  iconWrap: {
    width: 36,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: COLORS.bg.secondary,
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: 8,
    color: '#FFF',
    lineHeight: 10,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    color: COLORS.text.muted,
    marginTop: 3,
  },
  labelActive: {
    color: COLORS.brand.primary,
    fontFamily: FONTS.semiBold,
  },
});
