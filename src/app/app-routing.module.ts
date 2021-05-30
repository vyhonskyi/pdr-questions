import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionComponent } from './question/question.component';
import { QuestionsListComponent } from './questions-list/questions-list.component';

const routes: Routes = [
  { path: '', component: QuestionsListComponent },
  { path: 'question/:id', component: QuestionComponent },
  { path: 'question/:id/:wrongAnswerQuestions', component: QuestionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
