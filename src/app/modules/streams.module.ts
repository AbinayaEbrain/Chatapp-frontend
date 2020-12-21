import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StreamsComponent } from '../components/streams/streams.component';
import { TokenService } from '../services/token.service';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { SideComponent } from '../components/side/side.component';
import { PostFormComponent } from '../components/post-form/post-form.component';
import { PostsComponent } from '../components/posts/posts.component';
import { PostService } from '../services/post.service';
import { CommentsComponent } from '../components/comments/comments.component';
import { RouterModule } from '@angular/router';
import { PeopleComponent } from '../components/people/people.component';
import { UsersService } from '../services/users.service';
import { FollowingComponent } from '../components/following/following.component';
import { FollowersComponent } from '../components/followers/followers.component';
import { NotificationsComponent } from '../components/notifications/notifications.component';
import { TopStreamsComponent } from '../components/top-streams/top-streams.component';
import { ChatsComponent } from '../components/chats/chats.component';
import { MessageComponent } from '../components/message/message.component';
import { MessageService } from '../services/message.service';
// To auto-scroll messages
import { NgxAutoScrollModule } from 'ngx-auto-scroll';
// Emoji
import { EmojiPickerModule } from 'ng2-emoji-picker';
import { ImagesComponent } from '../components/images/images.component';
import { FileUploadModule } from 'ng2-file-upload'

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgxAutoScrollModule,
    FileUploadModule,
    EmojiPickerModule.forRoot()
  ],
  declarations: [
    StreamsComponent,
    ToolbarComponent,
    SideComponent,
    PostFormComponent,
    PostsComponent,
    CommentsComponent,
    PeopleComponent,
    FollowingComponent,
    FollowersComponent,
    NotificationsComponent,
    TopStreamsComponent,
    ChatsComponent,
    MessageComponent,
    ImagesComponent
  ],
  exports: [StreamsComponent, ToolbarComponent, SideComponent, PostFormComponent],
  providers: [TokenService, PostService, UsersService, MessageService]
})
export class StreamsModule {}
