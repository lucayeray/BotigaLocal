import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  imports: [NgForOf]
})
export class CartComponent {
  constructor(public cartService: CartService) {}

  get groupedItems() {
    return this.cartService.getGroupedCart();
  }

  get total() {
    return this.cartService.getTotal();
  }

  pay() {
    alert('Gracias por tu compra');
    this.cartService.clearCart();
  }
}


