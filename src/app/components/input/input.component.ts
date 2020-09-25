import { Component, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * @title Input with a clear button
 */
@Component({
  selector: 'input-component',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent {
  
  @Output() searchString = new EventEmitter<string>();
  
  input = new FormControl('');

  onSubmit() {
    this.searchString.emit(this.input.value);
  }
}