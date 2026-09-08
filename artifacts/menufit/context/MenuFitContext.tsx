import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ImageSourcePropType, Platform } from 'react-native';

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
  shoppingDays: number;
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
  dateKey?: string;
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

const getDayLabel = (dayIndex: number) => {
  const weekday = daysOfWeek[dayIndex % daysOfWeek.length];
  return dayIndex < daysOfWeek.length ? weekday : `Día ${dayIndex + 1} · ${weekday}`;
};

const getDayOrder = (day: string) => {
  const numbered = day.match(/^Día (\d+)/);
  if (numbered) return Number(numbered[1]);
  const weekdayIndex = daysOfWeek.indexOf(day);
  return weekdayIndex >= 0 ? weekdayIndex + 1 : 999;
};

const getLocalDateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export const defaultPreferences: Preferences = {
  people: 2,
  days: 5,
  mealsPerDay: 4,
  shoppingDays: 5,
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
  {
    id: 'apple-cinnamon-oats',
    name: 'Porridge de manzana y canela',
    mealType: 'Desayuno',
    time: 10,
    prepTime: 3,
    cookTime: 7,
    difficulty: 'Fácil',
    image: imageAssets.oats,
    ingredients: [
      { name: 'avena', amount: 60, unit: 'g', category: 'Cereales' },
      { name: 'leche', amount: 200, unit: 'ml', category: 'Lácteos' },
      { name: 'manzana', amount: 1, unit: 'ud', category: 'Frutas' },
      { name: 'canela', amount: 1, unit: 'pizca', category: 'Otros' },
    ],
    steps: ['Calienta la leche con la avena a fuego medio.', 'Remueve durante 6-7 minutos hasta que espese.', 'Añade la manzana en dados y la canela.', 'Sirve caliente.'],
    calories: 360,
    protein: 14,
    carbs: 58,
    fats: 9,
    tags: ['rápido', 'vegetariano', 'fibra'],
    description: 'Un desayuno caliente y reconfortante con fruta y fibra.',
  },
  {
    id: 'avocado-egg-toast',
    name: 'Tostada de aguacate y huevo',
    mealType: 'Desayuno',
    time: 12,
    prepTime: 5,
    cookTime: 7,
    difficulty: 'Fácil',
    image: imageAssets.oats,
    ingredients: [
      { name: 'pan integral', amount: 2, unit: 'rebanadas', category: 'Cereales' },
      { name: 'aguacate', amount: 70, unit: 'g', category: 'Frutas' },
      { name: 'huevos', amount: 2, unit: 'ud', category: 'Huevos' },
      { name: 'tomate cherry', amount: 80, unit: 'g', category: 'Verduras' },
    ],
    steps: ['Tuesta el pan.', 'Cocina los huevos a la plancha o escalfados.', 'Aplasta el aguacate sobre el pan.', 'Termina con el huevo y el tomate.'],
    calories: 430,
    protein: 22,
    carbs: 35,
    fats: 23,
    tags: ['vegetariano', 'alto en proteína'],
    description: 'Una tostada completa para empezar el día con energía.',
  },
  {
    id: 'chickpea-curry',
    name: 'Curry rápido de garbanzos',
    mealType: 'Comida',
    time: 25,
    prepTime: 8,
    cookTime: 17,
    difficulty: 'Fácil',
    image: imageAssets.quinoa,
    ingredients: [
      { name: 'garbanzos cocidos', amount: 180, unit: 'g', category: 'Legumbres' },
      { name: 'leche de coco', amount: 120, unit: 'ml', category: 'Otros' },
      { name: 'tomate triturado', amount: 120, unit: 'g', category: 'Verduras' },
      { name: 'arroz basmati', amount: 60, unit: 'g', category: 'Cereales' },
      { name: 'espinacas', amount: 50, unit: 'g', category: 'Verduras' },
    ],
    steps: ['Cuece el arroz según el envase.', 'Calienta el tomate con las especias durante 5 minutos.', 'Añade los garbanzos y la leche de coco.', 'Cocina 10 minutos e incorpora las espinacas al final.'],
    calories: 540,
    protein: 20,
    carbs: 78,
    fats: 16,
    tags: ['vegetariano', 'batch cooking', 'fibra'],
    description: 'Un plato vegetal especiado que se conserva muy bien.',
  },
  {
    id: 'turkey-couscous',
    name: 'Cuscús de pavo y verduras',
    mealType: 'Comida',
    time: 22,
    prepTime: 10,
    cookTime: 12,
    difficulty: 'Fácil',
    image: imageAssets.chicken,
    ingredients: [
      { name: 'pavo', amount: 150, unit: 'g', category: 'Carne' },
      { name: 'cuscús', amount: 70, unit: 'g', category: 'Cereales' },
      { name: 'calabacín', amount: 100, unit: 'g', category: 'Verduras' },
      { name: 'zanahoria', amount: 80, unit: 'g', category: 'Verduras' },
      { name: 'pasas', amount: 15, unit: 'g', category: 'Frutas' },
    ],
    steps: ['Hidrata el cuscús con agua caliente.', 'Saltea el pavo en dados.', 'Añade el calabacín y la zanahoria y cocina 8 minutos.', 'Mezcla con el cuscús y las pasas.'],
    calories: 510,
    protein: 36,
    carbs: 62,
    fats: 12,
    tags: ['alto en proteína', 'batch cooking'],
    description: 'Un plato colorido, rápido y fácil de llevar.',
  },
  {
    id: 'tuna-potato-salad',
    name: 'Ensalada de patata y atún',
    mealType: 'Comida',
    time: 25,
    prepTime: 10,
    cookTime: 15,
    difficulty: 'Fácil',
    image: imageAssets.quinoa,
    ingredients: [
      { name: 'patata', amount: 220, unit: 'g', category: 'Verduras' },
      { name: 'atún al natural', amount: 100, unit: 'g', category: 'Pescado' },
      { name: 'huevo', amount: 1, unit: 'ud', category: 'Huevos' },
      { name: 'judías verdes', amount: 100, unit: 'g', category: 'Verduras' },
      { name: 'tomate', amount: 80, unit: 'g', category: 'Verduras' },
    ],
    steps: ['Cuece la patata y las judías verdes.', 'Cuece el huevo durante 9 minutos.', 'Corta el tomate y mezcla todos los ingredientes.', 'Aliña con aceite, vinagre y pimienta.'],
    calories: 460,
    protein: 31,
    carbs: 49,
    fats: 15,
    tags: ['alto en proteína', 'sin gluten'],
    description: 'Una ensalada fresca y saciante para preparar con antelación.',
  },
  {
    id: 'hummus-carrot-crackers',
    name: 'Hummus con crudités y pan crujiente',
    mealType: 'Merienda',
    time: 8,
    prepTime: 8,
    cookTime: 0,
    difficulty: 'Fácil',
    image: imageAssets.quinoa,
    ingredients: [
      { name: 'hummus', amount: 70, unit: 'g', category: 'Legumbres' },
      { name: 'zanahoria', amount: 100, unit: 'g', category: 'Verduras' },
      { name: 'pepino', amount: 100, unit: 'g', category: 'Verduras' },
      { name: 'pan integral', amount: 1, unit: 'rebanada', category: 'Cereales' },
    ],
    steps: ['Lava y corta la zanahoria y el pepino en bastones.', 'Tuesta el pan y córtalo en tiras.', 'Sirve el hummus en un bol.', 'Acompaña con las verduras y el pan.'],
    calories: 250,
    protein: 9,
    carbs: 34,
    fats: 9,
    tags: ['vegetariano', 'sin cocinar', 'rápido'],
    description: 'Un picoteo vegetal y crujiente para cualquier tarde.',
  },
  {
    id: 'cottage-peach',
    name: 'Cottage con melocotón y semillas',
    mealType: 'Merienda',
    time: 5,
    prepTime: 5,
    cookTime: 0,
    difficulty: 'Fácil',
    image: imageAssets.oats,
    ingredients: [
      { name: 'queso cottage', amount: 180, unit: 'g', category: 'Lácteos' },
      { name: 'melocotón', amount: 1, unit: 'ud', category: 'Frutas' },
      { name: 'semillas de chía', amount: 10, unit: 'g', category: 'Otros' },
    ],
    steps: ['Corta el melocotón.', 'Sirve el queso cottage en un bol.', 'Añade el melocotón y las semillas.', 'Remueve y disfruta frío.'],
    calories: 220,
    protein: 23,
    carbs: 22,
    fats: 6,
    tags: ['alto en proteína', 'sin cocinar'],
    description: 'Una merienda muy proteica lista en cinco minutos.',
  },
  {
    id: 'turkey-meatballs',
    name: 'Albóndigas de pavo con tomate',
    mealType: 'Cena',
    time: 30,
    prepTime: 12,
    cookTime: 18,
    difficulty: 'Media',
    image: imageAssets.chicken,
    ingredients: [
      { name: 'carne picada de pavo', amount: 170, unit: 'g', category: 'Carne' },
      { name: 'tomate triturado', amount: 180, unit: 'g', category: 'Verduras' },
      { name: 'calabacín', amount: 160, unit: 'g', category: 'Verduras' },
      { name: 'pan rallado', amount: 20, unit: 'g', category: 'Cereales' },
    ],
    steps: ['Mezcla el pavo con el pan rallado y forma bolas.', 'Dóralas en una sartén.', 'Añade el tomate y cocina 15 minutos.', 'Sirve con calabacín a la plancha.'],
    calories: 470,
    protein: 42,
    carbs: 27,
    fats: 20,
    tags: ['alto en proteína', 'batch cooking'],
    description: 'Una cena casera que también funciona muy bien para el día siguiente.',
  },
  {
    id: 'cod-ratatouille',
    name: 'Bacalao con ratatouille',
    mealType: 'Cena',
    time: 28,
    prepTime: 10,
    cookTime: 18,
    difficulty: 'Media',
    image: imageAssets.chicken,
    ingredients: [
      { name: 'bacalao', amount: 170, unit: 'g', category: 'Pescado' },
      { name: 'berenjena', amount: 100, unit: 'g', category: 'Verduras' },
      { name: 'calabacín', amount: 100, unit: 'g', category: 'Verduras' },
      { name: 'pimiento rojo', amount: 80, unit: 'g', category: 'Verduras' },
      { name: 'tomate triturado', amount: 120, unit: 'g', category: 'Verduras' },
    ],
    steps: ['Corta las verduras en dados.', 'Cocínalas con el tomate durante 15 minutos.', 'Cocina el bacalao a la plancha 4 minutos por lado.', 'Sirve el pescado sobre la ratatouille.'],
    calories: 390,
    protein: 39,
    carbs: 22,
    fats: 13,
    tags: ['sin gluten', 'alto en proteína'],
    description: 'Pescado blanco con una base abundante de verduras.',
  },
  {
    id: 'tofu-stir-fry',
    name: 'Salteado de tofu y verduras',
    mealType: 'Cena',
    time: 20,
    prepTime: 8,
    cookTime: 12,
    difficulty: 'Fácil',
    image: imageAssets.quinoa,
    ingredients: [
      { name: 'tofu', amount: 180, unit: 'g', category: 'Legumbres' },
      { name: 'brócoli', amount: 130, unit: 'g', category: 'Verduras' },
      { name: 'pimiento rojo', amount: 80, unit: 'g', category: 'Verduras' },
      { name: 'arroz basmati', amount: 55, unit: 'g', category: 'Cereales' },
      { name: 'salsa de soja', amount: 15, unit: 'ml', category: 'Otros' },
    ],
    steps: ['Cuece el arroz.', 'Dora el tofu en dados.', 'Saltea el brócoli y el pimiento.', 'Mezcla todo con la salsa de soja y sirve.'],
    calories: 480,
    protein: 27,
    carbs: 58,
    fats: 16,
    tags: ['vegetariano', 'rápido'],
    description: 'Un salteado vegetal sabroso con textura y proteína.',
  },
  {
    id: 'chicken-fajita-bowl',
    name: 'Bowl de pollo estilo fajita',
    mealType: 'Cena',
    time: 25,
    prepTime: 10,
    cookTime: 15,
    difficulty: 'Fácil',
    image: imageAssets.chicken,
    ingredients: [
      { name: 'pechuga de pollo', amount: 160, unit: 'g', category: 'Carne' },
      { name: 'arroz integral', amount: 60, unit: 'g', category: 'Cereales' },
      { name: 'pimiento rojo', amount: 100, unit: 'g', category: 'Verduras' },
      { name: 'maíz', amount: 60, unit: 'g', category: 'Verduras' },
      { name: 'aguacate', amount: 50, unit: 'g', category: 'Frutas' },
    ],
    steps: ['Cuece el arroz.', 'Corta y saltea el pollo con el pimiento.', 'Añade el maíz y las especias.', 'Monta el bowl con arroz, pollo y aguacate.'],
    calories: 560,
    protein: 43,
    carbs: 61,
    fats: 18,
    tags: ['alto en proteína', 'batch cooking'],
    description: 'Un bowl completo inspirado en los sabores de las fajitas.',
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
  setShoppingDays: (days: number) => void;
  generateMenu: (days?: number) => void;
  regenerateDay: (day: string) => void;
  replaceMeal: (slotId: string, recipeId: string) => void;
  toggleRecipeFavorite: (recipeId: string) => void;
  toggleShoppingItem: (itemId: string) => void;
  clearPurchased: () => void;
  addShoppingItem: (name: string, amount?: number, unit?: string) => void;
  addExclusion: (value: string, type: ExclusionType) => void;
  removeExclusion: (value: string, type: ExclusionType) => void;
  restoreHistory: (historyId: string) => void;
  deleteHistory: (historyId: string) => void;
  getRecipe: (recipeId: string) => Recipe;
  allExclusions: string[];
  getShoppingWindowDays: () => number;
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
  const categories = recipe.ingredients.map((item) => item.category.toLowerCase());
  if (prefs.diet === 'Vegetariana' && categories.some((category) => ['carne', 'pescado'].includes(category))) return false;
  if (prefs.diet === 'Sin pescado' && categories.includes('pescado')) return false;
  if (prefs.diet === 'Vegana' && categories.some((category) => ['carne', 'pescado', 'huevos', 'lácteos'].includes(category))) return false;
  const max = Number(prefs.cookTime.split('-')[1]?.replace(/\D/g, '')) || 60;
  if (recipe.time > max && prefs.cookTime !== 'Más de 45 minutos') return false;
  return true;
};

const createMenu = (prefs: Preferences, current: MenuSlot[] = []): MenuSlot[] => {
  const allowed = recipes.filter((recipe) => recipeMatches(recipe, prefs));
  const source = allowed.length > 0 ? allowed : recipes.filter((recipe) => !prefs.allergies.some((allergy) => recipe.name.toLowerCase().includes(allergy.toLowerCase())));
  const result: MenuSlot[] = [];
  const selectedDays = Array.from({ length: Math.min(30, Math.max(1, prefs.days)) }, (_, index) => getDayLabel(index));
  const favorites = prefs.favorites.map((item) => item.toLowerCase());
  selectedDays.forEach((day, dayIndex) => {
    const date = new Date();
    date.setDate(date.getDate() + dayIndex);
    const weekday = date.toLocaleDateString('es-ES', { weekday: 'short' });
    const dateLabel = `${weekday.charAt(0).toUpperCase()}${weekday.slice(1)} ${date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`;
    const activeMeals = mealTypes.slice(0, prefs.mealsPerDay);
    activeMeals.forEach((mealType, mealIndex) => {
      const candidates = source.filter((recipe) => recipe.mealType === mealType);
      const pool = candidates.length ? candidates : source;
      const favored = pool.filter((recipe) => favorites.some((favorite) => recipe.name.toLowerCase().includes(favorite) || recipe.ingredients.some((item) => item.name.includes(favorite))));
      const mealPool = favored.length && (dayIndex + mealIndex) % 3 !== 1 ? favored : pool;
      const used = result.slice(-6).map((item) => item.recipeId);
      const unique = mealPool.filter((recipe) => !used.includes(recipe.id));
      const recipe = (unique.length ? unique : mealPool)[(dayIndex + mealIndex) % (unique.length || mealPool.length)] ?? source[0];
      result.push({ id: `${dayIndex}-${mealIndex}-${recipe.id}`, day, dateLabel, dateKey: getLocalDateKey(date), mealType, recipeId: recipe.id });
    });
  });
  return result;
};

const getShoppingWindowDays = (prefs: Preferences) => Math.max(1, Math.min(30, prefs.shoppingDays));

const aggregateShopping = (menu: MenuSlot[], prefs: Preferences, previous: ShoppingItem[] = []) => {
  const map = new Map<string, ShoppingItem>();
  const windowDays = Math.min(prefs.days, getShoppingWindowDays(prefs));
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + windowDays - 1);
  const startKey = getLocalDateKey(startDate);
  const endKey = getLocalDateKey(endDate);
  menu.forEach((slot) => {
    const inDateWindow = slot.dateKey ? slot.dateKey >= startKey && slot.dateKey <= endKey : getDayOrder(slot.day) <= windowDays;
    if (!inDateWindow) return;
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
  previous.filter((item) => item.id.startsWith('custom-')).forEach((item) => map.set(item.id, item));
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
        const mergedPreferences = { ...defaultPreferences, ...saved.preferences };
        mergedPreferences.shoppingDays = Math.min(30, Math.max(1, Math.min(mergedPreferences.days, Number(mergedPreferences.shoppingDays) || defaultPreferences.shoppingDays)));
        setPreferences(mergedPreferences);
        setMenu(saved.menu ?? []);
        setShopping(saved.shopping ?? []);
        setFavoriteRecipes(saved.favoriteRecipes ?? []);
        setHistory(saved.history ?? []);
      }
      setHydrated(true);
    }).catch(() => setHydrated(true));
  }, []);

  useEffect(() => {
    if (hydrated && Platform.OS !== 'web') {
      Appearance.setColorScheme(preferences.darkMode ? 'dark' : 'light');
    }
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
    const needsNewMenu = ['diet', 'cookTime', 'allergies', 'excluded', 'disliked'].some((key) => key in values);
    const nextMenu = needsNewMenu ? createMenu(nextPreferences) : menu;
    const nextShopping = aggregateShopping(nextMenu, nextPreferences, shopping);
    saveState(nextPreferences, nextMenu, nextShopping);
  };

  const setShoppingDays = (days: number) => {
    const requestedDays = Math.min(30, Math.max(1, days));
    const nextDays = Math.max(preferences.days, requestedDays);
    const nextPreferences = { ...preferences, days: nextDays, shoppingDays: requestedDays };
    const nextMenu = nextDays > preferences.days ? createMenu(nextPreferences) : menu;
    saveState(nextPreferences, nextMenu, aggregateShopping(nextMenu, nextPreferences, shopping));
  };

  const generateMenu = (days = preferences.days) => {
    const nextPreferences = { ...preferences, days: Math.min(30, Math.max(1, days)) };
    const nextMenu = createMenu(nextPreferences);
    const entry: MenuHistory = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date().toISOString(), label: `${nextPreferences.days} días · ${goalLabels[nextPreferences.goal]}`, slots: nextMenu };
    const nextHistory = [entry, ...history].slice(0, 10);
    saveState(nextPreferences, nextMenu, aggregateShopping(nextMenu, nextPreferences), favoriteRecipes, nextHistory);
  };

  const regenerateDay = (day: string) => {
    const keep = menu.filter((slot) => slot.day !== day);
    const replacement = createMenu({ ...preferences, days: preferences.days }).filter((slot) => slot.day === day);
    const nextMenu = [...keep, ...replacement].sort((a, b) => getDayOrder(a.day) - getDayOrder(b.day));
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

  const addShoppingItem = (name: string, amount = 1, unit = 'ud') => {
    const cleanName = name.trim();
    if (!cleanName) return;
    const id = `custom-${cleanName.toLowerCase()}-${Date.now()}`;
    const next = [...shopping, { id, name: cleanName, amount: Math.max(0.1, amount), unit, category: 'Otros', checked: false }];
    saveState(preferences, menu, next);
  };

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
    setShoppingDays,
    generateMenu,
    regenerateDay,
    replaceMeal,
    toggleRecipeFavorite,
    toggleShoppingItem,
    clearPurchased,
    addShoppingItem,
    addExclusion,
    removeExclusion,
    restoreHistory,
    deleteHistory,
    getRecipe: (recipeId) => recipes.find((item) => item.id === recipeId) ?? recipes[0],
    allExclusions: [...preferences.allergies, ...preferences.excluded, ...preferences.disliked],
    getShoppingWindowDays: () => Math.min(preferences.days, getShoppingWindowDays(preferences)),
  }), [hydrated, preferences, menu, shopping, favoriteRecipes, history]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export const useMenuFit = () => {
  const value = useContext(Context);
  if (!value) throw new Error('useMenuFit debe usarse dentro de MenuFitProvider');
  return value;
};

export const getGoalLabel = (goal: Goal) => goalLabels[goal];
export const getDayNames = (count = 7) => Array.from({ length: Math.min(30, Math.max(1, count)) }, (_, index) => getDayLabel(index));