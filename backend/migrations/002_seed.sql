-- ============================================================
-- TASKFLOW DEMO SEED DATA
-- Demo Login: test@example.com / password123
-- ============================================================

-- Demo user (password = "password123", bcrypt hash below)
INSERT INTO users (id, name, email, password) VALUES
  ('11111111-1111-1111-1111-111111111111',
   'Harsheel Sharma',
   'test@example.com',
   '$2b$12$liEWlNfu..s.EqSB2x0/BeHDVCBuZgeUO9Yx2mqwJgKXTc8ifjkHu')
ON CONFLICT (email) DO NOTHING;

-- ---------------------------------------------------------------
-- PROJECTS (3 realistic Greening India initiatives)
-- ---------------------------------------------------------------
INSERT INTO projects (id, name, description, owner_id) VALUES
  ('22222222-2222-2222-2222-222222222222',
   'Zomato Green Fleet Initiative',
   'Transition 40% of delivery fleet to EVs across Tier-1 cities by Q3.',
   '11111111-1111-1111-1111-111111111111'),
  ('33333333-3333-3333-3333-333333333333',
   'Zero Waste Packaging Drive',
   'Replace all single-use plastic packaging with certified biodegradable materials.',
   '11111111-1111-1111-1111-111111111111'),
  ('44444444-4444-4444-4444-444444444444',
   'Solar-Powered Dark Kitchens',
   'Install 500kW solar panel arrays across 12 dark kitchen hubs in Mumbai and Delhi.',
   '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------
-- TASKS — Project 1: Green Fleet
-- ---------------------------------------------------------------
INSERT INTO tasks (title, description, status, priority, project_id, assignee_id, due_date) VALUES
  ('Vendor shortlist for EV bikes',
   'Evaluate Ather, Ola Electric, and Hero Vida for fleet compatibility.',
   'done', 'high',
   '22222222-2222-2222-2222-222222222222',
   '11111111-1111-1111-1111-111111111111',
   '2026-03-01'),
  ('Pilot 50 EVs in Bengaluru',
   'Deploy a controlled pilot and collect telemetry data on range and uptime.',
   'done', 'high',
   '22222222-2222-2222-2222-222222222222',
   '11111111-1111-1111-1111-111111111111',
   '2026-03-20'),
  ('Build EV charging station map',
   'Create an internal dashboard layer showing nearest charging stations per hub.',
   'in_progress', 'medium',
   '22222222-2222-2222-2222-222222222222',
   '11111111-1111-1111-1111-111111111111',
   '2026-04-15'),
  ('Finalize fleet insurance policies',
   'Negotiate group EV insurance with Acko and HDFC Ergo.',
   'todo', 'medium',
   '22222222-2222-2222-2222-222222222222',
   NULL,
   '2026-05-01'),
  ('National rollout communication plan',
   'Internal announcement and rider training material creation.',
   'todo', 'low',
   '22222222-2222-2222-2222-222222222222',
   NULL,
   '2026-05-15');

-- ---------------------------------------------------------------
-- TASKS — Project 2: Zero Waste Packaging
-- ---------------------------------------------------------------
INSERT INTO tasks (title, description, status, priority, project_id, assignee_id, due_date) VALUES
  ('Audit current packaging suppliers',
   'Map all existing single-use plastic SKUs to supplier contracts.',
   'done', 'high',
   '33333333-3333-3333-3333-333333333333',
   '11111111-1111-1111-1111-111111111111',
   '2026-02-28'),
  ('Source biodegradable alternatives',
   'RFQ to EcoWrap, Pakka, and No Nasties for pricing and certifications.',
   'in_progress', 'high',
   '33333333-3333-3333-3333-333333333333',
   '11111111-1111-1111-1111-111111111111',
   '2026-04-20'),
  ('Pilot in 5 restaurants - Delhi NCR',
   'Switch 5 partner restaurants to new packaging and gather feedback.',
   'todo', 'medium',
   '33333333-3333-3333-3333-333333333333',
   NULL,
   '2026-06-01');

-- ---------------------------------------------------------------
-- TASKS — Project 3: Solar Dark Kitchens
-- ---------------------------------------------------------------
INSERT INTO tasks (title, description, status, priority, project_id, assignee_id, due_date) VALUES
  ('Structural feasibility assessment',
   'Engineering survey of rooftop load capacity at 12 hub locations.',
   'done', 'high',
   '44444444-4444-4444-4444-444444444444',
   '11111111-1111-1111-1111-111111111111',
   '2026-03-10'),
  ('Tender process for solar vendor',
   'Float tenders with Waaree, Adani Solar, and Vikram Solar.',
   'in_progress', 'high',
   '44444444-4444-4444-4444-444444444444',
   '11111111-1111-1111-1111-111111111111',
   '2026-04-30'),
  ('Grid interconnect regulatory approval',
   'Submit DISCOM net-metering applications across Maharashtra and Delhi.',
   'todo', 'medium',
   '44444444-4444-4444-4444-444444444444',
   NULL,
   '2026-05-20'),
  ('Staff safety training for solar equipment',
   'On-site training sessions for kitchen managers at all 12 hubs.',
   'todo', 'low',
   '44444444-4444-4444-4444-444444444444',
   NULL,
   '2026-06-15');
