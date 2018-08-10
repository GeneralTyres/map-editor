import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({name: 'yearDisplayer'})
export class YearDisplayerPipe {
  constructor(private sanitizer: DomSanitizer) {}

  transform(html) {
    if (Number(html) > 0) {
      html += ' AD';
    } else if (Number(html) < 0) {
      const positive = Number(html) * -1;
      html = positive + ' BC';
    }
    return html;
  }
}
