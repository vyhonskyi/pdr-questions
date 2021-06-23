import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { QuestionModel } from './models';

const STATIC_WRONGANSWER_QUESTIONS_STR = "[{\"questionId\":\"question_number_1333\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1325\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1324\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1323\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1303\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1290\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1286\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1285\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1282\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1279\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1273\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1271\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1264\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1262\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1256\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1253\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1250\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1243\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1240\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1221\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_1220\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1204\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1202\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1181\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1172\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1156\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1145\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1124\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1121\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1119\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1112\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1110\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1106\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1102\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1101\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1092\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_1090\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1077\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1067\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1066\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1057\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1052\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_1048\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1032\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1030\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1026\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1016\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1010\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_981\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_976\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_957\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_941\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_932\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_908\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_905\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_884\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_870\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_869\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_854\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_852\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_847\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_803\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_797\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_787\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_784\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_774\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_768\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_759\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_754\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_751\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_747\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_710\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_708\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_707\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_700\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_675\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_667\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_657\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_639\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_627\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_626\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_604\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_594\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_586\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_583\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_566\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_541\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_534\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_489\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_479\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_469\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_459\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_458\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_399\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_360\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_357\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_351\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_334\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_332\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_323\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_313\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_286\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_265\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_257\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_249\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_235\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_234\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_215\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_191\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_174\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_169\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_157\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_151\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_128\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_117\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_103\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_97\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_85\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_63\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_57\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_50\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_34\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_31\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_19\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_126\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1165\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_164\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_552\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1039\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_805\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_142\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_294\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_573\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_338\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1019\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_329\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_114\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1345\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_1079\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_902\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_762\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_373\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_1206\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_1122\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_1017\",\"wrongAnswerCount\":3},{\"questionId\":\"question_number_1000\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_995\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_975\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_861\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_790\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_789\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_750\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_515\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_380\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_283\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_248\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_244\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_228\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_219\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_125\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_75\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_37\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_14\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_1228\",\"wrongAnswerCount\":3},{\"questionId\":\"question_number_830\",\"wrongAnswerCount\":3},{\"questionId\":\"question_number_456\",\"wrongAnswerCount\":3},{\"questionId\":\"question_number_1105\",\"wrongAnswerCount\":4},{\"questionId\":\"question_number_1007\",\"wrongAnswerCount\":4},{\"questionId\":\"question_number_1069\",\"wrongAnswerCount\":4},{\"questionId\":\"question_number_511\",\"wrongAnswerCount\":4},{\"questionId\":\"question_number_496\",\"wrongAnswerCount\":4},{\"questionId\":\"question_number_395\",\"wrongAnswerCount\":4},{\"questionId\":\"question_number_388\",\"wrongAnswerCount\":4},{\"questionId\":\"question_number_384\",\"wrongAnswerCount\":4},{\"questionId\":\"question_number_546\",\"wrongAnswerCount\":5},{\"questionId\":\"question_number_25\",\"wrongAnswerCount\":5},{\"questionId\":\"question_number_563\",\"wrongAnswerCount\":5},{\"questionId\":\"question_number_539\",\"wrongAnswerCount\":5},{\"questionId\":\"question_number_518\",\"wrongAnswerCount\":5},{\"questionId\":\"question_number_510\",\"wrongAnswerCount\":5},{\"questionId\":\"question_number_101\",\"wrongAnswerCount\":6},{\"questionId\":\"question_number_1248\",\"wrongAnswerCount\":7},{\"questionId\":\"question_number_737\",\"wrongAnswerCount\":6},{\"questionId\":\"question_number_419\",\"wrongAnswerCount\":6},{\"questionId\":\"question_number_829\",\"wrongAnswerCount\":7},{\"questionId\":\"question_number_536\",\"wrongAnswerCount\":7},{\"questionId\":\"question_number_381\",\"wrongAnswerCount\":8},{\"questionId\":\"question_number_1020\",\"wrongAnswerCount\":7},{\"questionId\":\"question_number_1198\",\"wrongAnswerCount\":8},{\"questionId\":\"question_number_1021\",\"wrongAnswerCount\":8},{\"questionId\":\"question_number_846\",\"wrongAnswerCount\":8},{\"questionId\":\"question_number_746\",\"wrongAnswerCount\":9},{\"questionId\":\"question_number_712\",\"wrongAnswerCount\":8},{\"questionId\":\"question_number_420\",\"wrongAnswerCount\":10},{\"questionId\":\"question_number_335\",\"wrongAnswerCount\":9},{\"questionId\":\"question_number_270\",\"wrongAnswerCount\":16},{\"questionId\":\"question_number_955\",\"wrongAnswerCount\":9},{\"questionId\":\"question_number_465\",\"wrongAnswerCount\":9},{\"questionId\":\"question_number_189\",\"wrongAnswerCount\":9},{\"questionId\":\"question_number_992\",\"wrongAnswerCount\":9},{\"questionId\":\"question_number_492\",\"wrongAnswerCount\":9},{\"questionId\":\"question_number_353\",\"wrongAnswerCount\":10},{\"questionId\":\"question_number_910\",\"wrongAnswerCount\":10},{\"questionId\":\"question_number_1244\",\"wrongAnswerCount\":10},{\"questionId\":\"question_number_1008\",\"wrongAnswerCount\":10},{\"questionId\":\"question_number_929\",\"wrongAnswerCount\":10},{\"questionId\":\"question_number_909\",\"wrongAnswerCount\":11},{\"questionId\":\"question_number_833\",\"wrongAnswerCount\":10},{\"questionId\":\"question_number_806\",\"wrongAnswerCount\":10},{\"questionId\":\"question_number_1025\",\"wrongAnswerCount\":11},{\"questionId\":\"question_number_1491\",\"wrongAnswerCount\":12},{\"questionId\":\"question_number_1201\",\"wrongAnswerCount\":12},{\"questionId\":\"question_number_1164\",\"wrongAnswerCount\":12},{\"questionId\":\"question_number_735\",\"wrongAnswerCount\":12},{\"questionId\":\"question_number_356\",\"wrongAnswerCount\":11},{\"questionId\":\"question_number_903\",\"wrongAnswerCount\":12},{\"questionId\":\"question_number_574\",\"wrongAnswerCount\":12},{\"questionId\":\"question_number_336\",\"wrongAnswerCount\":12},{\"questionId\":\"question_number_1214\",\"wrongAnswerCount\":12},{\"questionId\":\"question_number_1104\",\"wrongAnswerCount\":12},{\"questionId\":\"question_number_1006\",\"wrongAnswerCount\":12},{\"questionId\":\"question_number_911\",\"wrongAnswerCount\":13},{\"questionId\":\"question_number_815\",\"wrongAnswerCount\":14},{\"questionId\":\"question_number_734\",\"wrongAnswerCount\":12},{\"questionId\":\"question_number_1196\",\"wrongAnswerCount\":14},{\"questionId\":\"question_number_915\",\"wrongAnswerCount\":13},{\"questionId\":\"question_number_1050\",\"wrongAnswerCount\":14},{\"questionId\":\"question_number_713\",\"wrongAnswerCount\":14},{\"questionId\":\"question_number_1183\",\"wrongAnswerCount\":15},{\"questionId\":\"question_number_850\",\"wrongAnswerCount\":17},{\"questionId\":\"question_number_958\",\"wrongAnswerCount\":17},{\"questionId\":\"question_number_1184\",\"wrongAnswerCount\":20},{\"questionId\":\"question_number_987\",\"wrongAnswerCount\":23},{\"questionId\":\"question_number_193\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_411\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_122\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_89\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_545\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_500\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_213\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_602\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1249\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_800\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_349\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_565\",\"wrongAnswerCount\":2},{\"questionId\":\"question_number_1109\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1095\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_681\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_554\",\"wrongAnswerCount\":1},{\"questionId\":\"question_number_1291\",\"wrongAnswerCount\":2}]";

@Injectable({
  providedIn: 'root'
})
export class QuestionsService {
  private lastQuestionId$ = new BehaviorSubject<string | null>(localStorage.getItem('LastQuestionId'));
  private questions: QuestionModel[];
  private wrongAnswerQuestions: WrongAnswerQuestionModel[];
  private staticWrongAnswerQuestions: WrongAnswerQuestionModel[];
  private randomQuestionsOrder$ = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient) {
    const wrongAnswerQuestionsStr = localStorage.getItem('WrongAnswerQuestions');
    this.wrongAnswerQuestions = (wrongAnswerQuestionsStr || '').trim() !== '' ? JSON.parse(wrongAnswerQuestionsStr) : [];

    this.staticWrongAnswerQuestions = JSON.parse(STATIC_WRONGANSWER_QUESTIONS_STR);

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

  private getStaticWrongAnswerQuestions(): Observable<QuestionModel[]> {
    return this.getQuestions()
      .pipe(
        map(questions => questions.filter(q => this.staticWrongAnswerQuestions.some(x => x.questionId == q.id))),
        map(questions => questions.sort((a, b) => {
          const aIndex = this.staticWrongAnswerQuestions.findIndex(x => x.questionId === a.id);
          const bIndex = this.staticWrongAnswerQuestions.findIndex(x => x.questionId === b.id);
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

  getPrevNextStaticQuestions(id: string): Observable<PrevNextQuestionsModel> {
    return this.getStaticWrongAnswerQuestions()
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
