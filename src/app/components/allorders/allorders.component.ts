import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.css']
})
export class AllordersComponent implements OnInit {
  orders: any[] = [];
  userId: string = '';

  get deliveredOrdersCount(): number {
    return this.orders.filter(order => order.isDelivered).length;
  }

    private readonly _OrderService = inject(OrderService) ;
    private readonly _AuthService = inject(AuthService);


  ngOnInit(): void {
    this._AuthService.saveUserData();
    this.userId = this._AuthService.userData.id;
    this.getUserOrders();
  }

  getUserOrders() {
    this._OrderService.getUserOrders(this.userId).subscribe({
      next: (response) => {
        this.orders = response;
        console.log(this.orders);
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
      }
    });
  }
}
