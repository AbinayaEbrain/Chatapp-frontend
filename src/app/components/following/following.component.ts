import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { TokenService } from '../../services/token.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  following = [];
  user: any;
  socket: any;

  constructor(private userService: UsersService, private tokenService: TokenService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();

    this.getUser();

    this.socket.on('refreshPage', data => {
      this.getUser();
    });
  }

  getUser() {
    this.userService.getUserById(this.user._id).subscribe(
      data => {
        this.following = data.result.following;
      },
      err => {
        console.log(err);
      }
    );
  }

  unFollow(user) {
    this.userService.unFollowUser(user._id).subscribe(data => {
      this.socket.emit('refresh', {});
    });
  }
}
