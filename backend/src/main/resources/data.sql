DELETE FROM APP_USER;
DELETE FROM CHAT;
DELETE FROM CHAT_ADMINS;
DELETE FROM CHAT_MESSAGES;
DELETE FROM CHAT_USERS;
DELETE FROM MESSAGE;

INSERT INTO APP_USER(id, email, password, full_name)
-- Password: 1234
VALUES ('be900497-cc68-4504-9b99-4e5deaf1e6c0', 'luke.skywalker@test.com', '$2a$12$0TjSkhITHjj8BDk8KjHUYu1ASnDBOFMYFgRJSpkmdLQnRJdwoVIvS',
        'Luke Skywalker'),
--        Password: 2345
       ('f290f384-60ba-4cdd-af96-26c88ede0264', 'darth.vader@test.com', '$2a$12$rrCst9IZ1/zsIFxRq.Zw9eUDEIRne0oIa0wRIy5frhnpy2YnBH3E6', 'Darth Vader');