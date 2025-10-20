import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit, OnDestroy {
  private readonly _WishlistService = inject(WishlistService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly spinner = inject(NgxSpinnerService);
  wishlistItems: IProduct[] = [];
  wishlistSub!: Subscription;
  isLoading: boolean = false;
  ngOnInit(): void {
    this.getWishlistItems();
  }

  getWishlistItems(): void {
    this.isLoading = true;
    this.spinner.show();
    this.wishlistSub = this._WishlistService.getProductWishlist().subscribe({
      next: (res) => {
        this.wishlistItems = res.data;
        this.isLoading = false;
        this.spinner.hide();
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
        this.spinner.hide();
        }
    });
  }

  removeFromWishlist(id: string): void {
    this._WishlistService.removeProductFromWishlist(id).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, "MarketPulse");
        this.getWishlistItems(); // Refresh the wishlist
      },
      error: (err) => {
        console.log(err);
      }
    });
    this.isLoading = false;
  }

  addToCart(id: string): void {
    this._CartService.addProductToCart(id).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, "MarketPulse");
        this._CartService.cartCount.set(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  clearWishlist(): void {
    // Remove all items from wishlist one by one
    this.wishlistItems.forEach(item => {
      this._WishlistService.removeProductFromWishlist(item.id).subscribe({
        next: (res) => {
          this._ToastrService.success('Wishlist cleared successfully', "MarketPulse");
          this.getWishlistItems(); // Refresh the wishlist
        },
        error: (err) => {
          console.log(err);
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.wishlistSub) {
      this.wishlistSub.unsubscribe();
    }
  }
}
