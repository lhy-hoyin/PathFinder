# Project Design

## Program Flow
<img src="https://docs.google.com/drawings/d/e/2PACX-1vQamgQyQ7oZyEviaxv7FyfYWDPkXb1y1xG97Mu0VX3bFAPHFyPpA9eYhw9D_LpexOsuIqnteNDkxnor/pub?w=960&amp;h=720">

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
