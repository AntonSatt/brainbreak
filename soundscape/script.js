const moodCards = document.querySelectorAll('.mood-card');
const soundButtons = document.querySelectorAll('.play-sound-btn');

const audio = document.getElementById('global-audio');
const nowPlayingText = document.getElementById('now-playing');
const globalPlayPauseBtn = document.getElementById('global-play-pause');
const progressBar = document.getElementById('progress-bar');
const timeDisplay = document.getElementById('time-display');
const volumeControl = document.getElementById('volume-control');

let currentTitle = '';

// Smooth scroll to the selected mood section.
moodCards.forEach((card) => {
	card.addEventListener('click', () => {
		const sectionId = card.dataset.target;
		const targetSection = document.getElementById(sectionId);

		if (targetSection) {
			targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	});
});

// Convert seconds to mm:ss format for the time display.
function formatTime(totalSeconds) {
	if (!Number.isFinite(totalSeconds)) {
		return '0:00';
	}

	const minutes = Math.floor(totalSeconds / 60);
	const seconds = Math.floor(totalSeconds % 60);
	return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function updateTimeDisplay() {
	const current = formatTime(audio.currentTime);
	const duration = formatTime(audio.duration);
	timeDisplay.textContent = `${current} / ${duration}`;
}

function updateProgressBar() {
	if (!audio.duration) {
		progressBar.value = '0';
		return;
	}

	const progressPercent = (audio.currentTime / audio.duration) * 100;
	progressBar.value = String(progressPercent);
}

// Load a new sound into the single global audio element.
function playSelectedSound(title, src) {
	const isSameTrack = audio.src === src;

	if (!isSameTrack) {
		audio.pause();
		audio.src = src;
		audio.load();
	}

	currentTitle = title;
	nowPlayingText.textContent = `Now Playing: ${currentTitle}`;
	globalPlayPauseBtn.disabled = false;

	audio
		.play()
		.then(() => {
			globalPlayPauseBtn.textContent = 'Pause';
		})
		.catch(() => {
			globalPlayPauseBtn.textContent = 'Play';
		});
}

soundButtons.forEach((button) => {
	button.addEventListener('click', () => {
		const title = button.dataset.title;
		const src = button.dataset.src;

		if (!title || !src) {
			return;
		}

		playSelectedSound(title, src);
	});
});

// Global play/pause button controls the currently loaded sound.
globalPlayPauseBtn.addEventListener('click', () => {
	if (!audio.src) {
		return;
	}

	if (audio.paused) {
		audio.play();
	} else {
		audio.pause();
	}
});

// Update button text based on playback state.
audio.addEventListener('play', () => {
	globalPlayPauseBtn.textContent = 'Pause';
});

audio.addEventListener('pause', () => {
	globalPlayPauseBtn.textContent = 'Play';
});

// Keep the progress bar and time display synced in real time.
audio.addEventListener('timeupdate', () => {
	updateProgressBar();
	updateTimeDisplay();
});

audio.addEventListener('loadedmetadata', () => {
	updateTimeDisplay();
	updateProgressBar();
});

audio.addEventListener('ended', () => {
	globalPlayPauseBtn.textContent = 'Play';
});

// Let users drag the progress bar to seek through the sound.
progressBar.addEventListener('input', () => {
	if (!audio.duration) {
		return;
	}

	const newTime = (Number(progressBar.value) / 100) * audio.duration;
	audio.currentTime = newTime;
});

// Volume slider controls the same global audio element.
volumeControl.addEventListener('input', () => {
	audio.volume = Number(volumeControl.value);
});

// Set default volume and initial time text.
audio.volume = Number(volumeControl.value);
updateTimeDisplay();
