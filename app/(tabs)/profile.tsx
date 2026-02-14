import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#94a3b8" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Jogador</Text>
              <Text style={styles.profileEmail}>jogador@exemplo.com</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Jogos</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>205</Text>
              <Text style={styles.statLabel}>Horas</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>4.5</Text>
              <Text style={styles.statLabel}>Média</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={22} color="#94a3b8" />
            <Text style={styles.menuText}>Configurações</Text>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={22} color="#94a3b8" />
            <Text style={styles.menuText}>Notificações</Text>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={22} color="#94a3b8" />
            <Text style={styles.menuText}>Ajuda</Text>
            <Ionicons name="chevron-forward" size={20} color="#64748b" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="log-out-outline" size={22} color="#ef4444" />
            <Text style={[styles.menuText, { color: '#ef4444' }]}>Sair</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 30,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    color: '#94a3b8',
    fontSize: 16,
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    color: '#3b82f6',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 4,
  },
  menuSection: {
    marginBottom: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
  },
  menuText: {
    color: '#e2e8f0',
    fontSize: 16,
    flex: 1,
  },
});