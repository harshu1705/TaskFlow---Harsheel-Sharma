INSERT INTO users (id, name, email, password) VALUES 
('11111111-1111-1111-1111-111111111111', 'Test User', 'test@example.com', '$2b$12$liEWlNfu..s.EqSB2x0/BeHDVCBuZgeUO9Yx2mqwJgKXTc8ifjkHu')
ON CONFLICT (email) DO NOTHING;

INSERT INTO projects (id, name, description, owner_id) VALUES 
('22222222-2222-2222-2222-222222222222', 'Zomato Green Initiative', 'Platform migration for sustainability goals', '11111111-1111-1111-1111-111111111111')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (title, description, status, priority, project_id, assignee_id) VALUES
('Implement Backend Schema', 'Create tables with UUIDs and Enums', 'done', 'high', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
('Design React Kanban', 'Drag and drop columns for Zomato theme', 'in_progress', 'medium', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111'),
('Dockerize Systems', 'Verify multi-stage builds', 'todo', 'low', '22222222-2222-2222-2222-222222222222', NULL);
