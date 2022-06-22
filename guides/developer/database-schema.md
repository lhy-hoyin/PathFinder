Copy this database sechma to quickly generate the required database tables.
> *HINT*  
> If you are using Supabase, you can quickly generate the tables by pasting this into the Supabase SQL Editor.  
> Log into Supabase > Project > `SQL Editor` > `+ New query` > paste schema > `Run`

``` sql
-- Create 'profiles' table
create table profiles (
      user_id uuid references auth.users primary key,
      first_name text,
      last_name text,
      cohort text,
      role smallint not null default 0,
      updated_at timestamp with time zone not null default now()
);

-- set RLS for 'profiles' table
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for
    select using (true);
create policy "Users can insert their own profile." on profiles for
    insert with check (auth.uid() = user_id);
create policy "Users can update own profile" on profiles for
    update using (auth.uid() = user_id);

-- Create 'modules' table
create table modules (
      id uuid default uuid_generate_v4() primary key,
      acad_year text not null,
      code text not null,
      name text not null,
      description text not null,
      credit smallint not null,
      pre_req text array,
      preclusion text,
      updated_at timestamp with time zone not null default now()
);
```
