import { configureStore } from '@reduxjs/toolkit';
import { eventReducer, homeReducer, sidebarReducer } from './eventSlice';

export const store = configureStore({
  reducer: {
    events: eventReducer,
    sidebarState:sidebarReducer,
    homeState:homeReducer,
  },
});
