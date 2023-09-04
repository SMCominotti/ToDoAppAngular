import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ITask } from '../../model/task';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  todoForm !: FormGroup;
  task: ITask[] = [];
  inprogress: ITask[] = [];
  done: ITask[] = [];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item: ['', Validators.required],
      dueDate: ['']
    });
  }

  addTask() {
    const taskName = this.todoForm.value.item;
    const dueDate = this.todoForm.value.dueDate;

    this.task.push({
      description: taskName,
      dueDate: dueDate,
      done: false
    });

  //  Limpiar los campos
    this.todoForm.get('item')!.setValue('');

    this.todoForm.get('dueDate')!.setValue('');
  }

  deleteTask(i:number){
    this.task.splice(i, 1);
  }



  isDueDateExpired(task: ITask): boolean {
    if (!task.dueDate) {
      return false; // Si no hay fecha, no se marca como vencida
    }

    const currentDate = new Date();// Con ésto tengo la fecha actual
    return task.dueDate < currentDate;
  }


  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
