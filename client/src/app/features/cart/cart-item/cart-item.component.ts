import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../shared/models/carts';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
    CurrencyPipe
  ],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.scss'
})
export class CartItemComponent {
  item = input.required<CartItem>();
  cartService = inject(CartService);

  incrementQuantity() {
    // quantity is defaulted to 1, remove item from cart
    this.cartService.addItemToCart(this.item());
  }

  decrementQuantity() {
    // quantity is defaulted to 1, remove item from cart
    this.cartService.removeItemFromCart(this.item().productId);
  }

  removeItemFromCart() {
    // here we are passing the entire quantity of the item to remove it from the cart
    this.cartService.removeItemFromCart(this.item().productId, this.item().quantity);
  }
}