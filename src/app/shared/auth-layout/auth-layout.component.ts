
// import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { TranslateModule } from '@ngx-translate/core';
// @Component({
//   selector: 'app-auth-layout',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet,TranslateModule],
//   templateUrl: './auth-layout.component.html',
// })
// export class AuthLayoutComponent {
//   toggleTheme() {
//     document.documentElement.classList.toggle('dark');
//   }
// }

import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../core/services/theme.service'; // عدل المسار لو مختلف

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {

  // ✅ inject services
  translate = inject(TranslateService);
  themeService = inject(ThemeService);

  constructor() {
    // 🌍 Language Init
    const savedLang = localStorage.getItem('lang') || 'ar';
    this.translate.use(savedLang);

    document.documentElement.lang = savedLang;
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleLang() {
    const currentLang = this.translate.currentLang || 'ar';
    const nextLang = currentLang === 'ar' ? 'en' : 'ar';

    this.translate.use(nextLang);
    localStorage.setItem('lang', nextLang);

    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  }
}
