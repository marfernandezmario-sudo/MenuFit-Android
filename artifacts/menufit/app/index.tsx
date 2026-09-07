import React from 'react';
import { Redirect } from 'expo-router';
import { useMenuFit } from '@/context/MenuFitContext';
import { LoadingState } from '@/components/MenuFitUI';

export default function Entry() {
  const { hydrated, preferences } = useMenuFit();
  if (!hydrated) return <LoadingState />;
  return <Redirect href={preferences.configured ? '/home' : '/setup'} />;
}