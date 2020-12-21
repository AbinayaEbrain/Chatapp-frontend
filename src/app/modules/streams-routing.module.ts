import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StreamsComponent } from '../components/streams/streams.component';
import { AuthGuard } from '../services/auth.guard';
import { CommentsComponent } from '../components/comments/comments.component';
import { PeopleComponent } from '../components/people/people.component';
import { FollowingComponent } from '../components/following/following.component';
import { FollowersComponent } from '../components/followers/followers.component';
import { NotificationsComponent } from '../components/notifications/notifications.component';
import { ChatsComponent } from '../components/chats/chats.component';
import { MessageComponent } from '../components/message/message.component';
import { ImagesComponent } from '../components/images/images.component';

const routes: Routes = [
  {
    path: 'streams',
    component: StreamsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'post/:id',
    component: CommentsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'people',
    component: PeopleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'people/following',
    component: FollowingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'people/followers',
    component: FollowersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'chats/:name',
    component: ChatsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'message/:name',
    component: MessageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'images/:name',
    component: ImagesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**', // Default route
    redirectTo: 'streams'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class StreamsRoutingModule {}
