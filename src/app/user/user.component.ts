import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as UserActions from './store/user.actions';
import * as ServerResponse from '../shared/models/server-response.model';
import * as CustomValidators from '../shared/custom-validators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserOptionsComponent } from '../shared/modals/user-options/user-options.component';
import { getUserState } from './store/user.selector';
import { Alert } from '../shared/models/alert.model';
import { DeleteDeviceComponent } from '../shared/modals/delete-device/delete-device.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  userStoreSub!: Subscription;
  user: ServerResponse.User | null = null;
  currentDevice: ServerResponse.Device | null = null;
  isLoading: boolean = false;
  alert: Alert | null = null;
  /**
   * FORMS
   */
  editName: boolean = false;
  nameForm!: FormGroup;
  passwordForm!: FormGroup;
  deactivateForm!: FormGroup;
  deleteForm!: FormGroup;
  pinForm!: FormGroup;
  /**
   * MODES
   */
  updatePasswordMode: boolean = false;
  deactivateUserMode: boolean = false;
  deleteUserMode: boolean = false;
  resetPinMode: boolean = false;
  viewMode: boolean = true;

  constructor(
    private modalService: NgbModal,
    private store: Store<fromApp.AppState>) { }

  turnOnMode(mode: string) {
    this.editName = false;
    this.updatePasswordMode = mode === 'updatePasswordMode';
    this.deactivateUserMode = mode === 'deactivateUserMode';
    this.deleteUserMode = mode === 'deleteUserMode';
    this.resetPinMode = mode === 'resetPinMode';
    this.viewMode = mode === 'viewMode';
    if (this.viewMode) {
      this.passwordForm.reset();
      this.deactivateForm.reset();
      this.deleteForm.reset();
      this.pinForm.reset();
    } else {
      this.alert = null;
    }
  }
  
  private initForms() {

    // NAME FORM
    this.nameForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(30)
      ])
    }, { validators: CustomValidators.validCharacters });
    
    // PASSWORD FORM
    this.passwordForm = new FormGroup({
      passwordCurrent: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      passwordConfirm: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    }, { validators: CustomValidators.passwordsMatch });

    // DEACTIVATE FORM
    this.deactivateForm = new FormGroup({
      deactivate: new FormControl(null)
    }, { validators: CustomValidators.validDeactivate });

    // DELETE FORM
    this.deleteForm = new FormGroup({
      password: new FormControl(null, [Validators.required]),
      delete: new FormControl(null)
    }, { validators: CustomValidators.validDelete });

    // PIN FORM
    this.pinForm = new FormGroup({
      password: new FormControl(null, Validators.required),
      pin: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)]),
      pinConfirm: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)])
    }, { validators: CustomValidators.pinsMatch });
  }

  ngOnDestroy(): void {
    this.userStoreSub.unsubscribe();
  }

  ngOnInit(): void {

    this.store.dispatch(UserActions.fetchUser());
    
    this.initForms();

    this.userStoreSub = this.store.select(getUserState).subscribe(data => {
      this.isLoading = data.isLoading;
      this.user = data.user;
      this.currentDevice = data.currentDevice;
      this.alert = data.alert;
      this.nameForm.get('name')?.setValue(this.user?.name);
      if (this.alert?.type === 'SUCCESS') this.turnOnMode('viewMode');
    });
  }

  /**
   * MOBILE VIEW ONLY
   */
  onOpenMenuMobile(): void {
    this.modalService.open(UserOptionsComponent, {ariaLabelledBy: 'modal-basic-title', size: 'sm' }).result.then((result) => {
      switch(result) {
        case 'name': {
          this.editName = true;
          break;
        }
        case 'password': {
          this.turnOnMode('updatePasswordMode');
          break;
        }
        case 'deactivate': {
          this.turnOnMode('deactivateUserMode');
          break;
        }
        case 'delete': {
          this.turnOnMode('deleteUserMode');
          break;
        }
        case 'pin': {
          this.turnOnMode('resetPinMode');
          break;
        }
        default: {
          break;
        }
      }
    }, (reason) => {
      
    });
  }

  onEditName(): void {
    this.nameForm.get('name')?.setValue(this.user?.name);
    this.editName = !this.editName;
  }

  onSubmitUpdateName(): void {
    this.store.dispatch(UserActions.updateUser({ updateData: this.nameForm.value }));
  }

  onSubmitUpdatePassword(): void {
    this.store.dispatch(UserActions.updatePassword({ passwordData: this.passwordForm.value }));
  }

  onSubmitDeactivateUser(): void {
    this.store.dispatch(UserActions.deactivateUser());
  }

  onSubmitDeleteUser(): void {
    this.store.dispatch(UserActions.deleteUser({ password: this.deleteForm.get('password')?.value }));
  }

  onSubmitResetPin(): void {
    this.store.dispatch(UserActions.resetPin({ pinData: this.pinForm.value }));
  }

  onRemoveDevice(deviceId: string): void {
      this.modalService.open(DeleteDeviceComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(result => {
        this.store.dispatch(UserActions.deleteLoggedDevice({ deviceId }));
      }, reason => {});
  }

}
