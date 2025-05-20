import { Component } from '@angular/core';
import { NgForOf } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgForOf]
})
export class ProductListComponent {
  constructor(private cartService: CartService) {}

  products = [
    { name: 'Producto A', price: 10, image: 'carrete.jpg' },
    { name: 'Producto B', price: 20, image: 'caña.jpg' }
  ];


  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}

