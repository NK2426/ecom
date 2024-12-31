import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { SingleproductComponent } from './component/singleproduct/singleproduct.component';
import { ProductListComponent } from './component/product-list/product-list.component';
import { LoginComponent } from './component/login/login.component';
import { SignupComponent } from './component/signup/signup.component';
import { AuthguardService } from './services/authguard.service';
import { ViewCartComponent } from './component/view-cart/view-cart.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { WishlistComponent } from './component/wishlist/wishlist.component';
import { OrderStatusComponent } from './component/order-status/order-status.component';
import { ViewOrderComponent } from './component/view-order/view-order.component';
import { AccountComponent } from './component/account/account.component';
import { SubcategoriesListComponent } from './component/subcategories-list/subcategories-list.component';
import { ProductsComponent } from './component/products/products.component';
import { TagWithIdComponent } from './component/tag-with-id/tag-with-id.component';
import { TermsComponent } from './component/terms/terms.component';
import { PrivacypolicyComponent } from './component/privacypolicy/privacypolicy.component';
import { ReturnpolicyComponent } from './component/returnpolicy/returnpolicy.component';
import { BlogComponent } from './component/blog/blog.component';
import { SingleBlogComponent } from './component/single-blog/single-blog.component';
import { StoresComponent } from './component/stores/stores.component';
import { CustomerCareComponent } from './component/customer-care/customer-care.component';
import { ShopComponent } from './component/shop/shop.component';
import { SearchResultsComponent } from './component/search-results/search-results.component';
import { EventsComponent } from './component/events/events.component';
import { GoogleAccountComponent } from './component/google-account/google-account.component';
import { CategoriesComponent } from './component/categories/categories.component';
import { CategoryProductsComponent } from './component/category-products/category-products.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  // { path: 'home', component: HomeComponent },
  { path: 'product', component: SingleproductComponent },
  { path: 'product/:id', component: SingleproductComponent },
  { path: 'offers/:id', component: ProductListComponent },
  { path: 'product-list', component: ProductListComponent },
  { path: 'product-list/:id', component: ProductListComponent },
  { path: 'product-list/category/:id', component: ProductListComponent },
  { path: 'product-list/subcategory/:id', component: ProductListComponent },
  { path: 'subcategory/', component: SubcategoriesListComponent },
  { path: 'subcategory/:id', component: SubcategoriesListComponent },
  { path: 'login', component: LoginComponent, canActivate: [AuthguardService] },
  { path: 'signup', component: SignupComponent, canActivate: [AuthguardService] },
  { path: 'cart', component: ViewCartComponent },
  { path: 'checkout/:orderID', component: CheckoutComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'orderstatus', component: OrderStatusComponent },
  { path: 'orderstatus/:id', component: ViewOrderComponent },
  { path: 'account', component: AccountComponent },
  { path: 'stores/:id', component: StoresComponent },
  { path: 'store-products/:id', component: ProductsComponent },
  { path: 'tag/:id', component: TagWithIdComponent },
  { path: 'category/:id/:name', component: CategoryProductsComponent },
  { path: 'termsconditions', component: TermsComponent },
  { path: 'privacypolicy', component: PrivacypolicyComponent },
  { path: 'returnpolicy', component: ReturnpolicyComponent },
  { path: 'blogs', component: BlogComponent },
  { path: 'blogs/:id', component: SingleBlogComponent },
  { path: 'live-events', component: EventsComponent },
  { path: 'contact', component: CustomerCareComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: 'google', component: GoogleAccountComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
