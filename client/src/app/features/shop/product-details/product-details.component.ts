import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShopService } from '../../../core/services/shop.service';
import { Product } from '../../../shared/models/products';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { CurrencyPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { CartService } from '../../../core/services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  imports: [FormsModule, MatButton, MatDivider, MatIcon, MatInput, MatFormField, MatLabel, CurrencyPipe],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  private shopService = inject(ShopService);
  private cartService = inject(CartService);
  private activedRoute = inject(ActivatedRoute);

  product?: Product;

  quantity = 1;
  quantityInCart = 0;

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct() {
    const id = this.activedRoute.snapshot.paramMap.get('id');
    if (!id) return;
      this.shopService.getProduct(+id).subscribe({
        next: product => {
          this.product = product;
          this.updateQuantityInCart();
        },
        error: error => console.log(error)
      });
  }

  updateCart() {
    if (!this.product) return;

    if (this.quantity > this.quantityInCart) {
      const itemsToAdd = this.quantity - this.quantityInCart;
      this.quantityInCart += itemsToAdd;
      this.cartService.addItemToCart(this.product, itemsToAdd);
    } else {
      const itemsToRemove = this.quantityInCart - this.quantity;
      this.quantityInCart -= itemsToRemove;
      this.cartService.removeItemFromCart(this.product.id, itemsToRemove);
    }
  }

  updateQuantityInCart() {
    this.quantityInCart = this.cartService.cart()?.items.find(i => i.productId === this.product?.id)?.quantity || 0;
    this.quantity = this.quantityInCart || 1;
  }
  
  getButtonText() {
    return this.quantityInCart > 0 ? 'Update Quantity' : 'Add to Cart';
  }
}
