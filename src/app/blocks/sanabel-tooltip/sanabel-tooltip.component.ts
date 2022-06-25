import { trigger, transition, style, animate } from '@angular/animations';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'sanabel-tooltip',
  templateUrl: './sanabel-tooltip.component.html',
  styleUrls: ['./sanabel-tooltip.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tooltip', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(300, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate(300, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class SanabelTooltipComponent {
  @Input() text = '';

}
