import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyText'
})
export class EmptyTextPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) { return '(Текст відсутній)'; }
    return value;
  }

}
