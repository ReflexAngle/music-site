async function loadFirstSong() {
  try {
    const response = await fetch("/songs/first");
    const song = await response.json();

    if (song && song.ArtistName && song.SongName && song.Genre) {
      document.getElementById("songTitle").textContent = song.SongName;
      document.getElementById("songArtist").textContent = song.ArtistName;
      document.getElementById("songAlbum").textContent = song.Genre; // Assuming 'Genre' is used as album info
    } else {
      console.log("No song data found.");
    }
  } catch (error) {
    console.error("Error loading first song:", error);
  }
}

// Call this function when the page loads
document.addEventListener("DOMContentLoaded", loadFirstSong);

async function loadFirstArtist() {
  try {
    const response = await fetch("/songs/first-artist");
    const data = await response.json();

    if (data.artist) {
      document.getElementById("artistName").textContent = data.artist;
    } else {
      document.getElementById("artistName").textContent = "No Data Found";
    }
  } catch (error) {
    console.error("Error loading first artist:", error);
  }
}

// Run function when the page loads
document.addEventListener("DOMContentLoaded", loadFirstArtist);

