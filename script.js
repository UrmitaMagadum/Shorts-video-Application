// Mock data for videos
const mockVideos = [
  {
    id: 1,
    title: "Sunset at the beach",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    likes: 245,
    views: 1024,
    user: "alex_nature",
    createdAt: "2023-10-15",
  },
  {
    id: 2,
    title: "City lights at night",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-city-traffic-on-a-rainy-night-1306-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390",
    likes: 532,
    views: 2341,
    user: "urban_explorer",
    createdAt: "2023-10-12",
  },
  {
    id: 3,
    title: "Morning coffee routine",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-pouring-coffee-from-a-pot-1-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1495474472287-4671bcdd2085",
    likes: 189,
    views: 878,
    user: "coffee_lover",
    createdAt: "2023-10-10",
  },
  {
    id: 4,
    title: "Forest adventure",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-1288-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b",
    likes: 421,
    views: 1567,
    user: "nature_walks",
    createdAt: "2023-10-08",
  },
];

// Mock user data
const mockUsers = [
  { id: 1, email: "demo@example.com", password: "password123", name: "Demo User" },
];

// App state
const state = {
  currentScreen: "auth", // auth, feed, upload, profile
  authMode: "login", // login, register
  isAuthenticated: false,
  currentUser: null,
  videos: [...mockVideos],
  currentVideoIndex: 0,
  likedVideos: new Set(),
  isLoading: false,
  uploadData: { file: null, title: "", thumbnail: null },
};

// Render functions
function renderApp() {
  const app = document.getElementById("app");
  if (state.isLoading) {
    app.innerHTML = renderLoader();
    return;
  }
  switch (state.currentScreen) {
    case "auth":
      app.innerHTML = renderAuth();
      break;
    case "feed":
      app.innerHTML = renderFeed();
      break;
    case "upload":
      app.innerHTML = renderUpload();
      break;
    case "profile":
      app.innerHTML = renderProfile();
      break;
    default:
      app.innerHTML = renderAuth();
  }
  addEventListeners();
}

function renderLoader() {
  return `<div class="loader"></div>`;
}

function renderAuth() {
  return `
    <div class="auth-container">
      <h1>BOOM</h1>
      <div>
        <button onclick="setAuthMode('login')" class="${state.authMode === 'login' ? 'tab-active' : ''}">Login</button>
        <button onclick="setAuthMode('register')" class="${state.authMode === 'register' ? 'tab-active' : ''}">Register</button>
      </div>
      <form id="auth-form">
        ${state.authMode === "register" ? `<input id="name" class="auth-input" placeholder="Name" required />` : ""}
        <input id="email" class="auth-input" type="email" placeholder="Email" required />
        <input id="password" class="auth-input" type="password" placeholder="Password" required />
        <button type="submit" class="btn-primary">${state.authMode === "login" ? "Login" : "Create Account"}</button>
      </form>
      ${state.authMode === "login" ? `<p>Don't have an account? <a href="#" onclick="setAuthMode('register')">Register</a></p>` : ""}
    </div>
  `;
}

function renderFeed() {
  const currentVideo = state.videos[state.currentVideoIndex];
  const isLiked = state.likedVideos.has(currentVideo.id);
  return `
    <div class="video-container">
      <h2>${currentVideo.title}</h2>
      <p>@${currentVideo.user}</p>
      <video controls autoplay muted src="${currentVideo.videoUrl}" class="video-player"></video>
      <p>${currentVideo.views} views</p>
      <button class="like-button ${isLiked ? "liked" : ""}" onclick="likeVideo(${currentVideo.id})">Like</button>
      <button onclick="nextVideo()">Next Video</button>
      <button onclick="navigateTo('upload')">Upload</button>
      <button onclick="navigateTo('profile')">Profile</button>
      <button onclick="logout()">Logout</button>
    </div>
  `;
}

function renderUpload() {
  return `
    <div>
      <h2>Upload Video</h2>
      <input type="file" id="video-file" accept="video/*" />
      <input type="text" id="video-title" placeholder="Title" />
      <button onclick="uploadVideo()">Upload</button>
      <button onclick="navigateTo('feed')">Back to Feed</button>
    </div>
  `;
}

function renderProfile() {
  return `
    <div>
      <h2>${state.currentUser.name}'s Profile</h2>
      <p>Email: ${state.currentUser.email}</p>
      <p>Your Videos:</p>
      <ul>
        ${
          state.videos
            .filter(v => v.user === state.currentUser.name)
            .map(v => `<li>${v.title}</li>`)
            .join("") || "<li>No videos uploaded yet</li>"
        }
      </ul>
      <button onclick="navigateTo('upload')">Upload Video</button>
      <button onclick="logout()">Logout</button>
      <button onclick="navigateTo('feed')">Back to Feed</button>
    </div>
  `;
}

// Event listeners after render
function addEventListeners() {
  if (state.currentScreen === "auth") {
    const form = document.getElementById("auth-form");
    form.addEventListener("submit", e => {
      e.preventDefault();
      handleAuthSubmit();
    });
  }
  if (state.currentScreen === "upload") {
    const fileInput = document.getElementById("video-file");
    const titleInput = document.getElementById("video-title");
    fileInput.addEventListener("change", e => handleVideoFileSelect(e));
    titleInput.addEventListener("input", e => {
      state.uploadData.title = e.target.value;
    });
  }
}

// Auth handlers
function setAuthMode(mode) {
  state.authMode = mode;
  renderApp();
}

function handleAuthSubmit() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (state.authMode === "login") {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      state.isLoading = true;
      renderApp();
      setTimeout(() => {
        state.isAuthenticated = true;
        state.currentUser = user;
        state.currentScreen = "feed";
        state.isLoading = false;
        renderApp();
      }, 1000);
    } else {
      alert("Invalid email or password");
    }
  } else {
    // Register
    const name = document.getElementById("name").value.trim();
    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }
    state.isLoading = true;
    renderApp();
    setTimeout(() => {
      const newUser = { id: mockUsers.length + 1, email, password, name };
      mockUsers.push(newUser);
      state.isAuthenticated = true;
      state.currentUser = newUser;
      state.currentScreen = "feed";
      state.isLoading = false;
      renderApp();
    }, 1000);
  }
}

function navigateTo(screen) {
  state.currentScreen = screen;
  renderApp();
}

function logout() {
  state.isLoading = true;
  renderApp();
  setTimeout(() => {
    state.isAuthenticated = false;
    state.currentUser = null;
    state.currentScreen = "auth";
    state.isLoading = false;
    renderApp();
  }, 1000);
}

function nextVideo() {
  if (state.currentVideoIndex < state.videos.length - 1) {
    state.currentVideoIndex++;
  } else {
    state.currentVideoIndex = 0; // Loop back
  }
  renderApp();
}

function likeVideo(videoId) {
  if (state.likedVideos.has(videoId)) {
    state.likedVideos.delete(videoId);
  } else {
    state.likedVideos.add(videoId);
  }
  renderApp();
}

function handleVideoFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    state.uploadData.file = file;
  }
}

function uploadVideo() {
  if (!state.uploadData.file || !state.uploadData.title) {
    alert("Please select a video and enter a title");
    return;
  }
  state.isLoading = true;
  renderApp();
  setTimeout(() => {
    const newVideo = {
      id: state.videos.length + 1,
      title: state.uploadData.title,
      videoUrl: URL.createObjectURL(state.uploadData.file),
      thumbnailUrl: "",
      likes: 0,
      views: 0,
      user: state.currentUser.name,
      createdAt: new Date().toISOString().split("T")[0],
    };
    state.videos.unshift(newVideo);
    state.uploadData = { file: null, title: "", thumbnail: null };
    state.currentScreen = "feed";
    state.currentVideoIndex = 0;
    state.isLoading = false;
    renderApp();
  }, 2000);
}

// Initialize app
renderApp();
