// ======================================
// SMART STUDENT APP
// FIREBASE AUTHENTICATION + DASHBOARD
// ======================================

import {
    auth,
    db
} from "./firebaseConfig.js";


import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


import {
    ref,
    set,
    get
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";



// ======================================
// PAGE CHECK
// ======================================

const isLoginPage =
    document.getElementById("loginForm") !== null;


const isDashboardPage =
    document.getElementById("dashboardSection") !== null;



// ======================================
// LOGIN / SIGNUP ELEMENTS
// ======================================

const loginForm =
    document.getElementById("loginForm");


const signupForm =
    document.getElementById("signupForm");


const loginCard =
    document.getElementById("loginCard");


const signupCard =
    document.querySelector(".signup-card");



// ======================================
// SHOW SIGNUP FORM
// ======================================

function showSignupForm() {

    if (!loginCard || !signupCard) {
        return;
    }

    loginCard.classList.add("hidden");

    signupCard.classList.remove("hidden");
}



// ======================================
// SHOW LOGIN FORM
// ======================================

function showLoginForm() {

    if (!loginCard || !signupCard) {
        return;
    }

    signupCard.classList.add("hidden");

    loginCard.classList.remove("hidden");
}



// ======================================
// LOGIN / SIGNUP SWITCHING
// ======================================

const showSignup =
    document.getElementById("showSignup");


const showSignupBottom =
    document.getElementById("showSignupBottom");


const showLogin =
    document.getElementById("showLogin");


const showLoginTab =
    document.getElementById("showLoginTab");



if (showSignup) {

    showSignup.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showSignupForm();

        }
    );

}



if (showSignupBottom) {

    showSignupBottom.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showSignupForm();

        }
    );

}



if (showLogin) {

    showLogin.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showLoginForm();

        }
    );

}



if (showLoginTab) {

    showLoginTab.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            showLoginForm();

        }
    );

}



// ======================================
// PASSWORD TOGGLE
// ======================================

function togglePassword(
    inputId,
    button
) {

    const input =
        document.getElementById(inputId);


    if (!input) {
        return;
    }


    if (input.type === "password") {

        input.type = "text";

        button.textContent = "🙈";

    } else {

        input.type = "password";

        button.textContent = "👁";

    }

}



// ======================================
// LOGIN PASSWORD TOGGLE
// ======================================

const loginPasswordToggle =
    document.getElementById(
        "loginPasswordToggle"
    );


if (loginPasswordToggle) {

    loginPasswordToggle.addEventListener(
        "click",
        function () {

            togglePassword(
                "loginPassword",
                loginPasswordToggle
            );

        }
    );

}



// ======================================
// SIGNUP PASSWORD TOGGLE
// ======================================

const signupPasswordToggle =
    document.getElementById(
        "signupPasswordToggle"
    );


if (signupPasswordToggle) {

    signupPasswordToggle.addEventListener(
        "click",
        function () {

            togglePassword(
                "signupPassword",
                signupPasswordToggle
            );

        }
    );

}



// ======================================
// SIGN UP
// ======================================

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "signupName"
                ).value.trim();


            const email =
                document.getElementById(
                    "signupEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "signupPassword"
                ).value;


            const course =
                document.getElementById(
                    "course"
                ).value;


            const year =
                document.getElementById(
                    "year"
                ).value;


            const signupButton =
                document.getElementById(
                    "signupButton"
                );


            if (
                !name ||
                !email ||
                !password
            ) {

                alert(
                    "Please fill in all required fields."
                );

                return;
            }


            if (password.length < 6) {

                alert(
                    "Password must contain at least 6 characters."
                );

                return;
            }


            try {

                signupButton.disabled = true;

                signupButton.innerHTML =
                    "Creating Account...";


                // ==================================
                // CREATE FIREBASE ACCOUNT
                // ==================================

                const userCredential =
                    await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                // ==================================
                // SAVE USER INFORMATION
                // ==================================

                await set(
                    ref(
                        db,
                        "users/" + user.uid
                    ),
                    {

                        name: name,

                        email: email,

                        course: course,

                        year: year,

                        createdAt:
                            new Date().toISOString()

                    }
                );


                // ==================================
                // LOCAL STORAGE
                // ==================================

                localStorage.setItem(
                    "studentName",
                    name
                );


                localStorage.setItem(
                    "studentEmail",
                    email
                );


                localStorage.setItem(
                    "studentCourse",
                    course
                );


                localStorage.setItem(
                    "studentYear",
                    year
                );


                alert(
                    "Account created successfully! 🎉"
                );


                signupForm.reset();

                showLoginForm();


                const loginEmail =
                    document.getElementById(
                        "loginEmail"
                    );


                if (loginEmail) {

                    loginEmail.value =
                        email;

                }


            } catch (error) {

                console.error(
                    "Signup Error:",
                    error
                );


                let message =
                    "Unable to create account.";


                if (
                    error.code ===
                    "auth/email-already-in-use"
                ) {

                    message =
                        "This email is already registered.";

                }


                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Please enter a valid email address.";

                }


                else if (
                    error.code ===
                    "auth/weak-password"
                ) {

                    message =
                        "Password must contain at least 6 characters.";

                }


                else if (
                    error.code ===
                    "auth/network-request-failed"
                ) {

                    message =
                        "Network error. Please check your internet connection.";

                }


                alert(message);


            } finally {

                signupButton.disabled = false;

                signupButton.innerHTML =
                    'Create Account <span>→</span>';

            }

        }
    );

}



// ======================================
// LOGIN
// ======================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            const loginButton =
                document.getElementById(
                    "loginButton"
                );


            if (!email || !password) {

                alert(
                    "Please enter email and password."
                );

                return;
            }


            try {

                loginButton.disabled = true;

                loginButton.innerHTML =
                    "Logging in...";


                // ==================================
                // FIREBASE LOGIN
                // ==================================

                const userCredential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const user =
                    userCredential.user;


                // ==================================
                // GET USER DATA
                // ==================================

                const userRef =
                    ref(
                        db,
                        "users/" + user.uid
                    );


                const snapshot =
                    await get(userRef);


                if (snapshot.exists()) {

                    const userData =
                        snapshot.val();


                    localStorage.setItem(
                        "studentName",
                        userData.name || "Student"
                    );


                    localStorage.setItem(
                        "studentEmail",
                        userData.email || email
                    );


                    localStorage.setItem(
                        "studentCourse",
                        userData.course ||
                        "AI & Data Science"
                    );


                    localStorage.setItem(
                        "studentYear",
                        userData.year ||
                        ""
                    );

                }


                // ==================================
                // GO TO DASHBOARD
                // ==================================

                window.location.href =
                    "dashboard.html";


            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                let message =
                    "Unable to login.";


                if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    message =
                        "Invalid email or password.";

                }


                else if (
                    error.code ===
                    "auth/user-not-found"
                ) {

                    message =
                        "No account found with this email.";

                }


                else if (
                    error.code ===
                    "auth/wrong-password"
                ) {

                    message =
                        "Incorrect password.";

                }


                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    message =
                        "Please enter a valid email address.";

                }


                else if (
                    error.code ===
                    "auth/network-request-failed"
                ) {

                    message =
                        "Network error. Please check your internet connection.";

                }


                alert(message);


            } finally {

                loginButton.disabled = false;

                loginButton.innerHTML =
                    'Login <span>→</span>';

            }

        }
    );

}



// ======================================
// FORGOT PASSWORD
// ======================================

const forgotPassword =
    document.getElementById(
        "forgotPassword"
    );


if (forgotPassword) {

    forgotPassword.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();


            const emailInput =
                document.getElementById(
                    "loginEmail"
                );


            const email =
                emailInput.value.trim();


            if (!email) {

                alert(
                    "Please enter your email address first."
                );

                emailInput.focus();

                return;

            }


            try {

                await sendPasswordResetEmail(
                    auth,
                    email
                );


                alert(
                    "Password reset email sent! 📧"
                );


            } catch (error) {

                console.error(
                    "Password Reset Error:",
                    error
                );


                alert(
                    "Unable to send password reset email."
                );

            }

        }
    );

}



// ==================================================
// DASHBOARD USER INFORMATION
// ==================================================

async function loadDashboardUser() {

    const studentName =
        document.getElementById(
            "studentName"
        );


    const profileName =
        document.getElementById(
            "profileName"
        );


    const profileAvatar =
        document.getElementById(
            "profileAvatar"
        );


    const profileFullName =
        document.getElementById(
            "profileFullName"
        );


    const profileEmail =
        document.getElementById(
            "profileEmail"
        );


    const profileInfoName =
        document.getElementById(
            "profileInfoName"
        );


    const profileInfoEmail =
        document.getElementById(
            "profileInfoEmail"
        );


    const profileCourse =
        document.getElementById(
            "profileCourse"
        );


    const profileInfoCourse =
        document.getElementById(
            "profileInfoCourse"
        );


    const profileInfoYear =
        document.getElementById(
            "profileInfoYear"
        );


    const largeProfileAvatar =
        document.getElementById(
            "largeProfileAvatar"
        );



    // ==========================================
    // GET CURRENT FIREBASE USER
    // ==========================================

    onAuthStateChanged(
        auth,
        async function (user) {

            if (!user) {

                // No user logged in.
                // Send them back to login.

                window.location.href =
                    "index.html";

                return;
            }



            try {

                // ==================================
                // GET USER DATA FROM DATABASE
                // ==================================

                const userRef =
                    ref(
                        db,
                        "users/" + user.uid
                    );


                const snapshot =
                    await get(userRef);


                let name =
                    "Student";


                let email =
                    user.email || "student@example.com";


                let course =
                    "AI & Data Science";


                let year =
                    "Final Year";



                if (snapshot.exists()) {

                    const data =
                        snapshot.val();


                    name =
                        data.name ||
                        "Student";


                    email =
                        data.email ||
                        user.email ||
                        "student@example.com";


                    course =
                        data.course ||
                        "AI & Data Science";


                    year =
                        data.year ||
                        "Final Year";

                }



                // ==================================
                // SAVE UPDATED DATA LOCALLY
                // ==================================

                localStorage.setItem(
                    "studentName",
                    name
                );


                localStorage.setItem(
                    "studentEmail",
                    email
                );


                localStorage.setItem(
                    "studentCourse",
                    course
                );


                localStorage.setItem(
                    "studentYear",
                    year
                );



                // ==================================
                // FIRST LETTER
                // ==================================

                const firstLetter =
                    name
                        .trim()
                        .charAt(0)
                        .toUpperCase();



                // ==================================
                // UPDATE DASHBOARD HEADER
                // ==================================

                if (studentName) {

                    studentName.textContent =
                        name;

                }


                if (profileName) {

                    profileName.textContent =
                        name;

                }


                if (profileAvatar) {

                    profileAvatar.textContent =
                        firstLetter;

                }


                if (profileCourse) {

                    profileCourse.textContent =
                        course;

                }



                // ==================================
                // UPDATE PROFILE PAGE
                // ==================================

                if (profileFullName) {

                    profileFullName.textContent =
                        name;

                }


                if (profileEmail) {

                    profileEmail.textContent =
                        email;

                }


                if (profileInfoName) {

                    profileInfoName.textContent =
                        name;

                }


                if (profileInfoEmail) {

                    profileInfoEmail.textContent =
                        email;

                }


                if (profileInfoCourse) {

                    profileInfoCourse.textContent =
                        course;

                }


                if (profileInfoYear) {

                    profileInfoYear.textContent =
                        year;

                }


                if (largeProfileAvatar) {

                    largeProfileAvatar.textContent =
                        firstLetter;

                }



                console.log(
                    "Dashboard user loaded:",
                    {
                        name,
                        email,
                        course,
                        year
                    }
                );


            } catch (error) {

                console.error(
                    "Error loading user data:",
                    error
                );


                // Fallback to localStorage

                const savedName =
                    localStorage.getItem(
                        "studentName"
                    ) || "Student";


                const savedEmail =
                    localStorage.getItem(
                        "studentEmail"
                    ) ||
                    user.email ||
                    "student@example.com";


                const savedCourse =
                    localStorage.getItem(
                        "studentCourse"
                    ) ||
                    "AI & Data Science";


                const savedYear =
                    localStorage.getItem(
                        "studentYear"
                    ) ||
                    "Final Year";


                const firstLetter =
                    savedName
                        .trim()
                        .charAt(0)
                        .toUpperCase();


                if (studentName) {

                    studentName.textContent =
                        savedName;

                }


                if (profileName) {

                    profileName.textContent =
                        savedName;

                }


                if (profileAvatar) {

                    profileAvatar.textContent =
                        firstLetter;

                }


                if (profileCourse) {

                    profileCourse.textContent =
                        savedCourse;

                }


                if (profileFullName) {

                    profileFullName.textContent =
                        savedName;

                }


                if (profileEmail) {

                    profileEmail.textContent =
                        savedEmail;

                }


                if (profileInfoName) {

                    profileInfoName.textContent =
                        savedName;

                }


                if (profileInfoEmail) {

                    profileInfoEmail.textContent =
                        savedEmail;

                }


                if (profileInfoCourse) {

                    profileInfoCourse.textContent =
                        savedCourse;

                }


                if (profileInfoYear) {

                    profileInfoYear.textContent =
                        savedYear;

                }


                if (largeProfileAvatar) {

                    largeProfileAvatar.textContent =
                        firstLetter;

                }

            }

        }
    );

}



// ======================================
// LOGOUT
// ======================================

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function (event) {

            event.preventDefault();


            try {

                await signOut(auth);


                localStorage.removeItem(
                    "studentName"
                );


                localStorage.removeItem(
                    "studentEmail"
                );


                localStorage.removeItem(
                    "studentCourse"
                );


                localStorage.removeItem(
                    "studentYear"
                );


                window.location.href =
                    "index.html";


            } catch (error) {

                console.error(
                    "Logout Error:",
                    error
                );


                alert(
                    "Unable to logout. Please try again."
                );

            }

        }
    );

}



// ======================================
// START DASHBOARD
// ======================================

if (isDashboardPage) {

    loadDashboardUser();

}



// ======================================
// CURRENT PAGE INFORMATION
// ======================================

console.log(
    "Smart Student App loaded successfully."
);