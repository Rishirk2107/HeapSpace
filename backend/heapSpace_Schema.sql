CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] NOT NULL,
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE answers (
  id SERIAL PRIMARY KEY,
  body TEXT NOT NULL,
  question_id INTEGER REFERENCES questions(id),
  user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP NOT NULL
);

select * from users;