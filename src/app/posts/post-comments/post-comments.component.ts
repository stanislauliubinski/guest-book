import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/alert.service';
import { answers, newPost, pushPrivate, receivedAnswers, User } from 'src/app/interfaces';
import { SocketService } from 'src/app/socket.service';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styleUrls: ['./post-comments.component.scss']
})
export class PostCommentsComponent implements OnInit, OnDestroy {
  @Input() currentPost: newPost
  commentForm: FormGroup
  noAvatar = 'https://guest-book.naveksoft.com/storage/'
  isAdmin: string = localStorage.getItem('is_admin')
  userId: string = localStorage.getItem('user_id')
  answerId: string = localStorage.getItem('answer_id')
  answers: receivedAnswers
  commentSub: Subscription
  deleteSub: Subscription
  submitSub: Subscription
  pushSub: Subscription
  idSub: Subscription
  title: string
  User: User = {
    email: localStorage.getItem('user_email'),
    avatar: localStorage.getItem('user_avatar'),
    name: localStorage.getItem('user_name'),
    id: +this.userId
  }

  constructor(private postsService: PostsService, 
              private alert: AlertService, 
              private socket: SocketService) {
    this.pushSub = this.socket.pushedDataPrivate.subscribe((e: pushPrivate) => {
      if (e.type === 'answer_added') {
        this.answers.data.push(e.data)
        this.currentPost.answers_count++
      } else if (e.type === 'answer_deleted') {
        this.answers.data = this.answers.data.filter(answer => answer.id !== e.data.id)
        this.currentPost.answers_count--
      }
    })
  }

  ngOnInit(): void {
    this.answersReceiver()
    this.commentForm = new FormGroup({
      message: new FormControl('', [
        Validators.required,
        Validators.maxLength(65535)
      ])
    })
  }

  answersReceiver() {
    const params = this.getRequestParams(this.answers?.meta?.current_page)
    this.commentSub = this.postsService.getComments(params, this.currentPost.id).subscribe(comments => {
      this.answers = comments
      if (this.answers.data.length === 0) {
        this.title = "No comments"
      } else {
        this.title = "Comments"
      }
    })
  }

  getRequestParams(page): any {
    let params = {};
    if (page) {
      params[`page`] = page;
    }
    return params;
  }

  submitComment() {
    if (this.answers.data.length === 0) {
      this.title = 'Comments'
    } 
    const currentUser = this.User
    const newComment: answers = {
      message: this.commentForm.value.message,
      user: currentUser
    }
    if (this.commentForm.invalid) {
      this.getFormValidationErrors()
    } else {
      this.idSub = this.postsService.answerIdSubject.subscribe((id) => {
        if (!newComment.id) {
          newComment.id = +id
        }
      })
      this.submitSub = this.postsService.postComment(newComment, this.currentPost.id).subscribe(() => {
        this.commentForm.reset(),
        this.alert.success('Comment posted!')
        if(this.isAdmin === '1' && this.currentPost.user.id.toString() !== this.userId) {
          this.answers.data.push(newComment)
        }
      })
    }
  }

  getFormValidationErrors(): string {
    Object.keys(this.commentForm.controls).forEach(key => {
  
      const controlErrors: ValidationErrors = this.commentForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(() => {
          this.commentForm.markAllAsTouched()
        });
      }
      return key.toString()
    } );
    return
  }

  removeComment(commentId: string, postId: string) {
    if (this.answers.data.length === 1) {
      this.title = 'No comments'
    } 
    this.deleteSub = this.postsService.deleteComment(commentId, postId).subscribe(() => {
      if(this.isAdmin === '1' && this.currentPost.user.id.toString() !== this.userId) {
        this.answers.data = this.answers.data.filter(answer => answer.id !== commentId)
      }
      this.alert.warning('Comment deleted!')
    })
  }

  handlePageChange(event) {
    this.answers.meta.current_page = event
    this.answersReceiver()
  }

  ngOnDestroy() {
    if(this.commentSub) {
      this.commentSub.unsubscribe()
    }
    if(this.deleteSub) {
      this.deleteSub.unsubscribe()
    }
    if(this.submitSub) {
      this.submitSub.unsubscribe()
    }
    if(this.pushSub) {
      this.pushSub.unsubscribe()
    }
    if(this.idSub) {
      this.idSub.unsubscribe()
    }
  }
}
