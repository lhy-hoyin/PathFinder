# Project Design

## Naviation Mapping
<img src="https://docs.google.com/drawings/d/e/2PACX-1vRqMuimWRM7PElwnFa20kwO0GdYav1tAnEsU0ifIxrU6CvEeAt_zLzsEDkorTk5j9nw9Xly2un4wrNS/pub?w=611&amp;h=361">



## Program Flow
<img src="https://docs.google.com/drawings/d/e/2PACX-1vQamgQyQ7oZyEviaxv7FyfYWDPkXb1y1xG97Mu0VX3bFAPHFyPpA9eYhw9D_LpexOsuIqnteNDkxnor/pub?w=960&amp;h=720">



## Database Tables Structure


> Table Name: `profiles`
> 
> | Column Name | Data Type | Format |
> | --- | --- | --- |
> | user_id | `uuid` | `uuid` |
> | first_name | `text` | `text` |
> | last_name | `text` | `text` |
> | cohort | `text` | `text` |
> | course | `text` | `text` |
> | role | `smallint` | `int2` |
> | updated_at | `timestamp with time zone` | `timestampz` |
>
> Remarks: `role` indicate which pages can the user access


> Table Name: `modules`
> 
> | Column Name | Data Type | Format |
> | --- | --- | --- |
> | id | `uuid` | `uuid` |
> | acad_year | `text` | `text` |
> | code | `text` | `text` |
> | name | `text` | `text` |
> | description | `text` | `text` |
> | credit | `smallint` | `int2` |
> | pre_req | `ARRAY`| `_text` |
> | preclusion | `text` | `text` |
> | updated_at | `timestamp with time zone` | `timestampz` |
> 
> Remarks: `code` refers to the module code


> Table Name: `courses`
> 
> | Column Name | Data Type | Format |
> | --- | --- | --- |
> | id | `bigint` | `int8` |
> | course_name | `text` | `text` |
> | cohort | `text` | `text` |
> | grad_requirement | `ARRAY`| `_text` |
> | position | `ARRAY`| `_text` |
>
> Remarks: `position` stores the position of the modules at the graph
