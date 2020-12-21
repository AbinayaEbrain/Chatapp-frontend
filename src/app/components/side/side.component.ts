import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { UsersService } from '../../services/users.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit {
  socket: any;
  user:any;
  userData :any;

  constructor(private tokenService: TokenService,private userService: UsersService) {
    this.socket = io('http://localhost:3000');
   }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    this.getUser();

    this.socket.on('refreshPage', data => {
      this.getUser();
    });
  }

  getUser(){
    this.userService.getUserById(this.user._id).subscribe(data =>{
      this.userData = data.result;
    })
  }
}
