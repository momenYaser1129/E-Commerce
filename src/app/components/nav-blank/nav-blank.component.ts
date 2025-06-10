import { Component, computed, inject, OnInit, Signal, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MytranslateService } from '../../core/services/mytranslate.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink, RouterLinkActive,TranslateModule],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.scss',
})
export class NavBlankComponent implements OnInit {
   readonly _AuthService = inject(AuthService);


   private readonly _MytranslateService = inject(MytranslateService)
   private readonly _CartService = inject(CartService)

   readonly _TranslateService = inject(TranslateService)
   userName: string = '';
   showCartCount : Signal<number> = computed(()=> this._CartService.cartCount())

  // signOut(): void {
  //   this._AuthService.logOut();
  // }
  
  ngOnInit(): void {
    this._AuthService.saveUserData();
    this.userName = this._AuthService.userData.name;
    // Get All products CArt to get cartCount
    this._CartService.getProductCart().subscribe({
      next:(res)=>{
        this._CartService.cartCount.set(res.numOfCartItems)

      }
    })


    // this._CartService.cartCount.subscribe({
    //    next:(num)=>{
    //     this.showCartCount = num
    //    }
    // }) ;


  }


  switchLanguage(lang : string ):void {
  this._MytranslateService.changeLang(lang)
  }

  signEnLang():void{
    this.switchLanguage("en")
  }
}
