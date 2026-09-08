import React, { PropsWithChildren } from 'react';
import { ActivityIndicator, ImageSourcePropType, Pressable, StyleProp, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

export function Screen({ children, scroll = true, style }: PropsWithChildren<{ scroll?: boolean; style?: StyleProp<ViewStyle> }>) {
  const colors = useColors();
  const base = <View style={[styles.screen, { backgroundColor: colors.background }, style]}>{children}</View>;
  return base;
}

export function SectionTitle({ eyebrow, title, action, onAction }: { eyebrow?: string; title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return <View style={styles.sectionTitle}>
    <View>
      {eyebrow ? <Text style={[styles.eyebrow, { color: colors.primary }]}>{eyebrow.toUpperCase()}</Text> : null}
      <Text style={[styles.h2, { color: colors.foreground }]}>{title}</Text>
    </View>
    {action && onAction ? <Pressable onPress={onAction}><Text style={[styles.actionText, { color: colors.primary }]}>{action}</Text></Pressable> : null}
  </View>;
}

export function PrimaryButton({ label, onPress, icon, secondary = false, compact = false, disabled = false }: { label: string; onPress: () => void; icon?: keyof typeof Feather.glyphMap; secondary?: boolean; compact?: boolean; disabled?: boolean }) {
  const colors = useColors();
  return <Pressable testID={`button-${label}`} onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.button, compact && styles.buttonCompact, { backgroundColor: secondary ? colors.secondary : colors.primary, opacity: disabled ? 0.5 : pressed ? 0.82 : 1 }]}>
    {icon ? <Feather name={icon} size={compact ? 16 : 18} color={secondary ? colors.secondaryForeground : colors.primaryForeground} /> : null}
    <Text style={[styles.buttonText, { color: secondary ? colors.secondaryForeground : colors.primaryForeground }]}>{label}</Text>
  </Pressable>;
}

export function IconButton({ icon, onPress, label, active = false }: { icon: keyof typeof Feather.glyphMap; onPress: () => void; label?: string; active?: boolean }) {
  const colors = useColors();
  return <Pressable accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.iconButton, { backgroundColor: active ? colors.primary : colors.muted, opacity: pressed ? 0.7 : 1 }]}>
    <Feather name={icon} size={19} color={active ? colors.primaryForeground : colors.foreground} />
  </Pressable>;
}

export function Pill({ label, selected = false, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  const colors = useColors();
  const content = <Text style={[styles.pillText, { color: selected ? colors.primaryForeground : colors.mutedForeground }]}>{label}</Text>;
  return onPress ? <Pressable onPress={onPress} style={[styles.pill, { backgroundColor: selected ? colors.primary : colors.muted }]}>{content}</Pressable> : <View style={[styles.pill, { backgroundColor: colors.muted }]}>{content}</View>;
}

export function RecipeCard({ name, image, time, protein, mealType, favorite, onPress, onFavorite }: { name: string; image: ImageSourcePropType; time: number; protein: number; mealType?: string; favorite?: boolean; onPress: () => void; onFavorite: () => void }) {
  const colors = useColors();
  const icon = mealType === 'Desayuno' ? 'sunrise' : mealType === 'Cena' ? 'moon' : mealType === 'Merienda' ? 'coffee' : 'sun';
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.recipeCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.94 : 1 }]}>
    <View style={[styles.recipeVisual, { backgroundColor: colors.secondary }]}><Feather name={icon} size={27} color={colors.secondaryForeground} /><View style={[styles.recipeVisualDot, { backgroundColor: colors.accent }]} /></View>
    <View style={styles.recipeInfo}>
      {mealType ? <Text style={[styles.cardEyebrow, { color: colors.primary }]}>{mealType}</Text> : null}
      <Text numberOfLines={2} style={[styles.cardTitle, { color: colors.foreground }]}>{name}</Text>
      <View style={styles.metaRow}><Feather name="clock" size={13} color={colors.mutedForeground} /><Text style={[styles.metaText, { color: colors.mutedForeground }]}>{time} min</Text><Text style={[styles.metaDot, { color: colors.border }]}>•</Text><Text style={[styles.metaText, { color: colors.mutedForeground }]}>{protein}g proteína</Text></View>
    </View>
    <Pressable accessibilityLabel={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'} onPress={onFavorite} style={styles.favoriteButton}><Feather name={favorite ? 'heart' : 'heart'} size={18} color={favorite ? colors.primary : colors.mutedForeground} fill={favorite ? colors.primary : 'transparent'} /></Pressable>
  </Pressable>;
}

export function StatChip({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  const colors = useColors();
  return <View style={[styles.statChip, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.statIcon, { backgroundColor: colors.secondary }]}><Feather name={icon} size={16} color={colors.secondaryForeground} /></View><View><Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text><Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text></View></View>;
}

export function Field({ label, value, onChangeText, placeholder, multiline = false }: { label: string; value: string; onChangeText: (value: string) => void; placeholder?: string; multiline?: boolean }) {
  const colors = useColors();
  return <View style={styles.field}><Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} multiline={multiline} style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }, multiline && styles.multiline]} /></View>;
}

export function EmptyState({ icon, title, description, action, onAction }: { icon: keyof typeof Feather.glyphMap; title: string; description: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return <View style={[styles.empty, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={[styles.emptyIcon, { backgroundColor: colors.secondary }]}><Feather name={icon} size={24} color={colors.secondaryForeground} /></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.emptyDescription, { color: colors.mutedForeground }]}>{description}</Text>{action && onAction ? <PrimaryButton label={action} onPress={onAction} compact /> : null}</View>;
}

export function LoadingState() {
  const colors = useColors();
  return <View style={styles.loading}><ActivityIndicator color={colors.primary} size="large" /><Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Preparando tu espacio...</Text></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20 },
  sectionTitle: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14 },
  eyebrow: { fontSize: 11, letterSpacing: 1.3, fontWeight: '700', marginBottom: 5 },
  h2: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
  actionText: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  button: { minHeight: 54, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingHorizontal: 20 },
  buttonCompact: { minHeight: 42, borderRadius: 13, paddingHorizontal: 15 },
  buttonText: { fontSize: 15, fontWeight: '700' },
  iconButton: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  pill: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 30, marginRight: 7 },
  pillText: { fontSize: 12, fontWeight: '600' },
  recipeCard: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', marginBottom: 12, flexDirection: 'row', minHeight: 102 },
  recipeVisual: { width: 88, minHeight: 102, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  recipeVisualDot: { width: 9, height: 9, borderRadius: 5, position: 'absolute', right: 13, top: 13 },
  recipeInfo: { flex: 1, padding: 13, paddingRight: 34, justifyContent: 'center' },
  cardEyebrow: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 5 },
  cardTitle: { fontSize: 15, lineHeight: 20, fontWeight: '700' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  metaText: { fontSize: 11, fontWeight: '500' },
  metaDot: { marginHorizontal: 1 },
  favoriteButton: { position: 'absolute', right: 12, top: 12, padding: 4 },
  statChip: { borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 9, padding: 11, flex: 1 },
  statIcon: { width: 31, height: 31, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 14, fontWeight: '700' },
  statLabel: { fontSize: 10, marginTop: 2 },
  field: { marginBottom: 17 },
  fieldLabel: { fontSize: 12, fontWeight: '700', marginBottom: 8 },
  input: { minHeight: 48, borderWidth: 1, borderRadius: 14, paddingHorizontal: 14, fontSize: 15 },
  multiline: { minHeight: 88, paddingTop: 13, textAlignVertical: 'top' as TextStyle['textAlignVertical'] },
  empty: { borderWidth: 1, borderRadius: 20, alignItems: 'center', padding: 26, marginTop: 12 },
  emptyIcon: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 13 },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginBottom: 6, textAlign: 'center' },
  emptyDescription: { fontSize: 13, lineHeight: 19, textAlign: 'center', maxWidth: 280, marginBottom: 16 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  loadingText: { fontSize: 14 },
});