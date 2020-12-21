import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { TokenService } from '../../services/token.service';
import io from 'socket.io-client';
import * as moment from 'moment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  socket: any;
  notifications = [];
  user: any;

  constructor(private userService: UsersService, private tokenService: TokenService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();

    this.getNotifications();

    this.socket.on('refreshPage', data => {
      this.getNotifications();
    });
  }

  getNotifications() {
    this.userService.getUserById(this.user._id).subscribe(data => {
      this.notifications = data.result.notifications.reverse();
    });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  markNotication(data) {
    this.userService.markNotification(data._id).subscribe(body => {
      this.socket.emit('refresh',{});
    });
  }

  deleteNotification(data) {
    this.userService.markNotification(data._id ,true).subscribe(body => {
      this.socket.emit('refresh',{});
    });
  }
}
