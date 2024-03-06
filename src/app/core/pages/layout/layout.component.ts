import { Component } from '@angular/core';
import { CoreService } from '../../services/core.service';
CoreService;
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  constructor(public coreService: CoreService) {}
}
