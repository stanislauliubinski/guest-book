import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/alert.service';
import { newPost } from 'src/app/interfaces';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit, OnDestroy {
  reviewForm: FormGroup
  submitSub: Subscription

  constructor(private postsService: PostsService, private alert: AlertService) { }

  ngOnInit(): void {
    this.reviewForm = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.maxLength(255)
      ]),
      message: new FormControl('', [
        Validators.required,
        Validators.maxLength(65535)
      ])
    })
  }

  submitReview() {
    const createdPost: newPost = {
      message: this.reviewForm.value.message,
      title: this.reviewForm.value.title
    }

    this.submitSub = this.postsService.post(createdPost).subscribe(() => {
      this.reviewForm.reset(),
      this.alert.success('Review posted!')
    })
  }

  ngOnDestroy(): void {
    if(this.submitSub) {
      this.submitSub.unsubscribe()
    }
  }
}
