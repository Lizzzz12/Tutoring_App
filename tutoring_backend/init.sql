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
    subject VARCHAR(255),
    price DECIMAL(10,2),
    img_url VARCHAR(255),
    availability TEXT,
    ratings DECIMAL(3,2) DEFAULT 0.0,
    teacher_rating DECIMAL(3,2) DEFAULT 0.0,
    tutoring_location TEXT CHECK (tutoring_location IN ('Online', 'In Person', 'Both')),
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
);
 
CREATE TABLE AnnouncementReviews (
    id SERIAL PRIMARY KEY,
    announcement_id INT REFERENCES Announcements(id) ON DELETE CASCADE,
    student_id INT REFERENCES Student(id) ON DELETE CASCADE,
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    review TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
 
CREATE TABLE Reviews (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES Student(id) ON DELETE CASCADE,
    teacher_id INT REFERENCES Teacher(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    review TEXT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5) NOT NULL
);
 
CREATE TABLE Announcements (
    id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES Teacher(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 
 
CREATE TABLE Admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
);
 
INSERT INTO Student (firstname, lastname, email, username, password) VALUES
('Alice', 'Johnson', 'alice@example.com', 'alicej', 'hashedpassword1'),
('Bob', 'Smith', 'bob@example.com', 'bobsmith', 'hashedpassword2');
 
INSERT INTO Teacher (
    firstname, lastname, email, phone, address, description, subject, price, img_url, availability, ratings, tutoring_location, username, password
) VALUES
    ('Alice', 'Johnson', 'alice.johnson@example.com', '123-456-7890', '123 Maple St, Springfield', 'Experienced math teacher with over 10 years in high school education.', 'Mathematics', 50.00, 'https://images.pexels.com/photos/5212325/pexels-photo-5212325.jpeg', 'Mon-Fri 9am-5pm', 4.5, 'Online', 'alicej', 'securepassword1'),
    ('Bob', 'Smith', 'bob.smith@example.com', '234-567-8901', '456 Oak St, Springfield', 'Passionate physics tutor specializing in AP Physics.', 'Physics', 60.00, 'https://images.pexels.com/photos/5212340/pexels-photo-5212340.jpeg', 'Tue-Thu 10am-4pm', 4.7, 'Both', 'bobsmith', 'securepassword2'),
    ('Carol', 'Taylor', 'carol.taylor@example.com', '345-678-9012', '789 Pine St, Springfield', 'English literature expert with a focus on modern poetry.', 'English Literature', 55.00, 'https://images.pexels.com/photos/5212353/pexels-photo-5212353.jpeg', 'Mon-Wed 1pm-6pm', 4.6, 'In Person', 'carolt', 'securepassword3'),
    ('David', 'Brown', 'david.brown@example.com', '456-789-0123', '321 Birch St, Springfield', 'Chemistry professor with a PhD in organic chemistry.', 'Chemistry', 65.00, 'https://images.pexels.com/photos/5212365/pexels-photo-5212365.jpeg', 'Wed-Fri 9am-3pm', 4.8, 'Online', 'davidb', 'securepassword4'),
    ('Eva', 'Davis', 'eva.davis@example.com', '567-890-1234', '654 Cedar St, Springfield', 'Biology teacher with a knack for making complex topics accessible.', 'Biology', 58.00, 'https://images.pexels.com/photos/5212378/pexels-photo-5212378.jpeg', 'Mon-Fri 10am-4pm', 4.9, 'Both', 'evad', 'securepassword5'),
    ('Frank', 'Miller', 'frank.miller@example.com', '678-901-2345', '987 Elm St, Springfield', 'History buff specializing in European history.', 'History', 52.00, 'https://images.pexels.com/photos/5212390/pexels-photo-5212390.jpeg', 'Tue-Thu 11am-5pm', 4.3, 'In Person', 'frankm', 'securepassword6'),
    ('Grace', 'Wilson', 'grace.wilson@example.com', '789-012-3456', '159 Spruce St, Springfield', 'Computer science instructor with expertise in algorithms.', 'Computer Science', 70.00, 'https://images.pexels.com/photos/5212403/pexels-photo-5212403.jpeg', 'Mon-Wed 2pm-7pm', 4.7, 'Online', 'gracew', 'securepassword7'),
    ('Henry', 'Moore', 'henry.moore@example.com', '890-123-4567', '753 Willow St, Springfield', 'Art teacher focusing on contemporary art techniques.', 'Art', 45.00, 'https://images.pexels.com/photos/5212415/pexels-photo-5212415.jpeg', 'Thu-Fri 9am-2pm', 4.4, 'Both', 'henrym', 'securepassword8'),
    ('Ivy', 'Clark', 'ivy.clark@example.com', '901-234-5678', '852 Aspen St, Springfield', 'Music instructor specializing in classical piano.', 'Music', 60.00, 'https://images.pexels.com/photos/5212428/pexels-photo-5212428.jpeg', 'Mon-Fri 12pm-6pm', 4.8, 'In Person', 'ivyc', 'securepassword9'),
    ('Jack', 'White', 'jack.white@example.com', '012-345-6789', '369 Redwood St, Springfield', 'Physical education coach with a focus on wellness and fitness.', 'Physical Education', 40.00, 'https://images.pexels.com/photos/5212440/pexels-photo-5212440.jpeg', 'Tue-Thu 8am-1pm', 4.2, 'Online', 'jackw', 'securepassword10');
 
INSERT INTO Reviews (student_id, teacher_id, title, review, rating) VALUES
(1, 1, 'Great Tutor', 'John was very helpful and explained everything clearly.', 5),
(2, 2, 'Excellent Physics Lessons', 'Emma is a fantastic teacher with deep knowledge.', 5);
 
INSERT INTO Admin (username, password) VALUES
('admin', 'hashedadminpassword');
 
INSERT INTO Announcements (teacher_id, subject, price, content) VALUES
    (1, 'Mathematics', 50.00, 'Special offer: Get 10% off on Math tutoring for the first 5 sessions!'),
    (2, 'Physics', 60.00, 'New Physics course available for beginners. Register now for an introductory discount!'),
    (3, 'English Literature', 55.00, 'Join my English Literature class focusing on modern poetry. Now accepting students for a new semester!'),
    (4, 'Chemistry', 65.00, 'Advanced Chemistry classes available. Book now and get a free introductory lesson!'),
    (5, 'Biology', 58.00, 'Biology tutoring now available online and in-person. Get 20% off on your first session!'),
    (6, 'History', 52.00, 'European History: In-depth analysis of 20th-century events. Special discount for group sessions!'),
    (7, 'Computer Science', 70.00, 'Enroll now for advanced courses in algorithms and programming! Early bird discount available.'),
    (8, 'Art', 45.00, 'Art classes focusing on contemporary techniques. Join now and get your first class free!'),
    (9, 'Music', 60.00, 'Classical piano lessons available for all levels. Special rates for children under 12!'),
    (10, 'Physical Education', 40.00, 'Get fit with personalized physical education lessons. Special offer for group bookings!');