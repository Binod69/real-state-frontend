'use client';
import { NextUIProvider } from '@nextui-org/react';
const UiProvider = ({ children }) => {
  return <NextUIProvider>{children}</NextUIProvider>;
};

export default UiProvider;
