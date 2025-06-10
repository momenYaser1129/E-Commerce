import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent implements OnInit, OnDestroy {
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);  
   customOptionsDetails: OwlOptions = {
      loop: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: false,
      dots: true,
      autoplay: true,
      autoplayTimeout: 3000,
      autoplayHoverPause: true,
      navSpeed: 700,
      navText: ['', ''],
      items: 1,
      nav: false, 
    };


  getSpecificProduct!: Subscription;

  // productDetails: IProduct = {} as IProduct; // to give initial value => its an object
  detailsProduct: IProduct | null = null; 
  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (p) => {
        let idProduct = p.get('id');

        //  logic Api --> Call API
        this.getSpecificProduct = this._ProductsService
          .getSpecificProducts(idProduct)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.detailsProduct = res.data;
            },
            error: (err) => {
              console.log(err);
            },
          });
      },
    });
  }

  ngOnDestroy(): void {
    this.getSpecificProduct?.unsubscribe();
  }

  // AddToCart
  addToCart(id: string): void {
    this._CartService.addProductToCart(id).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastrService.success(res.message, "MarketPulse")
        // this._CartService.cartCount.next(res.numOfCartItems);
        this._CartService.cartCount.set(res.numOfCartItems);
        // console.log(this._CartService.cartCount);
        
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
