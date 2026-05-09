-- Update Schema for Sub-tasks
CREATE TABLE IF NOT EXISTS "SubTask" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "completed" BOOLEAN DEFAULT FALSE,
  "taskId" TEXT NOT NULL REFERENCES "Task"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update Schema for User Stats/Streaks
CREATE TABLE IF NOT EXISTS "UserStats" (
  "userId" TEXT PRIMARY KEY,
  "currentStreak" INTEGER DEFAULT 0,
  "longestStreak" INTEGER DEFAULT 0,
  "totalCompleted" INTEGER DEFAULT 0,
  "lastCompletedDate" DATE,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for new tables
ALTER TABLE "SubTask" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserStats" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subtask_owner_access" ON "SubTask"
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM "Task" WHERE "Task".id = "SubTask"."taskId" AND "Task"."userId" = auth.uid()::text
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM "Task" WHERE "Task".id = "SubTask"."taskId" AND "Task"."userId" = auth.uid()::text
  ));

CREATE POLICY "userstats_owner_access" ON "UserStats"
  FOR ALL TO authenticated
  USING (auth.uid()::text = "userId")
  WITH CHECK (auth.uid()::text = "userId");

-- Grant permissions
GRANT ALL ON TABLE "SubTask" TO authenticated;
GRANT ALL ON TABLE "UserStats" TO authenticated;
