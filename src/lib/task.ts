
interface Task {
  id: number;
  title: string;
  description: string;
}

export class TaskContext {
  private tasks: Task[]
  private listeners: (() => void)[]

  static id = 1;

  constructor() {
    this.tasks = []
    this.listeners = []
  }

  addTask(task: {title: string, description: string}) {
    const newTask: Task = {
      id: TaskContext.id++,
      title: task.title,
      description: task.description,
    }
    this.tasks.push(newTask)
    this.notifyListeners()
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener)
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener())
  }
}