(function () {
    "use strict";

    function onReady(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    onReady(function () {
        /* Reveal on scroll */
        var revealEls = document.querySelectorAll(".reveal");
        if (revealEls.length && "IntersectionObserver" in window) {
            var observer = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("active");
                        }
                    });
                },
                { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
            );
            revealEls.forEach(function (el) {
                observer.observe(el);
            });
        } else {
            revealEls.forEach(function (el) {
                el.classList.add("active");
            });
        }

        /* Cursor glow */
        var glow = document.querySelector(".cursor-glow");
        if (glow && window.matchMedia("(min-width: 769px)").matches) {
            document.addEventListener(
                "mousemove",
                function (e) {
                    glow.style.left = e.clientX + "px";
                    glow.style.top = e.clientY + "px";
                },
                { passive: true }
            );
        }

        /* Mobile nav */
        var nav = document.querySelector(".nav");
        var navToggle = document.getElementById("navToggle");
        var navMenu = document.getElementById("navMenu");

        var navScrim = document.getElementById("navScrim");

        function setNavOpen(open) {
            if (!nav || !navToggle) return;
            nav.classList.toggle("is-open", open);
            document.body.classList.toggle("menu-open", open);
            navToggle.setAttribute("aria-expanded", open ? "true" : "false");
            navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
            document.body.style.overflow = open ? "hidden" : "";
            if (navScrim) {
                if (open) {
                    navScrim.removeAttribute("hidden");
                    navScrim.setAttribute("aria-hidden", "false");
                } else {
                    navScrim.setAttribute("hidden", "");
                    navScrim.setAttribute("aria-hidden", "true");
                }
            }
        }

        if (navToggle && nav) {
            navToggle.addEventListener("click", function () {
                setNavOpen(!nav.classList.contains("is-open"));
            });
        }

        if (navScrim) {
            navScrim.addEventListener("click", function () {
                setNavOpen(false);
            });
        }

        if (navMenu) {
            navMenu.querySelectorAll("a").forEach(function (link) {
                link.addEventListener("click", function () {
                    setNavOpen(false);
                });
            });
        }

        window.addEventListener("resize", function () {
            if (window.innerWidth > 840 && nav) {
                setNavOpen(false);
            }
        });

        /* Voice intro */
        var voiceAudio = document.getElementById("myVoice");
        var playBtn = document.getElementById("playAudioBtn");
        var audioIcon = document.getElementById("audioIcon");
        var audioText = document.getElementById("audioText");

        function setPlayingUI(playing) {
            if (!audioIcon || !audioText || !playBtn) return;
            if (playing) {
                audioIcon.classList.remove("fa-play");
                audioIcon.classList.add("fa-pause");
                audioText.textContent = "Playing…";
                playBtn.classList.add("playing");
                playBtn.setAttribute("aria-pressed", "true");
            } else {
                audioIcon.classList.remove("fa-pause");
                audioIcon.classList.add("fa-play");
                audioText.textContent = "Listen to my voice";
                playBtn.classList.remove("playing");
                playBtn.setAttribute("aria-pressed", "false");
            }
        }

        if (playBtn && voiceAudio && audioIcon && audioText) {
            playBtn.addEventListener("click", function () {
                if (voiceAudio.paused) {
                    var p = voiceAudio.play();
                    if (p && typeof p.catch === "function") {
                        p.catch(function () {});
                    }
                    setPlayingUI(true);
                } else {
                    voiceAudio.pause();
                    setPlayingUI(false);
                }
            });

            voiceAudio.addEventListener("ended", function () {
                setPlayingUI(false);
            });

        }

        /* Testimonials: duplicate row for seamless CSS marquee */
        var testimonialTrack = document.getElementById("testimonialTrack");
        if (
            testimonialTrack &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            testimonialTrack.innerHTML += testimonialTrack.innerHTML;
        }

        /* Image modal */
        var modal = document.getElementById("projectModal");
        var modalImg = document.getElementById("imgFull");
        var modalCaption = document.getElementById("modalCaption");
        var closeModalBtn = modal ? modal.querySelector(".close-modal") : null;

        function openModal(src, caption) {
            if (!modal || !modalImg) return;
            modalImg.src = src;
            modalImg.alt = caption || "Project screenshot";
            if (modalCaption) {
                modalCaption.textContent = caption || "Workflow screenshot";
            }
            modal.classList.add("is-open");
            modal.removeAttribute("hidden");
            document.body.classList.add("no-scroll");
        }

        function closeModal() {
            if (!modal) return;
            modal.classList.remove("is-open");
            modal.setAttribute("hidden", "");
            document.body.classList.remove("no-scroll");
            if (modalImg) {
                modalImg.removeAttribute("src");
            }
        }

        document.querySelectorAll("a.view-image").forEach(function (anchor) {
            anchor.addEventListener("click", function (e) {
                if (!modal || !modalImg) return;
                e.preventDefault();
                var href = anchor.getAttribute("href");
                if (!href) return;
                openModal(href, anchor.getAttribute("data-caption") || "Workflow screenshot");
            });
        });

        if (closeModalBtn) {
            closeModalBtn.addEventListener("click", closeModal);
        }

        if (modal) {
            modal.addEventListener("click", function (e) {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }

        document.addEventListener("keydown", function (e) {
            if (e.key !== "Escape") return;
            if (modal && modal.classList.contains("is-open")) {
                closeModal();
                return;
            }
            if (nav && nav.classList.contains("is-open")) {
                setNavOpen(false);
            }
        });

        /* Legacy back-to-top if present */
        var backToTop = document.getElementById("backToTop");
        if (backToTop) {
            backToTop.addEventListener("click", function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
            });
        }
    });
})();
