import { Component, OnInit } from '@angular/core';
import { NgForOf, CommonModule  } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';


type Currency = 'usd' | 'eur' | 'bnb' | 'btc';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  imports: [NgForOf, CommonModule, HttpClientModule, FormsModule]
})
export class CartComponent implements OnInit{
  constructor(public cartService: CartService, private http: HttpClient) {}

  selectedCurrency: Currency = 'usd';

  exchangeRates: { [key in Currency]: number } = {
    usd: 1,
    eur: 1,
    bnb: 1,
    btc: 1
  };

  ngOnInit() {
    this.http.get<{ [key in Currency]: number }>('http://localhost:3000/api/exchange-rates')
      .subscribe(rates => {
        this.exchangeRates = rates;
      });
  }

  convertPrice(price: number): number {
    return price * this.exchangeRates[this.selectedCurrency];
  }


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


