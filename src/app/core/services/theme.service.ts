import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private storageKey = 'easeclub-theme';

  constructor() {
    this.loadTheme();
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(this.storageKey, isDark ? 'dark' : 'light');
  }

  loadTheme() {
    const savedTheme = localStorage.getItem(this.storageKey);

    if (savedTheme) {
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }

  isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }
}
