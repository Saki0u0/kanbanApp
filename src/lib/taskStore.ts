import { atom } from "nanostores";
import type { Task } from "./task";

export const tasks = atom<Task[]>([]);

export function addTask(title: string, description: string) {
  tasks.set([
    ...tasks.get(),
    { id: Date.now(), title, description, status: "todo" },
  ]);
}

export function updateTaskStatus(id: number, status: string) {
  tasks.set(
    tasks.get().map((task) => (task.id === id ? { ...task, status } : task))
  );
}
