import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';       // ✅ عشان *ngFor و *ngIf
import { FormsModule } from '@angular/forms';         // ✅ عشان ngModel
import { Input, Output, EventEmitter } from '@angular/core';

interface Plan {
  id: number;
  name: string;
  type: string;
  price: number;
  duration: number;
}

@Component({
  selector: 'app-template-connections',
  standalone: true, // ✅ مهم
  imports: [CommonModule, FormsModule], // ✅ الحل هنا
  templateUrl: './manage-template-connections-modal.component.html',
})
export class TemplateConnectionsComponent {

@Input() template: any;
@Output() close = new EventEmitter<void>();
  search = '';

  plans: Plan[] = [
    { id: 1, name: 'Premium Adult Annual', type: 'Adult Membership', price: 1200, duration: 365 },
    { id: 2, name: 'Student Semester', type: 'Student Membership', price: 400, duration: 180 },
    { id: 3, name: 'Child Monthly', type: 'Child Membership', price: 60, duration: 30 },
  ];

  selectedPlans: Plan[] = [];

  filteredPlans(): Plan[] {
    return this.plans.filter(p =>
      p.name.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  isSelected(plan: Plan): boolean {
    return this.selectedPlans.some(p => p.id === plan.id);
  }

  togglePlan(plan: Plan) {
    if (this.isSelected(plan)) {
      this.selectedPlans = this.selectedPlans.filter(p => p.id !== plan.id);
    } else {
      this.selectedPlans.push(plan);
    }
  }

  removePlan(plan: Plan) {
    this.selectedPlans = this.selectedPlans.filter(p => p.id !== plan.id);
  }

  save() {
    console.log(this.selectedPlans);
  }

closeModal() {
  this.close.emit();
}
}
