-- THERE IS NO NEED FOR "DROP TABLE IF EXISTS"
CREATE TABLE IF NOT EXISTS task (
  id SERIAL PRIMARY KEY,
  description VARCHAR NOT NULL
);

-- DO NOT INSERT ALREADY EXISTING DATA
INSERT INTO task (description) SELECT 'My test task' WHERE NOT EXISTS (SELECT * FROM task WHERE id=1);
INSERT INTO task (description) SELECT 'My another test task' WHERE NOT EXISTS (SELECT * FROM task WHERE id=2);