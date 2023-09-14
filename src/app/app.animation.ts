import { trigger, style, animate, transition } from '@angular/animations';

export const fadeInAnimation = trigger('myInsertRemoveTrigger', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate(1000, style({ opacity: 1 })),
  ]),
  transition(':leave', [
    style({ opacity: 1 }),
    animate(1000, style({ opacity: 0 })),
  ]),
]);
