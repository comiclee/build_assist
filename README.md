# build_assist
A tool to build project automatically with git and maven

## How to use

1. Use command `node server/index` to run the server
2. Visit `http://localhost:8787/find` with the browser
3. Input project directory and click '查找' . It will list all the git modules with git branch behind under the directory.
4. Copy module list and paste in the textarea with the order you want, and change the git branch to what you want.
5. Click '自动编译' and it will check out the right branch , pull new codes and mvn install automatically by the order.
