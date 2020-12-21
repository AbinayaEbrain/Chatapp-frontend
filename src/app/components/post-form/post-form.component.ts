import { Component, OnInit } from '@angular/core';
import { PostService } from './../../services/post.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import io from 'socket.io-client'; //if any error after doing this, in polyfills.ts file,declare this '(window as any).global = window;'

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.css']
})
export class PostFormComponent implements OnInit {
  socket: any;
  socketHost: any;
  postForm: FormGroup;

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.socketHost = 'http://localhost:3000'; //mention the server url
    this.socket = io(this.socketHost);
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.postForm = this.fb.group({
      post: ['', Validators.required]
    });
  }

  SubmitPost() {
    this.postService.addPost(this.postForm.value).subscribe(data => {
      this.socket.emit('refresh', {}); //to emit socket.io from client,call a emit method to create refresh event and it goes to streams.js
      this.postForm.reset();
    });
  }
}
