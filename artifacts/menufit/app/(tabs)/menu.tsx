import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { getDayNames, useMenuFit } from '@/context/MenuFitContext';
import { IconButton, PrimaryButton, SectionTitle } from '@/components/MenuFitUI';

export default function MenuScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { menu, getRecipe, preferences, regenerateDay, generateMenu } = useMenuFit();
  const dayNames = getDayNames(preferences.days);
  const visibleDays = useMemo(() => dayNames, [dayNames]);
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><View><Text style={[styles.eyebrow, { color: colors.primary }]}>PLANIFICACIÓN</Text><Text style={[styles.title, { color: colors.foreground }]}>Tu menú</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{preferences.days} {preferences.days === 1 ? 'día' : 'días'} · {preferences.people} {preferences.people === 1 ? 'persona' : 'personas'}</Text></View><IconButton icon="refresh-cw" onPress={() => generateMenu()} label="Regenerar menú completo" /></View>
    <View style={[styles.tip, { backgroundColor: colors.secondary }]}><Feather name="sliders" size={16} color={colors.secondaryForeground} /><Text style={[styles.tipText, { color: colors.secondaryForeground }]}>Puedes regenerar el plan completo, un día o una comida concreta con el botón de intercambio.</Text></View>
    {visibleDays.map((day) => { const slots = menu.filter((slot) => slot.day === day); return <View key={day} style={styles.dayBlock}><View style={styles.dayHeader}><View><Text style={[styles.dayName, { color: colors.foreground }]}>{day}</Text><Text style={[styles.dateText, { color: colors.mutedForeground }]}>{slots[0]?.dateLabel ?? 'Sin planificar'}</Text></View><Pressable onPress={() => regenerateDay(day)}><Text style={[styles.regenerate, { color: colors.primary }]}>Regenerar día</Text></Pressable></View>{slots.map((slot) => { const recipe = getRecipe(slot.recipeId); return <Pressable key={slot.id} onPress={() => router.push(`/recipe/${recipe.id}`)} style={[styles.mealRow, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.mealIcon, { backgroundColor: colors.secondary }]}><Feather name={slot.mealType === 'Desayuno' ? 'sunrise' : slot.mealType === 'Cena' ? 'moon' : slot.mealType === 'Merienda' ? 'coffee' : 'sun'} size={17} color={colors.secondaryForeground} /></View><View style={styles.mealInfo}><Text style={[styles.mealType, { color: colors.primary }]}>{slot.mealType}</Text><Text style={[styles.mealName, { color: colors.foreground }]}>{recipe.name}</Text><View style={styles.mealMeta}><Feather name="clock" size={12} color={colors.mutedForeground} /><Text style={[styles.mealMetaText, { color: colors.mutedForeground }]}>{recipe.time} min</Text><Text style={[styles.mealMetaText, { color: colors.mutedForeground }]}>· {recipe.protein}g proteína</Text></View></View><Pressable accessibilityLabel={`Cambiar ${slot.mealType}`} onPress={() => router.push(`/replace/${slot.id}`)} style={({ pressed }) => [styles.swapButton, { backgroundColor: colors.muted, opacity: pressed ? 0.7 : 1 }]}><Feather name="shuffle" size={16} color={colors.foreground} /></Pressable></Pressable>; })}</View>; })}
    <PrimaryButton label="Regenerar menú completo" icon="refresh-cw" onPress={() => generateMenu()} secondary />
  </ScrollView>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginBottom: 5 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { fontSize: 13, marginTop: 4 },
  tip: { flexDirection: 'row', gap: 9, alignItems: 'center', padding: 13, borderRadius: 15, marginBottom: 26 },
  tipText: { fontSize: 12, lineHeight: 17, fontWeight: '600', flex: 1 },
  dayBlock: { marginBottom: 23 },
  dayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  dayName: { fontSize: 19, fontWeight: '800' },
  dateText: { fontSize: 11, marginTop: 2 },
  regenerate: { fontSize: 11, fontWeight: '700' },
  mealRow: { borderWidth: 1, borderRadius: 17, flexDirection: 'row', alignItems: 'center', padding: 11, marginBottom: 8 },
  mealIcon: { width: 38, height: 38, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  mealInfo: { flex: 1, marginLeft: 11 },
  mealType: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  mealName: { fontSize: 14, fontWeight: '700', marginTop: 4 },
  mealMeta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  mealMetaText: { fontSize: 11 },
  swapButton: { width: 32, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginLeft: 7 },
});