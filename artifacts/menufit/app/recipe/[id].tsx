import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useMenuFit, recipes } from '@/context/MenuFitContext';
import { IconButton, Pill, PrimaryButton } from '@/components/MenuFitUI';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getRecipe, favoriteRecipes, toggleRecipeFavorite, menu } = useMenuFit();
  const recipe = getRecipe(id);
  const favorite = favoriteRecipes.includes(recipe.id);
  const slot = menu.find((item) => item.recipeId === recipe.id);
  const alternatives = recipes.filter((item) => item.mealType === recipe.mealType && item.id !== recipe.id).slice(0, 3);
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={{ paddingBottom: insets.bottom + 35 }} showsVerticalScrollIndicator={false}>
    <View style={[styles.cover, { backgroundColor: colors.secondary }]}><Feather name={recipe.mealType === 'Desayuno' ? 'sunrise' : recipe.mealType === 'Cena' ? 'moon' : recipe.mealType === 'Merienda' ? 'coffee' : 'sun'} size={74} color={colors.secondaryForeground} /><View style={[styles.coverDot, { backgroundColor: colors.accent }]} /><View style={[styles.backButton, { top: insets.top + 10 }]}><IconButton icon="arrow-left" onPress={() => router.back()} label="Volver" /></View><View style={styles.coverActions}><IconButton icon="heart" onPress={() => toggleRecipeFavorite(recipe.id)} label="Favorito" active={favorite} /></View></View>
    <View style={styles.content}><Text style={[styles.category, { color: colors.primary }]}>{recipe.mealType.toUpperCase()}</Text><Text style={[styles.title, { color: colors.foreground }]}>{recipe.name}</Text><Text style={[styles.description, { color: colors.mutedForeground }]}>{recipe.description}</Text>
      <View style={styles.metaGrid}><View style={styles.meta}><Feather name="clock" size={17} color={colors.primary} /><Text style={[styles.metaValue, { color: colors.foreground }]}>{recipe.time} min</Text><Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>total</Text></View><View style={styles.meta}><Feather name="activity" size={17} color={colors.primary} /><Text style={[styles.metaValue, { color: colors.foreground }]}>{recipe.difficulty}</Text><Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>dificultad</Text></View><View style={styles.meta}><Feather name="users" size={17} color={colors.primary} /><Text style={[styles.metaValue, { color: colors.foreground }]}>{2}</Text><Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>personas</Text></View></View>
      <Text style={[styles.section, { color: colors.foreground }]}>Información nutricional</Text><View style={[styles.nutrition, { backgroundColor: colors.secondary }]}><View><Text style={[styles.nutrientValue, { color: colors.secondaryForeground }]}>{recipe.calories}</Text><Text style={[styles.nutrientLabel, { color: colors.secondaryForeground }]}>kcal aprox.</Text></View><View><Text style={[styles.nutrientValue, { color: colors.secondaryForeground }]}>{recipe.protein}g</Text><Text style={[styles.nutrientLabel, { color: colors.secondaryForeground }]}>proteína</Text></View><View><Text style={[styles.nutrientValue, { color: colors.secondaryForeground }]}>{recipe.carbs}g</Text><Text style={[styles.nutrientLabel, { color: colors.secondaryForeground }]}>carbos</Text></View><View><Text style={[styles.nutrientValue, { color: colors.secondaryForeground }]}>{recipe.fats}g</Text><Text style={[styles.nutrientLabel, { color: colors.secondaryForeground }]}>grasas</Text></View></View>
      <Text style={[styles.section, { color: colors.foreground }]}>Ingredientes</Text><View style={[styles.ingredientList, { backgroundColor: colors.card, borderColor: colors.border }]}>{recipe.ingredients.map((ingredient) => <View key={`${ingredient.name}-${ingredient.unit}`} style={styles.ingredient}><View style={[styles.bullet, { backgroundColor: colors.primary }]} /><Text style={[styles.ingredientName, { color: colors.foreground }]}>{ingredient.name}</Text><Text style={[styles.ingredientAmount, { color: colors.mutedForeground }]}>{ingredient.amount * (slot ? 1 : 1)} {ingredient.unit}</Text></View>)}</View>
      <Text style={[styles.section, { color: colors.foreground }]}>Preparación</Text>{recipe.steps.map((step, index) => <View key={step} style={styles.step}><View style={[styles.stepNumber, { backgroundColor: colors.primary }]}><Text style={styles.stepNumberText}>{index + 1}</Text></View><Text style={[styles.stepText, { color: colors.foreground }]}>{step}</Text></View>)}
      <Text style={[styles.section, { color: colors.foreground }]}>También te puede gustar</Text>{alternatives.map((item) => <View key={item.id} style={styles.alt}><View style={styles.altCopy}><Text style={[styles.altName, { color: colors.foreground }]}>{item.name}</Text><Text style={[styles.altMeta, { color: colors.mutedForeground }]}>{item.time} min · {item.protein}g proteína</Text></View><Pill label="Ver" onPress={() => router.replace(`/recipe/${item.id}`)} /></View>)}
      {slot ? <PrimaryButton label="Cambiar esta comida" onPress={() => router.push(`/replace/${slot.id}`)} icon="shuffle" secondary /> : null}
    </View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  cover: { width: '100%', height: 220, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  coverDot: { width: 17, height: 17, borderRadius: 9, position: 'absolute', right: '28%', top: '28%' },
  backButton: { position: 'absolute', left: 18 },
  coverActions: { position: 'absolute', top: 18, right: 18 },
  content: { paddingHorizontal: 20, paddingTop: 23 },
  category: { fontSize: 11, fontWeight: '800', letterSpacing: 1.3, marginBottom: 7 },
  title: { fontSize: 30, lineHeight: 35, fontWeight: '800', letterSpacing: -0.9 },
  description: { fontSize: 14, lineHeight: 21, marginTop: 10 },
  metaGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 23, marginBottom: 27 },
  meta: { alignItems: 'center', minWidth: 80 },
  metaValue: { fontSize: 13, fontWeight: '800', marginTop: 7 },
  metaLabel: { fontSize: 10, marginTop: 2 },
  section: { fontSize: 18, fontWeight: '800', marginBottom: 12, marginTop: 6 },
  nutrition: { borderRadius: 17, padding: 15, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 26 },
  nutrientValue: { fontSize: 16, fontWeight: '800' },
  nutrientLabel: { fontSize: 10, marginTop: 3 },
  ingredientList: { borderWidth: 1, borderRadius: 17, paddingHorizontal: 14, marginBottom: 26 },
  ingredient: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#EEF1EC' },
  bullet: { width: 7, height: 7, borderRadius: 4, marginRight: 10 },
  ingredientName: { flex: 1, fontSize: 13, fontWeight: '600' },
  ingredientAmount: { fontSize: 12, fontWeight: '600' },
  step: { flexDirection: 'row', gap: 12, marginBottom: 15 },
  stepNumber: { width: 27, height: 27, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  stepText: { flex: 1, fontSize: 14, lineHeight: 21, paddingTop: 2 },
  alt: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEF1EC' },
  altCopy: { flex: 1, marginRight: 10 },
  altName: { fontSize: 13, fontWeight: '700' },
  altMeta: { fontSize: 11, marginTop: 4 },
});