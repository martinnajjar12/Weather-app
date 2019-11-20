<<<<<<< HEAD
// initial default city name
// المدينة الافتراضية هي لندن
let city = "London",
    unit,
    deg,
    long,
    lat,
    elementClicked,
    response;

// let's define our HTML elements here
// تعريف عناصر الصفحة التى نحتاجها هنا
const searchForm = document.querySelector("#search"),
    resultCard = document.querySelector('#result'),
    cityOut_elem = document.querySelector('#cityOut'),
    mainIcon_elem = document.querySelector('#mainIcon'),
    mainTemp_elem = document.querySelector('#mainTemp'),
    mainDescription_elem = document.querySelector('#mainDescription'),
    minTemp_elem = document.querySelector('#minTemp'),
    maxTemp_elem = document.querySelector('#maxTemp'),
    humidity_elem = document.querySelector('#humidity'),
    windSpeed_elem = document.querySelector('#windSpeed'),
    time = document.querySelector('footer > time'),
    submitButton = document.querySelector("#searchButton"),
    inputCityName = document.querySelector('#cityIn'),
    serchBox = new google.maps.places.SearchBox(inputCityName),
    checkBox = document.querySelector('#checkBox'),
    windSpeed_weight = document.querySelector('#windSpeed_weight'),
    currentLocationText = document.querySelector('#current_location');

//Accessing User Location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
    });
};

currentLocationText.addEventListener('click', () => {
    elementClicked = true;
    loadWeatherData(function () {
        city = response.name;
        resultCard.style.display = "block";
    });
    /*Setting the timeout to wait untill the response
    changes and the city name changes to the current city*/
    setTimeout(loadBackgroundImage, 500);
});

if (checkBox.checked) {
    unit = 'imperial';
    deg = '°F';
    windSpeed_weight.innerHTML = 'm/h'
} else {
    unit = 'metric';
    deg = '°C'
    windSpeed_weight.innerHTML = 'm/s'
};

checkBox.addEventListener('click', () => {
    if (checkBox.checked) {
        unit = 'imperial';
        deg = '°F'
        windSpeed_weight.innerHTML = 'm/h'
    } else {
        unit = 'metric';
        deg = '°C'
        windSpeed_weight.innerHTML = 'm/s'
    }
    loadWeatherData();
});

// When the page is fully loaded, fetch weather data for the default city name
// استدعاء الدالة الأساسية للحصول على معلومات الطقس عندما يتم تحميل جميع عناصر الصفحة
document.addEventListener("DOMContentLoaded", function () {
    // استدهاء الدالة الأساسية مع دالة رد
    loadWeatherData(function () {
        // show results card when finished
        resultCard.style.display = "block";
    });
    loadBackgroundImage();
});


// attach submit event to our search form to get weather data
// استدعاء الدالة الأساسية للحصول على معلومات الطقس عندما يتم الضغط على زر التحديث
searchForm.addEventListener('submit', function (e) {
    // منع السلوك الافتراضي لإرسال النموذج
    e.preventDefault();
    // التأكد أن النموذج صالح
    if (this.checkValidity()) {
        // disable submit button to prevent multi clicks until we get a response
        submitButton.disabled = true;
        submitButton.value = "Loading...";
        city = inputCityName.value;
        // استدعاء الدالة الأساسية مع دالة رد
        loadWeatherData(function () {
            // reset input value
            inputCityName.value = null;
            resultCard.style.display = "block";
        });
        loadBackgroundImage();
    }
});



// function to fetch weather data from external server by using it's API
// الدالة الأساسية التي تقوم بالاتصال بالواجهة البرمجية للحصول على معلومات الطقس بحسب المدينة
function loadWeatherData(callbackFunction) {

    const request = new XMLHttpRequest();

    // for more info about openWeatherMap API
    // https://openweathermap.org/current

    const key = "eb9ba4d5906d3eecd90f0bb03297ec8b";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit +
        "&APPID=" + key;
    const currentLocationURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=" + unit +
        "&APPID=" + key;

    request.onreadystatechange = function () {
        // to check we've got a valid response
        if (this.readyState === 4 && this.status === 200) {
             response = JSON.parse(this.responseText);
            // استدعاء الدالة الخاصة بتحديث معلومات الصفحة
            updateWeatherData(response, callbackFunction);
        }

        // إذا لم يتم الحصول على نتائج. مثلا اسم المدينة غير موجود
        else if (this.readyState === 4 && this.status === 404) {
            alert('No results found for "' + city + '", please check the city name.');
            submitButton.disabled = false;
            submitButton.value = "Update";
            inputCityName.value = null;
        };
    };

    //Checking which url should be fetching
    if (elementClicked == true) {
        request.open('GET', currentLocationURL, true);
    } else {
        request.open("GET", url, true);
    };
    request.send();
};

// الدالة الخاصة بتحديث معلومات الصفحة
function updateWeatherData(data, callbackFunction = null) {
    // to see what we've got from the API
    //console.log(data);
    // define some variables that we need to show in the card
    const cityName = data.name,
        icon = data.weather[0].icon,
        icon_url = "http://openweathermap.org/img/wn/" + icon + "@2x.png",
        description = data.weather[0].description,
        temp = data.main.temp,
        temp_max = data.main.temp_max,
        temp_min = data.main.temp_min,
        humidity = data.main.humidity,
        windSpeed = data.wind.speed,
        percent = "%";

    // set values on the card
    cityOut_elem.innerHTML = cityName;
    mainIcon_elem.setAttribute("src", icon_url);
    mainIcon_elem.setAttribute("alt", description);
    mainTemp_elem.innerHTML = Math.round(temp) + deg;
    mainDescription_elem.innerHTML = description;
    maxTemp_elem.innerHTML = Math.round(temp_max) + deg;
    minTemp_elem.innerHTML = Math.round(temp_min) + deg;
    humidity_elem.innerHTML = humidity + percent;
    windSpeed_elem.innerHTML = windSpeed;

    // الحصول على تاريخ ووقت تسجيل حالة الطقس
    let date = new Date(data.dt * 1000);

    // تعديل نسق التاريخ بحسب المطلوب
    time.innerHTML = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        hour12: true,
        minute: 'numeric'
    }).replace(",", " ").replace(/ /, "/").replace(/ /, "/");

    submitButton.disabled = false;
    submitButton.value = "Get Weather";

    // التأكد أنه تم تمرير دالة ضمنية
    if (callbackFunction) {
        // استدعاء الدالة التي ستنفذ عند انتهاء تنفيذ الكود
        callbackFunction();
    };
};

// =========================================
// 2nd part to get dynamic background image from external server API
// =========================================
// type your code here like loadWeatherData() function above but with another API
// you can use Flickr, GettyImages, Pexels, Unsplash, etc... API's to fetch a dynamic backgroud image

// Example for using Unsplash API
// 1. Register new account at https://unsplash.com/join
// 2. Enter some info about your app here https://unsplash.com/oauth/applications
// 3. Copy your API "Access Key" from the created app page
// 4. Call this URL to get random image about entered city name
// https://api.unsplash.com/photos/random/?client_id=YOUR_ACCESS_KEY_HERE&query=city_cairo&orientation=landscape&w=1920
// replace "YOUR_ACCESS_KEY_HERE" with your "Access Key" from step 3
// replace "cairo" with city variable name
// for more info about their API check here: https://unsplash.com/documentation#get-a-random-photo
function loadBackgroundImage() {
    const imageRequest = new XMLHttpRequest();
    const imageAPI = "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=92376ec203aab45c36d128836561a838&tags=" + city + "&accuracy=%7E11&safe_search=3&geo_context=2&format=json&nojsoncallback=1"


    imageRequest.onreadystatechange = () => {
        if (imageRequest.readyState === 4 && imageRequest.status === 200) {
            const result = JSON.parse(imageRequest.responseText);
            updateBackgroundImage(result);
        }
    }

    imageRequest.open("GET", imageAPI, true);
    imageRequest.send();
};

function updateBackgroundImage(image) {
    // type your code here to apply received image as a background image for body element
    let i = Math.floor(Math.random() * image.photos.photo.length);
    let farm = image.photos.photo[i].farm
    let serverId = image.photos.photo[i].server;
    let ID = image.photos.photo[i].id;
    let secret = image.photos.photo[i].secret;
    document.getElementsByTagName('body')[0].style.backgroundImage = "url(https://farm" + farm + ".staticflickr.com/" + serverId + "/" + ID + "_" + secret + ".jpg)";
    document.getElementsByTagName('body')[0].style.backgroundSize = 'cover no-repeat fixed center';
};

//To access city name url NOT current location url
inputCityName.addEventListener('keypress', () => {
    elementClicked = false;
=======
// initial default city name
// المدينة الافتراضية هي لندن
let city = "London",
    unit,
    deg,
    long,
    lat,
    elementClicked,
    response;

// let's define our HTML elements here
// تعريف عناصر الصفحة التى نحتاجها هنا
const searchForm = document.querySelector("#search"),
    resultCard = document.querySelector('#result'),
    cityOut_elem = document.querySelector('#cityOut'),
    mainIcon_elem = document.querySelector('#mainIcon'),
    mainTemp_elem = document.querySelector('#mainTemp'),
    mainDescription_elem = document.querySelector('#mainDescription'),
    minTemp_elem = document.querySelector('#minTemp'),
    maxTemp_elem = document.querySelector('#maxTemp'),
    humidity_elem = document.querySelector('#humidity'),
    windSpeed_elem = document.querySelector('#windSpeed'),
    time = document.querySelector('footer > time'),
    submitButton = document.querySelector("#searchButton"),
    inputCityName = document.querySelector('#cityIn'),
    serchBox = new google.maps.places.SearchBox(inputCityName),
    checkBox = document.querySelector('#checkBox'),
    windSpeed_weight = document.querySelector('#windSpeed_weight'),
    currentLocationText = document.querySelector('#current_location');

//Accessing User Location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
    });
};

currentLocationText.addEventListener('click', () => {
    elementClicked = true;
    loadWeatherData(function () {
        city = response.name;
        resultCard.style.display = "block";
    });
    /*Setting the timeout to wait untill the response
    changes (the city name changes to the current city)*/
    setTimeout(loadBackgroundImage, 500);
});

function unitChecker() {
    if (checkBox.checked) {
        unit = 'imperial';
        deg = '°F';
        windSpeed_weight.innerHTML = 'm/h'
    } else {
        unit = 'metric';
        deg = '°C'
        windSpeed_weight.innerHTML = 'm/s'
    };
}

checkBox.addEventListener('click', () => {
    unitChecker();
    loadWeatherData();
});

// When the page is fully loaded, fetch weather data for the default city name
// استدعاء الدالة الأساسية للحصول على معلومات الطقس عندما يتم تحميل جميع عناصر الصفحة
document.addEventListener("DOMContentLoaded", function () {
    unitChecker();
    // استدهاء الدالة الأساسية مع دالة رد
    loadWeatherData(function () {
        // show results card when finished
        resultCard.style.display = "block";
    });
    loadBackgroundImage();
});


// attach submit event to our search form to get weather data
// استدعاء الدالة الأساسية للحصول على معلومات الطقس عندما يتم الضغط على زر التحديث
searchForm.addEventListener('submit', function (e) {
    // منع السلوك الافتراضي لإرسال النموذج
    e.preventDefault();
    // التأكد أن النموذج صالح
    if (this.checkValidity()) {
        // disable submit button to prevent multi clicks until we get a response
        submitButton.disabled = true;
        submitButton.value = "Loading...";
        city = inputCityName.value;
        // استدعاء الدالة الأساسية مع دالة رد
        loadWeatherData(function () {
            // reset input value
            inputCityName.value = null;
            resultCard.style.display = "block";
        });
        loadBackgroundImage();
    }
});



// function to fetch weather data from external server by using it's API
// الدالة الأساسية التي تقوم بالاتصال بالواجهة البرمجية للحصول على معلومات الطقس بحسب المدينة
function loadWeatherData(callbackFunction) {

    const request = new XMLHttpRequest();

    // for more info about openWeatherMap API
    // https://openweathermap.org/current

    const key = "eb9ba4d5906d3eecd90f0bb03297ec8b";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit +
        "&APPID=" + key;
    const currentLocationURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=" + unit +
        "&APPID=" + key;

    request.onreadystatechange = function () {
        // to check we've got a valid response
        if (this.readyState === 4 && this.status === 200) {
            response = JSON.parse(this.responseText);
            // استدعاء الدالة الخاصة بتحديث معلومات الصفحة
            updateWeatherData(response, callbackFunction);
        }

        // إذا لم يتم الحصول على نتائج. مثلا اسم المدينة غير موجود
        else if (this.readyState === 4 && this.status === 404) {
            alert('No results found for "' + city + '", please check the city name.');
            submitButton.disabled = false;
            submitButton.value = "Update";
            inputCityName.value = null;
        };
    };

    //Checking which url should be fetching
    if (elementClicked == true) {
        request.open('GET', currentLocationURL, true);
    } else {
        request.open("GET", url, true);
    };
    request.send();
};

// الدالة الخاصة بتحديث معلومات الصفحة
function updateWeatherData(data, callbackFunction = null) {
    // to see what we've got from the API
    //console.log(data);
    // define some variables that we need to show in the card
    const cityName = data.name,
        icon = data.weather[0].icon,
        icon_url = "http://openweathermap.org/img/wn/" + icon + "@2x.png",
        description = data.weather[0].description,
        temp = data.main.temp,
        temp_max = data.main.temp_max,
        temp_min = data.main.temp_min,
        humidity = data.main.humidity,
        windSpeed = data.wind.speed,
        percent = "%";

    // set values on the card
    cityOut_elem.innerHTML = cityName;
    mainIcon_elem.setAttribute("src", icon_url);
    mainIcon_elem.setAttribute("alt", description);
    mainTemp_elem.innerHTML = Math.round(temp) + deg;
    mainDescription_elem.innerHTML = description;
    maxTemp_elem.innerHTML = Math.round(temp_max) + deg;
    minTemp_elem.innerHTML = Math.round(temp_min) + deg;
    humidity_elem.innerHTML = humidity + percent;
    windSpeed_elem.innerHTML = windSpeed;

    // الحصول على تاريخ ووقت تسجيل حالة الطقس
    let date = new Date(data.dt * 1000);

    // تعديل نسق التاريخ بحسب المطلوب
    time.innerHTML = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        hour12: true,
        minute: 'numeric'
    }).replace(",", " ").replace(/ /, "/").replace(/ /, "/");

    submitButton.disabled = false;
    submitButton.value = "Get Weather";

    // التأكد أنه تم تمرير دالة ضمنية
    if (callbackFunction) {
        // استدعاء الدالة التي ستنفذ عند انتهاء تنفيذ الكود
        callbackFunction();
    };
};

// =========================================
// 2nd part to get dynamic background image from external server API
// =========================================
// type your code here like loadWeatherData() function above but with another API
// you can use Flickr, GettyImages, Pexels, Unsplash, etc... API's to fetch a dynamic backgroud image

// Example for using Unsplash API
// 1. Register new account at https://unsplash.com/join
// 2. Enter some info about your app here https://unsplash.com/oauth/applications
// 3. Copy your API "Access Key" from the created app page
// 4. Call this URL to get random image about entered city name
// https://api.unsplash.com/photos/random/?client_id=YOUR_ACCESS_KEY_HERE&query=city_cairo&orientation=landscape&w=1920
// replace "YOUR_ACCESS_KEY_HERE" with your "Access Key" from step 3
// replace "cairo" with city variable name
// for more info about their API check here: https://unsplash.com/documentation#get-a-random-photo
function loadBackgroundImage() {
    const imageRequest = new XMLHttpRequest();
    const imageAPI = "https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=92376ec203aab45c36d128836561a838&tags=" + city + "&accuracy=%7E11&safe_search=3&geo_context=2&format=json&nojsoncallback=1"


    imageRequest.onreadystatechange = () => {
        if (imageRequest.readyState === 4 && imageRequest.status === 200) {
            const result = JSON.parse(imageRequest.responseText);
            updateBackgroundImage(result);
        }
    }

    imageRequest.open("GET", imageAPI, true);
    imageRequest.send();
};

function updateBackgroundImage(image) {
    // type your code here to apply received image as a background image for body element
    let i = Math.floor(Math.random() * image.photos.photo.length);
    let farm = image.photos.photo[i].farm
    let serverId = image.photos.photo[i].server;
    let ID = image.photos.photo[i].id;
    let secret = image.photos.photo[i].secret;
    document.getElementsByTagName('body')[0].style.backgroundImage = "url(https://farm" + farm + ".staticflickr.com/" + serverId + "/" + ID + "_" + secret + ".jpg)";
    document.getElementsByTagName('body')[0].style.backgroundSize = 'cover no-repeat fixed center';
};

//To access city name url NOT current location url
inputCityName.addEventListener('keypress', () => {
    elementClicked = false;
>>>>>>> Simple changes
});