import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-data',
  templateUrl: './modal-data.component.html',
  styleUrls: ['./modal-data.component.css']
})
export class ModalDataComponent implements OnInit, AfterViewInit {
  @Input() visible = false;
  @Input() day: any;
  @Input() month: any;
  @Input() quantity: any;
  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<{ quantity: string; note: string }>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      txtQuantity: ['', Validators.nullValidator],
      txtNote: ['', [Validators.nullValidator ]]
    });
  }

  ngAfterViewInit() {
  
  }

  public updateForm():void {
    console.log('updateForm() called');
  }

  close() {
    this.closed.emit();
    console.log('Modal closed');
  }

  submit() {
    console.log('Form submitted:', this.form.value);
    if (this.form.valid) {
      console.log('Form is valid');
      console.log('this.form.get(txtQuantity) = ' + this.form.get('txtQuantity')?.value);
      console.log(this.form);
      console.log(this.form.value);
      this.submitted.emit(this.form.value);
      this.close();
    } else {
      this.form.markAllAsTouched(); // shows validation errors
    }
  }
}
