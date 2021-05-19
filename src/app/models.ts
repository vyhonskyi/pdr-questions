export interface QuestionModel {
  id: string;
  text: string;
  imgUrl: string;
  answers: AnswerModel[];
}

export interface AnswerModel {
  id: string;
  text: string;
  isRight: boolean;
}
