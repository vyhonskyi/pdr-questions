import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { QuestionModel } from '../models';
import { PrevNextQuestionsModel, QuestionsService } from '../questions.service';

export enum QuestionsSourceTypes {
  Default = 'default',
  Wrong = 'wrong',
  Random = 'random',
  Static = 'static'
}

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
    public route: ActivatedRoute,
    private questionsService: QuestionsService,
    private title: Title
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
        tap(question => {
          this.title.setTitle(`${question.title.substr(0, 50)}... - Відповіді на тести ПДР`);
        })
      );

    this.prevNextQuestions$ = this.route.paramMap
      .pipe(
        map(params => [params.get('id'), params.get('questionsSource')]),
        switchMap(([id, questionsSource]: [string, QuestionsSourceTypes]) => {
          if (!id) { throw new Error('id is null.'); }

          switch (questionsSource) {
            case QuestionsSourceTypes.Default:
              return this.questionsService.getPrevNextQuestions(id);
            case QuestionsSourceTypes.Wrong:
              return this.questionsService.getPrevNextWrongQuestions(id)
            case QuestionsSourceTypes.Random:
              return this.questionsService.getPrevNextRandomQuestions(id);
            case QuestionsSourceTypes.Static:
              return this.questionsService.getPrevNextStaticQuestions(id);
            default:
              throw new Error(`Unknown QuestionsSourceTypes value "${questionsSource}".`)
          }
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
