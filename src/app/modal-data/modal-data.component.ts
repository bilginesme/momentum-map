import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-data',
  templateUrl: './modal-data.component.html',
  styleUrls: ['./modal-data.component.css']
})
export class ModalDataComponent implements OnInit {
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<{ name: string; email: string }>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  close() {
    this.closed.emit();
  }

  submit() {
    if (this.form.valid) {
      this.submitted.emit(this.form.value);
      this.close();
    } else {
      this.form.markAllAsTouched(); // shows validation errors
    }
  }
}
