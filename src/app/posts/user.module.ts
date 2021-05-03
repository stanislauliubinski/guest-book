import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import { PostsComponent } from './posts.component';
import { AuthService } from '../auth.service';
import { CreatePostComponent } from './create-post/create-post.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from './posts.service';
import { AuthGuard } from '../auth.guard';
import { PostCommentsComponent } from './post-comments/post-comments.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {path: 'posts', component: PostsComponent, canActivate: [AuthGuard], children: [
                {path: ':id/comments', component: PostCommentsComponent, canActivate: [AuthGuard]}
            ]},
            {path: 'create-post', component: CreatePostComponent, canActivate: [AuthGuard]}
            // ,
            // {path: '*', redirectTo: '/posts'} 
            ]),
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule
    ],
    exports: [RouterModule],
    providers: [AuthService, PostsService, AuthGuard],
    declarations: [
      CreatePostComponent,
      PostsComponent,
      PostCommentsComponent
    ]
})
export class UserModule {}