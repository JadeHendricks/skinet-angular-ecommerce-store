import { inject, Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { forkJoin, Observable, of } from 'rxjs';
import { Cart } from '../../shared/models/carts';
import { AccountService } from './account.service';
import { User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class InitService {
  private cartService = inject(CartService);
  private accountService = inject(AccountService);  

  init(): Observable<{cart: Cart | null; user: User;}> {
    const cartId = localStorage.getItem('cart_id');
    const cart$  = cartId ? this.cartService.getCart(cartId) : of(null)

    return forkJoin({
      cart: cart$,
      user: this.accountService.getUserInfo()
    })
  }
}
