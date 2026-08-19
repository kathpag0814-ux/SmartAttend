const API="/api/settings";

window.onload=()=>{

loadSettings();

};

async function loadSettings(){

const res=await fetch(API);

const data=await res.json();

document.getElementById("schoolName").value = data.schoolName || "";

document.getElementById("schoolYear").value = data.schoolYear || "";

// Morning
document.getElementById("morningIn").value = data.morningIn || "07:00";

document.getElementById("morningLate").value = data.morningLate || "07:30";

document.getElementById("morningOut").value = data.morningOut || "12:00";

// Afternoon
document.getElementById("afternoonIn").value = data.afternoonIn || "13:00";

document.getElementById("afternoonLate").value = data.afternoonLate || "13:30";

document.getElementById("afternoonOut").value = data.afternoonOut || "17:00";

}

async function saveSettings() {

    const data = {
        schoolName: document.getElementById("schoolName").value,
        schoolYear: document.getElementById("schoolYear").value,

        morningIn: document.getElementById("morningIn").value,
        morningLate: document.getElementById("morningLate").value,
        morningOut: document.getElementById("morningOut").value,

        afternoonIn: document.getElementById("afternoonIn").value,
        afternoonLate: document.getElementById("afternoonLate").value,
        afternoonOut: document.getElementById("afternoonOut").value
    };

    const response = await fetch("http://localhost:3000/api/settings",{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(data)

    });

    const result = await response.json();

    if(result.success){

        alert("Settings Saved!");

    }else{

        alert("Failed.");

    }

}
// ===================================
// CHANGE PASSWORD
// ===================================

async function changePassword(){

    const currentPassword =
        document.getElementById("currentPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if(!currentPassword || !newPassword || !confirmPassword){

        alert("Please fill in all fields.");

        return;

    }

    if(newPassword !== confirmPassword){

        alert("New passwords do not match.");

        return;

    }

    const token = localStorage.getItem("token");

    try{

        const response = await fetch(
            "http://localhost:3000/api/auth/change-password",
            {

                method:"PUT",

                headers:{

                    "Content-Type":"application/json",

                    "Authorization":"Bearer " + token

                },

                body:JSON.stringify({

                    currentPassword,

                    newPassword

                })

            }
        );

        const data = await response.json();

        if(data.success){

            alert("Password updated successfully.");

            document.getElementById("currentPassword").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("confirmPassword").value = "";

        }else{

            alert(data.message);

        }

    }

    catch(err){

        console.log(err);

        alert("Unable to connect to the server.");

    }

}