import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CoreService {
  isSidebarOpen: boolean = true;

  constructor() {}
}
