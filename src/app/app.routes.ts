import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ForgetpasswordComponent } from './components/forgetpassword/forgetpassword.component';
import { authGuard } from './core/guards/auth.guard';
import { loggedGuard } from './core/guards/logged.guard';

export const routes: Routes = [
  // Auth layout - eagerly loaded with all its children
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [loggedGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot', component: ForgetpasswordComponent },
    ],
  },
  
  // Main layout - for authenticated users
  {
    path: '',
    component: BlankLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent }, // Eagerly loaded as commonly used
      { 
        path: 'products', 
        loadComponent: () => import('./components/product/product.component').then(m => m.ProductComponent) 
      },
      { 
        path: 'cart', 
        loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent) 
      },
      { 
        path: 'wishlist', 
        loadComponent: () => import('./components/wishlist/wishlist.component').then(m => m.WishlistComponent) 
      },
      { 
        path: 'categories', 
        loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent) 
      },
      { 
        path: 'details/:id', 
        loadComponent: () => import('./components/details/details.component').then(m => m.DetailsComponent) 
      },
      { 
        path: 'allorders', 
        loadComponent: () => import('./components/allorders/allorders.component').then(m => m.AllordersComponent) 
      },
      { 
        path: 'orders/:id', 
        loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent) 
      },
    ],
  },
  
  // Catch all route
  { path: '**', component: NotfoundComponent },
];