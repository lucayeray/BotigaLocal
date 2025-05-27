import { Component, OnInit } from '@angular/core';
import { NgForOf, CommonModule  } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ethers } from 'ethers';


type Currency = 'usd' | 'eur' | 'bnb' | 'btc';

declare let window: any;
const BTCB_CONTRACT_ADDRESS = '0x6ce8dA28E2f864420840cF74474eFf5fD80E65B8';
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)"
];



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
    return price / this.exchangeRates[this.selectedCurrency];
  }


  get groupedItems() {
    return this.cartService.getGroupedCart();
  }

  get total() {
    return this.cartService.getTotal();
  }

  payUSD() {

    for (const item of this.groupedItems) {
      const payload = {
        nombre: item.name,
        cantidad: item.quantity,
        moneda: 'USD'
      };

      this.http.post('http://localhost:3000/api/compras', payload).subscribe();
    }

    alert('Gracias por tu compra')
    this.cartService.clearCart();
  }

  payEUR() {

    for (const item of this.groupedItems) {
      const payload = {
        nombre: item.name,
        cantidad: item.quantity,
        moneda: 'EUR'
      };

      this.http.post('http://localhost:3000/api/compras', payload).subscribe();
    }

    this.cartService.clearCart();
    alert('Gracias por tu compra')
  }

  async payWithBNB() {
    if (!window.ethereum) {
      alert('MetaMask no está instalado');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const sender = accounts[0];

      // Linea per evitar Spam Filter
      const amountBNB = this.convertPrice(this.total);
      if (amountBNB < 0.001) {
        alert('El monto es muy bajo para enviar con BNB, intenta agregar más productos.');
        return;
      }

      const value = this.toHexWei(amountBNB.toFixed(6));

      const txParams = {
        from: sender,
        to: '0xbF794c99990079dAECbd70F647Cc2BB54e540B04',
        value,
      };

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });

      console.log('TX enviada:', txHash);
      alert('Pago con BNB enviado, Gracias por tu compra');

      //BD
      for (const item of this.groupedItems) {
        const payload = {
          nombre: item.name,
          cantidad: item.quantity,
          moneda: 'BNB'
        };

        this.http.post('http://localhost:3000/api/compras', payload).subscribe();
      }
      this.cartService.clearCart();

    } catch (err: any) {
      console.error(err);
      alert('Error al enviar BNB: ' + err.message);
    }
  }

  toHexWei(amountBNB: string): string {
    const wei = BigInt(parseFloat(amountBNB) * 1e18);
    return '0x' + wei.toString(16);
  }

  async payWithBTCB() {

    if (!window.ethereum) {
      alert('MetaMask no está instalado');
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });


      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const btcb = new ethers.Contract(BTCB_CONTRACT_ADDRESS, ERC20_ABI, signer);

      const totalBTC = this.convertPrice(this.total).toFixed(8);

      const amount = ethers.parseUnits(totalBTC, 18);
      const recipient = await signer.getAddress();

      const tx = await (btcb as any).transfer(recipient, amount);
      await tx.wait();

      alert('Pago con BTCB en testnet completado, Gracias por tu compra');

      //BD
      for (const item of this.groupedItems) {
        const payload = {
          nombre: item.name,
          cantidad: item.quantity,
          moneda: 'BTC'
        };

        this.http.post('http://localhost:3000/api/compras', payload).subscribe();
      }

      this.cartService.clearCart();
    } catch (err: any) {
      console.error(err);
      alert('Error al enviar BTCB: ' + err.message);
    }
  }



}


