import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function BottomNavBar({ active, onDiscover, onCommunity, onCart, onProfile }) {
  return (
    <View style={styles.bottomNavBar}>
      <TouchableOpacity style={[styles.navItem, active === 'discover' && styles.navItemActive]} onPress={onDiscover}>
        <Text style={active === 'discover' ? styles.navIconActive : styles.navIcon}>🏠</Text>
        <Text style={active === 'discover' ? styles.navLabelActive : styles.navLabel}>Discover</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navItem, active === 'community' && styles.navItemActive]} onPress={onCommunity}>
        <Text style={active === 'community' ? styles.navIconActive : styles.navIcon}>👥</Text>
        <Text style={active === 'community' ? styles.navLabelActive : styles.navLabel}>Community</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navItem, active === 'cart' && styles.navItemActive]} onPress={onCart}>
        <Text style={active === 'cart' ? styles.navIconActive : styles.navIcon}>🛒</Text>
        <Text style={active === 'cart' ? styles.navLabelActive : styles.navLabel}>My Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.navItem, active === 'profile' && styles.navItemActive]} onPress={onProfile}>
        <Text style={active === 'profile' ? styles.navIconActive : styles.navIcon}>👤</Text>
        <Text style={active === 'profile' ? styles.navLabelActive : styles.navLabel}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#faf7e6',
    borderTopWidth: 1,
    borderColor: '#ffb300',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 2,
    color: '#4b2e83',
  },
  navLabel: {
    fontSize: 12,
    color: '#4b2e83',
    fontWeight: 'bold',
  },
  navItemActive: {
    borderTopWidth: 2,
    borderColor: '#1976d2',
  },
  navIconActive: {
    fontSize: 22,
    marginBottom: 2,
    color: '#1976d2',
    fontWeight: 'bold',
  },
  navLabelActive: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: 'bold',
  },
});
