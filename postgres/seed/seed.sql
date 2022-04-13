BEGIN TRANSACTION;

insert into users
    (name, email, entries, joined)
values
    ('Johnny', 'a@a.com', 5, '2021-01-01');
insert into login
    (hash, email)
values
    ('$2b$10$/b.O90YrGXFgmt4a8kb.re/gnjKPSXlJV.HZ4ut27MirJRMX.wIjS', 'a@a.com');
-- Password hash is value of a

COMMIT;