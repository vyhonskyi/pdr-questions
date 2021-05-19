import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'questionImageUrl'
})
export class QuestionImageUrlPipe implements PipeTransform {

  transform(value: string): string {
    const imgName = value.split('/').reverse()[0];

    if (imgName == 'no_image.png') { return ''; }

    return `assets/img/${imgName}`;
  }

}
