import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { TokenService } from '../../services/token.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {
  followers = [];
  user: any;
  socket: any;

  constructor(private userService: UsersService, private tokenService: TokenService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();

    this.getUserById();

    this.socket.on('refreshPage', data => {
      this.getUserById();
    });
  }

  getUserById() {
    this.userService.getUserById(this.user._id).subscribe(
      data => {
        this.followers = data.result.followers;
      },
      err => {
        console.log(err);
      }
    );
  }
}
