import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {
  _message: string;

  @Input() set message(value: string) {
    this._message = value;
    this.cdr.detectChanges();
  }

  constructor(private readonly cdr: ChangeDetectorRef) { }
}
