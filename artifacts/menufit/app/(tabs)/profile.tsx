import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { getGoalLabel, useMenuFit, ExclusionType } from '@/context/MenuFitContext';
import { Field, Pill, PrimaryButton, SectionTitle } from '@/components/MenuFitUI';

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { preferences, updatePreferences, generateMenu, addExclusion, removeExclusion, history, restoreHistory, deleteHistory } = useMenuFit();
  const [newFood, setNewFood] = useState('');
  const [exclusionType, setExclusionType] = useState<ExclusionType>('Quiero evitar');
  const saveFood = () => { if (newFood.trim()) { addExclusion(newFood, exclusionType); setNewFood(''); } };
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={[styles.content, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
    <View style={styles.profileHead}><View style={[styles.avatar, { backgroundColor: colors.primary }]}><Text style={styles.avatarText}>M</Text></View><View><Text style={[styles.eyebrow, { color: colors.primary }]}>MI PERFIL</Text><Text style={[styles.title, { color: colors.foreground }]}>Tu configuración</Text></View></View>
    <View style={[styles.summary, { backgroundColor: colors.card, borderColor: colors.border }]}><Text style={[styles.summaryTitle, { color: colors.foreground }]}>{getGoalLabel(preferences.goal)}</Text><Text style={[styles.summaryText, { color: colors.mutedForeground }]}>{preferences.people} {preferences.people === 1 ? 'persona' : 'personas'} · {preferences.days} días · {preferences.supermarket}</Text></View>
    <SectionTitle eyebrow="PREFERENCIAS" title="Planificación" />
    <Text style={[styles.label, { color: colors.mutedForeground }]}>Objetivo</Text><View style={styles.pills}>{(['balanced', 'protein', 'weight-loss', 'muscle'] as const).map((goal) => <Pill key={goal} label={getGoalLabel(goal)} selected={preferences.goal === goal} onPress={() => updatePreferences({ goal })} />)}</View>
    <Text style={[styles.label, { color: colors.mutedForeground }]}>Duración del plan</Text><View style={styles.pills}>{[1, 7, 14, 30].map((days) => <Pill key={days} label={`${days} ${days === 1 ? 'día' : 'días'}`} selected={preferences.days === days} onPress={() => generateMenu(days)} />)}</View>
    <Text style={[styles.label, { color: colors.mutedForeground }]}>Tiempo disponible</Text><View style={styles.pills}>{['10-20 minutos', '20-30 minutos', 'Más de 45 minutos'].map((time) => <Pill key={time} label={time} selected={preferences.cookTime === time} onPress={() => updatePreferences({ cookTime: time })} />)}</View>
    <Text style={[styles.label, { color: colors.mutedForeground }]}>Supermercado</Text><View style={styles.pills}>{['Mercadona', 'Carrefour', 'Lidl'].map((store) => <Pill key={store} label={store} selected={preferences.supermarket === store} onPress={() => updatePreferences({ supermarket: store })} />)}</View>
    <SectionTitle eyebrow="ALIMENTOS" title="Lo que prefieres" />
    <Field label="Alimentos favoritos (separados por comas)" value={preferences.favorites.join(', ')} onChangeText={(value) => updatePreferences({ favorites: value.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean) })} placeholder="pollo, aguacate" />
    <Field label="Lo que ya tienes en casa" value={preferences.pantry.join(', ')} onChangeText={(value) => updatePreferences({ pantry: value.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean) })} placeholder="arroz, huevos" multiline />
    <SectionTitle eyebrow="EXCLUSIONES" title="Alimentos que no quiero" />
    <View style={styles.exclusionTypes}>{(['Quiero evitar', 'No me gusta', 'Alergia / intolerancia'] as ExclusionType[]).map((type) => <Pill key={type} label={type} selected={exclusionType === type} onPress={() => setExclusionType(type)} />)}</View>
    <View style={styles.addRow}><Field label="" value={newFood} onChangeText={setNewFood} placeholder="Ej. marisco" /><PrimaryButton label="Añadir" onPress={saveFood} compact icon="plus" /></View>
    {(['allergies', 'excluded', 'disliked'] as const).map((key) => preferences[key].length ? <View key={key} style={styles.tagGroup}><Text style={[styles.tagTitle, { color: colors.mutedForeground }]}>{key === 'allergies' ? 'Alergias / intolerancias' : key === 'excluded' ? 'Quiero evitar' : 'No me gusta'}</Text><View style={styles.tags}>{preferences[key].map((value) => <Pressable key={value} onPress={() => removeExclusion(value, key === 'allergies' ? 'Alergia / intolerancia' : key === 'excluded' ? 'Quiero evitar' : 'No me gusta')} style={[styles.tag, { backgroundColor: key === 'allergies' ? '#FBE4E0' : colors.muted }]}><Text style={[styles.tagText, { color: key === 'allergies' ? colors.destructive : colors.foreground }]}>{value}</Text><Feather name="x" size={13} color={key === 'allergies' ? colors.destructive : colors.mutedForeground} /></Pressable>)}</View></View> : null)}
    <SectionTitle eyebrow="HISTORIAL" title="Menús anteriores" />
    {history.length ? history.slice(0, 4).map((item) => <View key={item.id} style={[styles.historyRow, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={styles.historyIcon}><Feather name="archive" size={16} color={colors.primary} /></View><View style={styles.historyCopy}><Text style={[styles.historyLabel, { color: colors.foreground }]}>{item.label}</Text><Text style={[styles.historyDate, { color: colors.mutedForeground }]}>{new Date(item.createdAt).toLocaleDateString('es-ES')}</Text></View><Pressable onPress={() => restoreHistory(item.id)}><Feather name="rotate-ccw" size={17} color={colors.primary} /></Pressable><Pressable onPress={() => Alert.alert('Eliminar menú', '¿Quieres eliminar este menú del historial?', [{ text: 'Cancelar', style: 'cancel' }, { text: 'Eliminar', style: 'destructive', onPress: () => deleteHistory(item.id) }])} style={{ marginLeft: 14 }}><Feather name="trash-2" size={17} color={colors.mutedForeground} /></Pressable></View>) : <Text style={[styles.noHistory, { color: colors.mutedForeground }]}>Tus menús generados aparecerán aquí.</Text>}
    <SectionTitle eyebrow="APARIENCIA" title="Tema" />
    <View style={styles.themeRow}><Pill label="Claro" selected={!preferences.darkMode} onPress={() => updatePreferences({ darkMode: false })} /><Pill label="Oscuro" selected={preferences.darkMode} onPress={() => updatePreferences({ darkMode: true })} /></View>
    <View style={[styles.healthNote, { backgroundColor: colors.secondary }]}><Feather name="shield" size={17} color={colors.secondaryForeground} /><Text style={[styles.healthText, { color: colors.secondaryForeground }]}>Las alergias se tratan como restricciones estrictas. MenúFit ofrece orientación general, no sustituye a un profesional sanitario.</Text></View>
  </ScrollView>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20 },
  profileHead: { flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 23 },
  avatar: { width: 50, height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  eyebrow: { fontSize: 11, fontWeight: '800', letterSpacing: 1.4, marginBottom: 5 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.8 },
  summary: { padding: 16, borderRadius: 18, borderWidth: 1, marginBottom: 28 },
  summaryTitle: { fontSize: 16, fontWeight: '800' },
  summaryText: { fontSize: 12, marginTop: 5 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 10 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 19 },
  exclusionTypes: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  addRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  tagGroup: { marginBottom: 14 },
  tagTitle: { fontSize: 11, fontWeight: '700', marginBottom: 7 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  tag: { flexDirection: 'row', gap: 7, alignItems: 'center', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 11 },
  tagText: { fontSize: 12, fontWeight: '600' },
  historyRow: { borderWidth: 1, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  historyIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FBE4E0' },
  historyCopy: { flex: 1, marginLeft: 10 },
  historyLabel: { fontSize: 13, fontWeight: '700' },
  historyDate: { fontSize: 11, marginTop: 3 },
  noHistory: { fontSize: 13, marginBottom: 20 },
  themeRow: { flexDirection: 'row', marginBottom: 22 },
  healthNote: { borderRadius: 17, padding: 15, flexDirection: 'row', gap: 10, marginTop: 13 },
  healthText: { flex: 1, fontSize: 11, lineHeight: 16 },
});