import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccessibilitySettings, UserPreferences } from '@/types';

interface AccessibilityState {
  // 無障礙設定
  settings: AccessibilitySettings;
  
  // 使用者偏好設定
  preferences: UserPreferences;
  
  // 當前字體大小倍率
  fontSize: number;
  
  // 高對比模式
  highContrast: boolean;
  
  // 鍵盤導航模式
  keyboardNavigation: boolean;
  
  // 螢幕閱讀器模式
  screenReader: boolean;
  
  // 動畫減少模式
  reducedMotion: boolean;
  
  // 色彩盲友善模式
  colorBlindFriendly: boolean;
  
  // 語音提示
  voiceAnnouncements: boolean;
}

const initialState: AccessibilityState = {
  settings: {
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: false,
  },
  preferences: {
    accessibility: {
      highContrast: false,
      largeText: false,
      screenReader: false,
      keyboardNavigation: false,
    },
    defaultSearchRadius: 1000,
    favoriteToilets: [],
    searchHistory: [],
  },
  fontSize: 1,
  highContrast: false,
  keyboardNavigation: false,
  screenReader: false,
  reducedMotion: false,
  colorBlindFriendly: false,
  voiceAnnouncements: false,
};

const accessibilitySlice = createSlice({
  name: 'accessibility',
  initialState,
  reducers: {
    // 設定高對比模式
    setHighContrast: (state, action: PayloadAction<boolean>) => {
      state.highContrast = action.payload;
      state.settings.highContrast = action.payload;
      state.preferences.accessibility.highContrast = action.payload;
      
      // 更新CSS變數
      document.documentElement.style.setProperty(
        '--contrast-mode',
        action.payload ? 'high' : 'normal'
      );
      
      // 儲存到localStorage
      localStorage.setItem('highContrast', action.payload.toString());
    },

    // 設定大字體模式
    setLargeText: (state, action: PayloadAction<boolean>) => {
      state.settings.largeText = action.payload;
      state.preferences.accessibility.largeText = action.payload;
      
      if (action.payload) {
        state.fontSize = 1.25;
      } else {
        state.fontSize = 1;
      }
      
      // 更新CSS變數
      document.documentElement.style.setProperty(
        '--font-size-multiplier',
        state.fontSize.toString()
      );
      
      localStorage.setItem('largeText', action.payload.toString());
    },

    // 設定螢幕閱讀器模式
    setScreenReader: (state, action: PayloadAction<boolean>) => {
      state.screenReader = action.payload;
      state.settings.screenReader = action.payload;
      state.preferences.accessibility.screenReader = action.payload;
      
      // 更新aria-hidden屬性
      if (action.payload) {
        // 啟用螢幕閱讀器模式
        document.body.setAttribute('aria-live', 'polite');
      } else {
        // 停用螢幕閱讀器模式
        document.body.removeAttribute('aria-live');
      }
      
      localStorage.setItem('screenReader', action.payload.toString());
    },

    // 設定鍵盤導航模式
    setKeyboardNavigation: (state, action: PayloadAction<boolean>) => {
      state.keyboardNavigation = action.payload;
      state.settings.keyboardNavigation = action.payload;
      state.preferences.accessibility.keyboardNavigation = action.payload;
      
      // 更新focus樣式
      document.documentElement.classList.toggle('keyboard-navigation', action.payload);
      
      localStorage.setItem('keyboardNavigation', action.payload.toString());
    },

    // 設定動畫減少模式
    setReducedMotion: (state, action: PayloadAction<boolean>) => {
      state.reducedMotion = action.payload;
      
      // 更新CSS變數
      document.documentElement.style.setProperty(
        '--animation-duration',
        action.payload ? '0s' : '0.3s'
      );
      
      localStorage.setItem('reducedMotion', action.payload.toString());
    },

    // 設定色彩盲友善模式
    setColorBlindFriendly: (state, action: PayloadAction<boolean>) => {
      state.colorBlindFriendly = action.payload;
      
      // 更新CSS變數
      document.documentElement.classList.toggle('colorblind-friendly', action.payload);
      
      localStorage.setItem('colorBlindFriendly', action.payload.toString());
    },

    // 設定語音提示
    setVoiceAnnouncements: (state, action: PayloadAction<boolean>) => {
      state.voiceAnnouncements = action.payload;
      localStorage.setItem('voiceAnnouncements', action.payload.toString());
    },

    // 設定字體大小
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = Math.max(0.75, Math.min(2, action.payload)); // 限制在0.75-2倍之間
      
      // 更新CSS變數
      document.documentElement.style.setProperty(
        '--font-size-multiplier',
        state.fontSize.toString()
      );
      
      localStorage.setItem('fontSize', state.fontSize.toString());
    },

    // 設定預設搜尋半徑
    setDefaultSearchRadius: (state, action: PayloadAction<number>) => {
      state.preferences.defaultSearchRadius = action.payload;
      localStorage.setItem('defaultSearchRadius', action.payload.toString());
    },

    // 載入使用者偏好設定
    loadUserPreferences: (state) => {
      const highContrast = localStorage.getItem('highContrast') === 'true';
      const largeText = localStorage.getItem('largeText') === 'true';
      const screenReader = localStorage.getItem('screenReader') === 'true';
      const keyboardNavigation = localStorage.getItem('keyboardNavigation') === 'true';
      const reducedMotion = localStorage.getItem('reducedMotion') === 'true';
      const colorBlindFriendly = localStorage.getItem('colorBlindFriendly') === 'true';
      const voiceAnnouncements = localStorage.getItem('voiceAnnouncements') === 'true';
      const fontSize = parseFloat(localStorage.getItem('fontSize') || '1');
      const defaultSearchRadius = parseInt(localStorage.getItem('defaultSearchRadius') || '1000');

      state.highContrast = highContrast;
      state.settings.highContrast = highContrast;
      state.preferences.accessibility.highContrast = highContrast;

      state.settings.largeText = largeText;
      state.preferences.accessibility.largeText = largeText;
      state.fontSize = largeText ? 1.25 : fontSize;

      state.screenReader = screenReader;
      state.settings.screenReader = screenReader;
      state.preferences.accessibility.screenReader = screenReader;

      state.keyboardNavigation = keyboardNavigation;
      state.settings.keyboardNavigation = keyboardNavigation;
      state.preferences.accessibility.keyboardNavigation = keyboardNavigation;

      state.reducedMotion = reducedMotion;
      state.colorBlindFriendly = colorBlindFriendly;
      state.voiceAnnouncements = voiceAnnouncements;
      state.preferences.defaultSearchRadius = defaultSearchRadius;

      // 應用設定到DOM
      document.documentElement.style.setProperty('--contrast-mode', highContrast ? 'high' : 'normal');
      document.documentElement.style.setProperty('--font-size-multiplier', state.fontSize.toString());
      document.documentElement.style.setProperty('--animation-duration', reducedMotion ? '0s' : '0.3s');
      document.documentElement.classList.toggle('keyboard-navigation', keyboardNavigation);
      document.documentElement.classList.toggle('colorblind-friendly', colorBlindFriendly);

      if (screenReader) {
        document.body.setAttribute('aria-live', 'polite');
      } else {
        document.body.removeAttribute('aria-live');
      }
    },

    // 重置所有無障礙設定
    resetAccessibilitySettings: (state) => {
      state.highContrast = false;
      state.settings.highContrast = false;
      state.preferences.accessibility.highContrast = false;

      state.settings.largeText = false;
      state.preferences.accessibility.largeText = false;
      state.fontSize = 1;

      state.screenReader = false;
      state.settings.screenReader = false;
      state.preferences.accessibility.screenReader = false;

      state.keyboardNavigation = false;
      state.settings.keyboardNavigation = false;
      state.preferences.accessibility.keyboardNavigation = false;

      state.reducedMotion = false;
      state.colorBlindFriendly = false;
      state.voiceAnnouncements = false;

      // 清除localStorage
      localStorage.removeItem('highContrast');
      localStorage.removeItem('largeText');
      localStorage.removeItem('screenReader');
      localStorage.removeItem('keyboardNavigation');
      localStorage.removeItem('reducedMotion');
      localStorage.removeItem('colorBlindFriendly');
      localStorage.removeItem('voiceAnnouncements');
      localStorage.removeItem('fontSize');

      // 重置DOM設定
      document.documentElement.style.removeProperty('--contrast-mode');
      document.documentElement.style.removeProperty('--font-size-multiplier');
      document.documentElement.style.removeProperty('--animation-duration');
      document.documentElement.classList.remove('keyboard-navigation', 'colorblind-friendly');
      document.body.removeAttribute('aria-live');
    },

    // 語音播報
    announceToScreenReader: (state, action: PayloadAction<string>) => {
      if (state.voiceAnnouncements && state.screenReader) {
        // 建立語音播報元素
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = action.payload;
        
        document.body.appendChild(announcement);
        
        // 短暫延遲後移除元素
        setTimeout(() => {
          document.body.removeChild(announcement);
        }, 1000);
      }
    },
  },
});

export const {
  setHighContrast,
  setLargeText,
  setScreenReader,
  setKeyboardNavigation,
  setReducedMotion,
  setColorBlindFriendly,
  setVoiceAnnouncements,
  setFontSize,
  setDefaultSearchRadius,
  loadUserPreferences,
  resetAccessibilitySettings,
  announceToScreenReader,
} = accessibilitySlice.actions;

export default accessibilitySlice.reducer;
