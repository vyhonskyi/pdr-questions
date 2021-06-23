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
  private randomQuestionsOrder$ = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) {
    const wrongAnswerQuestionsStr = localStorage.getItem('WrongAnswerQuestions');
    this.wrongAnswerQuestions = (wrongAnswerQuestionsStr || '').trim() !== '' ? JSON.parse(wrongAnswerQuestionsStr) : [];

    const randomQuestionsOrderStr = localStorage.getItem('RandomQuestionsOrder');
    this.randomQuestionsOrder$.next((randomQuestionsOrderStr || '').trim() !== '' ? JSON.parse(randomQuestionsOrderStr) : []);
  }

  private getQuestions(): Observable<QuestionModel[]> {
    if (this.questions) { return of(this.questions); }

    return this.http.get<QuestionModel[]>('assets/questions.json')
      .pipe(
        map(questions => questions.map(q => new QuestionModel(q))),
        tap(questions => {
          this.questions = questions;
        })
      );
  }

  public getRandomQuestions(): Observable<QuestionModel[]> {
    return combineLatest([this.getQuestions(), this.randomQuestionsOrder$])
      .pipe(
        map(([questions, randomQuestionsOrder]) => {
          if (!randomQuestionsOrder.length) {
            randomQuestionsOrder = this.shuffle(questions.map(x => x.id));
            localStorage.setItem('RandomQuestionsOrder', JSON.stringify(randomQuestionsOrder));
          }

          return questions.sort((a, b) => randomQuestionsOrder.findIndex(id => id === a.id) - randomQuestionsOrder.findIndex(id => id === b.id));
        })
      );
  }

  public shuffleRandomQuestions(): Observable<void> {
    return this.getQuestions()
      .pipe(
        tap(questions => {
          const randomQuestionsOrder = this.shuffle(questions.map(x => x.id));
          this.randomQuestionsOrder$.next(randomQuestionsOrder);
          localStorage.setItem('RandomQuestionsOrder', JSON.stringify(randomQuestionsOrder));
        }),
        map(() => { })
      );
  }

  getQuestionsSorted(): Observable<QuestionModel[]> {
    return this.getQuestions()
      .pipe(
        map(questions => questions.sort((a, b) => a.numericId - b.numericId)),
      );
  }

  getWrongAnswerQuestions(): Observable<QuestionModel[]> {
    return this.getQuestions()
      .pipe(
        map(questions => questions.filter(q => this.wrongAnswerQuestions.some(x => x.questionId == q.id))),
        map(questions => questions.sort((a, b) => {
          const aIndex = this.wrongAnswerQuestions.findIndex(x => x.questionId === a.id);
          const bIndex = this.wrongAnswerQuestions.findIndex(x => x.questionId === b.id);
          return bIndex - aIndex;
        })),
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

  getPrevNextRandomQuestions(id: string): Observable<PrevNextQuestionsModel> {
    return this.getRandomQuestions()
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

  private shuffle(array: any[]): any[] {
    var currentIndex: number = array.length;
    var randomIndex: number;
    // While there remain elements to shuffle...

    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
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
