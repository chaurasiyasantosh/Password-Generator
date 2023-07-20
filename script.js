const inputSlider = document.querySelector("[data-slider]");
const lengthDisplay = document.querySelector("[data-password_length]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector(".tooltip[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-PasswordButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
// const color = "#0f0";
let password = "";
let password_length = 10;
let checkCount = 0;
handleSlider();

// set password_length
function handleSlider() {
    inputSlider.value = password_length;
    lengthDisplay.innerText = password_length;
}

// indicator function
function setIndicator( color) {
    indicator.style.backgroundColor = color;
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


// generate random number.
function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}
function generateRandomLowercase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}
function generateRandomUppercase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}
function generateRandomSymbols() {
    const ranNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(ranNum);
}
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbols = false;

    if (lowercaseCheck.checked) hasLower = true;
    if (uppercaseCheck.checked) hasUpper = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbols = true;
    
    if (
        hasLower &&
        hasUpper &&
        (hasNumber || hasSymbols) &&
        (passwordDisplay.value.length >= 8)
    ) {
        setIndicator("#0f0");
    } else if (
        (hasNumber || hasSymbols) &&
        (hasLower || hasUpper) &&
         (passwordDisplay.value.length >= 6) 

    ) {
        setIndicator("#0ff");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    } catch (error) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) checkCount++;
    });
}
// special condition
if (password_length < checkCount) {
    password_length = checkCount;
    handleSlider();
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) => {
    password_length = e.target.value;
    handleSlider();
});
copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});


generateBtn.addEventListener('click', () => {
    if (checkCount === 0) return;

    if (password_length < checkCount) {
               password_length = checkCount;
             handleSlider();
            }

    // Clear the old password
    password = "";

    let funcArr = [];

    // Add the selected character types to the funcArr
    if (uppercaseCheck.checked) {
        funcArr.push(generateRandomUppercase);
    }
    if (lowercaseCheck.checked) {
        funcArr.push(generateRandomLowercase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateRandomSymbols);
    }

    // If no character type is selected, return an empty password
    if (funcArr.length === 0) {
        passwordDisplay.value = password;
        calcStrength();
        return;
    }

    // Generate the password using the specified length
    for (let i = 0; i < password_length; i++) {
        const randIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle the password
    password = shufflePassword(Array.from(password));

    // Show in UI
    passwordDisplay.value = password;

    // Calculate strength
    calcStrength();
});
