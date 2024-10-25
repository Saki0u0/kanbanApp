export type Assignee = {
  name: "pumpkin" | "dracula" | "ghost" | "hat" | "spider";
  src: `/asignee/${string}.svg`;
};

export const assigneeMap: Record<Assignee["name"], Assignee> = {
  pumpkin: { name: "pumpkin", src: "/asignee/pumpkin.svg" },
  dracula: { name: "dracula", src: "/asignee/dracula.svg" },
  ghost: { name: "ghost", src: "/asignee/ghost.svg" },
  hat: { name: "hat", src: "/asignee/hat.svg" },
  spider: { name: "spider", src: "/asignee/spider.svg" },
};

export const getUnassignedAssignee = (assignees: Assignee[]): Assignee[] => {
  const unassignedAssignee = Object.values(assigneeMap).filter(
    (assignee) => !assignees.includes(assignee)
  );
  return unassignedAssignee;
};
