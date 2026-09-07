import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { getGoalLabel, useMenuFit } from '@/context/MenuFitContext';
import { IconButton, RecipeCard, SectionTitle, StatChip } from '@/components/MenuFitUI';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { preferences, menu, favoriteRecipes, getRecipe } = useMenuFit();
  const first = menu[0];
  const progress = menu.length ? `${menu.length} comidas planificadas` : 'Crea tu primer menú';
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><View><Text style={[styles.greeting, { color: colors.mutedForeground }]}>Buenos días</Text><Text style={[styles.title, { color: colors.foreground }]}>Tu plan, más fácil.</Text></View><IconButton icon="settings" onPress={() => router.push('/(tabs)/profile')} label="Abrir ajustes" /></View>
    <View style={[styles.hero, { backgroundColor: colors.navy }]}><View style={styles.heroCopy}><Text style={styles.heroKicker}>PLAN ACTUAL</Text><Text style={styles.heroTitle}>{getGoalLabel(preferences.goal)}</Text><Text style={styles.heroBody}>{progress}. Diseñado para {preferences.people} {preferences.people === 1 ? 'persona' : 'personas'}.</Text><Pressable onPress={() => router.push('/(tabs)/menu')} style={({ pressed }) => [styles.heroButton, { opacity: pressed ? 0.8 : 1 }]}><Text style={[styles.heroButtonText, { color: colors.navy }]}>Ver mi menú</Text><Feather name="arrow-up-right" size={16} color={colors.navy} /></Pressable></View><View style={styles.heroArt}><Feather name="coffee" size={66} color={colors.accent} /></View></View>
    <View style={styles.stats}><StatChip icon="calendar" label="Días" value={`${preferences.days}`} /><StatChip icon="clock" label="Tiempo" value={preferences.cookTime.split(' ')[0]} /><StatChip icon="shopping-bag" label="Compra" value={`${menu.length ? 'Lista' : 'Pendiente'}`} /></View>
    <SectionTitle eyebrow="Siguiente" title={first ? `Hoy · ${first.day}` : 'Tu primer menú'} action={first ? 'Abrir menú' : undefined} onAction={() => router.push('/(tabs)/menu')} />
    {first ? <Pressable onPress={() => router.push(`/recipe/${first.recipeId}`)} style={[styles.nextCard, { backgroundColor: colors.card, borderColor: colors.border }]}><Image source={getRecipe(first.recipeId).image} style={styles.nextImage} /><View style={styles.nextCopy}><Text style={[styles.nextMeal, { color: colors.primary }]}>{first.mealType}</Text><Text style={[styles.nextTitle, { color: colors.foreground }]}>{getRecipe(first.recipeId).name}</Text><View style={styles.nextMeta}><Feather name="clock" size={14} color={colors.mutedForeground} /><Text style={[styles.nextMetaText, { color: colors.mutedForeground }]}>{getRecipe(first.recipeId).time} min</Text><Feather name="arrow-right" size={16} color={colors.primary} /></View></View></Pressable> : <View style={[styles.emptyIntro, { backgroundColor: colors.secondary }]}><Feather name="star" size={22} color={colors.secondaryForeground} /><Text style={[styles.emptyIntroText, { color: colors.secondaryForeground }]}>Tu menú se genera automáticamente al completar la configuración.</Text></View>}
    <SectionTitle eyebrow="Para ti" title="Ideas que te encajan" action="Ver favoritos" onAction={() => router.push('/(tabs)/favorites')} />
    <View>{favoriteRecipes.slice(0, 2).map((recipeId) => { const recipe = getRecipe(recipeId); return <RecipeCard key={recipe.id} name={recipe.name} image={recipe.image} time={recipe.time} protein={recipe.protein} mealType={recipe.mealType} favorite onPress={() => router.push(`/recipe/${recipe.id}`)} onFavorite={() => undefined} />; })}</View>
    <View style={[styles.note, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="info" size={16} color={colors.primary} /><Text style={[styles.noteText, { color: colors.mutedForeground }]}>La información nutricional es orientativa y no sustituye el consejo de un profesional.</Text></View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  greeting: { fontSize: 13, fontWeight: '600', marginBottom: 5 },
  title: { fontSize: 27, fontWeight: '800', letterSpacing: -0.8 },
  hero: { borderRadius: 25, padding: 21, flexDirection: 'row', minHeight: 190, overflow: 'hidden', marginBottom: 15 },
  heroCopy: { flex: 1, zIndex: 2 },
  heroKicker: { color: '#B8CEBF', fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginBottom: 11 },
  heroTitle: { color: '#FFFFFF', fontSize: 23, fontWeight: '800', lineHeight: 28, maxWidth: 190 },
  heroBody: { color: '#B8CEBF', fontSize: 12, lineHeight: 18, marginTop: 8, maxWidth: 200 },
  heroButton: { backgroundColor: '#F4C95D', borderRadius: 13, alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 13, flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 15 },
  heroButtonText: { fontSize: 12, fontWeight: '800' },
  heroArt: { position: 'absolute', right: 4, bottom: 28, transform: [{ rotate: '-12deg' }] },
  stats: { flexDirection: 'row', gap: 8, marginBottom: 30 },
  nextCard: { borderRadius: 20, borderWidth: 1, flexDirection: 'row', overflow: 'hidden', marginBottom: 30 },
  nextImage: { width: 125, height: 132 },
  nextCopy: { flex: 1, padding: 15, justifyContent: 'center' },
  nextMeal: { fontSize: 10, fontWeight: '800', letterSpacing: 0.7, textTransform: 'uppercase' },
  nextTitle: { fontSize: 17, lineHeight: 22, fontWeight: '800', marginTop: 6 },
  nextMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  nextMetaText: { fontSize: 12, flex: 1 },
  emptyIntro: { borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 30 },
  emptyIntroText: { flex: 1, fontSize: 13, lineHeight: 19, fontWeight: '600' },
  note: { borderWidth: 1, borderRadius: 16, padding: 13, flexDirection: 'row', gap: 9, alignItems: 'flex-start', marginTop: 18 },
  noteText: { flex: 1, fontSize: 11, lineHeight: 16 },
});