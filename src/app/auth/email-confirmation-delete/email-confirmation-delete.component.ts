import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-email-confirmation-delete',
  templateUrl: './email-confirmation-delete.component.html',
  styleUrls: ['./email-confirmation-delete.component.css']
})
export class EmailConfirmationDeleteComponent implements OnInit {

  isLoading: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    const emailToken = this.route.snapshot.params['emailToken'];
    const url = `${environment.API_HOST}users/email-confirmation/${emailToken}`;
    this.http.delete<null>(url).subscribe(() => this.isLoading = false, () => this.router.navigate(['/not-found']));
  }

}
