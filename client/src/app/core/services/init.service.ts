import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { Observable, of } from 'rxjs';
import { Cart } from '../../shared/models/carts';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private cartService = inject(CartService);

  init(): Observable<Cart> | Observable<null> {
    const cartId = localStorage.getItem('cart_id');
    const cart$  = cartId ? this.cartService.getCart(cartId) : of(null)

    return cart$;
  }
}
