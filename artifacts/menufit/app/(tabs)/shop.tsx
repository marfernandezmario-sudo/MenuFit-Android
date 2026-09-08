import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useMenuFit } from '@/context/MenuFitContext';
import { Field, Pill, PrimaryButton, SectionTitle } from '@/components/MenuFitUI';

export default function ShopScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { shopping, toggleShoppingItem, clearPurchased, addShoppingItem, setShoppingDays, getShoppingWindowDays, preferences } = useMenuFit();
  const [newItem, setNewItem] = useState('');
  const [newAmount, setNewAmount] = useState('1');
  const grouped = shopping.reduce<Record<string, typeof shopping>>((accumulator, item) => { (accumulator[item.category] ??= []).push(item); return accumulator; }, {});
  const purchased = shopping.filter((item) => item.checked).length;
  const windowDays = getShoppingWindowDays();
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + windowDays - 1);
  const formatDate = (date: Date) => date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  const addItem = () => {
    if (!newItem.trim()) return;
    addShoppingItem(newItem, Number(newAmount) || 1);
    setNewItem('');
    setNewAmount('1');
  };
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><View><Text style={[styles.eyebrow, { color: colors.primary }]}>ORGANIZADA</Text><Text style={[styles.title, { color: colors.foreground }]}>Lista de compra</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{shopping.length - purchased} productos pendientes</Text></View><View style={[styles.bag, { backgroundColor: colors.secondary }]}><Feather name="shopping-bag" size={21} color={colors.secondaryForeground} /></View></View>
    <View style={[styles.windowCard, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.windowTitle, { color: colors.foreground }]}>¿Para cuántos días haces esta compra?</Text><Text style={[styles.windowSubtitle, { color: colors.mutedForeground }]}>La app usa la fecha de hoy y calcula las cantidades para tus comidas.</Text><View style={styles.windowPills}>{[1, 3, 5, 7, 14, 30].map((days) => <Pill key={days} label={`${days} ${days === 1 ? 'día' : 'días'}`} selected={preferences.shoppingDays === days} onPress={() => setShoppingDays(days)} />)}</View><Text style={[styles.dateRange, { color: colors.primary }]}><Feather name="calendar" size={13} color={colors.primary} /> Hoy, {formatDate(today)} · hasta {formatDate(endDate)}</Text></View>
    <View style={[styles.progressCard, { backgroundColor: colors.navy }]}><View><Text style={styles.progressLabel}>PRÓXIMA COMPRA</Text><Text style={styles.progressTitle}>{windowDays} {windowDays === 1 ? 'día' : 'días'} de comidas</Text><Text style={styles.progressCopy}>{purchased} de {shopping.length} productos comprados</Text></View><View style={[styles.progressCircle, { borderColor: colors.accent }]}><Text style={[styles.progressPercent, { color: colors.accent }]}>{shopping.length ? Math.round((purchased / shopping.length) * 100) : 0}%</Text></View></View>
    <View style={[styles.mustHave, { backgroundColor: colors.secondary }]}><Feather name="alert-circle" size={17} color={colors.secondaryForeground} /><Text style={[styles.mustHaveText, { color: colors.secondaryForeground }]}>Estos son los productos imprescindibles para cubrir tus comidas hasta volver a comprar.</Text></View>
    {Object.keys(grouped).length === 0 ? <View style={[styles.empty, { backgroundColor: colors.secondary }]}><Feather name="check" size={22} color={colors.secondaryForeground} /><Text style={[styles.emptyText, { color: colors.secondaryForeground }]}>Tu lista aparecerá cuando generes un menú.</Text></View> : Object.entries(grouped).map(([category, items]) => <View key={category} style={styles.group}><SectionTitle title={category} /><View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>{items.map((item) => <Pressable key={item.id} onPress={() => toggleShoppingItem(item.id)} style={styles.item}><View style={[styles.checkbox, { borderColor: item.checked ? colors.success : colors.border, backgroundColor: item.checked ? colors.success : colors.background }]}>{item.checked ? <Feather name="check" size={13} color={colors.primaryForeground} /> : null}</View><Text style={[styles.itemName, { color: item.checked ? colors.mutedForeground : colors.foreground, textDecorationLine: item.checked ? 'line-through' : 'none' }]}>{item.name}</Text><Text style={[styles.amount, { color: colors.mutedForeground }]}>{Number.isInteger(item.amount) ? item.amount : item.amount.toFixed(1)} {item.unit}</Text></Pressable>)}</View></View>)}
    <View style={[styles.addCard, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.addTitle, { color: colors.foreground }]}>Añadir algo a la lista</Text><View style={styles.addRow}><View style={styles.addName}><Field label="" value={newItem} onChangeText={setNewItem} placeholder="Ej. café" /></View><View style={styles.addAmount}><Field label="" value={newAmount} onChangeText={setNewAmount} placeholder="1" /></View><PrimaryButton label="Añadir" onPress={addItem} compact icon="plus" /></View></View>
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
  progressCopy: { color: '#B8CEBF', fontSize: 11, marginTop: 5 },
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
  mustHave: { borderRadius: 16, padding: 14, flexDirection: 'row', gap: 9, alignItems: 'center', marginBottom: 22 },
  mustHaveText: { flex: 1, fontSize: 12, lineHeight: 17, fontWeight: '600' },
  addCard: { borderRadius: 17, borderWidth: 1, padding: 14, marginBottom: 16 },
  addTitle: { fontSize: 14, fontWeight: '800', marginBottom: 10 },
  addRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  addName: { flex: 1 },
  addAmount: { width: 60 },
  windowCard: { borderRadius: 18, borderWidth: 1, padding: 15, marginBottom: 18 },
  windowTitle: { fontSize: 15, fontWeight: '800' },
  windowSubtitle: { fontSize: 12, lineHeight: 17, marginTop: 5 },
  windowPills: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, marginBottom: 3 },
  dateRange: { fontSize: 12, fontWeight: '700', marginTop: 5 },
});