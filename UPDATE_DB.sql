-- 1. Create Missions Table (Projects Clients)
CREATE TABLE IF NOT EXISTS "missions" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" varchar(255) NOT NULL,
  "clientName" varchar(255),
  "description" text,
  "coverImageUrl" text,
  "isPublished" boolean DEFAULT false NOT NULL,
  "displayOrder" integer DEFAULT 0 NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- 2. Create Workflows Table (Linked to Missions)
CREATE TABLE IF NOT EXISTS "workflows" (
  "id" serial PRIMARY KEY NOT NULL,
  "missionId" integer REFERENCES "missions"("id") ON DELETE CASCADE,
  "title" varchar(255) NOT NULL,
  "description" text,
  "toolsUsed" text,
  "demoUrl" text,
  "codeSnippet" text,
  "displayOrder" integer DEFAULT 0 NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- 3. Create Experience Posts Table (R&D, Notebooks)
CREATE TABLE IF NOT EXISTS "experience_posts" (
  "id" serial PRIMARY KEY NOT NULL,
  "title" varchar(255) NOT NULL,
  "summary" text,
  "content" text,
  "type" varchar(50) NOT NULL, -- 'notebook', 'video', 'podcast', 'article'
  "mediaUrl" text,
  "tags" text,
  "isPublished" boolean DEFAULT false NOT NULL,
  "displayOrder" integer DEFAULT 0 NOT NULL,
  "createdAt" timestamp DEFAULT now() NOT NULL,
  "updatedAt" timestamp DEFAULT now() NOT NULL
);

-- 4. Enable RLS (Security) - Optional but recommended
ALTER TABLE "missions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "workflows" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "experience_posts" ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies (Public Read, Admin Write)
-- Missions
CREATE POLICY "Public missions are viewable by everyone" ON "missions" FOR SELECT USING (true);
CREATE POLICY "Admins can insert missions" ON "missions" FOR INSERT WITH CHECK (auth.role() = 'service_role' OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can update missions" ON "missions" FOR UPDATE USING (auth.role() = 'service_role' OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can delete missions" ON "missions" FOR DELETE USING (auth.role() = 'service_role' OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Workflows
CREATE POLICY "Public workflows are viewable by everyone" ON "workflows" FOR SELECT USING (true);
CREATE POLICY "Admins can insert workflows" ON "workflows" FOR INSERT WITH CHECK (auth.role() = 'service_role' OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can update workflows" ON "workflows" FOR UPDATE USING (auth.role() = 'service_role' OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can delete workflows" ON "workflows" FOR DELETE USING (auth.role() = 'service_role' OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Experience
CREATE POLICY "Public experience posts are viewable by everyone" ON "experience_posts" FOR SELECT USING (true);
CREATE POLICY "Admins can insert experience posts" ON "experience_posts" FOR INSERT WITH CHECK (auth.role() = 'service_role' OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can update experience posts" ON "experience_posts" FOR UPDATE USING (auth.role() = 'service_role' OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Admins can delete experience posts" ON "experience_posts" FOR DELETE USING (auth.role() = 'service_role' OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');
