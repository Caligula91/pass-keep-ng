import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit {

  isLoading: boolean = true;
  userEmail: string = '';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {    
    const emailToken = this.route.snapshot.params['emailToken'];
    this.authService.confirmEmail(emailToken).subscribe(email => {
      this.isLoading = false;
      this.userEmail = email;
    }, error => {
      this.router.navigate(['/']);
    })
  }

}
