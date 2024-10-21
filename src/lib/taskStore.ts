import { atom } from "nanostores";
import type { Task } from "./task";
import type { Column } from "./columns";

export const tasks = atom<Task[]>([]);
export const columns = atom<Column[]>([
  {
    id: "todo",
    title: "To Do",
    tasks: [
      { id: 1, title: "Task 1", description: "Description 1", status: "todo" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      {
        id: 2,
        title: "Task 2",
        description: "Description 2",
        status: "in-progress",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      { id: 3, title: "Task 3", description: "Description 3", status: "done" },
    ],
  },
]);

export function addTask(columnId: string, title: string, description: string) {
  // tasks.set([
  //   ...tasks.get(),
  //   { id: Date.now(), title, description, status: "todo" },
  // ]);
  console.log("addTask", columnId, title, description);
  const column = columns.get().find((column) => column.id === columnId);
  console.log("column", column);
  if (!column) return;
  const newTask: Task = { id: Date.now(), title, description, status: "todo" };
  column.tasks = [...column.tasks, newTask];
  columns.set(columns.get().map((c) => (c.id === columnId ? column : c)));
  console.log(column);
}

export function updateTaskStatus(id: number, status: string) {
  tasks.set(
    tasks.get().map((task) => (task.id === id ? { ...task, status } : task))
  );
}
