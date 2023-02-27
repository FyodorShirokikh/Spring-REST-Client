create table  IF NOT EXISTS users_db.users
(
    id       bigint auto_increment primary key,
    age      int null,
    username varchar(255) not null,
    lastname varchar(255) null,
    password varchar(255) not null,
    email    varchar(255) not null
);
create table  IF NOT EXISTS users_db.roles
(
    id   bigint auto_increment primary key,
    name varchar(255) null
);
create table  IF NOT EXISTS users_db.users_roles
(
    user_id bigint not null,
    role_id bigint not null,
    primary key (user_id, role_id),
    constraint users_roles_ibfk_1
        foreign key (user_id) references users_db.users (id),
    constraint users_roles_ibfk_2
        foreign key (role_id) references users_db.roles (id)
);
create index role_id
    on users_db.users_roles (role_id);




