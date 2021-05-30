import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, share, tap } from 'rxjs/operators';
import { QuestionModel } from './models';

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private lastQuestionId$ = new BehaviorSubject<string | null>(localStorage.getItem('LastQuestionId'));
  private questions: QuestionModel[];
  private wrongAnswerQuestions: WrongAnswerQuestionModel[];

  constructor(private http: HttpClient) {
    const wrongAnswerQuestionsStr = localStorage.getItem('WrongAnswerQuestions');
    this.wrongAnswerQuestions = (wrongAnswerQuestionsStr || '').trim() !== '' ? JSON.parse(wrongAnswerQuestionsStr) : [];
  }

  getQuestions(): Observable<QuestionModel[]> {
    if (this.questions) { return of(this.questions); }

    return this.http.get<QuestionModel[]>('assets/questions.json')
      .pipe(
        map(questions => questions.map(q => new QuestionModel(q))),
        map(questions => questions.sort((a, b) => a.numericId - b.numericId)),
        tap(questions => this.questions = questions)
      );
  }

  getWrongAnswerQuestions(): Observable<QuestionModel[]> {
    return this.getQuestions()
      .pipe(
        map(questions => questions.filter(q => this.wrongAnswerQuestions.some(x => x.questionId == q.id)))
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

  getPrevNextWrongQuestions(id: string): Observable<PrevNextQuestionsModel> {
    return this.getWrongAnswerQuestions()
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

  addWrongAnswerQuestion(questionId: string): void {
    let index = this.wrongAnswerQuestions.findIndex(x => x.questionId === questionId);

    if (index >= 0) {
      this.wrongAnswerQuestions[index].wrongAnswerCount++;
    } else {
      this.wrongAnswerQuestions.push({ questionId: questionId, wrongAnswerCount: 1 });
    }

    localStorage.setItem('WrongAnswerQuestions', JSON.stringify(this.wrongAnswerQuestions));
  }
}

export interface PrevNextQuestionsModel {
  prev?: QuestionModel;
  next?: QuestionModel;
}

export interface WrongAnswerQuestionModel {
  questionId: string;
  wrongAnswerCount: number;
}
