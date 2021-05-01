import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Account } from 'src/app/shared/models/account.model';
import { AccountsService } from '../accounts.service';
import { ClickTargets } from '../accounts-card/click-targets.model';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { filter, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PinEnterComponent } from 'src/app/shared/modals/pin-enter/pin-enter.component';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.css']
})
export class AccountsListComponent implements OnInit, OnDestroy {

  accounts!: Account[];
  private accountsSub!: Subscription;
  alertSub!: Subscription;
  private accountId!: string;
  alertAccountId!: string;
  /** ALERT */
  error: string = '';
  success: string = '';
  /** FILTER */
  filtersSub!: Subscription;
  sortBy!: string;
  order!: string;
  search!: string;
  /** UPDATING */
  updating: boolean = false;

  resetPin: boolean = false;

  constructor(private accountsService: AccountsService, private databaseService: DatabaseService, private modalService: NgbModal) { }

  ngOnDestroy(): void {
    this.accountsSub.unsubscribe();
    this.filtersSub.unsubscribe();
    this.alertSub.unsubscribe();
  }

  ngOnInit(): void {

    this.accountsSub = this.accountsService.accounts$.subscribe((accounts) => {
      this.accounts = accounts;
    });

    this.filtersSub = this.accountsService.accountsFilter$.subscribe((fitlersObj) => {
      this.search = fitlersObj.search;
      this.order = fitlersObj.order;
      this.sortBy = fitlersObj.sortBy;
    });

    this.alertSub = this.databaseService.serverAlert$.pipe(
      tap(() => this.resetPin = false),
      tap(alert => {
        if (alert.action === 'GET_ACCOUNT_PASSWORD') {
          if (alert.status === 'ERROR') {
            this.success = '';
            this.error = alert.message || 'Failed to get password';
            this.resetPin = alert.payload === 401;
            this.alertAccountId = this.accountId
          } else if (alert.status === 'SUCCESS') {
            this.error = '';
          } else if (alert.status === 'LOADING') {
            this.error = '';
            this.success = '';
          }
        }
      }),
      filter(alert => alert.action === 'UPDATE_ACCOUNT'),
      tap(alert => this.updating = alert.status === 'LOADING'),
      tap(() => {
        this.error = '';
        this.success = '';
      }),
      tap(() => this.alertAccountId = this.accountId),
    ).subscribe(alert => {
      if (alert.status === 'SUCCESS') {
        this.success = alert.message || 'Tasks completed successfully';
      } else if (alert.status === 'ERROR') {
        this.error = alert.message || 'Task failed';
      }
    })

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
            this.accountsService.getAccountPassword(this.accountId, result.pin);
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
