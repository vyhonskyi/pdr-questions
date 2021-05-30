import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { QuestionModel } from '../models';
import { PrevNextQuestionsModel, QuestionsService } from '../questions.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, OnDestroy {
  question$: Observable<QuestionModel>;
  prevNextQuestions$: Observable<PrevNextQuestionsModel>;
  selectedAnswerId$ = new BehaviorSubject<string>(null);
  rightAnswerId$: Observable<string>;
  wrongAnswerId$: Observable<string>;

  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private questionsService: QuestionsService
  ) {

    this.question$ = this.route.paramMap
      .pipe(
        map(params => params.get('id')),
        tap(id => {
          this.questionsService.setLastQuestionId(id);
          this.selectedAnswerId$.next(null);
        }),
        switchMap(id => {
          if (!id) { throw new Error('id is null.'); }
          return this.questionsService.getQuestionById(id);
        }),
      );

    this.prevNextQuestions$ = this.route.paramMap
      .pipe(
        map(params => [params.get('id'), params.get('wrongAnswerQuestions')]),
        switchMap(([id, wrongAnswerQuestions]) => {
          if (!id) { throw new Error('id is null.'); }

          return wrongAnswerQuestions === 'true'
            ? this.questionsService.getPrevNextWrongQuestions(id)
            : this.questionsService.getPrevNextQuestions(id);
        })
      );

    this.rightAnswerId$ = combineLatest([this.selectedAnswerId$, this.question$])
      .pipe(
        map(([selectedAnswerId, question]) => selectedAnswerId ? question.answers.find(x => x.isRight).id : null)
      );

    this.wrongAnswerId$ = combineLatest([this.selectedAnswerId$, this.rightAnswerId$])
      .pipe(
        map(([selectedAnswerId, rightAnswerId]) => selectedAnswerId && rightAnswerId && selectedAnswerId !== rightAnswerId ? selectedAnswerId : null)
      );

    this.subscriptions.add(
      combineLatest([this.question$, this.wrongAnswerId$])
        .pipe(
          filter(([question, wrongAnswerId]) => !!wrongAnswerId),
          tap(([question, wrongAnswerId]) => this.questionsService.addWrongAnswerQuestion(question.id))
        )
        .subscribe()
    );
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  checkAnswer(answerId: string): void {
    this.selectedAnswerId$.next(answerId);
  }

  saveAsWrong(): void {
    this.questionsService.addWrongAnswerQuestion(this.route.snapshot.params['id']);
  }
}
