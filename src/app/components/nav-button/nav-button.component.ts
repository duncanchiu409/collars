import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav-button',
  templateUrl: './nav-button.component.html',
  styleUrls: ['./nav-button.component.css']
})
export class NavButtonComponent implements OnInit {
  public toggleOn :boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  toggleButton() :void {
    this.toggleOn = !this.toggleOn
  }
}
