import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { CardChoiceComponent } from 'src/app/shared/modals/card-choice/card-choice.component';
import { Account } from 'src/app/shared/models/account.model';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { IconsSelectorComponent } from '../../shared/modals/icons-selector/icons-selector.component';
import { AccountsService } from '../accounts.service';

import { ClickTargets } from './click-targets.model';

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
  private sub!: Subscription;
  private alertSub!: Subscription;
  isLoading: boolean = false;
  private intervalId: any;
  secondsLeft: number = 5;
  activeCard: string = '';

  public get ClickTargets() {
    return ClickTargets; 
  }

  constructor(
    private modalService: NgbModal, 
    private accountsService: AccountsService,
    private databaseService: DatabaseService) { }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.alertSub.unsubscribe();
    clearInterval(this.intervalId); 
  }
  
  ngOnInit(): void {
    this.previewEditImage = this.account.image
    
    this.sub = this.accountsService.accountAction$.subscribe(data => {
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
          case ClickTargets.ShowPassword: {
            this.password = data.payload ? data.payload : '';
            if (this.intervalId) clearInterval(this.intervalId);
            this.intervalId = setInterval(() => {
              this.secondsLeft--;
              if (this.secondsLeft === 0) {
                this.secondsLeft = 5;
                clearInterval(this.intervalId);
                this.password = '';
              } 
            }, 1000);
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

    this.alertSub = this.databaseService.serverAlert$.pipe(
      filter(alert => alert.action === 'GET_ACCOUNT_PASSWORD'),
    ).subscribe(alert => {
      if (alert.status === 'LOADING') {
        this.isLoading = true;
        this.activeCard = String(alert.payload) || '';
      } else {
        this.isLoading = false;
      }
    })
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
    this.accountsService.updateAccount(this.account.id, this.editForm.value);
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
