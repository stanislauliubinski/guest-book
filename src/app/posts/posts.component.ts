import { Component, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../alert.service';
import { AuthService } from '../auth.service';
import { newPost, push, receivedPosts } from '../interfaces';
import { SocketService } from '../socket.service';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  currentId: string[] = []
  commentsStatus: string = 'see comments'

  @Output()
  pSub: Subscription
  dSub: Subscription
  pushSub: Subscription
  posts: receivedPosts
  noAvatar = 'https://guest-book.naveksoft.com/storage/'
  isAdmin: string = localStorage.getItem('is_admin')
  userId: string = localStorage.getItem('user_id')
  window: Window = window
  

  constructor(private postsService: PostsService, 
              private alert: AlertService, 
              private socket: SocketService) { 
    this.pushSub = this.socket.pushedData.subscribe((e: push) => {
      if (e.type === 'post_added') {
        this.posts.data.unshift(e.data)
      } else if (e.type === 'post_deleted') {
        this.posts.data = this.posts.data.filter(post => post.id !== e.data.id)
        console.log('deleted')
      }
    })
  }

  ngOnInit() {
    this.postsReceiver()
  }

  postsReceiver() {
    const params = this.getRequestParams(this.posts?.meta.current_page)
    this.pSub = this.postsService.getPosts(params).subscribe(posts => {
      this.posts = posts
    })
  }

  getRequestParams(page): any {
    let params = {};
    if (page) {
      params[`page`] = page;
    }
    return params;
  }

  showCommentsFunc(id) {
    if (this.currentId.indexOf(id) >= 0) {
      delete this.currentId[this.currentId.indexOf(id)]
    } else {
      this.currentId.push(id)
    } 
  }

  remove(postId: string) {
    this.dSub = this.postsService.deletePost(postId).subscribe(() => {
      
      this.alert.warning('Review deleted!')
    })
  }

  handlePageChange(event) {
    this.posts.meta.current_page = event;
    this.postsReceiver()
    this.window.scroll({top: 0})
  }

  ngOnDestroy() {
    if (this.pSub) {
      this.pSub.unsubscribe()
    }
    this.currentId = []
    if (this.dSub) {
      this.dSub.unsubscribe()
    }
    if (this.pushSub) {
      this.pushSub.unsubscribe()
    }
  }
}
