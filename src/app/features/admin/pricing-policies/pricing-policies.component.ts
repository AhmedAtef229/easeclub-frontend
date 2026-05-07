import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PageLayoutComponent } from '../../../shared/components/page-layout/page-layout.component';
import { CreatePolicyModalComponent } from '../../../shared/components/modals/create-policy-modal/create-policy-modal.component';
@Component({
  selector: 'app-pricing-policies',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,      // ✅ مهم
    RouterLink,        // ✅ عشان routerLink
    RouterLinkActive,  // ✅ عشان active tab
    PageLayoutComponent
    ,CreatePolicyModalComponent
  ],
  templateUrl: './pricing-policies.component.html',
})
export class PricingPoliciesComponent  {


 
}
