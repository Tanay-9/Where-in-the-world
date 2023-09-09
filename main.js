const head = document.querySelector('.second-sub-head'),
themeBtn = document.querySelector('.theme-btn'),
themeIcon = document.querySelector('.theme-img'),
themeTxt = document.querySelector('.theme-txt'),
selectRegion = document.getElementById('region'),
searchCountry = document.querySelector('.search-icon'),
searchCountryInput = document.getElementById('country'),
wrapper = document.querySelector('.wrapper'),
countryDetailsBox = document.querySelector('.country-details-box'),
backBtn = document.querySelector('.back-btn');

let themeFlag =JSON.parse(localStorage.getItem("themeFlag")) || false;

if(themeFlag){
    themeIcon.src = 'images/sun-icon.svg';
    themeTxt.innerText='Light Mode';
    switchTheme();
}

themeBtn.addEventListener('click', ()=>{
    if(!themeFlag){
        themeIcon.src = "./design/sun_icon.svg";
        themeTxt.innerText='Light Mode';
        switchTheme();
        themeFlag = true;
        localStorage.setItem("themeFlag", themeFlag);
    }else{
        themeIcon.src = './design/moon_icomn.svg';
        themeTxt.innerText='Dark Mode';
        switchTheme();
        themeFlag = false;
        localStorage.setItem("themeFlag", themeFlag);
    }
})

function switchTheme(){
    document.querySelector('body').classList.toggle('theme-class');
}

searchCountry.addEventListener('click',searchCountryFn);

searchCountryInput.addEventListener('keyup', searchCountryFn);

function searchCountryFn(){
    [...wrapper.children].forEach(child => {
        child.classList.add('none');
        if(child.lastElementChild.firstElementChild.innerText.toLowerCase().includes(searchCountryInput.value)){
            child.classList.remove('none');
        }
    });
}

selectRegion.addEventListener('change',()=>{
    [...wrapper.children].forEach(child => {
        child.classList.remove('none');
        if(!child.lastElementChild.children[2].classList.contains(selectRegion.value)){
            child.classList.add('none');
        }
    });
})

countryDetailsBox.addEventListener('click', (e)=>{
    if(e.target.classList.contains('back-btn')){
        head.classList.toggle('none');
        wrapper.classList.toggle('none');
        countryDetailsBox.classList.toggle('none');
        countryDetailsBox.innerHTML='';
    }
})

wrapper.addEventListener('click',(e)=>{
    if(e.target.classList.contains('country-box')){
        const indx = [...wrapper.children].indexOf(e.target);
        
        head.classList.toggle('none');
        wrapper.classList.toggle('none');
        countryDetailsBox.classList.toggle('none');
        getCountryDetails(indx);
    }
})

async function getCountryDetails(i){
    const countryData = await fetch('data.json');
    const countryResults = await countryData.json();
    console.log(countryResults);

    const currenciesList = countryResults[i].currencies?countryResults[i].currencies:0;
    const languagesList = countryResults[i].languages;
    const bordersList = (countryResults[i].borders)? countryResults[i].borders : 0;
    console.log(bordersList);
  

    const div = document.createElement('div');

    div.innerHTML = `
    <button class="back-btn">
    <img src="images/arrow-left.svg" alt="" class="back-img">
    Back
    </button>

    <div class="country-details-grid">
    <img src="${countryResults[i].flags.svg}" alt="" class="flag">

    <div class="country-info">
    <div class="country-details-grid">
    <div>
    <h3 class="country-name">${countryResults[i].name}</h3>
    <p class="country-info-para">
        native name: <span>${countryResults[i].nativeName}</span>
    </p>
    <p class="country-info-para">
        population: <span>${countryResults[i].population}</span>
    </p>
    <p class="country-info-para">
        region: <span>${countryResults[i].region}</span>
    </p>
    <p class="country-info-para">
        sub region: <span>${countryResults[i].subregion}</span>
    </p>
    <p class="country-info-para country-details-capital">
        capital: <span>${countryResults[i].capital}</span>
    </p>
    </div>
    <div>
    <p class="country-info-para">
    top level domain: <span>b${countryResults[i].topLevelDomain}</span>
    </p>
    <p class="country-info-para">
        Currencies:
    </p>
    <p class="country-info-para">
        Languages:
    </p>
    </div>
    </div>
    <h4 class="borders">
            Border countries
        </h4>
        <div class="border-box"></div>
    </div>
    </div>
    `;
    const currencyBox = div.lastElementChild.lastElementChild.firstElementChild.lastElementChild.children[1];
    const languageBox = div.lastElementChild.lastElementChild.firstElementChild.lastElementChild.children[2];
    const borderBox = div.lastElementChild.lastElementChild.lastElementChild;
    
        if(currenciesList.length){
        currenciesList.forEach((ele,j) =>{
        const span = document.createElement('span');
        span.innerText = j==0?currenciesList[j].code:' ,' + currenciesList[j].code;
        currencyBox.append(span);
    })}
    else {
        const span = document.createElement('span');
        span.innerText = `No currency exist`;
        currencyBox.append(span);
    }

    languagesList.forEach((ele,id) => {
        const spanL = document.createElement('span');
        if(id>0){
            spanL.innerText=', ' + languagesList[id].name;
        }else{
            spanL.innerText= languagesList[id].name;
        }
        languageBox.append(spanL);
    })
    if(bordersList.length){
    for (let i = 0; i < bordersList.length; i++) {
        const p = document.createElement('p');
        p.classList.add('border');
        p.innerText=bordersList[i];
        borderBox.append(p);
    }}
    else {
        const p = document.createElement('p');
        p.classList.add('border');
        p.innerText=`no bordering country`;
        borderBox.append(p);
    }
    
    countryDetailsBox.append(div);
}



async function getData(){
    const data = await fetch('data.json');
    const result = await data.json();
    
    result.forEach((ele,i) =>{
        const countryBox = document.createElement('div');
        countryBox.classList.add('country-box');
        countryBox.innerHTML=`
        <div class="flag-box">
                    <img src="${result[i].flags.svg}" alt="" class="flag">
                </div>
                <div class="country-info">
                    <h3 class="country-name">${result[i].name}</h3>
                    <p class="country-info-para">
                        population: <span>${result[i].population}</span>
                    </p>
                    <p class="country-info-para ${result[i].region.toLowerCase()}">
                        region: <span>${result[i].region}</span>
                    </p>
                    <p class="country-info-para">
                        capital: <span>${result[i].capital}</span>
                    </p>
                </div>
        `;
        wrapper.append(countryBox);
    })
        
    }


getData();

