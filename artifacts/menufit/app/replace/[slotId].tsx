import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { recipes, useMenuFit } from '@/context/MenuFitContext';
import { RecipeCard, IconButton } from '@/components/MenuFitUI';

export default function ReplaceMealScreen() {
  const { slotId } = useLocalSearchParams<{ slotId: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { menu, getRecipe, replaceMeal } = useMenuFit();
  const slot = menu.find((item) => item.id === slotId);
  if (!slot) return null;
  const current = getRecipe(slot.recipeId);
  const alternatives = recipes.filter((recipe) => recipe.id !== current.id && recipe.mealType === current.mealType && recipe.time <= 45);
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 30 }]}><View style={styles.header}><IconButton icon="arrow-left" onPress={() => router.back()} label="Volver" /><View style={styles.headerCopy}><Text style={[styles.eyebrow, { color: colors.primary }]}>CAMBIAR COMIDA</Text><Text style={[styles.title, { color: colors.foreground }]}>{slot.mealType}</Text></View></View><View style={[styles.context, { backgroundColor: colors.secondary }]}><Feather name="info" size={16} color={colors.secondaryForeground} /><Text style={[styles.contextText, { color: colors.secondaryForeground }]}>Alternativas compatibles con tu tiempo y preferencias.</Text></View><Text style={[styles.currentLabel, { color: colors.mutedForeground }]}>Ahora tienes</Text><RecipeCard name={current.name} image={current.image} time={current.time} protein={current.protein} favorite onPress={() => undefined} onFavorite={() => undefined} />{alternatives.map((recipe) => <RecipeCard key={recipe.id} name={recipe.name} image={recipe.image} time={recipe.time} protein={recipe.protein} onPress={() => { replaceMeal(slot.id, recipe.id); router.back(); }} onFavorite={() => undefined} />)}</ScrollView>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 22 },
  headerCopy: { flex: 1 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.3, marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.8 },
  context: { borderRadius: 16, padding: 13, flexDirection: 'row', gap: 9, alignItems: 'center', marginBottom: 26 },
  contextText: { flex: 1, fontSize: 12, fontWeight: '600' },
  currentLabel: { fontSize: 12, fontWeight: '700', marginBottom: 10 },
});