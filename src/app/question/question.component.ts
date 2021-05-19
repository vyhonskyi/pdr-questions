import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { QuestionModel } from '../models';
import { PrevNextQuestionsModel, QuestionsService } from '../questions.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  question$: Observable<QuestionModel>;
  prevNextQuestions$: Observable<PrevNextQuestionsModel>;
  isShowRightAnswer: boolean;

  constructor(
    private route: ActivatedRoute,
    private questionsService: QuestionsService
  ) {

    this.question$ = this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        tap(id => {
          this.questionsService.setLastQuestionId(id);
          this.isShowRightAnswer = false;
        }),
        switchMap(id => {
          if (!id) { throw new Error('id is null.'); }
          return this.questionsService.getQuestionById(id);
        }),
      );

    this.prevNextQuestions$ = this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        switchMap(id => {
          if (!id) { throw new Error('id is null.'); }
          return this.questionsService.getPrevNextQuestions(id);
        })
      );
  }

  ngOnInit(): void {

  }

  toggleAnswer() {
    this.isShowRightAnswer = !this.isShowRightAnswer;
  }

}
