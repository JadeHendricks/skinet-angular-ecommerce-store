import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../../shared/models/carts';
import { Product } from '../../shared/models/products';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  cart = signal<Cart | null>(null);
  // computed is used with signals in order to gain access to the value of the signal
  // it is a reactive way to get the value of the signal
  // it will re-evaluate when the signal changes
  itemCount = computed(() => { 
    return this.cart()?.items.reduce((sum, item) => sum + item.quantity, 0);
  });
  totals = computed(() => {
    const cart = this.cart();
    if (!cart) return null;

    const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const  shipping = 0;
    const discount = 0;

    return {
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount
    }
  });

  getCart(id: string) {
    return this.http.get<Cart>(this.baseUrl + 'cart?id=' + id).pipe(
      map(cart => {
        this.cart.set(cart);
        return cart;
      })
    )
  }

  setCart(cart: Cart) {
    return this.http.post<Cart>(this.baseUrl + 'cart', cart).subscribe({
      next: cart => this.cart.set(cart)
    });
  }

  private createCart(): Cart {
    const cart = new Cart();
    localStorage.setItem('cart_id', cart.id);
    return cart;
  }

  private isProduct(item: CartItem | Product): item is Product {
    // product has an id, it is a product
    // cart item has a productId and not an id
    // so if id is not undefined, item is a product
    return (item as Product).id !== undefined;
  }

  private mapProductToCartItem(item: Product): CartItem {
    return {
      productId: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.brand,
      type: item.type,
    }
  }

  private addOrUpdateItem(items: CartItem[], item: CartItem, quantity: number): CartItem[] {
    const index = items.findIndex(i => i.productId === item.productId);
    if (index === -1) {
      item.quantity = quantity;
      items.push(item);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  addItemToCart(item: CartItem | Product, quantity = 1) {
    const cart = this.cart() ?? this.createCart();
    if (this.isProduct(item)) {
      item = this.mapProductToCartItem(item);
    }
    cart.items = this.addOrUpdateItem(cart.items, item, quantity);
    this.setCart(cart);
  }


  private deleteCart() {
    this.http.delete(this.baseUrl + 'cart?id=' + this.cart()?.id).subscribe({
      next: () => {
        localStorage.removeItem('cart_id');
        // setting the signal to null
        // this is to notify the subscribers that the cart has been deleted
        // and to update the UI
        this.cart.set(null);
      }
    });
  }

  removeItemFromCart(productId: number, quantity = 1) {
    const cart = this.cart();
    if (!cart) return;
    const index = cart.items.findIndex(i => i.productId === productId);
    if (index !== -1) {
      // here we are checking if the quantity is greater than the quantity in the cart
      // if it is, we are subtracting the quantity from the quantity in the cart
      // if it is not, we are removing the item from the cart
      // this is to prevent negative quantities in the cart
      if (cart.items[index].quantity > quantity) {
        cart.items[index].quantity -= quantity;
      } else {
        cart.items.splice(index, 1);
      }

      if (cart.items.length === 0) {
        this.deleteCart();
      } else {
        // updates the cart on the redis server
        this.setCart(cart);
      }
    }
  
  }
}
