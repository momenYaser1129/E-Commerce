import { Icart } from './../../core/interfaces/icart';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe,RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  // From Cart Services
  // private readonly _CartService = inject(CartService);
  // private readonly _ToastrService = inject(ToastrService);
  // make constructor 
  constructor(private readonly _CartService: CartService, private readonly _ToastrService: ToastrService){

    }
  
  // property to hold the data
  
  cartDetails: Icart = {data:{products:[]},numOfCartItems:0,totalCartPrice:0,status:true,cartId:''} as unknown as Icart;
  // cartDetails: Icart | null = null;
  // Remember to make Sweet Alert

  //  For Unsubscribe
  CartServiceUnsubscribe!: Subscription;

  isLoading: boolean = false;

  // Logic will start when i get into Comp.
  ngOnInit(): void {
    this.loadCartData();
  }

  private loadCartData(): void {
    this.isLoading = true;
    this.CartServiceUnsubscribe = this._CartService.getProductCart().subscribe({
      next: (res) => {
        console.log(res.data);
        this.cartDetails = res;
        this.isLoading = false;
      },
      error: (err) => {
        this._ToastrService.error('Failed to load cart data', 'Error');
        this.isLoading = false;
        console.error('Cart loading error:', err);
      },
    });
  }

  // Get out From the Cart
  ngOnDestroy(): void {
    this.CartServiceUnsubscribe?.unsubscribe();
  }

  //  Remove Item
  removeItem(id: string): void {
    this.isLoading = true;
    this._CartService.removeSpecificCartItem(id).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails = res;
        this._ToastrService.success("Removed Successfully", "MarketPulse")
        this._CartService.cartCount.set(res.numOfCartItems);
        this.isLoading = false;
      },
      error: (err) => {
        this._ToastrService.error('Failed to remove item', 'Error');
        this.isLoading = false;
        console.error('Remove item error:', err);
      },
    });
  }

  //  UPdate CArt
  updateCart(id: string, productCount: number): void {
    if (productCount < 1) {
      this._ToastrService.warning('Quantity must be at least 1', 'Warning');
      return;
    }

    this.isLoading = true;
    this._CartService.updateCartQuantity(id, productCount).subscribe({
      next: (res) => {
        this.cartDetails = res;
        this._ToastrService.success("Updated Successfully", "MarketPulse")
        this.isLoading = false;
      },
      error: (err) => {
        this._ToastrService.error('Failed to update cart', 'Error');
        this.isLoading = false;
        console.error('Update cart error:', err);
      },
    });
  }

  // Clear Cart
  clearCart(): void {
    this.isLoading = true;
    this._CartService.clearUserCart().subscribe({
      next: (res) => {
        console.log(res);
        if (res.message == 'success') {
          //fix it
          this.cartDetails = {data:{products:[]},numOfCartItems:0,totalCartPrice:0} as unknown as Icart;
          this._ToastrService.success("Cart Cleared Successfully", "MarketPulse")
          console.log("done");
          console.log( this.cartDetails);
          this._CartService.cartCount.set(0);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this._ToastrService.error('Failed to clear cart', 'Error');
        this.isLoading = false;
        console.error('Clear cart error:', err);
      },
    });
  }
}
