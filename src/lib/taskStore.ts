import { atom } from "nanostores";
import type { Task } from "./task";
import type { Column } from "./columns";

export class TaskContext {
  private tasks = atom<Task[]>([]);
  private columns = atom<Column[]>([{
      id: 1,
      title: "To Do",
      tasks: [
        { id: 1, title: "Task 1", description: "Description 1", label: "todo" },
      ],
      label: 'todo',
    },
    {
      id: 2,
      title: "In Progress",
      tasks: [
        {
          id: 2,
          title: "Task 2",
          description: "Description 2",
          label: "in-progress",
        },
      ],
      label: 'in-progress',
    },
    {
      id: 3,
      title: "Done",
      tasks: [
        { id: 3, title: "Task 3", description: "Description 3", label: "done" },
      ],
      label: 'in-progress',
    },
  ])

  getTasks() {
    return this.tasks;
  }

  getColumns() {
    return this.columns;
  }

  addTask(title: string, description: string, label: string) {
    const targetColumn = this.columns.get().find(column => column.label === label)

    if(!targetColumn) return;

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      label,
    }

    targetColumn.tasks = [...targetColumn.tasks, newTask]

    this.columns.set(this.columns.get().map((c) => (c.label === label ? targetColumn : c)));
    this.tasks.set([...this.tasks.get(), newTask]);
    console.log(targetColumn)
  }

  updateTaskStatus(id: number, status: string) {
    const tasks = this.tasks.get();
    this.tasks.set(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  }

  deleteTask() {
    
  }

}