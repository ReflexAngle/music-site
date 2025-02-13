const buttonAdd = document.getElementById('addSong');
const randomSong = document.getElementById('selectRandom');
const aboutSitePage = document.getElementById('aboutSite');

buttonAdd.addEventListener('click', function(){ // takes us to the page to add a song
    window.location.href="AddSong.html";
});
randomSong.addEventListener('click', function(){ // selects a random song
    alert("Random");
});
aboutSitePage.addEventListener('click', function(){
    window.location.href="About.html";
});