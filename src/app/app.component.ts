import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { QuestionModel } from './models';
import { QuestionsService } from './questions.service';

declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  questions$: Observable<QuestionModel[]>;
  private routerEventsSubscription: Subscription;

  constructor(
    private questionsService: QuestionsService,
    private router: Router,
  ) {
    this.questions$ = this.questionsService.getQuestions();
  }

  ngOnInit(): void {
    this.routerEventsSubscription = this.router.events
      .pipe(
        tap(event => {
          if (event instanceof NavigationEnd) {
            gtag('config', 'G-1T7C355CND', { 'page_path': event.urlAfterRedirects });
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.routerEventsSubscription) {
      this.routerEventsSubscription.unsubscribe();
    }
  }
}
