import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit, AfterViewInit {
  toolbarElement: any;
  online_Users = [];

  constructor() {}

  ngOnInit() {
    this.toolbarElement = document.querySelector('.nav-content');
  }

  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  }

  online(event) {
    // 'online_Users', This data will be sent to message cpmnt
    // Bind it in the html
    this.online_Users = event;
  }
}
