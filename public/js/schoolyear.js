const API="/api/schoolyear";

loadYears();

async function loadYears(){

    const res = await fetch(API);

    const years = await res.json();

    const select = document.getElementById("yearList");

    select.innerHTML = "";

    let active = "None";

    years.forEach(year=>{

        if(year.active){

            active = year.schoolYear;

        }

        select.innerHTML += `

        <option value="${year._id}">

        ${year.schoolYear}

        ${year.active ? "(Active)" : ""}

        </option>

        `;

    });

    document.getElementById("activeYear").innerText = active;

}

async function addSchoolYear(){

    const schoolYear = document.getElementById("schoolYear").value.trim();

    if(!schoolYear){

        alert("Please enter a school year.");

        return;

    }

    const res = await fetch(API,{

        method:"POST",

        headers:{

            "Content-Type":"application/json"

        },

        body:JSON.stringify({

            schoolYear

        })

    });

    const data = await res.json();

    alert(data.success ? "School Year Added!" : data.message);

    document.getElementById("schoolYear").value = "";

    loadYears();

}

async function setActiveYear() {

    const id = document.getElementById("yearList").value;

    const res = await fetch(API + "/" + id, {
        method: "PUT"
    });

    const data = await res.json();

    if (data.success) {
        alert("School Year Activated.");
    } else {
        alert(data.message);
    }

    loadYears();

}
        
async function promoteStudents(){

    if(!confirm("Promote all students to the next grade?")){

        return;

    }

    const res = await fetch(API + "/promote",{

        method:"POST"

    });

    const data = await res.json();

    alert(data.message);

}