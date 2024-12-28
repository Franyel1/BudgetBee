Milestone 04 - Final Project Documentation
===

NetID
---
fd2190

Name
---
Franyel Diaz Rodriguez

Repository Link
---
[Final Project Repository](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-Franyel1)

URL for deployed site
---
[Deployed Site](http://linserv1.cims.nyu.edu:26441/)

URL for form 1 (from previous milestone)
---
[Transactions Form](http://linserv1.cims.nyu.edu:26441/transactions)

Special Instructions for Form 1
---
Navigate to the transactions page and click “Add” to create a new transaction.

URL for form 2 (for current milestone)
---
[Edit Transaction Form](http://linserv1.cims.nyu.edu:26441/editTransaction/TRANSACTIONID)

Special Instructions for Form 2
---
In order to access this form, you must click on a transaction in the transactions table to edit it.

URL for form 3 (from previous milestone)
---
[Registration  Form](http://linserv1.cims.nyu.edu:26441/register)

Special Instructions for Form 3
---
registration form be sure to fill all fields, confirm password, and create a new username, this will be saved and used to log in




First link to GitHub line number(s) for constructor, HOF, etc.
---
[map and filter uses](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-Franyel1/blob/master/app.mjs#L104-L110)


Second link to GitHub line number(s) for constructor, HOF, etc.
---
[reduce](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-Franyel1/blob/master/auth.mjs#L115-L117)


Short description for links above
---
Uses *filter* to isolate income or expense transactions and *map* to transform them into simplified objects with only *name* and *amount* fields.
`
Uses *reduce* to calculate the total income and expense by summing up amounts from their respective breakdown arrays.




Link to GitHub line number(s) for schemas (db.js or models folder)
---
[startAuthenticatedSession](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-Franyel1/blob/master/db.mjs#L12-L73)



Description of research topics above with points
---
3 points - Perform server-side form validation using a JavaScript library to validata data input from user
3 points - Data visualization integrated with Chart.js to display income and expense summaries on the dashboard.
2 points - Motion One library used to add animations for row hovers, button clicks, and smooth transitions, creating a dynamic and responsive user interface.


Links to GitHub line number(s) for research topics described above (one link per line)
---
[Server-side Form Validation](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-Franyel1/blob/master/auth.mjs#L53-L65) 

[Data Visualization with Chart.js](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-Franyel1/blob/master/views/dashboard.hbs#L29-L154)  

[Motion One Animations](https://github.com/nyu-csci-ua-0467-001-002-fall-2024/final-project-Franyel1/blob/master/views/layout.hbs#L32-L61) 




Optional project notes
---
Register: create a new account
Login: To access most features, users must register and log in.
Adding a Transaction: Navigate to the transactions page and click “Add” to create a new transaction.
Editing Transactions: Click on any transaction row to edit its details.

Attributions
---
*(TODO: list sources that you have based your code off of, 1 per line, with file name, a very short description, and an accompanying URL... for example: routes/index.js - Authentication code based off of http://foo.bar/baz ... alternatively, if you have already placed annotations in your project, answer "See source code comments")*
