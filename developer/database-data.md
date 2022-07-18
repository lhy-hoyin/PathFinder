# Database Data

Run this SQL to quickly provide some data to your database.
> *HINT*  
> If you are using Supabase, you can quickly insert the data to your database by pasting this into the Supabase SQL Editor.  
> Log into Supabase > Project > `SQL Editor` > `+ New query` > paste sql > `Run`

``` sql
insert into courses (course_name, cohort, grad_requirement, position) values
  (
    'Computer Science', 
    'AY2021/2022', 
    '{
      "CS1101S",
      "CS1231S",
      "MA1521",
      "MA2001",
      "CS2040S",
      "CS2109S",
      "ST2334",
      "CS3230",
      "CS2030S",
      "CS2103T",
      "CS2100",
      "CS2106",
      "CS2101",
      "IS1103",
      "ES2660"
    }',
    '{
      { "CS1101S", "-340", "-200" },
      { "CS1231S", "0","-200"},
      { "MA1521", "300", "-200" },
      { "MA2001", "558", "-140" },
      { "CS2040S", "-145", "-90" },
      { "CS2109S", "134", "80" },
      { "ST2334", "413", "-53" },
      { "CS3230", "-140", "80" },
      { "CS2030S", "-340", "-90" },
      { "CS2101", "-342", "230" },
      { "CS2103T", "-342", "200" },
      { "CS2100", "-530", "-90" },
      { "CS2106", "-530",  "80" },
      { "IS1103", "560", "-77" },
      { "ES2660", "560", "-17" },
      { "CS1231S or CS2040S or MA1521", "130", "-53"}
    }'
  );
```
