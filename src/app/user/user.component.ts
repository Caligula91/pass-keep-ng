import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as ServerResponse from '../shared/models/server-response.model';
import * as CustomValidators from '../shared/custom-validators';
import { UserService } from './user.service';
import { DatabaseService } from '../shared/services/database.service';
import { filter, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserOptionsComponent } from '../shared/modals/user-options/user-options.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {

  user!: ServerResponse.User;
  alertSub!: Subscription;
  error: string = '';
  success: string = '';
  serverError: boolean = false;
  isLoading: boolean = false;
  editName: boolean = false;
  /**
   * FORMS
   */
  nameForm!: FormGroup;
  passwordForm!: FormGroup;
  deactivateForm!: FormGroup;
  deleteForm!: FormGroup;
  /**
   * MODES
   */
  updatePasswordMode: boolean = false;
  deactivateUserMode: boolean = false;
  deleteUserMode: boolean = false;
  viewMode: boolean = true;

  constructor(private userService: UserService, private databaseService: DatabaseService, private modalService: NgbModal) { }

  turnOnMode(mode: string) {
    this.editName = false;
    this.updatePasswordMode = mode === 'updatePasswordMode';
    this.deactivateUserMode = mode === 'deactivateUserMode';
    this.deleteUserMode = mode === 'deleteUserMode';
    this.viewMode = mode === 'viewMode';
    if (this.viewMode) {
      this.passwordForm.reset();
      this.deactivateForm.reset();
      this.deleteForm.reset();
    } else {
      this.error = '';
      this.success = '';
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
  }

  ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }

  ngOnInit(): void {

    this.initForms();

    this.alertSub = this.databaseService.serverAlert$.pipe(
      filter(alert => 
        alert.action === 'GET_ME' || 
        alert.action === 'UPDATE_NAME' || 
        alert.action === 'UPDATE_PASSWORD' ||
        alert.action === 'DEACTIVATE_USER' ||
        alert.action === 'DELETE_USER'),
      tap(alert => this.isLoading = alert.status === 'LOADING'),
      tap(() => {
        this.error = '';
        this.success = '';
        this.serverError = false;
      })
    ).subscribe(alert => {
      // ERROR
      if (alert.status === 'ERROR') {
        this.error = alert.message || 'unknown error';
        this.serverError = alert.payload === 500 || alert.payload === 0;

      // SUCCESS
      } else if (alert.status === 'SUCCESS') {
        this.success =  alert.action !== 'GET_ME' 
          ? alert.message || 'success'
          : '';
        if (alert.action === 'UPDATE_PASSWORD') {
          this.turnOnMode('viewMode');
          this.passwordForm.reset();
        }
      }
    });

    this.fetchUserInfo();
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
        default: {
          break;
        }
      }
    }, (reason) => {
      
    });
  }

  onEditName(): void {
    this.nameForm.get('name')?.setValue(this.user.name);
    this.editName = !this.editName;
  }

  fetchUserInfo(): void {
    this.userService.fetchUserInfo().subscribe(user => {
      this.user = user;
      this.nameForm.get('name')?.setValue(this.user.name);
    });
  }

  onSubmitUpdateName(): void {
    this.editName = false;
    this.userService.updateName(this.nameForm.value).subscribe(user => {
      this.user = user;
      this.nameForm.get('name')?.setValue(this.user.name);
    });
  }

  onSubmitUpdatePassword(): void {
    this.userService.updatePassword(this.passwordForm.value).subscribe();
  }

  onSubmitDeactivateUser(): void {
    this.userService.deactivateUser();
  }

  onSubmitDeleteUser(): void {
    this.userService.deleteUser(this.deleteForm.get('password')?.value);
  }

}
