const apiAuthorization = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjNDVhNjJlYmEwMjExZDc4YjgxYWUyMzI3ZWNhNjgyZiIsInN1YiI6IjY0YjI5Mzk5Mzc4MDYyMDBmZjM4N2UyZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8UaTRGLM2eoPK8c0wmZm01o7zS9r1Vij9ZWBfYJqCI4";
const header = new Headers({"Authorization": apiAuthorization});
let categoryBar = document.querySelectorAll(".category-bar button");
let categoryUnderBar = document.getElementById("bar-underline");
let openSearch = document.querySelector("#open-search");
let userInput = document.getElementById("user-input");
let carouselButton = document.querySelectorAll("#carouselExampleCaptions button");
let userInputValue = "";
let genreValue = "";
let url="";
let resultsCurrent = [];
let resultsFilter = [];
let page = 1;
let maxPage=0;
let sliceFilter=[];
let currentData={};

const callCurrentData = async() => {
    let response = await fetch(url,{headers:header});
    let data = await response.json();
    resultsCurrent = await data.results;
    
    console.log(response);
    console.log(data);
    console.log(resultsCurrent);
    
    carouserRender();
}


const callFilterData = async() => {
    page = 1;
    let response = await fetch(url,{headers:header});
    let data = await response.json();
    resultsFilter = await data.results;
    
    console.log(response);
    console.log(data);
    console.log(resultsFilter);

    categoryRender();
}

const popularityData = ()=>{
    url = new URL('https://api.themoviedb.org/3/discover/movie?language=ko&region=KR&sort_by=popularity.desc');
    callFilterData();
    document.querySelector(".category-area h2").textContent = `Best 영화`;
    categoryUnderBar.style.width="0"
    document.querySelector(".title").style.color = "rgb(168, 7, 7)";
}

const currentPlay = () => {
    url = new URL('https://api.themoviedb.org/3/movie/now_playing?language=ko&region=KR');
    callCurrentData();
}

const getFilterData =() =>{
    url = new URL(`https://api.themoviedb.org/3/search/movie?query=${userInputValue}&language=ko&region=KR`);
    callFilterData();
}

const getGenreData = () =>{
    url = new URL(`https://api.themoviedb.org/3/discover/movie?language=ko&region=KR&with_genres=${genreValue}`)
    callFilterData();
}


const carouserRender = () => {
    let carouserHtml = "";

    resultsCurrent.forEach((item,index)=>{
        if(index==0){
            carouserHtml += `<div class="carousel-item active" data-bs-interval="3000">
            <img src="${"https://image.tmdb.org/t/p/original"+item.poster_path}" class="d-block w-100" class="poster-image"/>
            <div class="carousel-caption d-md-block" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="modalDataCarouser('${index}')">
              <h5 class="poster-title">${item.title}</h5>
              <p class ="poster-detail">${item.overview.length>50?item.overview.slice(0,50)+"...":item.overview}</p>
            </div>
          </div>` 

        }else{
            carouserHtml += `<div class="carousel-item" data-bs-interval="3000">
            <img src="${"https://image.tmdb.org/t/p/original"+item.poster_path}" class="d-block w-100" class="poster-image" />
            <div class="carousel-caption d-md-block" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="modalDataCarouser('${index}')">
              <h5 class="poster-title">${item.title}</h5>
              <p class ="poster-detail">${item.overview.length>50?item.overview.slice(0,50)+"...":item.overview}</p>
            </div>
          </div>` 
        }
    })

    document.querySelector(".carousel-inner").innerHTML=carouserHtml;    
}

const modalDataCarouser = (index)=>{
    currentData = resultsCurrent[index];
    modalRender();
}

const modalDataCategory = (index) =>{
    currentData = sliceFilter[index];
    modalRender();
}

const modalRender = () =>{
    let modalRateHtml = "";
    let halfStarCheck = false;
    let starRate = currentData.vote_average/2;
    let halfStarRate = starRate-Math.floor(starRate);

    document.querySelector(".modal-title").textContent=currentData.title;
    document.querySelector(".modal-detail").textContent = currentData.overview;
    document.querySelector(".modal-poster").src= currentData.poster_path?"https://image.tmdb.org/t/p/original"+currentData.poster_path:"https://media.istockphoto.com/id/1216251206/vector/no-image-available-icon.jpg?s=612x612&w=0&k=20&c=6C0wzKp_NZgexxoECc8HD4jRpXATfcu__peSYecAwt0=";
    

    for(let i = 1;i<=Math.floor(starRate);i++){
        modalRateHtml+=`<i class="fa-solid fa-star"></i>`;
    }

    if(halfStarRate>=0.5){
        modalRateHtml+=`<i class="fa-solid fa-star-half-stroke"></i>`;
        halfStarCheck=true;
    }
    
    if(halfStarCheck==true){
        for(let i=(Math.floor(starRate)+1);i<5;i++){
            modalRateHtml+=`<i class="fa-regular fa-star"></i>`
        }
    }else{
        for(let i=(Math.floor(starRate));i<5;i++){
            modalRateHtml+=`<i class="fa-regular fa-star"></i>`
        }
    }
    document.querySelector(".modal-rate").innerHTML=modalRateHtml;
    document.querySelector(".modal-rate-num").textContent=starRate;    
}

const categoryRender = () => {
    let categoryHtml = "";
    paginationRender(resultsFilter.length);
    sliceFilter=resultsFilter.slice(page*6-6,page*6);
    sliceFilter.forEach((item,index)=>{
        categoryHtml += `<div class = "col-md-4 col-6 movie-items" onclick="modalDataCategory('${index}')" data-bs-toggle="modal" data-bs-target="#exampleModal">
            <div>
              <img src="${item.poster_path?"https://image.tmdb.org/t/p/original"+item.poster_path:"https://media.istockphoto.com/id/1216251206/vector/no-image-available-icon.jpg?s=612x612&w=0&k=20&c=6C0wzKp_NZgexxoECc8HD4jRpXATfcu__peSYecAwt0="}" class="movie-image">
            </div>
            <div>
              ${item.title}
            </div>
          </div>` });
        
    document.querySelector(".movie-list").innerHTML=categoryHtml;   
    console.log(document.querySelector(".category-area").offsetTop);
}

const paginationRender = (size)=>{
    maxPage = Math.ceil(size/6);
    let currentGroup = Math.ceil (page/3);
    let first = 0;
    let last=0;
    currentGroup*3>maxPage?last = maxPage : last = currentGroup*3;
    currentGroup*3-2<1?first=1: first=(currentGroup*3)-2;;
    let paginationHtml = "";

    

    if (page>1){
        paginationHtml+=`<a class="page-link" href="#" aria-label="Previous" onclick="nextPrevious('first')">
        <span aria-hidden="true">&laquo;</span>
      </a>`

        paginationHtml+=`<a class="page-link" href="#" aria-label="Previous" onclick="nextPrevious('pre')">
        <span aria-hidden="true">&lt;</span>
      </a>`
    }

    for(let i = first; i<=last;i++){

        if(i==page){
            paginationHtml+=`<li class="page-item active"><a class="page-link" href="#" onclick="pageChange(${i})">${i}</a></li>`

        }else{
            paginationHtml+=`<li class="page-item"><a class="page-link" href="#" onclick="pageChange(${i})">${i}</a></li>`
        }
    }

    if (page<maxPage){
        paginationHtml+=`<a class="page-link" href="#" aria-label="Next" onclick="nextPrevious('next')">
        <span aria-hidden="true">&gt;</span>
      </a>`
        paginationHtml+=`<a class="page-link" href="#" aria-label="Next" onclick="nextPrevious('last')">
        <span aria-hidden="true">&raquo;</span>
        </a>`
    }

    document.querySelector(".pagination").innerHTML = paginationHtml;
}



const pageChange = (p) =>{
    page = p;
    categoryRender();
    movieListScroll();
}

const nextPrevious=(value)=>{
    if(value=='pre'){
        page--;
    }else if(value=='next'){
        page++;
    }else if(value == 'first'){
        page=1;
    }else if(value == 'last'){
        page=maxPage;
    }
    categoryRender();
    movieListScroll();
}



let searchAreaOpenWide=()=>{
    document.querySelector(".search-container").style.visibility="visible";
    document.querySelector(".search-container").style.opacity="1";
    carouselButton.forEach((item)=>item.style.display="none");
    document.querySelector(".title").style.color = "white";
}
let searchAreaOpen = ()=>{
    categoryUnderBar.style.width = openSearch.offsetWidth +"px";
    categoryUnderBar.style.left = openSearch.offsetLeft +"px";
    categoryUnderBar.style.top = openSearch.offsetHeight+ openSearch.offsetTop +4+"px";
    document.querySelector(".search-container").style.visibility="visible";
    document.querySelector(".search-container").style.opacity="1";
    carouselButton.forEach((item)=>item.style.display="none");
    document.querySelector(".title").style.color = "white";
}

let closeSearchArea=()=>{   
    document.querySelector(".search-container").style.visibility="hidden";
    document.querySelector(".search-container").style.opacity="0";
    carouselButton.forEach((item)=>item.style.display="block");
}

categoryBar.forEach((item)=>{
    item.addEventListener("click",()=>{
        categoryUnderBar.style.width = item.offsetWidth +"px";
        categoryUnderBar.style.left = item.offsetLeft +"px";
        categoryUnderBar.style.top = item.offsetHeight+ item.offsetTop +"px";
        document.querySelector(".category-area h2").textContent = `"${item.textContent}" 영화`;
        genreValue = item.value;
        getGenreData();
        document.querySelector(".title").style.color = "white";
        movieListScroll();
        closeMenu();  
    })
})

document.querySelectorAll(".side-bar button").forEach((item)=>{
    item.addEventListener("click",()=>{
        document.querySelectorAll(".side-bar button").forEach((other)=>{
            other.style.color="white";
        })
        item.style.color="rgb(168, 7, 7)";

    });
})

let searchKeyword=()=>{
    userInputValue = userInput.value
    document.querySelector(".category-area h2").textContent = `"${userInputValue}" 으로 검색한 결과`
    getFilterData();
    document.querySelector(".search-container").style.visibility="hidden";
    document.querySelector(".search-container").style.opacity="0";
    carouselButton.forEach((item)=>item.style.display="block");
    movieListScroll();
}

userInput.addEventListener("keypress",(event)=>{
    if(event.keyCode=="13"){
        searchKeyword();
    }

})

const movieListScroll = () => {
    setTimeout(()=>{
        window.scrollTo({top:document.querySelector(".category-area").offsetTop,behavior:'smooth'});     
    },300);
}

const closeMenu=()=>{
    document.querySelector(".side-bar").style.width = "0"
    carouselButton.forEach((item)=>item.style.display="block");
}

const openMenu=()=>{
    document.querySelector(".side-bar button").style.width = "fit-content"
    document.querySelector(".side-bar").style.width = "50%"
    carouselButton.forEach((item)=>item.style.display="none");
}


window.addEventListener("scroll", (event) => {
    let scrollY = this.scrollY;
    if(scrollY>300){
        document.querySelector(".go-top").style.display="block";
    }else{
        document.querySelector(".go-top").style.display="none";
    }
});

let goToTop = ()=>{
    window.scrollTo(0,0);
}

currentPlay();
popularityData();
// getData();