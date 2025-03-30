console.log("fail ühendatud");

class Entry { // Lisandus priority ja formaddate
    constructor(title, description, date, priority) {
        this.title = title;
        this.description = description;
        this.date = Entry.formatDate(date);
        this.done = false;
        this.priority = priority || "Keskmine"; //Vaikimisi määrame keskmise priority
    }

    static formatDate(date) { //Aja formaadi muutmine DD.MM.YY formaati. Mõlema puhul (ka parseDate) https://stackoverflow.com/questions/67372332/how-to-use-local-storage-in-js-to-do-list, freecodecamp ja GPT-ga modimine. 
        if (!date.includes("-")) return date;
        const [year, month, day] = date.split("-");
        return `${day}.${month}.${year}`;
    }

    static parseDate(date) { // Järjekorra vahetus. Mõlema puhul 
        if (!date || !date.includes(".")) return new Date(date);
        const [day, month, year] = date.split(".");
        return new Date(`${year}-${month}-${day}`);
    }

}

class Todo {
    constructor(){
        this.entries = JSON.parse(localStorage.getItem("entries")) || [];
        this.entries.forEach(entry => entry.date = Entry.formatDate(entry.date));
        this.sortEntries();
        this.render();
        document.querySelector("#addButton").addEventListener("click", () => {this.addEntry()});
    }

    addEntry() { // Uue ülesande lisamine: Lisasin priorityValue
        console.log("vajutasin nuppu");
        const titleValue = document.querySelector("#title").value;
        const descriptionValue = document.querySelector("#description").value;
        const dateValue = document.querySelector("#date").value;
        const priorityValue = document.querySelector("#priority").value;

        this.entries.push(new Entry(titleValue, descriptionValue, dateValue, priorityValue));
        this.save();
    }


    //ideid siit: https://www.youtube.com/watch?v=SeKQSQDUMDQ&ab_channel=WebDevTutorials, siis stack overflow, freecodecamp ja gpt-ga modimine.
    editEntry(index) {
        const entry = this.entries[index];
        const newTitle = prompt("Muuda pealkiri:", entry.title);
        const newDescription = prompt("Muuda kirjeldus:", entry.description);
        const newDate = prompt("Muuda kuupäev (DD.MM.YYYY):", entry.date);
        const newPriority = prompt("Muuda prioriteet (Kõrge, Keskmine, Madal):", entry.priority);

        if (newTitle !== null) entry.title = newTitle;
        if (newDescription !== null) entry.description = newDescription;
        if (newDate !== null && /^\d{2}\.\d{2}\.\d{4}$/.test(newDate)) entry.date = newDate;
        if (["Kõrge", "Keskmine", "Madal"].includes(newPriority)) entry.priority = newPriority;

        this.save();
    }

    sortEntries() {
        this.entries.sort((a, b) => Entry.parseDate(a.date) - Entry.parseDate(b.date));
    }

    render() {
        this.sortEntries();
        let tasklist = document.querySelector("#taskList");
        tasklist.innerHTML = "";
    
        const ul = document.createElement("ul");
        const doneUl = document.createElement("ul");
        ul.className = "todo-list";
        doneUl.className = "todo-list";
        const taskHeading = document.createElement("h2");
        const doneHeading = document.createElement("h2");
        taskHeading.innerText = "Todo";
        doneHeading.innerText = "Done tasks";


        this.entries.forEach((entryValue, entryIndex) => {
            const li = document.createElement("li");
            const div = document.createElement("div");
            const buttonDiv = document.createElement("div");
            buttonDiv.className = "button-container";
            const deleteButton = document.createElement("button");
            const doneButton = document.createElement("button");
            const editButton = document.createElement("button");

            doneButton.innerText = "✔";
            deleteButton.innerText = "X";
            editButton.innerText = "✎";

            deleteButton.className = "delete";
            doneButton.className = "done";
            editButton.className = "edit";

            deleteButton.addEventListener("click", () => {
                this.entries.splice(entryIndex, 1);
                this.save();   
            });

            doneButton.addEventListener("click", () => {
                this.entries[entryIndex].done = !this.entries[entryIndex].done;
                this.save();
            });

            //selle lisasin juurde
            editButton.addEventListener("click", () => {
                this.editEntry(entryIndex);
            });



            div.className = "task";

            //siin muudatus välimusega + priority.
            div.innerHTML = `<div>➥ ${entryValue.title}</div><div>${entryValue.description}</div><div>${entryValue.date}</div><div>${entryValue.priority}</div>`;
            
            if(this.entries[entryIndex].done){
                doneButton.classList.add("done-task");
                doneUl.appendChild(li);
            } else{
                ul.appendChild(li);
            }


            li.appendChild(div);
            li.appendChild(buttonDiv);
            buttonDiv.appendChild(deleteButton);
            buttonDiv.appendChild(doneButton);
            buttonDiv.appendChild(editButton);
        });

        tasklist.appendChild(taskHeading)
        tasklist.appendChild(ul);
        tasklist.appendChild(doneHeading);
        tasklist.appendChild(doneUl);
        
    }

    save() {
        this.sortEntries();
        localStorage.setItem("entries", JSON.stringify(this.entries));
        this.render();
    }
}

const todo = new Todo();