import { Component, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, EventEmitter, OnInit } from '@angular/core';
import { Strings, Generic } from '../../../shared/utils/utils';
import { trigger, sequence, style, animate, transition } from '@angular/animations';

export type TipoMensaje = 'warning' | 'error' | 'success' | 'info';

@Component({
  selector: 'amm-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        style({ transform: 'translateY(0)', height: '*', opacity: 1 }),
        sequence([
          animate('250ms ease-out', style({ transform: 'translateY(-16px)', height: 0, opacity: 0 }))
        ])
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageComponent implements OnInit, OnDestroy {
  @Input() typeMessage: TipoMensaje = 'info';
  @Input() closable = true;
  @Input() hideAfter = 15000;
  @Input() autoScroll = true;

  @Input() get msg(): string {
    return this._text;
  }

  set msg(value: string) {
    if (Generic.isNullOrUndefined(value) || typeof value !== 'string') {
      return;
    }
    if (this.timer) {
      clearTimeout(this.timer);
      delete this.timer;
    }

    this._text = value;
    this._hide = Strings.isEmpty(value.toString());

    if (this.hideAfter > 0) {
      this.timer = setTimeout(() => {
        this.hideMessage();
      }, this.hideAfter);
    }

    this.cdr.detectChanges();

    if (!this._hide && this.autoScroll) {
      const el = document.getElementById(this.controlID);
      if (el) {
        const bodyTop = document.body.getBoundingClientRect().top;
        const elemTop = el.getBoundingClientRect().top; // It's relative to Viewport
        const y = elemTop - bodyTop - 118; // 118 for the header
        if (y > 0) {
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    }
  }

  @Output() readonly msgChange = new EventEmitter<string>();

  static idCounter = 0;
  _text: string;
  _hide = true;
  controlID: string;

  private timer: NodeJS.Timer;

  constructor(private readonly cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    MessageComponent.idCounter++;
    this.controlID = `ammMessage${MessageComponent.idCounter}`;
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      delete this.timer;
    }
    delete this._text;
    this.msgChange.emit(null);
  }

  hideMessage(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      delete this.timer;
    }
    this._hide = true;
    this.msgChange.emit(null);
    this.cdr.detectChanges();
  }
}
