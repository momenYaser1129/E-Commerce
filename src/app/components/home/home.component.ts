import { SearchPipe } from './../../core/pipes/search.pipe';
import { Subscription } from 'rxjs';
import { IProduct } from '../../core/interfaces/iproduct';
import { ProductsService } from './../../core/services/products.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../core/interfaces/icategory';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { CurrencyPipe} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { WishlistService } from '../../core/services/wishlist.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    CarouselModule,
    RouterLink,
    [SearchPipe, CurrencyPipe],
    TranslateModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _WishlistService = inject(WishlistService);

  productList: IProduct[] = [];
  categoryList: ICategory[] = [];
  wishlistStatus: { [key: string]: boolean } = {};
  dataOfSearch: string = '';
  userName: string = '';

  getAllProductsSub!: Subscription;

  customOptionsMain: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    rtl: true,
    autoplay: true,
    autoplayTimeout: 3500,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: ['', ''],
    items: 1,
    nav: false,
  };

  customOptionsCat: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    rtl: true,
    autoplay: true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    navSpeed: 700,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsive: {
      0: { items: 2 },
      400: { items: 3 },
      740: { items: 4 },
      940: { items: 6 },
    },
    nav: true,
  };

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts(); 
  }

  private loadCategories(): void {
    this._CategoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoryList = res.data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      },
    });
  }

  private loadProducts(): void {
    this.getAllProductsSub = this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList = res.data;
        // Check wishlist status for each product
        this.productList.forEach(product => {
          this.checkWishlistStatus(product.id);
        });
      },
      error: (err) => {
        console.error('Error loading products:', err);
      },
    });
  }

  private checkWishlistStatus(productId: string): void {
    this._WishlistService.isInWishlist(productId).subscribe({
      next: (isInWishlist) => {
        this.wishlistStatus[productId] = isInWishlist;
      },
      error: (err) => {
        console.error('Error checking wishlist status:', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.getAllProductsSub?.unsubscribe();
  }

  addToCart(id: string): void {
    this._CartService.addProductToCart(id).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, "MarketPulse");
        this._CartService.cartCount.set(res.numOfCartItems);
      },
      error: (err) => {
        this._ToastrService.error('Failed to add to cart', 'Error');
        console.error('Add to cart error:', err);
      },
    });
  }

  toggleWishlist(id: string): void {
    if (this.wishlistStatus[id]) {
      this.removeFromWishlist(id);
    } else {
      this.addToWishlist(id);
    }
  }

  private addToWishlist(id: string): void {
    this._WishlistService.addProductToWishlist(id).subscribe({
      next: (res) => {
        this.wishlistStatus[id] = true;
        this._ToastrService.success('Added to wishlist', 'MarketPulse');
      },
      error: (err) => {
        this._ToastrService.error('Failed to add to wishlist', 'Error');
        console.error('Add to wishlist error:', err);
      },
    });
  }

  private removeFromWishlist(id: string): void {
    this._WishlistService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        this.wishlistStatus[id] = false;
        this._ToastrService.success('Removed from wishlist', 'MarketPulse');
      },
      error: (err) => {
        this._ToastrService.error('Failed to remove from wishlist', 'Error');
        console.error('Remove from wishlist error:', err);
      },
    });
  }
}
