import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ITask } from '../../model/task';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent implements OnInit {
  todoForm!: FormGroup;
  task: ITask[] = [];
  inprogress: ITask[] = [];
  done: ITask[] = [];
  updateIndex!: any;
  isEditEnabled: boolean = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item: ['', Validators.required],
      dueDate: [''],
    });
  }

  addTask() {
    const taskName = this.todoForm.value.item;
    const dueDate = this.todoForm.value.dueDate;

    this.task.push({
      description: taskName,
      dueDate: dueDate,
      done: false,
    });
    this.todoForm.reset();
  }

  updateTask() {
    const updatedDescription = this.todoForm.value.item;
    const updatedDueDate = this.todoForm.value.dueDate;

    // Verifico si hay cambios, tanto en tarea como en fecha
    if (updatedDescription !== this.task[this.updateIndex].description) {
      this.task[this.updateIndex].description = updatedDescription;
    }

    // Verifico si se ha proporcionado una fecha actualizada
    if (updatedDueDate !== this.task[this.updateIndex].dueDate) {
      this.task[this.updateIndex].dueDate = updatedDueDate;
    }

    this.todoForm.reset();
    this.updateIndex = undefined;
    this.isEditEnabled = false;
  }

  onEdit(item: ITask, i: number) {
    this.todoForm.controls['item'].setValue(item.description);

    if (item.dueDate) {
      // Si existe una fecha, La muestra en el formulario
      this.todoForm.controls['dueDate'].setValue(item.dueDate);
    } else {
      this.todoForm.controls['dueDate'].setValue('');
    }

    this.updateIndex = i;
    this.isEditEnabled = true;
  }

  deleteTask(i: number) {
    this.task.splice(i, 1);
  }

  deleteInprogressTask(i: number) {
    this.inprogress.splice(i, 1);
  }

  deleteDoneTask(i: number) {
    this.done.splice(i, 1);
  }

  isDueDateExpired(task: ITask): boolean {
    if (!task.dueDate) {
      return false; // Si no hay fecha, no se marca como vencida
    }

    const currentDate = new Date(); // Con ésto tengo la fecha actual
    return task.dueDate < currentDate;
  }

  drop(event: CdkDragDrop<ITask[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
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
