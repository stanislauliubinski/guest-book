import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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

  constructor(private postsService: PostsService, private alert: AlertService, private router: Router) { }

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
    const createdPost: newPost = this.reviewForm.value;
    if (this.reviewForm.invalid) {
      this.getFormValidationErrors()
    } else {
      this.submitSub = this.postsService.post(createdPost).subscribe(() => {
        this.reviewForm.reset(),
        this.alert.success('Review posted!')
        this.goToPosts()
      })
    }
  }

  getFormValidationErrors(): string {
    Object.keys(this.reviewForm.controls).forEach(key => {
  
      const controlErrors: ValidationErrors = this.reviewForm.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(() => {
          this.reviewForm.markAllAsTouched()
        });
      }
      return key.toString()
    } );
    return
  }

  goToPosts() {
    setTimeout(() => {
      this.router.navigate(['/posts'])
    }, 500)
  }

  ngOnDestroy(): void {
    if(this.submitSub) {
      this.submitSub.unsubscribe()
    }
  }
}
