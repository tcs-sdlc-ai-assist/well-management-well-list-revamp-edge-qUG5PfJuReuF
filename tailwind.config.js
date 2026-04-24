/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: {
          primary: '#1a1a2e',
          secondary: '#16213e',
          tertiary: '#0f3460',
          card: '#1e2a45',
          hover: '#243352',
        },
        border: {
          primary: '#2a3a5c',
          secondary: '#1e2d4a',
          accent: '#0f3460',
        },
        text: {
          primary: '#e2e8f0',
          secondary: '#94a3b8',
          muted: '#64748b',
          accent: '#7dd3fc',
          heading: '#f1f5f9',
        },
        status: {
          active: '#22c55e',
          'active-bg': '#14532d',
          inactive: '#ef4444',
          'inactive-bg': '#7f1d1d',
          injecting: '#3b82f6',
          'injecting-bg': '#1e3a8a',
          producing: '#22c55e',
          'producing-bg': '#14532d',
          suspended: '#f59e0b',
          'suspended-bg': '#78350f',
          abandoned: '#6b7280',
          'abandoned-bg': '#1f2937',
          plugged: '#8b5cf6',
          'plugged-bg': '#4c1d95',
        },
        button: {
          primary: '#0f3460',
          'primary-hover': '#1a4a7a',
          secondary: '#1e2a45',
          'secondary-hover': '#243352',
          danger: '#7f1d1d',
          'danger-hover': '#991b1b',
          success: '#14532d',
          'success-hover': '#166534',
        },
        accent: {
          blue: '#3b82f6',
          'blue-light': '#7dd3fc',
          'blue-dark': '#1d4ed8',
          cyan: '#06b6d4',
          purple: '#8b5cf6',
          green: '#22c55e',
          yellow: '#f59e0b',
          red: '#ef4444',
        },
      },
    },
  },
  plugins: [],
};