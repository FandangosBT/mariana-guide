import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface JourneyState {
  // Estado atual
  currentStep: number;
  isComplete: boolean;
  
  // Dados das etapas (sem PII)
  step1Baseline: {
    manualHoursRange: string;
    monthlyLossRange: string;
    conversionRange: string;
  };
  step1Data: {
    selectedProblems: string[];
    expandedItems: string[];
  };
  
  step2Data: {
    hoveredItems: string[];
    clickedItems: string[];
  };
  
  step3Data: {
    favoriteSolutions: string[];
    selectedTags: Record<string, boolean>;
    flippedCards: Record<string, number>;
  };
  
  step4Data: {
    selectedPilot: string | null;
    recommendedSeen: Record<string, boolean>;
  };
  
  step5Data: {
    activeWidget: string | null;
    simulationActive: boolean;
    widgetInteractions: Record<string, string[]>;
    cart: {
      [key: string]: { selecionado: boolean; modulos: Record<string, boolean> };
    };
  };
  
  // Preferências do usuário
  theme: 'light' | 'dark' | 'system';
  autoMode: boolean;
  
  // Actions
  setCurrentStep: (step: number) => void;
  setComplete: (complete: boolean) => void;
  
  // Step 1 actions
  setStep1Baseline: (b: { manualHoursRange: string; monthlyLossRange: string; conversionRange: string }) => void;
  addSelectedProblem: (problemId: string) => void;
  removeSelectedProblem: (problemId: string) => void;
  setExpandedItems: (items: string[]) => void;
  
  // Step 2 actions
  addHoveredItem: (itemId: string) => void;
  addClickedItem: (itemId: string) => void;
  
  // Step 3 actions
  toggleFavoriteSolution: (solutionId: string) => void;
  toggleTag: (solutionId: string, tag: string) => void;
  incrementFlipCount: (cardId: string) => void;
  
  // Step 4 actions
  setSelectedPilot: (pilotId: string | null) => void;
  markRecommendedSeen: (pilotId: string) => void;
  
  // Step 5 actions
  setActiveWidget: (widgetId: string | null) => void;
  setSimulationActive: (active: boolean) => void;
  addWidgetInteraction: (widgetId: string, interaction: string) => void;
  cartToggleProduct: (productId: string) => void;
  cartToggleModule: (productId: string, moduleId: string) => void;
  cartClear: () => void;
  
  // Preferences
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setAutoMode: (auto: boolean) => void;
  
  // Reset
  resetJourney: () => void;
}

const initialState = {
  currentStep: 0,
  isComplete: false,
  step1Baseline: {
    manualHoursRange: '40–60h/mês',
    monthlyLossRange: 'R$ 8–15k/mês',
    conversionRange: '-15% a -25%'
  },
  step1Data: {
    selectedProblems: [],
    expandedItems: [],
  },
  step2Data: {
    hoveredItems: [],
    clickedItems: [],
  },
  step3Data: {
    favoriteSolutions: [],
    selectedTags: {},
    flippedCards: {},
  },
  step4Data: {
    selectedPilot: null,
    recommendedSeen: {},
  },
  step5Data: {
    activeWidget: null,
    simulationActive: false,
    widgetInteractions: {},
    cart: {},
  },
  theme: 'system' as const,
  autoMode: false,
};

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setCurrentStep: (step) => set({ currentStep: step }),
      setComplete: (complete) => set({ isComplete: complete }),
      
      // Step 1
      setStep1Baseline: (b) => set(() => ({ step1Baseline: b })),
      addSelectedProblem: (problemId) => set((state) => ({
        step1Data: {
          ...state.step1Data,
          selectedProblems: [...new Set([...state.step1Data.selectedProblems, problemId])],
        },
      })),
      removeSelectedProblem: (problemId) => set((state) => ({
        step1Data: {
          ...state.step1Data,
          selectedProblems: state.step1Data.selectedProblems.filter(id => id !== problemId),
        },
      })),
      setExpandedItems: (items) => set((state) => ({
        step1Data: { ...state.step1Data, expandedItems: items },
      })),
      
      // Step 2
      addHoveredItem: (itemId) => set((state) => ({
        step2Data: {
          ...state.step2Data,
          hoveredItems: [...new Set([...state.step2Data.hoveredItems, itemId])],
        },
      })),
      addClickedItem: (itemId) => set((state) => ({
        step2Data: {
          ...state.step2Data,
          clickedItems: [...new Set([...state.step2Data.clickedItems, itemId])],
        },
      })),
      
      // Step 3
      toggleFavoriteSolution: (solutionId) => set((state) => {
        const favorites = state.step3Data.favoriteSolutions;
        const isFavorite = favorites.includes(solutionId);
        return {
          step3Data: {
            ...state.step3Data,
            favoriteSolutions: isFavorite
              ? favorites.filter(id => id !== solutionId)
              : [...favorites, solutionId],
          },
        };
      }),
      toggleTag: (solutionId, tag) => set((state) => {
        const key = `${solutionId}:${tag}`;
        const current = state.step3Data.selectedTags[key] || false;
        return {
          step3Data: {
            ...state.step3Data,
            selectedTags: { ...state.step3Data.selectedTags, [key]: !current },
          },
        };
      }),
      incrementFlipCount: (cardId) => set((state) => ({
        step3Data: {
          ...state.step3Data,
          flippedCards: {
            ...state.step3Data.flippedCards,
            [cardId]: (state.step3Data.flippedCards[cardId] || 0) + 1,
          },
        },
      })),
      
      // Step 4
      setSelectedPilot: (pilotId) => set((state) => ({
        step4Data: { ...state.step4Data, selectedPilot: pilotId },
      })),
      markRecommendedSeen: (pilotId) => set((state) => ({
        step4Data: {
          ...state.step4Data,
          recommendedSeen: { ...state.step4Data.recommendedSeen, [pilotId]: true },
        },
      })),
      
      // Step 5
      setActiveWidget: (widgetId) => set((state) => ({
        step5Data: { ...state.step5Data, activeWidget: widgetId },
      })),
      setSimulationActive: (active) => set((state) => ({
        step5Data: { ...state.step5Data, simulationActive: active },
      })),
      addWidgetInteraction: (widgetId, interaction) => set((state) => ({
        step5Data: {
          ...state.step5Data,
          widgetInteractions: {
            ...state.step5Data.widgetInteractions,
            [widgetId]: [...(state.step5Data.widgetInteractions[widgetId] || []), interaction],
          },
        },
      })),
      cartToggleProduct: (productId) => set((state) => {
        const prev = state.step5Data.cart[productId];
        const nextSel = prev ? !prev.selecionado : true;
        return {
          step5Data: {
            ...state.step5Data,
            cart: {
              ...state.step5Data.cart,
              [productId]: { selecionado: nextSel, modulos: prev?.modulos ?? {} },
            },
          },
        };
      }),
      cartToggleModule: (productId, moduleId) => set((state) => {
        const prev = state.step5Data.cart[productId];
        const current = prev?.modulos?.[moduleId] ?? false;
        const togglingOn = !current;
        const nextModulos = { ...(prev?.modulos ?? {}), [moduleId]: !current };
        const nextSelecionado = (prev?.selecionado ?? false) || togglingOn;
        return {
          step5Data: {
            ...state.step5Data,
            cart: {
              ...state.step5Data.cart,
              [productId]: {
                selecionado: nextSelecionado,
                modulos: nextModulos,
              },
            },
          },
        };
      }),
      cartClear: () => set((state) => ({ step5Data: { ...state.step5Data, cart: {} } })),
      
      // Preferences
      setTheme: (theme) => set({ theme }),
      setAutoMode: (auto) => set({ autoMode: auto }),
      
      // Reset
      resetJourney: () => set(initialState),
    }),
    {
      name: 'timeos-journey-storage',
      storage: createJSONStorage(() => localStorage),
      // Persistir apenas dados não sensíveis
      partialize: (state) => ({
        currentStep: state.currentStep,
        step1Baseline: state.step1Baseline,
        step1Data: state.step1Data,
        step2Data: state.step2Data,
        step3Data: state.step3Data,
        step4Data: state.step4Data,
        step5Data: state.step5Data,
        theme: state.theme,
        autoMode: state.autoMode,
      }),
    }
  )
);
