// =========================
// CHALLENGE DATA
// =========================

const challenges = {

    room: {
        title: "Clean my room",
        icon: "🧹",
        target: 7,
        type: "streak",
        description: "Keep your room clean for 7 consecutive days.",
        reward: "Sylvanian Families blind bag 🎁"
    },

    returns: {
        title: "Return 3 items",
        icon: "📦",
        target: 3,
        type: "counter",
        description: "Return three things you've been meaning to send back.",
        reward: "Miffy ear muffs 🐰"
    },

    theory: {
        title: "Theory test practice",
        icon: "🚗",
        target: 10,
        type: "streak",
        description: "Practice your theory test for 10 consecutive days.",
        reward: "New shoes 👟"
    }

};


// =========================
// LOAD SAVED PROGRESS
// =========================

let progress = JSON.parse(
    localStorage.getItem("challengeProgress")
) || {

    room: {
        value: 0,
        lastDate: null
    },

    returns: {
        value: 0,
        lastDate: null
    },

    theory: {
        value: 0,
        lastDate: null
    }

};


// Which challenge are we currently viewing?
let currentChallenge = null;


// =========================
// SAVE PROGRESS
// =========================

function saveProgress() {

    localStorage.setItem(
        "challengeProgress",
        JSON.stringify(progress)
    );

}


// =========================
// OPEN A CHALLENGE
// =========================

function openChallenge(id) {

    currentChallenge = id;

    const challenge = challenges[id];

    document.getElementById("home-screen")
        .classList.add("hidden");

    document.getElementById("challenge-screen")
        .classList.remove("hidden");


    document.getElementById("detail-icon")
        .textContent = challenge.icon;

    document.getElementById("detail-title")
        .textContent = challenge.title;

    document.getElementById("detail-description")
        .textContent = challenge.description;


    updateDetailScreen();

}


// =========================
// GO HOME
// =========================

function goHome() {

    document.getElementById("challenge-screen")
        .classList.add("hidden");

    document.getElementById("home-screen")
        .classList.remove("hidden");

    updateHomeScreen();

}


// =========================
// COMPLETE CHALLENGE
// =========================

function completeCurrentChallenge() {

    const challenge = challenges[currentChallenge];
    const data = progress[currentChallenge];

    const today = new Date().toDateString();


    // Don't allow two completions on the same day
    // for streak-based challenges.

    if (
        challenge.type === "streak" &&
        data.lastDate === today
    ) {

        document.getElementById("detail-status")
            .textContent =
            "You've already completed this today! ♡";

        return;
    }


    // =========================
    // COUNTER CHALLENGE
    // =========================

    if (challenge.type === "counter") {

        if (data.value < challenge.target) {

            data.value++;

        }

    }


    // =========================
    // STREAK CHALLENGE
    // =========================

    if (challenge.type === "streak") {

        if (data.lastDate === null) {

            data.value = 1;

        } else {

            const lastDate =
                new Date(data.lastDate);

            const todayDate =
                new Date(today);

            const difference =
                Math.floor(
                    (todayDate - lastDate) /
                    (1000 * 60 * 60 * 24)
                );


            if (difference > 1) {

                // Streak broken
                data.value = 1;

            } else {

                data.value++;

            }

        }

        data.lastDate = today;

    }


    // Don't go over the target

    if (data.value > challenge.target) {

        data.value = challenge.target;

    }


    saveProgress();

    updateDetailScreen();

    updateHomeScreen();

}


// =========================
// UPDATE DETAIL SCREEN
// =========================

function updateDetailScreen() {

    const challenge =
        challenges[currentChallenge];

    const data =
        progress[currentChallenge];

    const reward =
        document.getElementById("detail-reward");


    document.getElementById("detail-progress")
        .textContent =
        `${data.value} / ${challenge.target}`;


    const percentage =
        (data.value / challenge.target) * 100;


    document.getElementById("detail-bar")
        .style.width =
        percentage + "%";


    const status =
        document.getElementById("detail-status");


    const button =
        document.getElementById("action-button");


    // COMPLETED

    if (data.value >= challenge.target) {

        status.textContent =
            "🎉 Challenge complete! You earned your reward!";

        button.textContent =
            "🎁 Completed!";

        button.disabled = true;

        reward.textContent =
            `🎁 Your reward: ${challenge.reward}`;

        return;

    }


    // REWARD LOCKED

    reward.textContent =
        "🔒 Reward locked — keep going!";


    // STREAK

    if (challenge.type === "streak") {

        const remaining =
            challenge.target - data.value;

        status.textContent =
            `${remaining} more day${remaining === 1 ? "" : "s"} to go. ✨`;

        button.textContent =
            "✓ I did it today";

        button.disabled = false;

    }


    // COUNTER

    if (challenge.type === "counter") {

        const remaining =
            challenge.target - data.value;

        status.textContent =
            `${remaining} more item${remaining === 1 ? "" : "s"} to return.`;

        button.textContent =
            "✓ I returned an item";

        button.disabled = false;

    }

}


// =========================
// UPDATE HOME SCREEN
// =========================

function updateHomeScreen() {

    updateCard(
        "room",
        "room-progress",
        "room-bar"
    );

    updateCard(
        "returns",
        "returns-progress",
        "returns-bar"
    );

    updateCard(
        "theory",
        "theory-progress",
        "theory-bar"
    );

}


function updateCard(
    id,
    progressId,
    barId
) {

    const challenge =
        challenges[id];

    const data =
        progress[id];


    document.getElementById(progressId)
        .textContent =
        `${data.value} / ${challenge.target}`;


    const percentage =
        (data.value / challenge.target) * 100;


    document.getElementById(barId)
        .style.width =
        percentage + "%";

}


// =========================
// START
// =========================

updateHomeScreen();
