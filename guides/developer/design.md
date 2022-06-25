# Project Design

## Program Flow
<img src="https://docs.google.com/drawings/d/e/2PACX-1vQamgQyQ7oZyEviaxv7FyfYWDPkXb1y1xG97Mu0VX3bFAPHFyPpA9eYhw9D_LpexOsuIqnteNDkxnor/pub?w=960&amp;h=720">

## Database tables

> Table Name: `profiles`
> 
> | Column Name | Data Type |
> | --- | --- |
> | user_id | `uuid` |
> | first_name | `text` |
> | last_name | `text` |
> | cohort | `text` |
> | role | `int2` |
> | updated_at | `timestampz` |

> Table Name: `modules`
> 
> | Column Name | Data Type |
> | --- | --- |
> | id | `uuid` |
> | acad_year | `text` |
> | code | `text` |
> | name | `text` |
> | description | `text` |
> | credit | `int2` |
> | pre_req | `text` (Array) |
> | preclusion | `text` |
> | updated_at | `timestampz` |

> Table Name: `courses`
> 
> | Column Name | Data Type |
> | --- | --- |
> | id | `int8` |
> | course_name | `text` |
> | cohort | `text` |
> | grad_requirement | `text` (Array) |
> | position | `text` (Array) |
