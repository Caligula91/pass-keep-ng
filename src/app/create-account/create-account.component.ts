import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountsService } from '../accounts/accounts.service';
import { DatabaseService } from '../shared/services/database.service';
import { IconsSelectorComponent } from '../shared/modals/icons-selector/icons-selector.component';
import * as ServerAlert from '../shared/models/server-alert.model';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit, OnDestroy {

  imagePath: string = `${environment.API_DOMAIN}img/default.png`;
  createForm!: FormGroup;
  success: string = '';
  error: string = '';
  isLoading: boolean = false;
  alertSub!: Subscription;

  constructor(
    private modalService: NgbModal, 
    private accountService: AccountsService, 
    private databaseService: DatabaseService) { }
  
  ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }

  ngOnInit(): void {
    this.alertSub = this.databaseService.serverAlert$.subscribe((alert) => {
      if (alert.action === ServerAlert.ActionTypes.AddAccount) {
        this.error = ''; 
        this.success = '';
        this.isLoading = false;
        if (alert.status === ServerAlert.Status.Success) {
          this.success = alert.message || 'Success';
          this.resetForm();
        } else if (alert.status === ServerAlert.Status.Error) {
          this.error = alert.message || 'Error';
        } else if (alert.status === ServerAlert.Status.Loading) {
          this.isLoading = true;
        }
      }
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
    this.accountService.addAccount(this.createForm.value);
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
