import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useMenuFit } from '@/context/MenuFitContext';
import { EmptyState, RecipeCard, SectionTitle } from '@/components/MenuFitUI';

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { favoriteRecipes, getRecipe, toggleRecipeFavorite } = useMenuFit();
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
    <Text style={[styles.eyebrow, { color: colors.primary }]}>TU COLECCIÓN</Text><Text style={[styles.title, { color: colors.foreground }]}>Favoritos</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Tus recetas e ingredientes para volver a lo que funciona.</Text>
    <SectionTitle title={`${favoriteRecipes.length} recetas guardadas`} />
    {favoriteRecipes.length ? favoriteRecipes.map((recipeId) => { const recipe = getRecipe(recipeId); return <RecipeCard key={recipe.id} name={recipe.name} image={recipe.image} time={recipe.time} protein={recipe.protein} mealType={recipe.mealType} favorite onPress={() => router.push(`/recipe/${recipe.id}`)} onFavorite={() => toggleRecipeFavorite(recipe.id)} />; }) : <EmptyState icon="heart" title="Aún no tienes favoritos" description="Guarda una receta desde tu menú para encontrarla aquí." onAction={() => router.push('/(tabs)/menu')} action="Explorar menú" />}
    <View style={[styles.ingredientCard, { backgroundColor: colors.secondary }]}><Text style={[styles.ingredientTitle, { color: colors.secondaryForeground }]}>Ingredientes que priorizamos</Text><Text style={[styles.ingredientBody, { color: colors.secondaryForeground }]}>Pollo · Aguacate · Avena</Text></View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginBottom: 6 },
  title: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { fontSize: 14, lineHeight: 20, marginTop: 8, marginBottom: 26 },
  ingredientCard: { borderRadius: 18, padding: 17, marginTop: 16 },
  ingredientTitle: { fontSize: 13, fontWeight: '800' },
  ingredientBody: { fontSize: 13, marginTop: 6 },
});