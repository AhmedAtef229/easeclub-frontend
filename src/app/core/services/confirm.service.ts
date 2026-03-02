import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ConfirmData {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  private confirmSubject = new Subject<ConfirmData>();
  private responseSubject = new Subject<boolean>();

  confirm(data: ConfirmData): Observable<boolean> {
    this.confirmSubject.next(data);
    return this.responseSubject.asObservable();
  }

  getConfirm(): Observable<ConfirmData> {
    return this.confirmSubject.asObservable();
  }

  resolve(response: boolean) {
    this.responseSubject.next(response);
  }
}
