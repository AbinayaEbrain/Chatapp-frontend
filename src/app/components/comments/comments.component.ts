import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { ActivatedRoute } from '@angular/router';
import io from 'socket.io-client';
import * as moment from 'moment';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit {
  toolbarElement: any;
  commmentForm: FormGroup;
  postId: any;
  commentsArray = [];
  socket: any;
  post: String;

  constructor(private fb: FormBuilder, private postService: PostService, private route: ActivatedRoute) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    //In this component, we want to hide the nav-content in toolbar component...
    this.toolbarElement = document.querySelector('.nav-content');
    this.postId = this.route.snapshot.paramMap.get('id');

    this.init();
    this.getPost();
    this.socket.on('refreshPage', data => {
      this.getPost();
    });
  }

  //this will be called after ngOnInit
  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  }

  init() {
    this.commmentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  addComment() {
    this.postService.addComment(this.postId, this.commmentForm.value.comment).subscribe(data => {
      this.socket.emit('refresh', {});
      this.commmentForm.reset();
    });
  }

  //to get comments
  getPost() {
    this.postService.getPost(this.postId).subscribe(data => {
      //reverse() is used to display the last added comment first
      this.post = data.post.post;
      this.commentsArray = data.post.comments.reverse();
    });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}
