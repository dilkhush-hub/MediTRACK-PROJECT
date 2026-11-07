const patients = JSON.parse(
    localStorage.getItem("meditrackPatients")
) || [];

let tokenCounter = Number(
    localStorage.getItem("meditrackTokenCounter")
) || 1;

let myToken = localStorage.getItem("meditrackMyToken") || null;

const myPeopleAhead = document.getElementById("myPeopleAhead");
const myWaitingTime = document.getElementById("myWaitingTime");
const queueForm = document.getElementById("queueForm");
const queueList = document.getElementById("queueList");
const waitingCount = document.getElementById("waitingCount");
const nextToken = document.getElementById("nextToken");
const waitingTime = document.getElementById("waitingTime");
const tokenNumber = document.getElementById("tokenNumber");
const tokenDetails = document.getElementById("tokenDetails");
const queueStatus = document.getElementById("queueStatus");
const cancelButton = document.getElementById("cancelButton");
const nextButton = document.getElementById("nextButton");
function saveQueueData() {
    localStorage.setItem(
        "meditrackPatients",
        JSON.stringify(patients)
    );

    localStorage.setItem(
        "meditrackTokenCounter",
        tokenCounter
    );

    localStorage.setItem(
        "meditrackMyToken",
        myToken || ""
    );
}

// Update queue dashboard
function renderQueue() {
    queueList.replaceChildren();

    const waiting = patients.filter(
        patient => patient.status === "Waiting"
    );

    waitingCount.textContent = waiting.length;
    nextToken.textContent = waiting.length
        ? waiting[0].token : "---";

    waitingTime.textContent = waiting.length * 10 + " min";
    nextButton.disabled = waiting.length === 0;
    const myPatient = patients.find(
    patient => patient.token === myToken
);

if (myPatient) {
    const myPosition = waiting.findIndex(
        patient => patient.token === myToken
    );

    const peopleAhead = myPosition >= 0 ? myPosition : 0;
    const estimatedWait = peopleAhead === 0 ? 1 : peopleAhead * 10;

    document.getElementById("myPeopleAhead").textContent = peopleAhead;
    document.getElementById("myWaitingTime").textContent = estimatedWait + " min";
}
    
    
    if (waiting.length === 0) {
        const message = document.createElement("p");
        message.className = "empty";
        message.textContent = "No patients in queue.";
        queueList.appendChild(message);
        return;
    }

    waiting.forEach((patient, index) => {
    const item = document.createElement("div");
    item.className = "queue-item";

    // Patient name and token
    const title = document.createElement("strong");
    title.textContent = patient.token + " - " + patient.name;

    // Department and doctor
    const details = document.createElement("p");
    details.className = "queue-patient-details";
    details.textContent =
        (patient.department || "N/A") + " | " +
        (patient.doctor || "N/A");

    // Age, gender and weight
    const healthDetails = document.createElement("p");
    healthDetails.className = "queue-health-details";
    healthDetails.textContent =
        "Age: " + (patient.age || "N/A") +
        " | Gender: " + (patient.gender || "N/A") +
        " | Weight: " +
        (patient.weight ? patient.weight + " kg" : "N/A");

    // Patient address
    const address = document.createElement("p");
    address.className = "queue-address";
    address.textContent =
        "Address: " + (patient.address || "N/A");

    // Estimated waiting time
    const wait = document.createElement("p");
    wait.className = "queue-wait";
    wait.textContent =
    "Estimated wait: " +
(index === 0 ? 5 : index * 10) + " minutes";

    item.append(title, details, healthDetails, address, wait);
    queueList.appendChild(item);
});
}
// Join queue
queueForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("patientName")
        .value.trim();

    if (!name) return;

    
const patient = {
    name,
    token: "A-" + String(tokenCounter).padStart(3, "0"),

    // Patient ki extra details
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    weight: document.getElementById("weight").value,
    address: document.getElementById("address").value.trim(),

    // Appointment details
    department: document.getElementById("department").value,
    doctor: document.getElementById("doctor").value,
    status: "Waiting"
};


    tokenCounter++;
    patients.push(patient);
    updateAppointmentSlip(patient);
    myToken = patient.token;
    saveQueueData();

    tokenNumber.textContent = patient.token;
    tokenDetails.textContent =
        "Patient: " + patient.name +
        " | Department: " + patient.department +
        " | Doctor: " + patient.doctor;

    queueStatus.textContent = "● Queue is Live";
    cancelButton.disabled = false;

    queueForm.reset();
   
    // DOCTOR DIRECTORY


 // Doctor Directory complete

    renderQueue();
});
const doctors = [
    {
        name: "Dr. Sarthak",
        department: "General Medicine",
        time: "09:00 AM - 02:00 PM"
    },
    {
        name: "Dr. Sharma",
        department: "Cardiology",
        time: "10:00 AM - 04:00 PM"
    },
    {
        name: "Dr. Patel",
        department: "Dental",
        time: "09:00 AM - 01:00 PM"
    },
    {
        name: "Dr. Mehta",
        department: "Orthopedics",
        time: "11:00 AM - 05:00 PM"
    },
    {
        name: "Dr. Suman",
        department: "Pediatrics",
        time: "09:00 AM - 03:00 PM"
    },
    {
        name: "Dr. Suresh",
        department: "Dermatology",
        time: "10:00 AM - 02:00 PM"
    },
    {
        name: "Dr. Pawan",
        department: "General Medicine",
        time: "02:00 PM - 07:00 PM"
    },
    {
        name: "Dr. Mohan",
        department: "Cardiology",
        time: "03:00 PM - 08:00 PM"
    }
];

const doctorList = document.getElementById("doctorList");

doctors.forEach(function(doctor) {

    const card = document.createElement("div");
    card.className = "doctor-card";

    card.innerHTML = `
        <div class="doctor-avatar">👨‍⚕️</div>
        <h3>${doctor.name}</h3>
        <p><strong>Department:</strong> ${doctor.department}</p>
        <p><strong>Available:</strong> ${doctor.time}</p>
        <span class="doctor-available">● Available</span>
    `;

    doctorList.appendChild(card);
});

// Cancel queue
cancelButton.addEventListener("click", function() {
    const patient = patients.find(
        item => item.token === myToken &&
                item.status === "Waiting"
    );

    if (!patient) return;

    patient.status = "Cancelled";
    saveQueueData();
    queueStatus.textContent = "Queue booking cancelled.";
    cancelButton.disabled = true;

    renderQueue();
});

// APPOINTMENT SLIP

const printSlip = document.getElementById("printSlip");

printSlip.addEventListener("click", function() {
    window.print();
});

// Update appointment slip after booking
function updateAppointmentSlip(patient) {
    document.getElementById("slipToken").textContent =
        patient.token;

    document.getElementById("slipPatient").textContent =
        patient.name;

    document.getElementById("slipAge").textContent =
        patient.age;

    document.getElementById("slipGender").textContent =
        patient.gender;

    document.getElementById("slipWeight").textContent =
        patient.weight + " kg";

    document.getElementById("slipDepartment").textContent =
        patient.department;

    document.getElementById("slipDoctor").textContent =
        patient.doctor;
}


// Next patient

nextButton.addEventListener("click", function() {
    const patient = patients.find(
        item => item.status === "Waiting"
    );

    if (!patient) return;

    // Current patient ko complete karo
    patient.status = "Completed";
    saveQueueData();

    if (patient.token === myToken) {
        queueStatus.textContent = "Your turn is completed.";
        cancelButton.disabled = true;
    }

    // Queue ko dobara render karo
    renderQueue();
});


// Medicine tracker
const medicineForm = document.getElementById("medicineForm");
const medicineList = document.getElementById("medicineList");

medicineForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("medicineName")
        .value.trim();
    const dosage = document.getElementById("dosage")
        .value.trim();
    const timing = document.getElementById("timing").value;
    const duration = document.getElementById("duration")
        .value.trim();

    if (!name || !dosage || !duration) return;

    const item = document.createElement("div");
    item.className = "medicine-item";

    const title = document.createElement("strong");
    title.textContent = name;

    const details = document.createElement("p");
    details.textContent =
        dosage + " | " + timing + " | " + duration;

    item.append(title, details);
    medicineList.appendChild(item);

    medicineForm.reset();
});

// QR code for the website address
const qrCode = document.getElementById("qrCode");
const qrMessage = document.getElementById("qrMessage");

if (location.protocol === "http:" ||
    location.protocol === "https:") {

    qrCode.src =
        "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=" +
        encodeURIComponent(location.href);

    qrCode.onload = function() {
        qrMessage.textContent = "Scan to open this website.";
    };

    qrCode.onerror = function() {
        qrMessage.textContent =
            "QR code could not load. Check your internet.";
    };

} else {
    qrCode.hidden = true;
    qrMessage.textContent =
        "Open using Live Server to generate the QR code.";
}

renderQueue();
