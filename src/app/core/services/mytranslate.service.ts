import { resolve } from 'node:path';
import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, RendererFactory2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class MytranslateService {
  private readonly _TranslateService = inject(TranslateService);
  private readonly _Renderer2 = inject(RendererFactory2).createRenderer(null,null) // create Instance
  private readonly _platId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this._platId)) {
      //1- set default lang
      this._TranslateService.setDefaultLang('en');
      //  Call Func Set Lang and DIR
      this.setLang();
    }
  }

  // Function to call for DIR
  setLang(): void {
    let saveLang = localStorage.getItem('lang');
    if (saveLang) {
      this._TranslateService.use(saveLang);
    }

    //  Change Dir
    if (saveLang === 'en') {
      // document.documentElement.dir = 'ltr';
      this._Renderer2.setAttribute(document.documentElement,'dir', 'ltr')
      this._Renderer2.setAttribute(document.documentElement,'lang', 'en')
    } else if (saveLang === 'ar') {
      // document.documentElement.dir = 'rtl';
      this._Renderer2.setAttribute(document.documentElement,'dir', 'rtl')
      this._Renderer2.setAttribute(document.documentElement,'lang', 'ar')
    }
  }

  changeLang(lang: string): void {
    if (isPlatformBrowser(this._platId)) {
      localStorage.setItem('lang', lang);
      this.setLang();
    }
  }
}
