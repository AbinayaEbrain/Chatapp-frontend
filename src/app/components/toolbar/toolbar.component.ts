import { Component, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import { UsersService } from '../../services/users.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  @Output() onlineUsers = new EventEmitter(); // To send data from one compnt to other and the data is emitted in 'ngAfterViewInit'
  user: any;
  notifications = [];
  socket: any;
  count = [];
  chatList = [];
  msgNumber = 0;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private userService: UsersService,
    private messageService: MessageService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();

    this.getUser();

    this.socket.on('refreshPage', data => {
      this.getUser();
    });

    // Emit the event to get online
    this.socket.emit('online', { room: 'global', user: this.user.username });

    const dropDownElement = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropDownElement, {
      hover: true,
      alignment: 'right',
      coverTrigger: false
    });

    const dropDownElementTwo = document.querySelectorAll('.dropdown-trigger1');
    M.Dropdown.init(dropDownElementTwo, {
      alignment: 'left',
      hover: true,
      coverTrigger: false
    });
  }

  ngAfterViewInit() {
    this.socket.on('usersOnline', data => {
      this.onlineUsers.emit(data); // To emit data to other compnt..'onlineUsers' is declared in Output decorator
    });
  }

  logout() {
    this.tokenService.deleteToken();
    this.router.navigate(['']);
  }

  goToHome() {
    this.router.navigate(['streams']);
  }

  gotoChat(name) {
    this.router.navigate(['/chats', name]);
    this.messageService.markMessages(this.user.username, name).subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

  getUser() {
    this.userService.getUserById(this.user._id).subscribe(
      data => {
        this.notifications = data.result.notifications.reverse();
        //'filter' method is going to filter the notifications array and looking for read property which is false
        const value = _.filter(this.notifications, ['read', false]);
        this.count = value;
        this.chatList = data.result.chatList;
        this.checkIfRead(this.chatList);
      },
      err => {
        if (err.error.token === null) {
          this.tokenService.deleteToken();
          this.router.navigate(['']);
        }
      }
    );
  }

  checkIfRead(arr) {
    const msgArr = [];
    for (let i = 0; i < arr.length; i++) {
      const receiver = arr[i].messageId.message[arr[i].messageId.message.length - 1]; // To get last data in array
      if (this.router.url !== `/chats/${receiver.senderName}`) {
        if (receiver.isRead === false && receiver.receiverName === this.user.username) {
          msgArr.push(1);
          this.msgNumber = _.sum(msgArr);
        }
      }
    }
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  markAll() {
    this.userService.markAllRead().subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

  markAllMessages() {
    this.messageService.markAllMessages().subscribe(data => {
      this.socket.emit('refresh', {});
      this.msgNumber = 0;
    });
  }

  messageDate(data) {
    return moment(data).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: '[DD/MM/YYYY]',
      sameElse: '[DD/MM/YYYY]'
    });
  }
}
