import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent implements OnInit, OnDestroy {

  @Input() placeholder = 'Search...';
  @Output() search = new EventEmitter<string>();

  private searchSubject = new Subject<string>();
  private subscription?: Subscription;

  ngOnInit() {
    // Wait for 400ms after the user stops typing, and only emit if the value changed
    this.subscription = this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(value => {
      this.search.emit(value);
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  onInput(value: string) {
    this.searchSubject.next(value);
  }
}
