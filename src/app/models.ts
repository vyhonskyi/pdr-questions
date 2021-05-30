export class QuestionModel {
  constructor(obj: any) {
    Object.assign(this, obj);
  }

  id: string;
  text: string;
  imgUrl: string;
  answers: AnswerModel[];

  get numericId(): number {
    return parseInt(/\d+/gm.exec(this.id)[0]);
  }

  get title(): string {
    return `${this.numericId}. ${this.text}`;
  }
}

export interface AnswerModel {
  id: string;
  text: string;
  isRight: boolean;
}
