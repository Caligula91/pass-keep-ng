import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-icons-selector',
  templateUrl: './icons-selector.component.html',
  styleUrls: ['./icons-selector.component.css']
})
export class IconsSelectorComponent implements OnInit {

  selectedIcon: string = '';
  icons!: string[];
  search: string = '';


  constructor(public activeModal: NgbActiveModal, private databaseService: DatabaseService) { }

  ngOnInit(): void {
    this.databaseService.fetchIcons().subscribe((icons) => {
      this.icons = icons;
    })
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
