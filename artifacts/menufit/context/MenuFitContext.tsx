import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ImageSourcePropType } from 'react-native';

export type Goal = 'balanced' | 'protein' | 'weight-loss' | 'maintenance' | 'muscle' | 'custom';
export type MealType = 'Desayuno' | 'Comida' | 'Merienda' | 'Cena';
export type Difficulty = 'Fácil' | 'Media' | 'Avanzada';
export type ExclusionType = 'No me gusta' | 'Quiero evitar' | 'Alergia / intolerancia';

export type Ingredient = {
  name: string;
  amount: number;
  unit: string;
  category: string;
};

export type Recipe = {
  id: string;
  name: string;
  mealType: MealType;
  time: number;
  prepTime: number;
  cookTime: number;
  difficulty: Difficulty;
  image: ImageSourcePropType;
  ingredients: Ingredient[];
  steps: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  tags: string[];
  description: string;
};

export type Preferences = {
  people: number;
  days: number;
  mealsPerDay: number;
  goal: Goal;
  cookTime: string;
  budget: string;
  supermarket: string;
  favorites: string[];
  disliked: string[];
  excluded: string[];
  allergies: string[];
  diet: string;
  pantry: string[];
  configured: boolean;
  darkMode: boolean;
};

export type MenuSlot = {
  id: string;
  day: string;
  dateLabel: string;
  mealType: MealType;
  recipeId: string;
};

export type ShoppingItem = Ingredient & {
  id: string;
  checked: boolean;
};

export type MenuHistory = {
  id: string;
  createdAt: string;
  label: string;
  slots: MenuSlot[];
};

const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
export const mealTypes: MealType[] = ['Desayuno', 'Comida', 'Merienda', 'Cena'];

export const defaultPreferences: Preferences = {
  people: 2,
  days: 5,
  mealsPerDay: 4,
  goal: 'balanced',
  cookTime: '20-30 minutos',
  budget: 'Medio',
  supermarket: 'Mercadona',
  favorites: ['pollo', 'avena', 'aguacate'],
  disliked: [],
  excluded: [],
  allergies: [],
  diet: 'Sin restricciones',
  pantry: ['aceite de oliva', 'sal', 'pimienta'],
  configured: false,
  darkMode: false,
};

const imageAssets = {
  quinoa: require('../assets/images/quinoa-bowl.jpg'),
  chicken: require('../assets/images/chicken-plate.jpg'),
  oats: require('../assets/images/overnight-oats.jpg'),
};

export const recipes: Recipe[] = [
  {
    id: 'oats-berries',
    name: 'Avena nocturna con frutos rojos',
    mealType: 'Desayuno',
    time: 8,
    prepTime: 8,
    cookTime: 0,
    difficulty: 'Fácil',
    image: imageAssets.oats,
    ingredients: [
      { name: 'avena', amount: 60, unit: 'g', category: 'Cereales' },
      { name: 'yogur natural', amount: 150, unit: 'g', category: 'Lácteos' },
      { name: 'frutos rojos', amount: 80, unit: 'g', category: 'Frutas' },
      { name: 'almendras', amount: 15, unit: 'g', category: 'Otros' },
    ],
    steps: ['Mezcla la avena con el yogur en un tarro.', 'Añade los frutos rojos y las almendras.', 'Tapa y deja reposar en la nevera durante la noche.', 'Sirve frío y remueve antes de comer.'],
    calories: 380,
    protein: 19,
    carbs: 48,
    fats: 13,
    tags: ['rápido', 'sin cocinar', 'vegetariano'],
    description: 'Un desayuno cremoso, rico en fibra y listo desde la noche anterior.',
  },
  {
    id: 'quinoa-bowl',
    name: 'Bowl mediterráneo de quinoa',
    mealType: 'Comida',
    time: 25,
    prepTime: 10,
    cookTime: 15,
    difficulty: 'Fácil',
    image: imageAssets.quinoa,
    ingredients: [
      { name: 'quinoa', amount: 70, unit: 'g', category: 'Cereales' },
      { name: 'garbanzos cocidos', amount: 100, unit: 'g', category: 'Legumbres' },
      { name: 'aguacate', amount: 60, unit: 'g', category: 'Frutas' },
      { name: 'tomate cherry', amount: 100, unit: 'g', category: 'Verduras' },
      { name: 'espinacas', amount: 50, unit: 'g', category: 'Verduras' },
    ],
    steps: ['Enjuaga la quinoa y cuécela con el doble de agua durante 15 minutos.', 'Lava y corta el tomate, el aguacate y las espinacas.', 'Escurre los garbanzos y mézclalos con las verduras.', 'Añade la quinoa templada, aliña y sirve.'],
    calories: 520,
    protein: 20,
    carbs: 67,
    fats: 19,
    tags: ['vegetariano', 'fibra', 'batch cooking'],
    description: 'Un plato completo con proteína vegetal y verduras frescas.',
  },
  {
    id: 'lemon-chicken',
    name: 'Pollo al limón con boniato',
    mealType: 'Cena',
    time: 30,
    prepTime: 10,
    cookTime: 20,
    difficulty: 'Fácil',
    image: imageAssets.chicken,
    ingredients: [
      { name: 'pechuga de pollo', amount: 160, unit: 'g', category: 'Carne' },
      { name: 'boniato', amount: 180, unit: 'g', category: 'Verduras' },
      { name: 'judías verdes', amount: 120, unit: 'g', category: 'Verduras' },
      { name: 'limón', amount: 0.5, unit: 'ud', category: 'Frutas' },
    ],
    steps: ['Corta el boniato en dados pequeños y cuécelo 12 minutos.', 'Sazona el pollo y dóralo en una sartén durante 5 minutos por lado.', 'Añade el zumo de limón y cocina 2 minutos más.', 'Cuece las judías verdes y sirve todo junto.'],
    calories: 490,
    protein: 43,
    carbs: 43,
    fats: 14,
    tags: ['alto en proteína', 'sin gluten', 'favorito'],
    description: 'Una cena sencilla y saciante con proteína magra.',
  },
  {
    id: 'turkey-wrap',
    name: 'Wrap integral de pavo y hummus',
    mealType: 'Comida',
    time: 12,
    prepTime: 12,
    cookTime: 0,
    difficulty: 'Fácil',
    image: imageAssets.quinoa,
    ingredients: [
      { name: 'tortilla integral', amount: 1, unit: 'ud', category: 'Cereales' },
      { name: 'pavo loncheado', amount: 100, unit: 'g', category: 'Carne' },
      { name: 'hummus', amount: 40, unit: 'g', category: 'Legumbres' },
      { name: 'lechuga', amount: 40, unit: 'g', category: 'Verduras' },
      { name: 'tomate', amount: 70, unit: 'g', category: 'Verduras' },
    ],
    steps: ['Extiende el hummus sobre la tortilla.', 'Coloca el pavo, la lechuga y el tomate.', 'Enrolla presionando los laterales hacia dentro.', 'Corta por la mitad y sirve.'],
    calories: 410,
    protein: 29,
    carbs: 41,
    fats: 14,
    tags: ['rápido', 'alto en proteína'],
    description: 'Un almuerzo fresco para días con poco tiempo.',
  },
  {
    id: 'greek-yogurt',
    name: 'Yogur griego con manzana y nueces',
    mealType: 'Merienda',
    time: 5,
    prepTime: 5,
    cookTime: 0,
    difficulty: 'Fácil',
    image: imageAssets.oats,
    ingredients: [
      { name: 'yogur griego', amount: 170, unit: 'g', category: 'Lácteos' },
      { name: 'manzana', amount: 1, unit: 'ud', category: 'Frutas' },
      { name: 'nueces', amount: 15, unit: 'g', category: 'Otros' },
      { name: 'canela', amount: 1, unit: 'pizca', category: 'Otros' },
    ],
    steps: ['Lava y corta la manzana en dados.', 'Sirve el yogur en un cuenco.', 'Añade la manzana, las nueces y la canela.', 'Mezcla justo antes de comer.'],
    calories: 290,
    protein: 18,
    carbs: 28,
    fats: 11,
    tags: ['rápido', 'sin cocinar'],
    description: 'Una merienda sencilla con proteína y textura crujiente.',
  },
  {
    id: 'lentil-salad',
    name: 'Ensalada templada de lentejas',
    mealType: 'Comida',
    time: 20,
    prepTime: 8,
    cookTime: 12,
    difficulty: 'Fácil',
    image: imageAssets.quinoa,
    ingredients: [
      { name: 'lentejas cocidas', amount: 160, unit: 'g', category: 'Legumbres' },
      { name: 'pimiento rojo', amount: 80, unit: 'g', category: 'Verduras' },
      { name: 'calabacín', amount: 100, unit: 'g', category: 'Verduras' },
      { name: 'queso feta', amount: 35, unit: 'g', category: 'Lácteos' },
    ],
    steps: ['Corta el pimiento y el calabacín.', 'Saltea las verduras durante 8 minutos.', 'Incorpora las lentejas escurridas y calienta 4 minutos.', 'Termina con queso feta desmenuzado.'],
    calories: 440,
    protein: 25,
    carbs: 51,
    fats: 14,
    tags: ['vegetariano', 'fibra', 'batch cooking'],
    description: 'Legumbres y verduras en un plato que aguanta perfecto para llevar.',
  },
  {
    id: 'salmon-rice',
    name: 'Salmón con arroz y brócoli',
    mealType: 'Cena',
    time: 28,
    prepTime: 8,
    cookTime: 20,
    difficulty: 'Media',
    image: imageAssets.chicken,
    ingredients: [
      { name: 'salmón', amount: 150, unit: 'g', category: 'Pescado' },
      { name: 'arroz integral', amount: 65, unit: 'g', category: 'Cereales' },
      { name: 'brócoli', amount: 150, unit: 'g', category: 'Verduras' },
      { name: 'limón', amount: 0.5, unit: 'ud', category: 'Frutas' },
    ],
    steps: ['Cuece el arroz según el tiempo del envase.', 'Cocina el brócoli al vapor durante 8 minutos.', 'Cocina el salmón a la plancha 4 minutos por lado.', 'Sirve con limón por encima.'],
    calories: 560,
    protein: 38,
    carbs: 54,
    fats: 22,
    tags: ['omega 3', 'alto en proteína'],
    description: 'Una cena equilibrada con grasas saludables y verduras.',
  },
  {
    id: 'spinach-omelette',
    name: 'Tortilla de espinacas y queso',
    mealType: 'Cena',
    time: 15,
    prepTime: 5,
    cookTime: 10,
    difficulty: 'Fácil',
    image: imageAssets.quinoa,
    ingredients: [
      { name: 'huevos', amount: 2, unit: 'ud', category: 'Huevos' },
      { name: 'espinacas', amount: 70, unit: 'g', category: 'Verduras' },
      { name: 'queso fresco', amount: 40, unit: 'g', category: 'Lácteos' },
      { name: 'pan integral', amount: 1, unit: 'rebanada', category: 'Cereales' },
    ],
    steps: ['Saltea las espinacas hasta que reduzcan.', 'Bate los huevos y añade el queso fresco.', 'Vierte la mezcla y cuaja 3 minutos por cada lado.', 'Sirve con pan integral.'],
    calories: 370,
    protein: 26,
    carbs: 25,
    fats: 18,
    tags: ['vegetariano', 'rápido', 'alto en proteína'],
    description: 'Una opción rápida para aprovechar hojas verdes frescas.',
  },
  {
    id: 'banana-toast',
    name: 'Tostada de crema de cacahuete y plátano',
    mealType: 'Desayuno',
    time: 6,
    prepTime: 6,
    cookTime: 0,
    difficulty: 'Fácil',
    image: imageAssets.oats,
    ingredients: [
      { name: 'pan integral', amount: 2, unit: 'rebanadas', category: 'Cereales' },
      { name: 'crema de cacahuete', amount: 20, unit: 'g', category: 'Otros' },
      { name: 'plátano', amount: 1, unit: 'ud', category: 'Frutas' },
    ],
    steps: ['Tuesta el pan.', 'Extiende la crema de cacahuete.', 'Corta el plátano en rodajas y reparte por encima.', 'Sirve inmediatamente.'],
    calories: 360,
    protein: 12,
    carbs: 52,
    fats: 13,
    tags: ['rápido', 'vegetariano'],
    description: 'Dulce, energético y listo en menos de diez minutos.',
  },
];

const storageKey = '@menufit/state-v1';

type PersistedState = {
  preferences: Preferences;
  menu: MenuSlot[];
  shopping: ShoppingItem[];
  favoriteRecipes: string[];
  history: MenuHistory[];
};

type MenuFitContextValue = {
  hydrated: boolean;
  preferences: Preferences;
  menu: MenuSlot[];
  shopping: ShoppingItem[];
  favoriteRecipes: string[];
  history: MenuHistory[];
  completeSetup: (values: Partial<Preferences>) => void;
  updatePreferences: (values: Partial<Preferences>) => void;
  generateMenu: (days?: number) => void;
  regenerateDay: (day: string) => void;
  replaceMeal: (slotId: string, recipeId: string) => void;
  toggleRecipeFavorite: (recipeId: string) => void;
  toggleShoppingItem: (itemId: string) => void;
  clearPurchased: () => void;
  addExclusion: (value: string, type: ExclusionType) => void;
  removeExclusion: (value: string, type: ExclusionType) => void;
  restoreHistory: (historyId: string) => void;
  deleteHistory: (historyId: string) => void;
  getRecipe: (recipeId: string) => Recipe;
  allExclusions: string[];
};

const Context = createContext<MenuFitContextValue | null>(null);

const parseCsv = (value: string) => value.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean);
const goalLabels: Record<Goal, string> = {
  balanced: 'Alimentación equilibrada',
  protein: 'Alto en proteínas',
  'weight-loss': 'Pérdida de peso',
  maintenance: 'Mantenimiento',
  muscle: 'Ganancia de masa muscular',
  custom: 'Personalizado',
};

const recipeMatches = (recipe: Recipe, prefs: Preferences) => {
  const text = `${recipe.name} ${recipe.ingredients.map((item) => item.name).join(' ')}`.toLowerCase();
  const strict = [...prefs.allergies, ...prefs.excluded].map((item) => item.toLowerCase());
  const soft = prefs.disliked.map((item) => item.toLowerCase());
  if (strict.some((item) => item && text.includes(item))) return false;
  if (soft.some((item) => item && text.includes(item))) return false;
  if (prefs.diet === 'Vegetariana' && recipe.ingredients.some((item) => ['carne', 'pescado'].includes(item.category.toLowerCase()))) return false;
  const max = Number(prefs.cookTime.split('-')[1]?.replace(/\D/g, '')) || 60;
  if (recipe.time > max && prefs.cookTime !== 'Más de 45 minutos') return false;
  return true;
};

const createMenu = (prefs: Preferences, current: MenuSlot[] = []): MenuSlot[] => {
  const allowed = recipes.filter((recipe) => recipeMatches(recipe, prefs));
  const source = allowed.length > 0 ? allowed : recipes.filter((recipe) => !prefs.allergies.some((allergy) => recipe.name.toLowerCase().includes(allergy.toLowerCase())));
  const result: MenuSlot[] = [];
  const selectedDays = daysOfWeek.slice(0, prefs.days);
  const favorites = prefs.favorites.map((item) => item.toLowerCase());
  selectedDays.forEach((day, dayIndex) => {
    const date = new Date();
    date.setDate(date.getDate() + dayIndex);
    const dateLabel = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    const activeMeals = mealTypes.slice(0, prefs.mealsPerDay);
    activeMeals.forEach((mealType, mealIndex) => {
      const candidates = source.filter((recipe) => recipe.mealType === mealType);
      const pool = candidates.length ? candidates : source;
      const favored = pool.filter((recipe) => favorites.some((favorite) => recipe.name.toLowerCase().includes(favorite) || recipe.ingredients.some((item) => item.name.includes(favorite))));
      const mealPool = favored.length && (dayIndex + mealIndex) % 3 !== 1 ? favored : pool;
      const used = result.slice(-6).map((item) => item.recipeId);
      const unique = mealPool.filter((recipe) => !used.includes(recipe.id));
      const recipe = (unique.length ? unique : mealPool)[(dayIndex + mealIndex) % (unique.length || mealPool.length)] ?? source[0];
      result.push({ id: `${dayIndex}-${mealIndex}-${recipe.id}`, day, dateLabel, mealType, recipeId: recipe.id });
    });
  });
  return result;
};

const aggregateShopping = (menu: MenuSlot[], prefs: Preferences, previous: ShoppingItem[] = []) => {
  const map = new Map<string, ShoppingItem>();
  menu.forEach((slot) => {
    const recipe = recipes.find((item) => item.id === slot.recipeId);
    recipe?.ingredients.forEach((ingredient) => {
      const key = `${ingredient.name}-${ingredient.unit}`;
      const existing = map.get(key);
      map.set(key, {
        ...ingredient,
        id: key,
        amount: (existing?.amount ?? 0) + ingredient.amount * prefs.people,
        checked: previous.find((item) => item.id === key)?.checked ?? false,
      });
    });
  });
  prefs.pantry.forEach((pantryItem) => {
    const lower = pantryItem.toLowerCase();
    [...map.keys()].forEach((key) => {
      if (key.startsWith(lower)) map.delete(key);
    });
  });
  return [...map.values()].sort((a, b) => a.category.localeCompare(b.category));
};

export function MenuFitProvider({ children }: PropsWithChildren) {
  const [hydrated, setHydrated] = useState(false);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [menu, setMenu] = useState<MenuSlot[]>([]);
  const [shopping, setShopping] = useState<ShoppingItem[]>([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState<string[]>(['lemon-chicken', 'oats-berries']);
  const [history, setHistory] = useState<MenuHistory[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(storageKey).then((value) => {
      if (value) {
        const saved = JSON.parse(value) as PersistedState;
        setPreferences({ ...defaultPreferences, ...saved.preferences });
        setMenu(saved.menu ?? []);
        setShopping(saved.shopping ?? []);
        setFavoriteRecipes(saved.favoriteRecipes ?? []);
        setHistory(saved.history ?? []);
      }
      setHydrated(true);
    }).catch(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated) Appearance.setColorScheme(preferences.darkMode ? 'dark' : 'light');
  }, [hydrated, preferences.darkMode]);

  const persist = (next: PersistedState) => {
    AsyncStorage.setItem(storageKey, JSON.stringify(next)).catch(() => undefined);
  };

  const saveState = (nextPreferences: Preferences, nextMenu: MenuSlot[], nextShopping: ShoppingItem[], nextFavorites = favoriteRecipes, nextHistory = history) => {
    setPreferences(nextPreferences);
    setMenu(nextMenu);
    setShopping(nextShopping);
    setFavoriteRecipes(nextFavorites);
    setHistory(nextHistory);
    persist({ preferences: nextPreferences, menu: nextMenu, shopping: nextShopping, favoriteRecipes: nextFavorites, history: nextHistory });
  };

  const completeSetup = (values: Partial<Preferences>) => {
    const nextPreferences = { ...preferences, ...values, configured: true };
    const nextMenu = createMenu(nextPreferences);
    saveState(nextPreferences, nextMenu, aggregateShopping(nextMenu, nextPreferences), favoriteRecipes, history);
  };

  const updatePreferences = (values: Partial<Preferences>) => {
    const nextPreferences = { ...preferences, ...values };
    const nextShopping = aggregateShopping(menu, nextPreferences, shopping);
    saveState(nextPreferences, menu, nextShopping);
  };

  const generateMenu = (days = preferences.days) => {
    const nextPreferences = { ...preferences, days };
    const nextMenu = createMenu(nextPreferences);
    const entry: MenuHistory = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString(), label: `${days} días · ${goalLabels[nextPreferences.goal]}`, slots: nextMenu };
    const nextHistory = [entry, ...history].slice(0, 10);
    saveState(nextPreferences, nextMenu, aggregateShopping(nextMenu, nextPreferences), favoriteRecipes, nextHistory);
  };

  const regenerateDay = (day: string) => {
    const keep = menu.filter((slot) => slot.day !== day);
    const replacement = createMenu({ ...preferences, days: 7 }).filter((slot) => slot.day === day);
    const nextMenu = [...keep, ...replacement].sort((a, b) => daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day));
    saveState(preferences, nextMenu, aggregateShopping(nextMenu, preferences, shopping));
  };

  const replaceMeal = (slotId: string, recipeId: string) => {
    const nextMenu = menu.map((slot) => slot.id === slotId ? { ...slot, recipeId } : slot);
    saveState(preferences, nextMenu, aggregateShopping(nextMenu, preferences, shopping));
  };

  const toggleRecipeFavorite = (recipeId: string) => {
    const next = favoriteRecipes.includes(recipeId) ? favoriteRecipes.filter((id) => id !== recipeId) : [...favoriteRecipes, recipeId];
    saveState(preferences, menu, shopping, next, history);
  };

  const toggleShoppingItem = (itemId: string) => {
    const next = shopping.map((item) => item.id === itemId ? { ...item, checked: !item.checked } : item);
    saveState(preferences, menu, next);
  };

  const clearPurchased = () => saveState(preferences, menu, shopping.filter((item) => !item.checked));

  const addExclusion = (value: string, type: ExclusionType) => {
    const key = type === 'Alergia / intolerancia' ? 'allergies' : type === 'No me gusta' ? 'disliked' : 'excluded';
    const next = [...preferences[key], ...parseCsv(value)].filter((item, index, array) => array.indexOf(item) === index);
    updatePreferences({ [key]: next });
  };

  const removeExclusion = (value: string, type: ExclusionType) => {
    const key = type === 'Alergia / intolerancia' ? 'allergies' : type === 'No me gusta' ? 'disliked' : 'excluded';
    updatePreferences({ [key]: preferences[key].filter((item) => item !== value) });
  };

  const restoreHistory = (historyId: string) => {
    const saved = history.find((item) => item.id === historyId);
    if (saved) saveState(preferences, saved.slots, aggregateShopping(saved.slots, preferences), favoriteRecipes, history);
  };

  const deleteHistory = (historyId: string) => saveState(preferences, menu, shopping, favoriteRecipes, history.filter((item) => item.id !== historyId));

  const value = useMemo<MenuFitContextValue>(() => ({
    hydrated,
    preferences,
    menu,
    shopping,
    favoriteRecipes,
    history,
    completeSetup,
    updatePreferences,
    generateMenu,
    regenerateDay,
    replaceMeal,
    toggleRecipeFavorite,
    toggleShoppingItem,
    clearPurchased,
    addExclusion,
    removeExclusion,
    restoreHistory,
    deleteHistory,
    getRecipe: (recipeId) => recipes.find((item) => item.id === recipeId) ?? recipes[0],
    allExclusions: [...preferences.allergies, ...preferences.excluded, ...preferences.disliked],
  }), [hydrated, preferences, menu, shopping, favoriteRecipes, history]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useMenuFit = () => {
  const value = useContext(Context);
  if (!value) throw new Error('useMenuFit debe usarse dentro de MenuFitProvider');
  return value;
};

export const getGoalLabel = (goal: Goal) => goalLabels[goal];
export const getDayNames = () => daysOfWeek;