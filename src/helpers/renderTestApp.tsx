import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { RenderOptions, render } from '@testing-library/react';
import { RootState, AppStore } from '../redux/store';
import { MemoryRouter } from 'react-router-dom';
import AppRouter from '../components/AppRouter';
import { PreloadedState, configureStore } from '@reduxjs/toolkit';
import { animeAPI } from '../redux/API/animeAPI';
import animeReducer from '../redux/features/anime/anime';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  initialRoute?: string;
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

export const renderTestApp = (
  component: React.ReactElement,
  {
    initialRoute = '/',
    preloadedState = {},
    store = configureStore({
      reducer: {
        anime: animeReducer,
        [animeAPI.reducerPath]: animeAPI.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(animeAPI.middleware),
      preloadedState,
    }),
    ...RenderOptions
  }: ExtendedRenderOptions = {}
) => {
  function Wrapper({ children }: PropsWithChildren<unknown>): JSX.Element {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <AppRouter />
          {children}
        </MemoryRouter>
      </Provider>
    );
  }

  return { store, ...render(component, { wrapper: Wrapper, ...RenderOptions }) };
};
