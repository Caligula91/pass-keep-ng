import { Pipe, PipeTransform } from '@angular/core';
import { Account } from 'src/app/shared/models/account.model';

@Pipe({
  name: 'accountsFilterPipe'
})
export class AccountsFilterPipe implements PipeTransform {

  transform(value: Account[], sortBy: string, order: string, search?: string): Account[] {
    if (sortBy === 'name') {
      value.sort((a, b) => {
        return (order === 'DESC')
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      })
    }

    if (sortBy === 'modified') {
      value.sort((a, b) => {
        let compare = 0;
        if (a.modified.getTime() > b.modified.getTime())
          compare = 1;
        else if (a.modified.getTime() < b.modified.getTime())
          compare = -1;
        return (order === 'DESC')
          ? compare * -1
          : compare * 1;
      })
    }

    if (search) {
      return value.reduce((acc, curr) => {
        if (curr.name.toLowerCase().startsWith(search.toLocaleLowerCase()))
          acc.push(curr);
        return acc;
      }, new Array<Account>())
    }
    return value;
  }

}
