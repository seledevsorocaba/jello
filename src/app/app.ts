import { Component } from '@angular/core';
import { BoardComponent } from './features/board/board.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BoardComponent],
  template: '<app-board />',
  styleUrl: './app.scss',
})
export class App {}
