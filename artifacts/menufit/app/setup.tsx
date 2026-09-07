import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useMenuFit, Goal } from '@/context/MenuFitContext';
import { Field, Pill, PrimaryButton } from '@/components/MenuFitUI';

const goalOptions: { label: string; value: Goal; icon: keyof typeof Feather.glyphMap; copy: string }[] = [
  { label: 'Equilibrado', value: 'balanced', icon: 'sun', copy: 'Variedad para sentirte bien' },
  { label: 'Alto en proteína', value: 'protein', icon: 'trending-up', copy: 'Más proteína en cada plato' },
  { label: 'Pérdida de peso', value: 'weight-loss', icon: 'target', copy: 'Ligero, saciante y sostenible' },
  { label: 'Masa muscular', value: 'muscle', icon: 'zap', copy: 'Energía para progresar' },
];

export default function SetupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completeSetup } = useMenuFit();
  const [step, setStep] = useState(0);
  const [people, setPeople] = useState('2');
  const [days, setDays] = useState('5');
  const [meals, setMeals] = useState('4');
  const [goal, setGoal] = useState<Goal>('balanced');
  const [cookTime, setCookTime] = useState('20-30 minutos');
  const [diet, setDiet] = useState('Sin restricciones');
  const [allergies, setAllergies] = useState('');
  const [favorites, setFavorites] = useState('pollo, aguacate, avena');
  const [pantry, setPantry] = useState('aceite de oliva, sal, pimienta');
  const steps = useMemo(() => ['Tu casa', 'Tu objetivo', 'Tus preferencias'], []);
  const finish = () => {
    completeSetup({ people: Math.max(1, Number(people) || 2), days: Math.min(7, Math.max(1, Number(days) || 5)), mealsPerDay: Math.min(4, Math.max(2, Number(meals) || 4)), goal, cookTime, diet, allergies: allergies.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean), favorites: favorites.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean), pantry: pantry.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean) });
    router.replace('/(tabs)');
  };
  return <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 12 }]}>
    <View style={styles.top}><View style={[styles.logo, { backgroundColor: colors.primary }]}><Feather name="heart" size={18} color={colors.primaryForeground} fill={colors.primaryForeground} /></View><Text style={[styles.brand, { color: colors.foreground }]}>MenuFit</Text><Text style={[styles.stepCount, { color: colors.mutedForeground }]}>{step + 1} de 3</Text></View>
    <View style={styles.progress}>{steps.map((label, index) => <View key={label} style={styles.progressItem}><View style={[styles.progressLine, { backgroundColor: index <= step ? colors.primary : colors.muted }]} /><Text style={[styles.progressLabel, { color: index <= step ? colors.primary : colors.mutedForeground }]}>{label}</Text></View>)}</View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {step === 0 ? <View><Text style={[styles.kicker, { color: colors.primary }]}>EMPECEMOS</Text><Text style={[styles.title, { color: colors.foreground }]}>Cuéntanos para quién cocinas.</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Crearemos un plan que encaje de verdad con tu semana.</Text><Field label="Personas en casa" value={people} onChangeText={setPeople} placeholder="2" /><Field label="Días a planificar (1–7)" value={days} onChangeText={setDays} placeholder="5" /><Text style={[styles.label, { color: colors.mutedForeground }]}>Comidas al día</Text><View style={styles.pills}>{['3', '4'].map((value) => <Pill key={value} label={`${value} comidas`} selected={meals === value} onPress={() => setMeals(value)} />)}</View></View> : null}
      {step === 1 ? <View><Text style={[styles.kicker, { color: colors.primary }]}>TU RITMO</Text><Text style={[styles.title, { color: colors.foreground }]}>¿Qué quieres conseguir?</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Lo usaremos para ordenar tus opciones, nunca para imponerte una dieta.</Text>{goalOptions.map((option) => <Pressable key={option.value} onPress={() => setGoal(option.value)} style={[styles.goalCard, { backgroundColor: goal === option.value ? colors.secondary : colors.card, borderColor: goal === option.value ? colors.primary : colors.border }]}><View style={[styles.goalIcon, { backgroundColor: goal === option.value ? colors.primary : colors.muted }]}><Feather name={option.icon} size={18} color={goal === option.value ? colors.primaryForeground : colors.foreground} /></View><View style={styles.goalCopy}><Text style={[styles.goalLabel, { color: colors.foreground }]}>{option.label}</Text><Text style={[styles.goalDescription, { color: colors.mutedForeground }]}>{option.copy}</Text></View>{goal === option.value ? <Feather name="check-circle" size={21} color={colors.primary} /> : null}</Pressable>)}</View> : null}
      {step === 2 ? <View><Text style={[styles.kicker, { color: colors.primary }]}>A TU MEDIDA</Text><Text style={[styles.title, { color: colors.foreground }]}>Una última vuelta.</Text><Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Puedes cambiarlo todo después desde tu perfil.</Text><Text style={[styles.label, { color: colors.mutedForeground }]}>Tiempo máximo para cocinar</Text><View style={styles.pills}>{['5-10 minutos', '10-20 minutos', '20-30 minutos', 'Más de 45 minutos'].map((value) => <Pill key={value} label={value} selected={cookTime === value} onPress={() => setCookTime(value)} />)}</View><Text style={[styles.label, { color: colors.mutedForeground }]}>Tipo de alimentación</Text><View style={styles.pills}>{['Sin restricciones', 'Vegetariana'].map((value) => <Pill key={value} label={value} selected={diet === value} onPress={() => setDiet(value)} />)}</View><Field label="Alergias o intolerancias" value={allergies} onChangeText={setAllergies} placeholder="Ej. frutos secos, gluten" /><Field label="Alimentos favoritos" value={favorites} onChangeText={setFavorites} placeholder="Ej. pollo, aguacate" /><Field label="Lo que ya tienes en casa" value={pantry} onChangeText={setPantry} placeholder="Ej. arroz, huevos" multiline /></View> : null}
    </ScrollView>
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 18), borderTopColor: colors.border, backgroundColor: colors.background }]}>{step > 0 ? <PrimaryButton label="Atrás" onPress={() => setStep((value) => value - 1)} secondary compact /> : <View />}{step < 2 ? <PrimaryButton label="Continuar" onPress={() => setStep((value) => value + 1)} icon="arrow-right" /> : <PrimaryButton label="Crear mi menú" onPress={finish} icon="star" />}</View>
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, gap: 9 },
  logo: { width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  brand: { fontSize: 20, fontWeight: '800', letterSpacing: -0.7 },
  stepCount: { marginLeft: 'auto', fontSize: 12, fontWeight: '600' },
  progress: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: 28, marginBottom: 5 },
  progressItem: { flex: 1 },
  progressLine: { height: 4, borderRadius: 3, marginBottom: 7 },
  progressLabel: { fontSize: 10, fontWeight: '600' },
  content: { padding: 20, paddingBottom: 120 },
  kicker: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginTop: 28, marginBottom: 8 },
  title: { fontSize: 31, lineHeight: 36, fontWeight: '800', letterSpacing: -1, maxWidth: 330 },
  subtitle: { fontSize: 15, lineHeight: 22, marginTop: 10, marginBottom: 30, maxWidth: 320 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 10, marginTop: 4 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 22 },
  goalCard: { borderWidth: 1, borderRadius: 18, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  goalIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  goalCopy: { flex: 1, marginLeft: 12 },
  goalLabel: { fontSize: 15, fontWeight: '700' },
  goalDescription: { fontSize: 12, marginTop: 4 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingHorizontal: 20, paddingTop: 15, borderTopWidth: 1 },
});