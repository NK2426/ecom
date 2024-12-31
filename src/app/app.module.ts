import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HttpClientModule } from '@angular/common/http';
import { CartComponent } from './component/cart/cart.component';
import { CategoriesComponent } from './component/categories/categories.component';
import { LoginComponent } from './component/login/login.component';
import { ProductListComponent } from './component/product-list/product-list.component';
import { ProductsComponent } from './component/products/products.component';
import { SingleproductComponent } from './component/singleproduct/singleproduct.component';
import { SignupComponent } from './component/signup/signup.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from './layout/home/home.component';
import { HomeSliderComponent } from './layout/home-slider/home-slider.component';
import { MobileCategoryDialogComponent } from './layout/mobile-category-dialog/mobile-category-dialog.component';
import { SearchBarComponent } from './layout/search-bar/search-bar.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgOtpInputModule } from 'ng-otp-input';
import { MessageService } from 'primeng/api';
import { MatRadioModule } from '@angular/material/radio'

import { ViewCartComponent } from './component/view-cart/view-cart.component';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { WishlistComponent } from './component/wishlist/wishlist.component';
import { MatIconModule } from '@angular/material/icon';
import { CodeInputModule } from 'angular-code-input';
import { OrderStatusComponent } from './component/order-status/order-status.component';
import { ViewOrderComponent } from './component/view-order/view-order.component';
import { MatCardModule } from '@angular/material/card';
import { AccountComponent } from './component/account/account.component';
import { MatSelectModule } from '@angular/material/select';
import { ConformationdialogComponent } from './component/conformationdialog/conformationdialog.component';
import { SubcategoriesListComponent } from './component/subcategories-list/subcategories-list.component';
import { TagWithIdComponent } from './component/tag-with-id/tag-with-id.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TermsComponent } from './component/terms/terms.component';
import { PrivacypolicyComponent } from './component/privacypolicy/privacypolicy.component';
import { ReturnpolicyComponent } from './component/returnpolicy/returnpolicy.component';
import { CancelReasonDialogComponent } from './component/cancel-reason-dialog/cancel-reason-dialog.component';
import { MatStepperModule } from '@angular/material/stepper';
import { BlogComponent } from './component/blog/blog.component';
import { SingleBlogComponent } from './component/single-blog/single-blog.component';
import { StoresComponent } from './component/stores/stores.component';
import { CustomerCareComponent } from './component/customer-care/customer-care.component';
import { ShopComponent } from './component/shop/shop.component';
import { CamelCasePipe } from './pipes/camelcase.pipe';
import { SearchResultsComponent } from './component/search-results/search-results.component';
import { ReturnReasonDialogComponent } from './component/return-reason-dialog/return-reason-dialog.component';
import { EventsComponent } from './component/events/events.component';
import { OverlayComponent } from './layout/overlay/overlay.component';
import { ReviewPopupComponent } from './component/review-popup/review-popup.component';
import { VideoCallComponent } from './component/video-call/video-call.component';
import { OAuthModule } from 'angular-oauth2-oidc';
import { GoogleAccountComponent } from './component/google-account/google-account.component';
import { NgbModule, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoryProductsComponent } from './component/category-products/category-products.component';

@NgModule({
  declarations: [
    AppComponent,
    CamelCasePipe,
    CartComponent,
    CategoriesComponent,
    LoginComponent,
    ProductListComponent,
    ProductsComponent,
    SingleproductComponent,
    SignupComponent,
    FooterComponent,
    HeaderComponent,
    HomeComponent,
    HomeSliderComponent,
    MobileCategoryDialogComponent,
    SearchBarComponent,
    ViewCartComponent,
    CheckoutComponent,
    WishlistComponent,
    OrderStatusComponent,
    ViewOrderComponent,
    AccountComponent,
    ConformationdialogComponent,
    SubcategoriesListComponent,
    TagWithIdComponent,
    TermsComponent,
    PrivacypolicyComponent,
    ReturnpolicyComponent,
    CancelReasonDialogComponent,
    BlogComponent,
    SingleBlogComponent,
    StoresComponent,
    CustomerCareComponent,
    ShopComponent,
    SearchResultsComponent,
    ReturnReasonDialogComponent,
    EventsComponent,
    OverlayComponent,
    ReviewPopupComponent,
    VideoCallComponent,
    GoogleAccountComponent,
    CategoryProductsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    MatToolbarModule,
    SlickCarouselModule,
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatTabsModule,
    FormsModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatRadioModule,
    NgOtpInputModule,
    MatPaginatorModule,
    FlexLayoutModule,
    CodeInputModule,
    MatCardModule,
    MatSelectModule,
    NgSelectModule,
    NgbRatingModule,
    NgbModule,
    OAuthModule.forRoot()
  ],
  providers: [MessageService, authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
