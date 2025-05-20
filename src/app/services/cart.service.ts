import { Injectable } from '@angular/core';

export interface CartItem {
  name: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cart: CartItem[] = [];

  getCart(): CartItem[] {
    return this.cart;
  }

  addToCart(item: CartItem): void {
    this.cart.push(item);
  }

  clearCart(): void {
    this.cart = [];
  }

  getGroupedCart(): { name: string; price: number; quantity: number }[] {
    const map = new Map<string, { name: string; price: number; quantity: number }>();

    for (const item of this.cart) {
      if (map.has(item.name)) {
        map.get(item.name)!.quantity++;
      } else {
        map.set(item.name, { ...item, quantity: 1 });
      }
    }

    return Array.from(map.values());
  }

  getTotal(): number {
    return this.cart.reduce((total, item) => total + item.price, 0);
  }
}


