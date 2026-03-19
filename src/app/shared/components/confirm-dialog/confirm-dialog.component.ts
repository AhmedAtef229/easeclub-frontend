import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService, ConfirmData } from '../../../core/services/api/ui/confirm.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent implements OnInit {
  visible = false;
  data!: ConfirmData;

  constructor(private confirmService: ConfirmService) {}

  ngOnInit(): void {
    this.confirmService.getConfirm().subscribe((data) => {
      this.data = data;
      this.visible = true;
    });
  }

  onConfirm() {
    this.visible = false;
    this.confirmService.resolve(true);
  }

  onCancel() {
    this.visible = false;
    this.confirmService.resolve(false);
  }
}
