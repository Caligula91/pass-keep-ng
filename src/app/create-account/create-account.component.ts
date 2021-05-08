import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as fromApp from '../store/app.reducer';
import * as AccountsActions from '../accounts/store/accounts.actions';
import { AccountsService } from '../accounts/accounts.service';
import { DatabaseService } from '../shared/services/database.service';
import { IconsSelectorComponent } from '../shared/modals/icons-selector/icons-selector.component';
import * as ServerAlert from '../shared/models/server-alert.model';
import { Alert } from '../shared/models/alert.model';
import { getAccountsState } from '../accounts/store/accounts.selector';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit, OnDestroy {

  imagePath: string = `${environment.API_DOMAIN}img/default.png`;
  createForm!: FormGroup;
  alert: Alert | null = null;
  isLoading: boolean = false;
  storeSub!: Subscription;

  constructor(
    private modalService: NgbModal, 
    private store: Store<fromApp.AppState>) { }
  
  ngOnDestroy(): void {
    // unsubscribe from store and clear alerts
    this.storeSub.unsubscribe();
    this.store.dispatch(AccountsActions.clearAlert());
  }

  ngOnInit(): void {

    this.storeSub = this.store.select(getAccountsState).subscribe(data => {
      this.isLoading = data.isLoading;
      this.alert = data.alert;
    });
    
    this.createForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      userEmail: new FormControl(null),
      password: new FormControl(null, Validators.required),
      image: new FormControl(this.imagePath),
    });
  }

  openIconsSelector() {
    this.modalService.open(IconsSelectorComponent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.imagePath = result;
      this.createForm.get('image')?.setValue(this.imagePath);
    }, (reason) => {
      
    });
  }

  onClear(): void {
    this.resetForm();
  }

  onSubmit(): void {
    this.store.dispatch(AccountsActions.addAccount({ newAccount: this.createForm.value }));
  }

  private resetForm(): void {
    this.imagePath = `${environment.API_DOMAIN}img/default.png`;
    this.createForm.patchValue({
      name: null,
      userEmail: null,
      password: null,
      image: this.imagePath,
    });
  }

}
