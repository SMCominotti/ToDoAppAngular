import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ITask } from '../model/task';

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
  isExpired: ITask[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.todoForm = this.fb.group({
      item: ['', Validators.required],
      dueDate: [''],
    });

    // Cargar las tareas y las fechas almacenadas en el Local Storage
    this.loadTasksFromLocalStorage();
    this.loadDatesFromLocalStorage();

    // Verificar si las fechas de vencimiento están vencidas para todas las tareas
    this.task.forEach((task) => {
      task.isExpired = this.isDueDateExpired(task);
    });

    this.inprogress.forEach((task) => {
      task.isExpired = this.isDueDateExpired(task);
    });

    this.done.forEach((task) => {
      task.isExpired = this.isDueDateExpired(task);
    });

    this.loadInprogressFromLocalStorage();
    this.loadDoneFromLocalStorage();
    this.loadIsExpiredFromLocalStorage();
  }

  private saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.task));
  }

  private loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.task = JSON.parse(storedTasks);

      this.task.forEach((task) => {
        task.isExpired = this.isDueDateExpired(task);
      });
    }
  }

  private saveDatesToLocalStorage() {
    localStorage.setItem(
      'dueDates',
      JSON.stringify(this.task.map((t) => t.dueDate))
    );
  }

  private loadDatesFromLocalStorage() {
    const storedDates = localStorage.getItem('dueDates');
    if (storedDates) {
      const dueDates = JSON.parse(storedDates);
      this.task.forEach((task, index) => {
        task.dueDate = dueDates[index];
      });
    }
  }

  private saveInprogressToLocalStorage() {
    localStorage.setItem('inprogress', JSON.stringify(this.inprogress));
  }

  private loadInprogressFromLocalStorage() {
    const storedInprogress = localStorage.getItem('inprogress');
    if (storedInprogress) {
      this.inprogress = JSON.parse(storedInprogress);
    }
  }

  private saveDoneToLocalStorage() {
    localStorage.setItem('done', JSON.stringify(this.done));
  }

  private loadDoneFromLocalStorage() {
    const storedDone = localStorage.getItem('done');
    if (storedDone) {
      this.done = JSON.parse(storedDone);
    }
  }

  private saveIsExpiredToLocalStorage() {
    localStorage.setItem('isExpired', JSON.stringify(this.isExpired));
  }

  private loadIsExpiredFromLocalStorage() {
    const storedIsExpired = localStorage.getItem('isExpired');
    if (storedIsExpired) {
      this.isExpired = JSON.parse(storedIsExpired);
    }
  }

  addTask() {
    const taskName = this.todoForm.value.item;
    const dueDate = this.todoForm.value.dueDate;

    this.task.push({
      description: taskName,
      dueDate: dueDate,
      done: false,
      isExpired: this.isDueDateExpired({
        description: taskName,
        dueDate: dueDate,
        done: false,
        isExpired: false,
      }),
    });

    this.task.forEach((task) => {
      task.isExpired = this.isDueDateExpired(task);
    });

    this.inprogress.forEach((task) => {
      task.isExpired = this.isDueDateExpired(task);
    });

    this.done.forEach((task) => {
      task.isExpired = this.isDueDateExpired(task);
    });

    this.saveTasksToLocalStorage();
    this.saveDatesToLocalStorage();
    this.saveIsExpiredToLocalStorage();

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

    this.saveTasksToLocalStorage();
    this.saveDatesToLocalStorage();
    this.saveIsExpiredToLocalStorage();

    this.todoForm.reset();
    this.updateIndex = undefined;
    this.isEditEnabled = false;
  }

  onEdit(item: ITask, i: number) {
    this.todoForm.controls['item'].setValue(item.description);

    if (item.dueDate) {
      // Si existe una fecha, la muestra en el formulario
      this.todoForm.controls['dueDate'].setValue(item.dueDate);
    } else {
      this.todoForm.controls['dueDate'].setValue('');
    }

    this.updateIndex = i;
    this.isEditEnabled = true;
  }

  deleteTask(i: number) {
    this.task.splice(i, 1);

    this.saveTasksToLocalStorage();
    this.saveDatesToLocalStorage();
    this.saveIsExpiredToLocalStorage();
  }

  deleteInprogressTask(i: number) {
    this.inprogress.splice(i, 1);

    this.saveInprogressToLocalStorage();
    this.saveTasksToLocalStorage();
    this.saveDatesToLocalStorage();
    this.saveIsExpiredToLocalStorage();
  }

  deleteDoneTask(i: number) {
    this.done.splice(i, 1);

    this.saveDoneToLocalStorage();
    this.saveTasksToLocalStorage();
    this.saveDatesToLocalStorage();
    this.saveIsExpiredToLocalStorage();
  }
  isDueDateExpired(task: ITask): boolean {
    if (!task.dueDate) {
      return false; // Si no hay fecha, no se marca como vencida
    }

    const currentDate = new Date();

    const isExpired = new Date(task.dueDate) <= currentDate;

    if (isExpired !== task.isExpired) {
      task.isExpired = isExpired;
      this.saveTasksToLocalStorage();
    }

    return isExpired;
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

    // Guarda las tareas y las fechas en el Local Storage después de la operación de arrastrar y soltar
    this.saveTasksToLocalStorage();
    this.saveDatesToLocalStorage();
    this.saveIsExpiredToLocalStorage();

    // También guarda las tareas en progreso y completadas
    this.saveInprogressToLocalStorage();
    this.saveDoneToLocalStorage();
    this.saveIsExpiredToLocalStorage();
  }
}
