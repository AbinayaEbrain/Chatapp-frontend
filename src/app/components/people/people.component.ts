import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import _ from 'lodash';
import { TokenService } from '../../services/token.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  users = [];
  loggedInUser: any;
  userArray = [];
  socket: any;
  online_users = [];

  constructor(private userService: UsersService, private tokenService: TokenService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getAllUsers();
    this.getUserById();

    this.socket.on('refreshPage', data => {
      this.getAllUsers();
      this.getUserById();
    });
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(data => {
      //to remove the loggedin user from the array
      //To do this pass the total array (data.result) and remove the username
      _.remove(data.result, { username: this.loggedInUser.username });
      this.users = data.result;
    });
  }

  followUser(user) {
    this.userService.followUser(user._id).subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }

  getUserById() {
    this.userService.getUserById(this.loggedInUser._id).subscribe(data => {
      this.userArray = data.result.following;
    });
  }

  checkInArray(arr, id) {
    //to find the id is existing in the loggedInUser array
    const result = _.find(arr, ['userFollowed._id', id]); //refer lodash.com
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  online(event) {
    this.online_users = event;
  }

  checkIfOnline(name) {
    const resultOnline = _.indexOf(this.online_users, name);
    if (resultOnline > -1) {
      return true;
    } else {
      return false;
    }
  }
}
