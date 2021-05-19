import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuestionModel } from './models';
import { QuestionsService } from './questions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  questions$: Observable<QuestionModel[]>;

  constructor(
    private questionsService: QuestionsService,
    private route: ActivatedRoute
  ) {
    this.questions$ = this.questionsService.getQuestions();
  }

  ngOnInit(): void {

  }
}
