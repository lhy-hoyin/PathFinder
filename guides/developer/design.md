# Project Design

## Database tables

> Table Name: `profiles`
> 
> | Column Name | Data Type |
> | --- | --- |
> | id | `uuid` |
> | FirstName | `text` |
> | LastName | `text` |
> | Cohort | `text` |
> | Role | `int2` |
> | updated_at | `timestampz` |

> Table Name: `modules`
> 
> | Column Name | Data Type       |
> |:------------|:----------------|
> | id          | `uuid`          |
> | code        | `text`          |
> | acadYear    | `text`          |
> | name        | `text`          |
> | description | `text`          |
> | credit      | `int2`          |
> | preReq      | `_text` (Array) |
> | preclusion  | `text`          |
> | updated_at  | `timestampz`    |