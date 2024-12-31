import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';
import { OrderData } from 'src/app/model/orders';
import { CheckoutService } from 'src/app/services/checkout.service';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.css']
})
export class OrderStatusComponent implements OnInit {

  orderid: any;

  orderItems!: OrderData;
  prodImg!: string;
  token = localStorage.getItem('token');
  selectedStatus: string = 'allorders';
  private scrollTriggerInstance!: ScrollTrigger;

  status_values: any = ["allorders", "place", "deliver", "cancel"];

  constructor(private orders: CheckoutService, private cd: ChangeDetectorRef) {
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnInit() {
    if (this.token) {
      this.allOrders()
    }

  }

  ngAfterViewInit(): void {
    this.fetchOrderItems();
  }

 
  fetchOrderItems() {
    if (this.selectedStatus === 'allorders') {
      this.allOrders();
    }

    this.orders.fetchOrders(this.selectedStatus).subscribe((data: any) => {
      this.orderItems = data.data;
      this.gsapScrollAnimation();
    });
  }

  gsapScrollAnimation() {
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill(); // Clean up previous ScrollTrigger instance
    }

    const rightSide = document.querySelector('.scroll-element') as HTMLElement;
    const fixedElement = document.querySelector('.fixed-element') as HTMLElement;

    if (rightSide && fixedElement) {
      const endValue = this.orderItems?.totalItems != 0
        ? 'bottom 90%'
        : 'bottom 20%'; // Adjust based on whether there are items or not

      this.scrollTriggerInstance = ScrollTrigger.create({
        trigger: rightSide,
        start: 'top 20%',
        end: endValue,
        pin: fixedElement,
        pinSpacing: false,
        scrub: 1,
        // markers: { startColor: 'orange', endColor: 'blue', fontSize: '18px', fontWeight: 'bold', indent: 20 }
      });
    }
  }

  allOrders() {
    this.orders.allOrders().subscribe(
      (data: any) => {
        // console.log(data);
        this.orderItems = data.data;
        // console.log(this.orderItems);
      },
      (error: any) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.scrollTriggerInstance) {
      this.scrollTriggerInstance.kill();
    }
  }


}
