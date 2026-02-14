
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
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule],
  templateUrl: './auth-layout.component.html',
})
export class AuthLayoutComponent {

  // 👇 نستخدم inject بدل constructor عشان نتجنب أي مشاكل injection
  translate = inject(TranslateService);

  constructor() {
    // لو مفيش لغة متحددة نبدأ بالعربي
    const savedLang = this.translate.currentLang || 'ar';
    this.translate.use(savedLang);

    document.documentElement.lang = savedLang;
    document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
  }

  toggleTheme() {
    document.documentElement.classList.toggle('dark');
  }

  toggleLang() {
    const currentLang = this.translate.currentLang || 'ar';
    const nextLang = currentLang === 'ar' ? 'en' : 'ar';

    this.translate.use(nextLang);

    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  }
}

