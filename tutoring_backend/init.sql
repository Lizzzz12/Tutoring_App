CREATE TABLE Student (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE Teacher (
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    description TEXT,
    image TEXT,
    subject VARCHAR(255),
    price DECIMAL(10,2),
    availability TEXT,
    ratings DECIMAL(3,2) DEFAULT 0.0,
    tutoring_location TEXT CHECK (tutoring_location IN ('Online', 'In Person', 'Both')),
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE Reviews (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES Student(id) ON DELETE CASCADE,
    teacher_id INT REFERENCES Teacher(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    review TEXT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL
);

CREATE TABLE Admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO Student (firstname, lastname, email, username, password) VALUES
('Alice', 'Johnson', 'alice@example.com', 'alicej', 'hashedpassword1'),
('Bob', 'Smith', 'bob@example.com', 'bobsmith', 'hashedpassword2');

INSERT INTO Teacher (firstname, lastname, email, phone, address, description, image, subject, price, availability, ratings, tutoring_location, username, password) VALUES
('John', 'Doe', 'johndoe@example.com', '1234567890', '123 Main St', 'Experienced math tutor', 'image_url_1', 'Mathematics', 25.00, 'Weekdays 6-9 PM', 4.5, 'Online', 'johndoe', 'hashedpassword3'),
('Emma', 'Brown', 'emma@example.com', '0987654321', '456 Elm St', 'Physics specialist', 'image_url_2', 'Physics', 30.00, 'Weekends', 5.0, 'Both', 'emmabrown', 'hashedpassword4');

INSERT INTO Reviews (student_id, teacher_id, title, review, rating) VALUES
(1, 1, 'Great Tutor', 'John was very helpful and explained everything clearly.', 5),
(2, 2, 'Excellent Physics Lessons', 'Emma is a fantastic teacher with deep knowledge.', 5);

INSERT INTO Admin (username, password) VALUES
('admin', 'hashedadminpassword');
