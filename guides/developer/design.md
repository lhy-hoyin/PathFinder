# Project Design

## Naviation Mapping
<img src="https://docs.google.com/drawings/d/e/2PACX-1vRqMuimWRM7PElwnFa20kwO0GdYav1tAnEsU0ifIxrU6CvEeAt_zLzsEDkorTk5j9nw9Xly2un4wrNS/pub?w=611&amp;h=361">

## Program Flow
<img src="https://docs.google.com/drawings/d/e/2PACX-1vQamgQyQ7oZyEviaxv7FyfYWDPkXb1y1xG97Mu0VX3bFAPHFyPpA9eYhw9D_LpexOsuIqnteNDkxnor/pub?w=960&amp;h=720">

## Database tables

> Table Name: `profiles`
> 
> | Column Name | Data Type | Remarks |
> | --- | --- | --- |
> | user_id | `uuid` |
> | first_name | `text` |
> | last_name | `text` |
> | cohort | `text` |
> | role | `int2` | Indicate which pages can the user access |
> | updated_at | `timestampz` |

> Table Name: `modules`
> 
> | Column Name | Data Type | Remarks |
> | --- | --- | --- |
> | id | `uuid` |
> | acad_year | `text` |
> | code | `text` | module code |
> | name | `text` |
> | description | `text` |
> | credit | `int2` |
> | pre_req | `text` (Array) |
> | preclusion | `text` |
> | updated_at | `timestampz` |

> Table Name: `courses`
> 
> | Column Name | Data Type | Remarks |
> | --- | --- | --- |
> | id | `int8` |
> | course_name | `text` |
> | cohort | `text` |
> | grad_requirement | `text` (Array) |
> | position | `text` (Array) | position of the modules at the graph |
