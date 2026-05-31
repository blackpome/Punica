"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_TASKS, type Task, type TaskStatus } from "@/lib/mock-security";
import { cn } from "@/lib/utils";

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "To do" },
  { status: "in-progress", label: "In progress" },
  { status: "done", label: "Done" },
];

const PRIORITY_STYLES: Record<Task["priority"], string> = {
  high: "border-destructive/40 bg-destructive/10 text-destructive",
  medium: "border-foreground/30 bg-foreground/10 text-foreground",
  low: "border-border bg-muted text-muted-foreground",
};

function storageKey(clientId: string) {
  return `punica:tasks:${clientId}`;
}

export default function TasksPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(clientId));
      setTasks(raw ? (JSON.parse(raw) as Task[]) : MOCK_TASKS);
    } catch {
      setTasks(MOCK_TASKS);
    }
    setHydrated(true);
  }, [clientId]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(storageKey(clientId), JSON.stringify(tasks));
    } catch {}
  }, [tasks, clientId, hydrated]);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-6 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">Task Manager</p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Tasks
          </h1>
          <p className="text-muted-foreground">
            Track remediation work and security tasks for this client.
          </p>
        </div>
        <Button size="sm">
          <ListChecks data-icon="inline-start" />
          New task
        </Button>
      </div>

      {!hydrated ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/30 p-3"
              >
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-medium">{col.label}</span>
                  <Badge variant="secondary" className="rounded-full">
                    {colTasks.length}
                  </Badge>
                </div>
                <div className="flex flex-col gap-2">
                  {colTasks.length === 0 ? (
                    <p className="px-1 py-6 text-center text-xs text-muted-foreground">
                      Nothing here.
                    </p>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex flex-col gap-2 rounded-lg border border-border/60 bg-background/60 p-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium">
                            {task.title}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "shrink-0 rounded-full text-xs capitalize",
                              PRIORITY_STYLES[task.priority],
                            )}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {task.description}
                        </p>
                        <div className="flex items-center justify-between">
                          {task.linkedVuln ? (
                            <span className="truncate text-xs text-muted-foreground">
                              ↳ {task.linkedVuln}
                            </span>
                          ) : (
                            <span />
                          )}
                          {task.assignee && (
                            <span className="shrink-0 text-xs font-medium">
                              {task.assignee}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
