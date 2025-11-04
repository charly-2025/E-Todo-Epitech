USE etodo;
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    firstname VARCHAR(50),
    name VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(50),
    created_date DATE
);

CREATE TABLE IF NOT EXISTS todo (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    title VARCHAR(100),
    created_at DATE,
    due_time DATE,
    description TEXT,
    status VARCHAR(10),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


