import { atom } from "nanostores";
import type { Task } from "./task";
import type { Column } from "./columns";
import { columns } from "./pre";

export class TaskContext {
  private $columns = atom<Column[]>([{
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
      label: 'done',
    },
  ])


  addTask(title: string, description: string, label: string) {
    const targetColumn = this.$columns.get().find(column => column.label === label)

    if(!targetColumn) return;

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      label,
    }

    targetColumn.tasks = [...targetColumn.tasks, newTask]

    this.$columns.set(this.$columns.get().map((c) => (c.label === label ? targetColumn : c)));
  }

  updateTaskLabel(taskId: number, preLabel: string, newLabel: string) {
    const targetColumn = this.$columns.get().find(column => column.label === preLabel);

    if(!targetColumn) return;

    const updatedTasks = targetColumn.tasks.map(task => task.id === taskId ? {...task, label: newLabel} : task)

    const updatedColumn = {...targetColumn, tasks: updatedTasks}

    this.$columns.set(this.$columns.get().map((c) => (c.label === preLabel ? updatedColumn : c)));
  }

  editTask(label: string, taskId: number, newTitle: string, newDescription: string) {
    const targetColumn = this.$columns.get().find(column => column.label === label)
    if(!targetColumn) return;

    targetColumn.tasks = targetColumn.tasks.map(task => task.id === taskId ? {...task, title: newTitle, description: newDescription } : task)

    this.$columns.set(this.$columns.get().map((c) => (c.label === label ? targetColumn : c)));

  }

  deleteTask(id: number, label: string) {
    const targetColumn = this.$columns.get().find(column => column.label === label)

    if(!targetColumn) return;

    const updateColumnTasks = targetColumn.tasks.filter(task => task.id !== id)

    // entire column
    this.$columns.set(this.$columns.get().map((c) => (c.label === label ? {...targetColumn, tasks: updateColumnTasks} : c)));

    console.log(this.$columns.get())
  }
}