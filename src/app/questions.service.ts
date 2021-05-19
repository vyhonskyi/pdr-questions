import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, share, tap } from 'rxjs/operators';
import { QuestionModel } from './models';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private lastQuestionId$ = new BehaviorSubject<string | null>(localStorage.getItem('LastQuestionId'));
  private questions: QuestionModel[];

  constructor(private http: HttpClient) { }

  getQuestions(): Observable<QuestionModel[]> {
    if (this.questions) { return of(this.questions); }

    return this.http.get<QuestionModel[]>('assets/questions.json')
      .pipe(
        map(questions => questions.sort((a, b) => parseInt(/\d+/gm.exec(a.id)[0]) - parseInt(/\d+/gm.exec(b.id)[0]))),
        tap(questions => this.questions = questions)
      );
  }

  getQuestionById(id: string): Observable<QuestionModel> {
    return this.getQuestions()
      .pipe(
        map(questions => {
          const question = questions.find(x => x.id === id);

          if (!question) { throw new Error(`Question id=${id} not found.`); }

          return question;
        })
      )
  }

  getPrevNextQuestions(id: string): Observable<PrevNextQuestionsModel> {
    return this.getQuestions()
      .pipe(
        map(questions => {
          const idx = questions.findIndex(x => x.id == id);
          const prevIdx = idx - 1;
          const nextIdx = idx + 1;

          return {
            prev: prevIdx >= 0 ? questions[prevIdx] : null,
            next: nextIdx < questions.length ? questions[nextIdx] : null
          } as PrevNextQuestionsModel;
        })
      )
  }

  setLastQuestionId(id: string): void {
    localStorage.setItem('LastQuestionId', id);
    this.lastQuestionId$.next(id);
  }

  getLastQuestion$(): Observable<QuestionModel> {
    return combineLatest([this.getQuestions(), this.lastQuestionId$])
      .pipe(
        map(([quetions, lastQuestionId]) => {
          if (!lastQuestionId) { return null; }

          return quetions.find(x => x.id == lastQuestionId);
        })
      );
  }
}

export interface PrevNextQuestionsModel {
  prev?: QuestionModel;
  next?: QuestionModel;
}
