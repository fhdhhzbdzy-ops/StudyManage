// ==================== POMODORO ====================

let timer = null;
let timeLeft = 25 * 60;
let isRunning = false;


function updateDisplay() {

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const display = document.getElementById("timer");

    if (display) {

        display.textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(seconds).padStart(2, "0");

    }
}


function setTime() {

    const input = document.getElementById("minutesInput");

    if (!input) return;

    const minutes = Number(input.value);

    if (minutes <= 0 || isNaN(minutes)) {

        alert("Vui lòng nhập số phút hợp lệ!");

        return;
    }

    clearInterval(timer);

    timeLeft = minutes * 60;

    isRunning = false;

    updateDisplay();
}


function playSound() {

    const audioContext = new (
        window.AudioContext ||
        window.webkitAudioContext
    )();

    const oscillator = audioContext.createOscillator();

    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);

    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 880;

    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(
        0.3,
        audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 1
    );

    oscillator.start();

    oscillator.stop(
        audioContext.currentTime + 1
    );
}


function startTimer() {

    if (isRunning) return;

    isRunning = true;

    timer = setInterval(function () {

        if (timeLeft > 0) {

            timeLeft--;

            updateDisplay();

        } else {

            clearInterval(timer);

            isRunning = false;

            playSound();

            alert(
                "🎉 Pomodoro đã kết thúc! Hãy nghỉ ngơi một chút."
            );
        }

    }, 1000);
}


function pauseTimer() {

    clearInterval(timer);

    isRunning = false;
}


function resetTimer() {

    clearInterval(timer);

    isRunning = false;

    timeLeft = 25 * 60;

    updateDisplay();
}



// ==================== NHẮC NHỞ ====================

let reminders = [];


function addReminder() {

    const textInput =
        document.getElementById("reminderText");

    const timeInput =
        document.getElementById("reminderTime");


    if (!textInput || !timeInput) {

        return;
    }


    const text = textInput.value.trim();

    const time = timeInput.value;


    if (text === "") {

        alert("Vui lòng nhập nội dung nhắc nhở!");

        return;
    }


    if (time === "") {

        alert("Vui lòng chọn thời gian nhắc nhở!");

        return;
    }


    reminders.push({

        text: text,

        time: time

    });


    textInput.value = "";

    timeInput.value = "";


    showReminders();

}


function showReminders() {

    const list =
    document.getElementById("reminderList");


    if (!list) return;


    list.innerHTML = "";


    if (reminders.length === 0) {

        list.innerHTML =
            "<li>Chưa có nhắc nhở.</li>";

        return;
    }


    reminders.forEach(function (reminder, index) {

        const item =
            document.createElement("li");


        const date =
            new Date(reminder.time);


        item.innerHTML =
            "🔔 " +
            reminder.text +
            " — " +
            date.toLocaleString("vi-VN") +
            ' <button onclick="deleteReminder(' +
            index +
            ')">Xóa</button>';


        list.appendChild(item);

    });

}


function deleteReminder(index) {

    reminders.splice(index, 1);

    showReminders();

}



// ==================== THỐNG KÊ ====================

function updateStatistics() {

    const tasks =
        document.querySelectorAll(".task-item");


    const total = tasks.length;


    let completed = 0;


    tasks.forEach(function (task) {

        if (
            task.classList.contains("completed") ||
            task.dataset.completed === "true"
        ) {

            completed++;

        }

    });


    const remaining =
        total - completed;


    const totalElement =
        document.getElementById("totalTasks");


    const completedElement =
        document.getElementById("completedTasks");


    const remainingElement =
        document.getElementById("remainingTasks");


    if (totalElement) {

        totalElement.textContent = total;

    }


    if (completedElement) {

        completedElement.textContent = completed;

    }


    if (remainingElement) {

        remainingElement.textContent = remaining;

    }

}



// ==================== KHỞI ĐỘNG ====================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateDisplay();

        updateStatistics();


        const reminderForm =
            document.getElementById("reminderForm");


        if (reminderForm) {

            reminderForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    addReminder();

                }
            );

        }

    }
);
