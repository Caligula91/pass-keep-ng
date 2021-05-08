import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as AccountsActions from './store/accounts.actions';
import { ClickTargets } from './accounts-card/click-targets.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmComponent } from '../shared/modals/delete-confirm/delete-confirm.component';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  accountAction$ = new Subject<{
    type: ClickTargets,
    accountId: string,
    payload?: string,
  }>();
  accountsFilter$ = new BehaviorSubject<{ sortBy: string, order: string, search: string }>({ 
    sortBy: 'name',
    order: 'ASC',
    search: '',
  });

  constructor(private modalService: NgbModal, private store: Store<fromApp.AppState>) { }

  startEdit(accountId: string): void {
    this.accountAction$.next({ type: ClickTargets.StartEdit, accountId });
  }

  endEdit(accountId: string): void {
    this.accountAction$.next({ type: ClickTargets.EndEdit, accountId });
  }

  deleteAccount(accountId: string): void {
    this.modalService.open(DeleteConfirmComponent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.store.dispatch(AccountsActions.deleteAccount({ accountId }))
    }, (reason) => {
    })
  }

  addImage(accountId: string): void {
    this.accountAction$.next({ type: ClickTargets.AddImage, accountId });
  }

  togglePasswordVisibility(accountId: string): void {
    this.accountAction$.next({ type: ClickTargets.PasswordVisibility, accountId });
  }

}
