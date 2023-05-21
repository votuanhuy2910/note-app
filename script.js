// start: animation hover btn popup
let btn = document.querySelector("form a");
btn.addEventListener("mousemove", (e) => {
	let rect = e.target.getBoundingClientRect();
	let x = e.clientX - rect.left;
	btn.style.setProperty("--x", x + "deg");
});
// end: animation hover btn popup

// start: progress function
const addBox = document.querySelector(".add-box"),
	popupBox = document.querySelector(".popup-box"),
	popupTitle = popupBox.querySelector("header p"),
	closeIcon = popupBox.querySelector("header i"),
	titleTag = popupBox.querySelector("input"),
	descTag = popupBox.querySelector("textarea"),
	addBtn = popupBox.querySelector("form a span");

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false,
	updateID;

addBox.addEventListener("click", () => {
	popupTitle.innerText = "Add a new Note";
	addBtn.innerText = "Add note";
	popupBox.classList.add("show");
	document.querySelector("body").style.overflow = "hidden";
	if (window.innerWidth > 660) titleTag.focus();
});

closeIcon.addEventListener("click", () => {
	isUpdate = false;
	titleTag.value = descTag.value = "";
	popupBox.classList.remove("show");
	document.querySelector("body").style.overflow = "auto";
});

document.addEventListener("keydown", (e) => {
	if (e.keyCode == 27) {
		isUpdate = false;
		popupBox.classList.remove("show");
		document.querySelector("body").style.overflow = "auto";
	}
});

function showNotes() {
	if (!notes) return;
	document.querySelectorAll(".note").forEach((li) => li.remove());
	notes.forEach((note, id) => {
		let filterDesc = note.description.replaceAll("\n", "<br/>- ");
		let liTag = `
            <li class="note">
                <div class="details">
					<p>${note.title}</p>
					<span>- ${filterDesc}</span>
                </div>

                <div class="bottom-info">
                    <span>${note.date} </br> 
                        <span>${note.time}</span>
                    </span>
                    
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="menu">
                            <li onclick="updateNote(${id}, '${note.title}', '${filterDesc}')"><i class="uil uil-pen"></i>edit</li>
                            <li onclick="deleteNote(${id})"><i class="uil uil-trash"></i>delete</li>
                        </ul>
                    </div>
                </div>
            </li>
        `;
		addBox.insertAdjacentHTML("afterend", liTag);
	});
}
showNotes();

function showMenu(elem) {
	elem.parentElement.classList.add("show");
	document.addEventListener("click", (e) => {
		if (e.target.tagName != "I" || e.target != elem) {
			elem.parentElement.classList.remove("show");
		}
	});
}

function deleteNote(noteID) {
	let confirmDel = confirm("Are you sure you want to delete this note?");
	if (!confirmDel) return;
	notes.splice(noteID, 1);
	localStorage.setItem("notes", JSON.stringify(notes));
	showNotes();
}

function updateNote(noteID, title, filterDesc) {
	let description = filterDesc.replaceAll("<br/>- ", "\r\n");
	updateID = noteID;
	isUpdate = true;
	addBox.click();
	titleTag.value = title;
	descTag.value = description;
	popupTitle.innerText = "Update a Note";
	addBtn.innerText = "Update Note";
}

addBtn.addEventListener("click", (e) => {
	e.preventDefault();
	let title = titleTag.value.trim(),
		description = descTag.value.trim();

	if (title || description) {
		let currentDateENG = new Date(),
			monthENG = months[currentDateENG.getMonth()],
			dayENG = currentDateENG.getDate(),
			yearENG = currentDateENG.getFullYear();

		let currentDateVN = new Date(),
			monthVN = currentDateVN.getMonth(),
			dayVN = currentDateVN.getDate(),
			yearVN = currentDateVN.getFullYear();

		monthVN = monthVN < 10 ? "0" + monthVN : monthVN;
		dayVN = dayVN < 10 ? "0" + dayVN : dayVN;
		yearVN = yearVN < 10 ? "0" + yearVN : yearVN;

		let currentTime = new Date(),
			hour = currentTime.getHours(),
			min = currentTime.getMinutes(),
			sec = currentTime.getSeconds();

		hour = hour < 10 ? "0" + hour : hour;
		min = min < 10 ? "0" + min : min;
		sec = sec < 10 ? "0" + sec : sec;

		// let convert_am_pm;
		// convert_am_pm = hour > 12 ? "AM" : "PM";
		// (hour = hour > 12 ? hour - 12 : hour), hour == 0 ? (hour = 12) : hour;

		let noteInfo = {
			title,
			description,
			date: `${monthENG} ${dayENG}, ${yearENG}`,
			time: `${hour}h ${min}m ${sec}s`,
		};
		if (!isUpdate) {
			notes.push(noteInfo);
		} else {
			isUpdate = false;
			notes[updateID] = noteInfo;
		}

		localStorage.setItem("notes", JSON.stringify(notes));
		showNotes();
		closeIcon.click();
	}
});
// end: progress function
