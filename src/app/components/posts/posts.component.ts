import { Component, OnInit } from '@angular/core';
import { PostService } from '../../services/post.service';
import * as moment from 'moment'; //install moment.js
import io from 'socket.io-client';
import _ from 'lodash';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  socket: any;
  posts = [];
  user: any;

  constructor(private postService: PostService, private tokenService: TokenService, private router: Router) {
    this.socket = io('http://localhost:3000'); //mention the server url
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    this.allPosts();
    //listen to the 'refreshPage' event from streams.js
    this.socket.on('refreshPage', data => {
      this.allPosts();
    });
  }

  allPosts() {
    this.postService.getAllPost().subscribe(
      data => {
        this.posts = data.posts;
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

  //to return 'a fewseconds ago' msg...to use this install "npm i moment --save"
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

  //to check username already exist to change the color of like icon
  //it will return false if the username exist
  CheckInLikesArray(arr, username) {
    return _.some(arr, { username: username });
  }

  openCommentBox(post) {
    this.router.navigate(['post', post._id]);
  }
}
