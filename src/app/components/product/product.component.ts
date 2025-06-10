import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';
import { ProductsService } from '../../core/services/products.service';
import { IProduct } from '../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../core/interfaces/icategory';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [[SearchPipe, CurrencyPipe], RouterLink, FormsModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit, OnDestroy {
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _ProductsService = inject(ProductsService);
  private readonly _CategoriesService = inject(CategoriesService);
  
  productList: IProduct[] = [];
  filteredProducts: IProduct[] = [];
  categories: ICategory[] = [];
  
  // Filter properties
  selectedCategory: string = '';
  selectedPriceRange: string = '';
  priceRanges = [
    { label: 'Low Price (Under 200)', min: 0, max: 200 },
    { label: 'Medium Price (200-500)', min: 200, max: 500 },
    { label: 'High Price (Over 500)', min: 500, max: Infinity }
  ];
  
  // Loading states
  isLoadingProducts: boolean = false;
  isLoadingCategories: boolean = false;
  isAddingToCart: { [key: string]: boolean } = {};
  
  // Two Way binding
  dataOfSearch: string = '';

  getAllProductsSub!: Subscription;
  getAllCategoriesSub!: Subscription;

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  private loadProducts(): void {
    this.isLoadingProducts = true;
    this.getAllProductsSub = this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        this.productList = res.data;
        this.filteredProducts = res.data;
        this.isLoadingProducts = false;
      },
      error: (err) => {
        this._ToastrService.error('Failed to load products', 'Error');
        this.isLoadingProducts = false;
        console.error('Products loading error:', err);
      }
    });
  }

  private loadCategories(): void {
    this.isLoadingCategories = true;
    this.getAllCategoriesSub = this._CategoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.isLoadingCategories = false;
      },
      error: (err) => {
        this._ToastrService.error('Failed to load categories', 'Error');
        this.isLoadingCategories = false;
        console.error('Categories loading error:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.getAllProductsSub?.unsubscribe();
    this.getAllCategoriesSub?.unsubscribe();
  }

  applyFilters(): void {
    this.filteredProducts = this.productList.filter(product => {
      if (this.selectedCategory && product.category._id !== this.selectedCategory) {
        return false;
      }
      
      if (this.selectedPriceRange) {
        const range = this.priceRanges.find(r => r.label === this.selectedPriceRange);
        if (range && (product.price < range.min || product.price > range.max)) {
          return false;
        }
      }
      
      return true;
    });
  }

  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedPriceRange = '';
    this.filteredProducts = this.productList;
  }

  addToCart(id: string): void {
    if (this.isAddingToCart[id]) return;
    
    this.isAddingToCart[id] = true;
    this._CartService.addProductToCart(id).subscribe({
      next: (res) => {
        this._ToastrService.success(res.message, 'MarketPulse');
        this._CartService.cartCount.set(res.numOfCartItems);
        this.isAddingToCart[id] = false;
      },
      error: (err) => {
        this._ToastrService.error('Failed to add product to cart', 'Error');
        this.isAddingToCart[id] = false;
        console.error('Add to cart error:', err);
      },
    });
  }
}
