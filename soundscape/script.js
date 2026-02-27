/* =============================================
	 Mental Hälsa – Soundscape Scripts
	 ============================================= */

(function () {
	'use strict';

	// ---------- Header scroll effect ----------
	const header = document.querySelector('.site-header');

	function onScroll() {
		if (!header) return;

		if (window.scrollY > 40) {
			header.classList.add('scrolled');
		} else {
			header.classList.remove('scrolled');
		}
	}

	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	// ---------- Mobile nav toggle ----------
	const navToggle = document.querySelector('.nav-toggle');
	const mainNav = document.querySelector('.main-nav');

	if (navToggle && mainNav) {
		navToggle.addEventListener('click', () => {
			const isOpen = navToggle.classList.toggle('open');
			mainNav.classList.toggle('open');
			navToggle.setAttribute('aria-expanded', String(isOpen));
		});

		mainNav.querySelectorAll('.nav-link').forEach((link) => {
			link.addEventListener('click', () => {
				navToggle.classList.remove('open');
				mainNav.classList.remove('open');
				navToggle.setAttribute('aria-expanded', 'false');
			});
		});

		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && mainNav.classList.contains('open')) {
				navToggle.classList.remove('open');
				mainNav.classList.remove('open');
				navToggle.setAttribute('aria-expanded', 'false');
				navToggle.focus();
			}
		});
	}

	// ---------- Soundscape mood scroll ----------
	const moodCards = document.querySelectorAll('.mood-card');

	moodCards.forEach((card) => {
		card.addEventListener('click', () => {
			const sectionId = card.dataset.target;
			const targetSection = document.getElementById(sectionId);

			if (targetSection) {
				targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		});
	});

	// ---------- Global audio player ----------
	const soundButtons = document.querySelectorAll('.play-sound-btn');
	const audio = document.getElementById('global-audio');
	const nowPlayingText = document.getElementById('now-playing');
	const globalPlayPauseBtn = document.getElementById('global-play-pause');
	const progressBar = document.getElementById('progress-bar');
	const timeDisplay = document.getElementById('time-display');
	const volumeControl = document.getElementById('volume-control');
	const globalPlayer = document.querySelector('.global-player');

	function syncPlayerHeightVar() {
		if (!globalPlayer) {
			return;
		}

		const playerHeight = Math.ceil(globalPlayer.offsetHeight);
		document.documentElement.style.setProperty('--player-height', `${playerHeight}px`);
	}

	window.addEventListener('load', syncPlayerHeightVar);
	window.addEventListener('resize', syncPlayerHeightVar);
	syncPlayerHeightVar();

	if (globalPlayer && 'ResizeObserver' in window) {
		const playerResizeObserver = new ResizeObserver(syncPlayerHeightVar);
		playerResizeObserver.observe(globalPlayer);
	}

	if (!audio || !nowPlayingText || !globalPlayPauseBtn || !progressBar || !timeDisplay || !volumeControl) {
		return;
	}

	// Convert seconds to mm:ss format.
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

	// Load one selected sound into the single global audio element.
	function playSelectedSound(title, src) {
		const absoluteSrc = new URL(src, window.location.href).href;
		const isSameTrack = audio.src === absoluteSrc;

		if (!isSameTrack) {
			audio.pause();
			audio.src = src;
			audio.load();
		}

		nowPlayingText.textContent = `Now Playing: ${title}`;
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

	audio.addEventListener('play', () => {
		globalPlayPauseBtn.textContent = 'Pause';
	});

	audio.addEventListener('pause', () => {
		globalPlayPauseBtn.textContent = 'Play';
	});

	// Keep progress and time synced while audio is playing.
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

	// Seek when the user drags the progress bar.
	progressBar.addEventListener('input', () => {
		if (!audio.duration) {
			return;
		}

		const newTime = (Number(progressBar.value) / 100) * audio.duration;
		audio.currentTime = newTime;
	});

	volumeControl.addEventListener('input', () => {
		audio.volume = Number(volumeControl.value);
	});

	audio.volume = Number(volumeControl.value);
	updateTimeDisplay();
})();
