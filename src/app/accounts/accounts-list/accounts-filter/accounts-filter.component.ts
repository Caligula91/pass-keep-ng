import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../../store/app.reducer';
import * as AccountsActions from '../../store/accounts.actions';
import { map, take } from 'rxjs/operators';
import { AccountsService } from '../../accounts.service';
import { Subscription } from 'rxjs';
import { getAccountsState } from '../../store/accounts.selector';

@Component({
  selector: 'app-accounts-filter',
  templateUrl: './accounts-filter.component.html',
  styleUrls: ['./accounts-filter.component.css']
})
export class AccountsFilterComponent implements OnInit, OnDestroy {

  filterForm!: FormGroup;
  reloadEnabled: boolean = true;
  accountsStoreSub!: Subscription;
  filterOptionsSub!: Subscription;

  constructor(private accountsService: AccountsService, private store: Store<fromApp.AppState>) { }
  ngOnDestroy(): void {
    this.accountsStoreSub.unsubscribe();
    this.filterOptionsSub.unsubscribe();
  }

  ngOnInit(): void {
    
    this.filterForm = new FormGroup({
      search: new FormControl(null),
      options: new FormControl('name_ASC'),
    });
    
    this.filterOptionsSub = this.accountsService.accountsFilter$.pipe(
      take(1),
      map(filterObj => {
        const options = `${filterObj.sortBy}_${filterObj.order}`;
        const search = filterObj.search;
        return { search, options };
      })
    ).subscribe(formControls => {
      this.filterForm.setValue({
        search: formControls.search,
        options: formControls.options,
      })
    })

    this.filterForm.valueChanges.subscribe(data => {
      const arr = data.options.split('_');
      const sortBy = arr[0];
      const order = arr[1];
      const search = data.search;
      this.accountsService.accountsFilter$.next({ sortBy, order, search });
    });

    this.accountsStoreSub = this.store.select(getAccountsState).subscribe(data => {
      this.reloadEnabled = !data.fetchingPassword && !data.isLoading;
    })

  }

  onReload(): void {
    if (this.reloadEnabled) this.store.dispatch(AccountsActions.fetchAccounts());
  }

}
