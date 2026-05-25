import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface DropdownOption {
  value: any;
  label: string;
}

@Component({
  selector: 'app-form-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-dropdown.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormDropdownComponent),
      multi: true
    }
  ]
})
export class FormDropdownComponent implements ControlValueAccessor {
  @Input() options: (string | DropdownOption)[] = [];
  @Input() placeholder: string = 'Select option';
  @Input() width: string = 'w-full';
  @Input() disabled: boolean = false;

  isOpen = false;
  selectedValue: any = null;

  // ControlValueAccessor methods
  onChange: any = () => {};
  onTouch: any = () => {};

  get parsedOptions(): DropdownOption[] {
    return this.options.map(opt => {
      if (typeof opt === 'string') {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }

  get selectedLabel(): string {
    const matched = this.parsedOptions.find(o => o.value === this.selectedValue);
    return matched ? matched.label : this.placeholder;
  }

  toggle() {
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
  }

  select(value: any) {
    if (this.disabled) return;
    this.selectedValue = value;
    this.onChange(value);
    this.onTouch();
    this.isOpen = false;
  }

  // ControlValueAccessor interface
  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
