import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatCurrencyService {
  GROUP_SEPARATOR = ",";
  DECIMAL_SEPARATOR = ".";
  constructor() { }

  formatSalary(valString:any) {
    if (!valString) {
      return '';
    }
    let val = valString.toString();
    const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
    return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR) + (!parts[1] ? '' : this.DECIMAL_SEPARATOR + parts[1]);
  };
  unFormat(val:any) {
    if (!val) {
      return '';
    }
    val = val.replace(/^0+/, '');
  
  
    if (this.GROUP_SEPARATOR === ',') {
      return val.replace(/,/g, '');
    } else {
      return val.replace(/\./g, '');
    }
  };
}
