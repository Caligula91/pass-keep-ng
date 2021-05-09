import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import * as AccountsActions from '../store/accounts.actions';
import { Account } from 'src/app/shared/models/account.model';
import { AccountsService } from '../accounts.service';
import { ClickTargets } from '../accounts-card/click-targets.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PinEnterComponent } from 'src/app/shared/modals/pin-enter/pin-enter.component';
import { getAccountsState } from '../store/accounts.selector';
import { Alert } from 'src/app/shared/models/alert.model';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.css']
})
export class AccountsListComponent implements OnInit, OnDestroy {

  accounts!: Account[];
  private storeSub!: Subscription;
  private accountId!: string;
  alertAccountId: string | null = null;
  /** ALERT */
  alert: Alert | null = null;
  /** FILTER */
  filtersSub!: Subscription;
  sortBy!: string;
  order!: string;
  search!: string;

  constructor(
    private accountsService: AccountsService, 
    private modalService: NgbModal, 
    private store: Store<fromApp.AppState>) { }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.filtersSub.unsubscribe();
  }

  ngOnInit(): void {

    this.storeSub = this.store.select(getAccountsState).subscribe(data => {
      this.accounts = data?.accounts?.slice() || [];
      this.alertAccountId = data.focusedAccount;
      this.alert = data.alert;
    });

    this.filtersSub = this.accountsService.accountsFilter$.subscribe((fitlersObj) => {
      this.search = fitlersObj.search;
      this.order = fitlersObj.order;
      this.sortBy = fitlersObj.sortBy;
    });

  }

  onClick(event: MouseEvent) {
    const target = (event.target as HTMLElement)
    const action = this.getClickTarget(target);
    if (action) {
      this.accountId = this.getParentDivId(target);
      switch (action) {
        case ClickTargets.StartEdit: {
          this.accountsService.startEdit(this.accountId);
          break;
        }
        case ClickTargets.EndEdit: {
          this.accountsService.endEdit(this.accountId);
          break;
        }
        case ClickTargets.ButtonExit: {
          this.accountsService.endEdit(this.accountId);
          break;
        }
        case ClickTargets.DeleteAccount: {
          this.accountsService.deleteAccount(this.accountId);
          break;
        }
        case ClickTargets.ShowPassword: {
          this.modalService.open(PinEnterComponent, {ariaLabelledBy: 'modal-basic-title', size: 'sm'}).result.then((result) => {
            this.store.dispatch(AccountsActions.fetchPassword({ accountId: this.accountId, pin: result.pin }));
          }, (reason) => {
          });
          break;
        }
        case ClickTargets.AddImage: {
          this.accountsService.addImage(this.accountId);
          break;
        }
        case ClickTargets.PasswordVisibility: {
          this.accountsService.togglePasswordVisibility(this.accountId);
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  private getParentDivId(target: HTMLElement): string {
    while(
      target.parentElement instanceof HTMLElement && 
      !target.classList.contains('account-card')) {
        target = target.parentElement;
    }
    return target.id;

  }

  private getClickTarget(target: HTMLElement): string {
    const values = Object.values(ClickTargets);
    for (let value of values) {
      if (target.classList.contains(value))
        return value;
    }
    return '';
  }

}
