import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import { PostService } from '../../services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';

@Component({
  selector: 'app-top-streams',
  templateUrl: './top-streams.component.html',
  styleUrls: ['./top-streams.component.css']
})
export class TopStreamsComponent implements OnInit {
  token: any;
  socket: any;
  topPosts = [];
  user: any;

  constructor(private tokenService: TokenService, private router: Router, private postService: PostService) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    this.allPosts();
    this.socket.on('refreshPage', data => {
      this.allPosts();
    });
  }

  allPosts() {
    this.postService.getAllPost().subscribe(
      data => {
        this.topPosts = data.top;
      },
      err => {
        //if token expires,it will go to index page
        if (err.error.token === null) {
          this.tokenService.deleteToken();
          this.router.navigate(['']);
        }
      }
    );
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  likePost(post) {
    this.postService.addLike(post).subscribe(
      data => {
        console.log(data);
        this.socket.emit('refresh', {});
      },
      err => {
        console.log(err);
      }
    );
  }

  CheckInLikesArray(arr, username) {
    return _.some(arr, { username: username });
  }

  openCommentBox(post) {
    this.router.navigate(['post', post._id]);
  }
}
