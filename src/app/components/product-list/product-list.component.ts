import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';

type Currency = 'usd' | 'eur' | 'bnb' | 'btc';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgForOf, HttpClientModule, FormsModule, CommonModule]
})
export class ProductListComponent implements OnInit{
  constructor(private cartService: CartService, private http: HttpClient) {

  }

  products = [
    { name: 'Producto A', price: 10, image: 'carrete.jpg' },
    { name: 'Producto B', price: 20, image: 'caña.jpg' }
  ];

  selectedCurrency: Currency = 'usd';
  exchangeRates: { [key in Currency]: number } = {
    usd: 1,
    eur: 1,
    bnb: 1,
    btc: 1
  };


  ngOnInit() {
    this.http.get<{ [key in Currency]: number }>('http://localhost:3000/api/exchange-rates')
      .subscribe((rates) => {
        console.log('Tasas de cambio cargadas:', rates);
        this.exchangeRates = rates;
      });
  }


  convertPrice(price: number): number {
    return price / this.exchangeRates[this.selectedCurrency];
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}

