import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { QuestionModel } from '../models';
import { QuestionsService } from '../questions.service';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.scss']
})
export class QuestionsListComponent implements OnInit {
  lastQuestion$: Observable<QuestionModel>;
  questions$: Observable<QuestionModel[]>;
  wrongAnswerQuestions$: Observable<QuestionModel[]>;

  constructor(
    private questionsService: QuestionsService,
    private title: Title
  ) {
    this.questions$ = this.questionsService.getQuestions();
    this.wrongAnswerQuestions$ = this.questionsService.getWrongAnswerQuestions();
    this.lastQuestion$ = this.questionsService.getLastQuestion$();
  }

  ngOnInit(): void {
    this.title.setTitle('Відповіді на тести ПДР')
  }

}
