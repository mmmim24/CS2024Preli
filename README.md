




# SUST_BONGCLOUD

>## Instituition 
### Shahjalal University of Science & Technology

> ##### Mustaq Mujahid Mim : mustaqmujahidmim@gmail.com
> ##### Niloy Roy: niloyroy1715@gmail.com
> ##### Ushan Ghosh : ushanghosh00@gmail.com

Clone this repository, run **Docker Desktop** on your local machine and run `docker compose up -d --build` in the project directory. Then access it on [localhost:8080](http://127.0.0.1:8000) 

If you can see `{message: "Welcome to dream theatre"}` then it has succesfully started the containers. 

you can run this project on Docker making the **script** executable with the command: `chmod +x run_docker_project.sh` . Run the script with your **ZIP** file name as an argument: `./run_docker_project.sh {ZIP_NAME}.zip` .



## Code Samurai 2024 - Preliminary Contest Instructions



### Submission process:

You have to submit a zip file in the **Google Classroom** before the contest ends.
Make sure you use the Zip Name from **column B** of this [sheet](https://docs.google.com/spreadsheets/d/e/2PACX-1vRyB65xZTrlkmk2-BSPEXHZsJxNrI9BVSL2MD6G-CMo0OT04eybisZEXb1S61OzChjGtzkjZEMNsOHA/pubhtml). We are replacing *spaces* with *underscores* to avoid issues.

***

> The zip file should be {zip_name}.zip. Example - DU_CSE.zip if your team name is
> “DU CSE”. Cross check your team name and zip names here - [List](https://docs.google.com/spreadsheets/d/e/2PACX-1vRyB65xZTrlkmk2-BSPEXHZsJxNrI9BVSL2MD6G-CMo0OT04eybisZEXb1S61OzChjGtzkjZEMNsOHA/pubhtml)        

---

* The zip file should not contain any __*executable*__ or *__node modules__* or __*virtualenv*__ file/folders and have the *dockerfile* inside the immediate directory, not inside a nested directory.
* One member from each team should submit, no need to submit from every member’s account.
* In case of multiple submissions by a team, we will count the **last submission** and the time penalty will be counted based on that.
* The submission will be disabled at **8:05 P.M.** , 5 minutes after the contest.
* In case of equal scores, submission time will be used as a **tiebreaker**.

### Files in the Zip:

* The zip file should contain a readme file (README.md) including the **team name** (*column A*), **Institution name** and the list of **emails** of all the team members. You can add additional instructions there, but we will not be using them in the judging process. This is useful in case some team uses the incorrect name of zip.
* Make sure your *dockerfile* launches the application with an empty database.
Store your environment variables in a `.env` file.
* Add a simple dockerfile to build an image from your solution. Make sure to mention the **environment variables** you are using in the `dockerfile` with proper values.
* Add a `compose.yml` file to add all local dependencies of your solution.
Optionally, add a `.dockerignore` file to tell docker which files or folders you do not want to copy.
* We will use port **`8000`**. Make sure you are exposing the correct port in your dockerfile.
* **DO NOT** explicitly declare a custom network in your docker compose file.

### Notes about Judging Process:

* If a compose file exists in the zip, Judge engine will run `docker compose up -d --build`.
* It is highly recommended that you add a **compose file** as it reduces chances of making a mistake.
* Otherwise, Judge will build the solution and run a standalone container

`docker build --tag=sol:latest` .
`docker run -dit -p 8000:8000 --rm --name=sol sol:latest`