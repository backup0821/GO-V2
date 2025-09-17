import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { toiletApi } from './api/toiletApi';
import searchReducer from './slices/searchSlice';
import mapReducer from './slices/mapSlice';
import accessibilityReducer from './slices/accessibilitySlice';

export const store = configureStore({
  reducer: {
    // API slices
    [toiletApi.reducerPath]: toiletApi.reducer,
    
    // Feature slices
    search: searchReducer,
    map: mapReducer,
    accessibility: accessibilityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [toiletApi.util.resetApiState.type],
      },
    }).concat(toiletApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// 設定監聽器
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
