import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { answers, newPost, receivedAnswers, receivedPosts } from '../interfaces';

@Injectable()
export class PostsService {
  answerIdSubject = new Subject();

  constructor(private http: HttpClient) { }

  getPosts(params): Observable<receivedPosts[]> | any {
    return this.http.get(`https://guest-book.naveksoft.com/api/v1/posts`, {params})
      .pipe(map((response: receivedPosts) => {
        return response
      }))
  } 

  getComments(params, postId: string): Observable<receivedAnswers[]> | any {
    return this.http.get(`https://guest-book.naveksoft.com/api/v1/posts/${postId}/answers`, {params})
      .pipe(map((response: receivedAnswers) => {
        return response
      }))
  }

  post(post: newPost): Observable<newPost> {
    return this.http.post<newPost>('https://guest-book.naveksoft.com/api/v1/posts', post)
  }

  deletePost(postId: string): Observable<void> {
    return this.http.delete<void>(`https://guest-book.naveksoft.com/api/v1/posts/${postId}`)
  }

  postComment(comment: answers, postId: string): Observable<answers> {
    return this.http.post<answers>(`https://guest-book.naveksoft.com/api/v1/posts/${postId}/answers`, comment)
      .pipe(
        tap(res => {
          this.setId(res)
        })
      )
  }

  deleteComment(commentId: string, postId: string): Observable<void> {
    return this.http.delete<void>(`https://guest-book.naveksoft.com/api/v1/posts/${postId}/answers/${commentId}`)
      .pipe(
        tap(() => {
          localStorage.removeItem('answer_id')
        })
      )
  }

  setId(res) {
    localStorage.setItem('answer_id', res.id.toString())
    this.answerIdSubject.next(res.id.toString())
  }

}
