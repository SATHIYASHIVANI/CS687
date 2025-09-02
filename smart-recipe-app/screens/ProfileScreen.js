import React from "react";
import BottomNavBar from "../components/BottomNavBar";
import { View, Text, Image, StyleSheet } from "react-native";
export default function ProfileScreen({ name = "User", dob, photoUri, onBack, onCart, onDiscover, onCommunity, onMealPlans, onProfile }) {
  const initial = name && name.length > 0 ? name[0].toUpperCase() : "U";
  return (
    <View style={styles.root}>
      {/* Top avatar and name */}
      <View style={styles.header}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitial}>{initial}</Text>
        </View>
        <Text style={styles.profileName}>{name}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}><Text style={styles.statValue}>0</Text><Text style={styles.statLabel}>ratings</Text></View>
          <View style={styles.statItem}><Text style={styles.statValue}>0</Text><Text style={styles.statLabel}>tips</Text></View>
          <View style={styles.statItem}><Text style={styles.statValue}>0</Text><Text style={styles.statLabel}>photos</Text></View>
        </View>
      </View>
      {/* Tabs */}
      <View style={styles.tabsRow}>
        <Text style={[styles.tab, styles.tabActive]}>Saved Recipes</Text>
        <Text style={styles.tab}>Cookbooks</Text>
        <Text style={styles.tab}>Activity</Text>
      </View>
      {/* Empty state illustration and message */}
      <View style={styles.emptyStateWrap}>
        <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/415/415733.png' }} style={styles.emptyOnion} />
        <Text style={styles.emptyText}>You haven’t liked any recipes yet. When you do, they’ll be here!</Text>
      </View>
      {/* Reusable BottomNavBar */}
      <BottomNavBar
        active="profile"
        onDiscover={onDiscover}
        onCommunity={onCommunity}
        onCart={onCart}
        onProfile={onProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#dfd935ff',
    paddingTop: 0,
    paddingBottom: 60,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 12,
    backgroundColor: '#8d6926ff',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#b2b217ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 38,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    marginTop: 2,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  statValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
    textAlign: 'center',
  },
  statLabel: {
    color: '#bdbdbd',
    fontSize: 13,
    textAlign: 'center',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#444',
    marginBottom: 0,
    backgroundColor: '#23232b',
  },
  tab: {
    color: '#bdbdbd',
    fontWeight: 'bold',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginHorizontal: 2,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  tabActive: {
    color: '#ff6f61',
    borderColor: '#ff6f61',
    borderBottomWidth: 2,
  },
  emptyStateWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#23232b',
  },
  emptyOnion: {
    width: 90,
    height: 90,
    marginBottom: 18,
    resizeMode: 'contain',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 18,
    marginBottom: 18,
  },
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