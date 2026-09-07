import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useMenuFit } from '@/context/MenuFitContext';
import { PrimaryButton, SectionTitle } from '@/components/MenuFitUI';

export default function ShopScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { shopping, toggleShoppingItem, clearPurchased, preferences } = useMenuFit();
  const grouped = shopping.reduce<Record<string, typeof shopping>>((accumulator, item) => { (accumulator[item.category] ??= []).push(item); return accumulator; }, {});
  const purchased = shopping.filter((item) => item.checked).length;
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><View><Text style={[styles.eyebrow, { color: colors.primary }]}>ORGANIZADA</Text><Text style={[styles.title, { color: colors.foreground }]}>Lista de compra</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{shopping.length - purchased} productos pendientes</Text></View><View style={[styles.bag, { backgroundColor: colors.secondary }]}><Feather name="shopping-bag" size={21} color={colors.secondaryForeground} /></View></View>
    <View style={[styles.progressCard, { backgroundColor: colors.navy }]}><View><Text style={styles.progressLabel}>PROGRESO</Text><Text style={styles.progressTitle}>{purchased === shopping.length && shopping.length ? '¡Compra lista!' : `${purchased} de ${shopping.length} comprados`}</Text></View><View style={[styles.progressCircle, { borderColor: colors.accent }]}><Text style={[styles.progressPercent, { color: colors.accent }]}>{shopping.length ? Math.round((purchased / shopping.length) * 100) : 0}%</Text></View></View>
    {Object.keys(grouped).length === 0 ? <View style={[styles.empty, { backgroundColor: colors.secondary }]}><Feather name="check" size={22} color={colors.secondaryForeground} /><Text style={[styles.emptyText, { color: colors.secondaryForeground }]}>Tu lista aparecerá cuando generes un menú.</Text></View> : Object.entries(grouped).map(([category, items]) => <View key={category} style={styles.group}><SectionTitle title={category} /><View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>{items.map((item) => <Pressable key={item.id} onPress={() => toggleShoppingItem(item.id)} style={styles.item}><View style={[styles.checkbox, { borderColor: item.checked ? colors.success : colors.border, backgroundColor: item.checked ? colors.success : colors.background }]}>{item.checked ? <Feather name="check" size={13} color={colors.primaryForeground} /> : null}</View><Text style={[styles.itemName, { color: item.checked ? colors.mutedForeground : colors.foreground, textDecorationLine: item.checked ? 'line-through' : 'none' }]}>{item.name}</Text><Text style={[styles.amount, { color: colors.mutedForeground }]}>{Number.isInteger(item.amount) ? item.amount : item.amount.toFixed(1)} {item.unit}</Text></Pressable>)}</View></View>)}
    {purchased > 0 ? <PrimaryButton label="Limpiar comprados" icon="trash-2" onPress={clearPurchased} secondary /> : null}
    <View style={[styles.disclaimer, { borderColor: colors.border }]}><Feather name="info" size={15} color={colors.mutedForeground} /><Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>Las cantidades se calculan para {preferences.people} {preferences.people === 1 ? 'persona' : 'personas'} y pueden variar según el producto.</Text></View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginBottom: 5 },
  title: { fontSize: 29, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { fontSize: 13, marginTop: 4 },
  bag: { width: 44, height: 44, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  progressCard: { borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 },
  progressLabel: { color: '#B8CEBF', fontSize: 10, letterSpacing: 1.2, fontWeight: '800' },
  progressTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginTop: 7 },
  progressCircle: { width: 59, height: 59, borderWidth: 4, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  progressPercent: { fontSize: 14, fontWeight: '800' },
  group: { marginBottom: 19 },
  list: { borderRadius: 17, borderWidth: 1, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#EEF1EC', gap: 11 },
  checkbox: { width: 22, height: 22, borderWidth: 1.5, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  itemName: { flex: 1, fontSize: 14, fontWeight: '600' },
  amount: { fontSize: 12, fontWeight: '600' },
  empty: { borderRadius: 18, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 22 },
  emptyText: { flex: 1, fontSize: 13, fontWeight: '600' },
  disclaimer: { marginTop: 20, paddingTop: 15, borderTopWidth: 1, flexDirection: 'row', gap: 8 },
  disclaimerText: { flex: 1, fontSize: 11, lineHeight: 16 },
});