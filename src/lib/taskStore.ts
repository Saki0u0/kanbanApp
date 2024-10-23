import { atom } from "nanostores";
import type { Task } from "./task";
import type { Column } from "./columns";

export class TaskContext {
  private $columns = atom<Column[]>([
    {
      id: 1,
      title: "To Do",
      tasks: [
        { id: 1, title: "Task 1", description: "Description 1", label: "todo" },
      ],
      label: "todo",
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
      label: "in-progress",
    },
    {
      id: 3,
      title: "Done",
      tasks: [
        { id: 3, title: "Task 3", description: "Description 3", label: "done" },
      ],
      label: "done",
    },
  ]);

  getColumns() {
    return this.$columns;
  }

  addTask(title: string, description: string, label: string) {
    const columns = this.$columns.get();
    const targetColumn = columns.find((column) => column.label === label);

    if (!targetColumn) return;

    const newTask: Task = {
      id: Date.now(),
      title,
      description,
      label,
    };

    targetColumn.tasks = [...targetColumn.tasks, newTask];

    this.$columns.set(
      columns.map((c) => (c.label === label ? targetColumn : c))
    );
  }

  updateTaskLabel(taskId: number, preLabel: string, newLabel: string) {
    const columns = this.$columns.get();

    const targetColumn = columns.find((column) => column.label === preLabel);
    if (!targetColumn) return;

    // change task label
    const updatedTask = targetColumn.tasks.find((task) => task.id === taskId);
    if (!updatedTask) return;

    const updatedTaskNewLabel = { ...updatedTask, label: newLabel };

    // previous task
    const removedTask = targetColumn.tasks.filter((task) => task.id !== taskId);
    if (!removedTask) return;

    const updatedPreColumn = { ...targetColumn, tasks: removedTask };

    // new
    const newColumn = columns.find((column) => column.label === newLabel);
    if (!newColumn) return;

    const updatedNewColumn = {
      ...newColumn,
      tasks: [...newColumn.tasks, updatedTaskNewLabel],
    };

    // update entire
    this.$columns.set(
      columns.map((c) => (c.label === newLabel ? updatedNewColumn : c))
    );

    this.$columns.set(
      columns.map((c) => (c.label === preLabel ? updatedPreColumn : c))
    );
  }

  editTask(
    label: string,
    taskId: number,
    newTitle: string,
    newDescription: string
  ) {
    const targetColumn = this.$columns
      .get()
      .find((column) => column.label === label);
    if (!targetColumn) return;

    targetColumn.tasks = targetColumn.tasks.map((task) =>
      task.id === taskId
        ? { ...task, title: newTitle, description: newDescription }
        : task
    );

    this.$columns.set(
      this.$columns.get().map((c) => (c.label === label ? targetColumn : c))
    );
  }

  deleteTask(id: number, label: string) {
    const targetColumn = this.$columns
      .get()
      .find((column) => column.label === label);

    if (!targetColumn) return;

    const updateColumnTasks = targetColumn.tasks.filter(
      (task) => task.id !== id
    );

    // entire column
    this.$columns.set(
      this.$columns
        .get()
        .map((c) =>
          c.label === label ? { ...targetColumn, tasks: updateColumnTasks } : c
        )
    );

    console.log(this.$columns.get());
  }
}
