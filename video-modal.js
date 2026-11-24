(function () {
    "use strict";

    const trigger = document.getElementById("hero-play");
    const modal = document.getElementById("video-modal");
    if (!trigger || !modal) return;

    const player = document.getElementById("video-modal-player");
    const closeBtn = modal.querySelector(".video-modal__close");
    let lastFocused = null;

    function openModal() {
        lastFocused = document.activeElement;
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        const p = player.play();
        if (p && typeof p.catch === "function") p.catch(function () {});
        if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
        if (modal.hidden) return;
        player.pause();
        modal.hidden = true;
        document.body.style.overflow = "";
        if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    }

    trigger.addEventListener("click", openModal);
    modal.querySelectorAll("[data-video-close]").forEach(function (el) {
        el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeModal();
    });
})();
