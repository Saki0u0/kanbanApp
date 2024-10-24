import { atom } from "nanostores";
import type { Task } from "./task";
import type { Column } from "./columns";

export class TaskContext {
  private static instance: TaskContext;
  private filter: string = "";
  private listenerFunctions: (() => void)[] = [];
  private $columns = atom<Column[]>([
    {
      tasks: [
        { id: 1, title: "Title", description: "Description 1", label: "todo" },
      ],
      label: "To Do",
    },
    {
      tasks: [
        {
          id: 2,
          title: "Task 2",
          description: "Description 2",
          label: "In Progress",
        },
      ],
      label: "In Progress",
    },
    {
      tasks: [
        { id: 3, title: "Task 3", description: "Description 3", label: "done" },
      ],
      label: "Done",
    },
  ]);

  static getInstance() {
    if (!TaskContext.instance) {
      TaskContext.instance = new TaskContext();
    }
    return TaskContext.instance;
  }

  updateFilter(keyword: string) {
    this.filter = keyword;
    if (keyword.length >= 3) {
      this.notifyListeners();
    } else {
      this.filter = "";
      this.notifyListeners();
    }
  }

  getColumns() {
    const filter = this.filter;
    if (!filter) return this.$columns.get();

    const filteredColumns = this.$columns
      .get()
      .map((column) => {
        const matchedTasks = column.tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(this.filter.toLowerCase()) ||
            task.description.toLowerCase().includes(this.filter.toLowerCase())
        );
        return { ...column, tasks: matchedTasks }
      })

    return filteredColumns;
  }

  addColumn(label: string) {
    const columns = this.$columns.get();
    let newLabel = label;
    let counter = 1;
    while (columns.find((column) => column.label === newLabel)) {
      newLabel = `${label} ${counter}`;
      counter++;
    }
    columns.push({ label: newLabel, tasks: [] });
    this.$columns.set(columns);
    this.notifyListeners();
  }

  updateColumnLabel(label: string, newLabel: string) {
    const columns = this.$columns.get();
    const targetColumn = columns.find((column) => column.label === label);
    if (!targetColumn) return;

    targetColumn.label = newLabel;

    this.$columns.set(columns);
    this.notifyListeners();
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
    this.notifyListeners();
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

    this.notifyListeners();
  }

  moveTask(
    taskId: number,
    fromColumnLabel: string,
    toColumnLabel: string,
    newIndex: number
  ) {
    const columns = this.$columns.get();
    const fromColumn = columns.find(
      (column) => column.label === fromColumnLabel
    );
    const toColumn = columns.find((column) => column.label === toColumnLabel);

    if (!fromColumn || !toColumn) return;

    const taskIndex = fromColumn.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return;

    // Remove the task from the source column and get it
    const [task] = fromColumn.tasks.splice(taskIndex, 1);

    // Insert the task at the new index in the destination column
    toColumn.tasks.splice(newIndex, 0, task);

    // Update the columns in the store
    this.$columns.set([...columns]);
    this.notifyListeners();
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
    this.notifyListeners();
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

    this.notifyListeners();
  }

  addListener(listener: () => void) {
    this.listenerFunctions.push(listener);
  }

  notifyListeners() {
    this.listenerFunctions.forEach((listener) => listener());
  }
}
