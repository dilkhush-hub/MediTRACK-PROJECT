
const patients = [];
let tokenCounter = 1;
let myToken = null;

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
        "Estimated wait: " + index * 10 + " minutes";

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
    myToken = patient.token;

    tokenNumber.textContent = patient.token;
    tokenDetails.textContent =
        "Patient: " + patient.name +
        " | Department: " + patient.department +
        " | Doctor: " + patient.doctor;

    queueStatus.textContent = "● Queue is Live";
    cancelButton.disabled = false;

    queueForm.reset();
    renderQueue();
});

// Cancel queue
cancelButton.addEventListener("click", function() {
    const patient = patients.find(
        item => item.token === myToken &&
                item.status === "Waiting"
    );

    if (!patient) return;

    patient.status = "Cancelled";
    queueStatus.textContent = "Queue booking cancelled.";
    cancelButton.disabled = true;

    renderQueue();
});

// Next patient

nextButton.addEventListener("click", function() {
    const patient = patients.find(
        item => item.status === "Waiting"
    );

    if (!patient) return;

    // Current patient ko complete karo
    patient.status = "Completed";

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
