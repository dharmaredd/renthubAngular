import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appartmentList',
})
export class AppartmentListPipe implements PipeTransform {
  transform(value: Array<any>, searchString?: string): Array<any> {
    if (!searchString) return value;
    return value.filter((res: any) =>
      res.name.toLowerCase().includes(searchString.toLowerCase()),
    );
  }
}
