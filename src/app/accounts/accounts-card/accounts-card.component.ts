import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import * as AccountsActions from '../store/accounts.actions';
import { CardChoiceComponent } from 'src/app/shared/modals/card-choice/card-choice.component';
import { Account } from 'src/app/shared/models/account.model';
import { IconsSelectorComponent } from '../../shared/modals/icons-selector/icons-selector.component';
import { AccountsService } from '../accounts.service';

import { ClickTargets } from './click-targets.model';
import { getAccountsState } from '../store/accounts.selector';

@Component({
  selector: 'app-accounts-card',
  templateUrl: './accounts-card.component.html',
  styleUrls: ['./accounts-card.component.css']
})
export class AccountsCardComponent implements OnInit, OnDestroy {

  @Input() account!: Account;
  editMode: boolean = false;
  fieldTextType: boolean = false;
  editForm!: FormGroup;
  previewEditImage!: string;
  password: string = '';
  private accountModeSub!: Subscription;
  isLoading: boolean = false;
  fetchingPassword: boolean = false;
  private intervalId: any;
  secondsLeft: number = 5;

  public get ClickTargets() {
    return ClickTargets; 
  }

  constructor(
    private modalService: NgbModal, 
    private accountsService: AccountsService,
    private store: Store<fromApp.AppState>) { }

  ngOnDestroy(): void {
    this.accountModeSub.unsubscribe();
    clearInterval(this.intervalId); 
  }
  
  ngOnInit(): void {
    this.previewEditImage = this.account.image
    
    this.accountModeSub = this.accountsService.accountAction$.subscribe(data => {
      if (data.accountId === this.account.id) {
        switch (data.type) {
          case ClickTargets.StartEdit: {
            this.editMode = true;
            this.initForm();
            break;
          }
          case ClickTargets.EndEdit: {
            this.endEditMode();
            this.previewEditImage = this.account.image;
            break;
          }
          case ClickTargets.ButtonExit: {
            this.endEditMode();
            this.previewEditImage = this.account.image;
            break;
          }
          case ClickTargets.DeleteAccount: {
            break;
          }
          case ClickTargets.AddImage: {
            this.openIconsSelector();
            break;
          }
          case ClickTargets.PasswordVisibility: {
            this.fieldTextType = !this.fieldTextType;
            break;
          }
          default: {
            break;
          }
        }
      } else if (data.type === ClickTargets.StartEdit || data.type === ClickTargets.DeleteAccount) {
        this.editMode = false;
        this.fieldTextType = false;
      }
    })

    this.store.select(getAccountsState).subscribe(data => {
      if (data.focusedAccount === this.account.id) {
        if (data.password) this.handlePassword(data.password);
        this.isLoading = data.isLoading;
        this.fetchingPassword = data.fetchingPassword;
      }
    })

  }

  private handlePassword(password: string): void {
    this.password = password;
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.secondsLeft--;
      if (this.secondsLeft === 0) {
        this.secondsLeft = 5;
        clearInterval(this.intervalId);
        this.password = '';
      } 
    }, 1000);
  }

  /**
   * MODAL
   */
  private openIconsSelector() {
    this.modalService.open(IconsSelectorComponent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.editForm.get('image')?.setValue(result);
      this.previewEditImage = result;
    }, (reason) => {
      
    });
  }

  /**
   * EDIT RELATED
   */
  private initForm(): void {
    this.editForm = new FormGroup({
      name: new FormControl(this.account.name),
      userEmail: new FormControl(this.account.userEmail),
      password: new FormControl(null),
      image: new FormControl(this.account.image),
    })
  }

  private endEditMode() {
    if (this.editForm) this.editForm.reset();
    this.editMode = false;
    this.fieldTextType = false;
  }

  onSubmit() {
    /**
     * PREVENT FROM SENDING SAME NAME
     */
    if (this.account.name === this.editForm.get('name')?.value) {
      this.editForm.get('name')?.setValue('');
    }
    this.store.dispatch(AccountsActions.updateAccount({ accountId: this.account.id, updateFields: this.editForm.value }));
    this.endEditMode();
  }

  /**
   * MOBILE VIEW ONLY
   */
  onOpenMenu(): void {
    this.modalService.open(CardChoiceComponent, {ariaLabelledBy: 'modal-basic-title', size: 'sm' }).result.then((result) => {
      // delete | edit
      if (result === 'edit') {
        this.accountsService.startEdit(this.account.id);
      } else if (result === 'delete') {
        this.accountsService.deleteAccount(this.account.id);
      }
    }, (reason) => {
      
    });
  }

}
