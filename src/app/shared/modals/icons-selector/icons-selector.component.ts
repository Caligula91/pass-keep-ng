import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as ServerResponse from '../../models/server-response.model';

@Component({
  selector: 'app-icons-selector',
  templateUrl: './icons-selector.component.html',
  styleUrls: ['./icons-selector.component.css']
})
export class IconsSelectorComponent implements OnInit {

  selectedIcon: string = '';
  icons!: string[];
  search: string = '';


  constructor(public activeModal: NgbActiveModal, private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<ServerResponse.GetImages>(`${environment.API_DOMAIN}img`).pipe(
      map(res => res.images),
      tap(icons => this.icons = icons)
    ).subscribe();
  }

  onSelectIcon(event: MouseEvent): void {
    if (event.target instanceof HTMLImageElement) {
      this.selectedIcon = event.target.src;
    }
  }

  onDoubleClick(event: MouseEvent): void {
    if (event.target instanceof HTMLImageElement) {
      this.selectedIcon = event.target.src;
      this.activeModal.close(this.selectedIcon);
    }
  }

}
