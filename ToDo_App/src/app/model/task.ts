export interface ITask{
  description: string;
  dueDate: Date | null;
  done: boolean;
  isExpired: boolean;
}
