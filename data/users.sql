create table users (
    id uuid references auth.users on delete cascade,
    first_name text not null,
    last_name text not null,
    email text not null,
    phone_number text,
    country text not null,
    currency text not null,
    birthday date,
    role text default 'user',
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now()),
    deleted_at timestamp with time zone,
    deleted_by uuid,
    primary key (id)
);


-- Ajout un trigger pour mettre updated_at = now() automatiquement à chaque update.
