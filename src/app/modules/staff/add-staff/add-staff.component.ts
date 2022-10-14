import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-staff',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-staff.component.html',
  styleUrls: ['./add-staff.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddStaffComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
