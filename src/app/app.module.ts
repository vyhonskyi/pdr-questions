import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionComponent } from './question/question.component';
import { QuestionImageUrlPipe } from './question-image-url.pipe';
import { QuestionsListComponent } from './questions-list/questions-list.component';
import { EmptyTextPipe } from './empty-text.pipe';

@NgModule({
  declarations: [
    AppComponent,
    QuestionComponent,
    QuestionImageUrlPipe,
    QuestionsListComponent,
    EmptyTextPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
