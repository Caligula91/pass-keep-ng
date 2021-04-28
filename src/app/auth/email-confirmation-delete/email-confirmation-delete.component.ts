import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-email-confirmation-delete',
  templateUrl: './email-confirmation-delete.component.html',
  styleUrls: ['./email-confirmation-delete.component.css']
})
export class EmailConfirmationDeleteComponent implements OnInit {

  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    const emailToken = this.route.snapshot.params['emailToken'];
    this.authService.deletePendingAccount(emailToken).subscribe(() => {
      this.isLoading = false;
    }, error => {
      this.router.navigate(['/']);
    })
  }

}
