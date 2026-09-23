/* Rhodo marketing site. No dependencies. Set contactEmail to enable mail drafts. */
(() => {
  "use strict";
  const config = { contactEmail: "" };
  const header = document.querySelector(".site-header");
  const updateHeader = () =>
    header?.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
  const menuButton = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#mobile-menu");
  function closeMenu() {
    if (!menuButton) return;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
    menu.hidden = true;
  }
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menu.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  menu
    ?.querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("click", (e) => {
    if (menu && !menu.hidden && !header.contains(e.target)) closeMenu();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia("(min-width: 801px)").addEventListener("change", (e) => {
    if (e.matches) closeMenu();
  });

  const tabs = [...document.querySelectorAll("[data-product]")];
  function selectTab(tab, focus = false) {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden =
        !selected;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (e) => {
      let next = i;
      if (e.key === "ArrowRight" || e.key === "ArrowDown")
        next = (i + 1) % tabs.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
        next = (i + tabs.length - 1) % tabs.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tabs.length - 1;
      else return;
      e.preventDefault();
      selectTab(tabs[next], true);
    });
  });

  const teaser = document.querySelector("#teaser-video");
  const teaserStage = document.querySelector("[data-teaser]");
  if (teaser && teaserStage) {
    const stagePlay = teaserStage.querySelector(".trailer-play");
    // Native controls stay in the markup as a no-JS fallback.
    teaser.controls = false;
    let failed = false;
    const resetTeaser = () => {
      const hadFocus = teaserStage.contains(document.activeElement);
      teaserStage.classList.remove("is-playing");
      teaser.controls = false;
      if (stagePlay) {
        stagePlay.hidden = false;
        if (hadFocus) stagePlay.focus();
      }
    };
    const playTeaser = (fromButton) => {
      if (failed) return;
      teaserStage.classList.add("is-playing");
      teaser.controls = true;
      if (stagePlay) stagePlay.hidden = true;
      if (fromButton) teaser.focus({ preventScroll: true });
      teaser.play().catch(() => {});
    };
    const showFailure = () => {
      if (failed) return;
      failed = true;
      resetTeaser();
      const note = document.createElement("p");
      note.className = "trailer-error";
      note.setAttribute("role", "status");
      note.innerHTML =
        'The trailer couldn’t load. <a href="demo-transcript.html">Read the product tour transcript</a>.';
      teaserStage.after(note);
    };
    // Skipped phone sources also fire "error"; only the last one means none loaded.
    [...teaser.querySelectorAll("source")]
      .pop()
      ?.addEventListener("error", showFailure);
    document.querySelectorAll("[data-play-teaser]").forEach((button) =>
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        closeMenu();
        if (!teaserStage.contains(button))
          teaserStage.scrollIntoView({
            behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "auto"
              : "smooth",
            block: "center",
          });
        playTeaser(true);
      }),
    );
    teaserStage.addEventListener("click", () => {
      if (!teaserStage.classList.contains("is-playing")) playTeaser(false);
    });
    teaser.addEventListener("ended", () => {
      resetTeaser();
      teaser.load();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) teaser.pause();
    });
    new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) teaser.pause();
    }).observe(teaser);
  }

  const aiVideo = document.querySelector("#ai-dashboard-video");
  if (aiVideo) {
    const first = document.querySelector("[data-ai-clip][aria-pressed='true']");
    if (first?.dataset.srcSmall && matchMedia("(max-width: 800px), (max-height: 500px)").matches)
      aiVideo.src = first.dataset.srcSmall;
    const choices = [...document.querySelectorAll("[data-ai-clip]")];
    const caption = document.querySelector("#ai-dashboard-caption");
    const narration = document.querySelector("[data-ai-narration]");
    choices.forEach((button) =>
      button.addEventListener("click", () => {
        choices.forEach((choice) =>
          choice.setAttribute("aria-pressed", String(choice === button)),
        );
        aiVideo.pause();
        const small = matchMedia("(max-width: 800px), (max-height: 500px)").matches;
        aiVideo.src =
          (small && button.dataset.srcSmall) || button.dataset.src;
        aiVideo.poster = button.dataset.poster;
        const oldTrack = aiVideo.querySelector("track");
        const mode = aiVideo.textTracks[0]?.mode || "disabled";
        // Hide the old captions first, or their last cue can stay on screen.
        if (aiVideo.textTracks[0]) aiVideo.textTracks[0].mode = "disabled";
        oldTrack?.remove();
        const track = document.createElement("track");
        Object.assign(track, {
          kind: "captions",
          srclang: "en",
          label: "English",
          src: button.dataset.captions,
        });
        aiVideo.append(track);
        if (aiVideo.textTracks[0]) aiVideo.textTracks[0].mode = mode;
        aiVideo.setAttribute("aria-label", button.dataset.title);
        caption.textContent = button.dataset.caption.replace(
          / (\S+)$/,
          "\u00a0$1",
        );
        narration.dataset.start = button.dataset.narration;
        aiVideo.load();
        teaser?.pause();
        aiVideo.scrollIntoView({ block: "nearest", behavior: "instant" });
        aiVideo.play().catch(() => {});
      }),
    );
    narration.addEventListener("click", () => aiVideo.pause());
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) aiVideo.pause();
    });
    new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) aiVideo.pause();
    }).observe(aiVideo);
  }

  const dialog = document.querySelector("#trailer-dialog");
  const video = document.querySelector("#full-video");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let lastFocus = null;
  if (dialog) {
    let pendingStart = null;
    let startRequest = 0;
    const chapterButtons = [...dialog.querySelectorAll("[data-time]")];
    const featurePosition = dialog.querySelector("#feature-position");
    const featureTitle = dialog.querySelector("#feature-title");
    const previousFeature = dialog.querySelector("[data-feature-previous]");
    const nextFeature = dialog.querySelector("[data-feature-next]");
    let activeChapter = -1;
    function updateFeature(time) {
      let index = 0;
      chapterButtons.forEach((button, i) => {
        if (time >= Number(button.dataset.time)) index = i;
      });
      if (index === activeChapter || !chapterButtons.length) return;
      activeChapter = index;
      chapterButtons.forEach((button, i) => {
        if (i === index) button.setAttribute("aria-current", "true");
        else button.removeAttribute("aria-current");
      });
      const title = chapterButtons[index].textContent
        .trim()
        .replace(/^\d+:\d+\s+/, "");
      if (featurePosition)
        featurePosition.textContent = `Chapter ${index + 1} of ${chapterButtons.length}`;
      if (featureTitle) featureTitle.textContent = title;
      const atStart = index === 0;
      const atEnd = index === chapterButtons.length - 1;
      if (atStart && document.activeElement === previousFeature)
        nextFeature?.focus();
      if (atEnd && document.activeElement === nextFeature)
        previousFeature?.focus();
      if (previousFeature) previousFeature.disabled = atStart;
      if (nextFeature) nextFeature.disabled = atEnd;
    }
    function cancelPendingStart() {
      startRequest += 1;
      if (pendingStart)
        video.removeEventListener("loadedmetadata", pendingStart);
      pendingStart = null;
    }
    function playVideo() {
      video.play().catch(() => {
        /* Native controls remain available if autoplay is blocked. */
      });
    }
    function startVideo(time, scrollBehavior) {
      cancelPendingStart();
      if (!dialog.open) return;
      updateFeature(time);
      const request = startRequest;
      const begin = () => {
        if (!dialog.open || request !== startRequest) return;
        pendingStart = null;
        video.currentTime = time;
        dialog.scrollTo({ top: 0, behavior: scrollBehavior });
        playVideo();
      };
      if (video.readyState >= 1) begin();
      else {
        pendingStart = begin;
        video.addEventListener("loadedmetadata", begin, { once: true });
        // Start loading in the click gesture; seek once metadata is available.
        playVideo();
      }
    }
    function closeTrailer() {
      cancelPendingStart();
      video.pause();
      dialog.close();
    }
    document.querySelectorAll("[data-trailer]").forEach((button) =>
      button.addEventListener("click", () => {
        lastFocus = button;
        aiVideo?.pause();
        teaser?.pause();
        dialog.showModal();
        document.body.classList.add("modal-open");
        startVideo(Number(button.dataset.start || 0), "instant");
      }),
    );
    dialog
      .querySelector(".dialog-close")
      .addEventListener("click", closeTrailer);
    dialog.addEventListener("click", (e) => {
      const r = dialog.getBoundingClientRect();
      if (
        e.target === dialog &&
        (e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom)
      )
        closeTrailer();
    });
    dialog.addEventListener("close", () => {
      cancelPendingStart();
      video.pause();
      document.body.classList.remove("modal-open");
      lastFocus?.focus();
    });
    chapterButtons.forEach((button) =>
      button.addEventListener("click", () => {
        startVideo(
          Number(button.dataset.time),
          reducedMotion.matches ? "auto" : "smooth",
        );
      }),
    );
    function moveFeature(direction) {
      const button = chapterButtons[activeChapter + direction];
      if (button)
        startVideo(
          Number(button.dataset.time),
          reducedMotion.matches ? "auto" : "smooth",
        );
    }
    previousFeature?.addEventListener("click", () => moveFeature(-1));
    nextFeature?.addEventListener("click", () => moveFeature(1));
    const syncFeature = () => {
      if (!pendingStart) updateFeature(video.currentTime);
    };
    video.addEventListener("timeupdate", syncFeature);
    video.addEventListener("seeking", syncFeature);
    updateFeature(0);
  }

  // Only one narrated video plays at a time.
  const narrated = [teaser, aiVideo, video].filter(Boolean);
  narrated.forEach((v) =>
    v.addEventListener("play", () =>
      narrated.forEach((other) => {
        if (other !== v) other.pause();
      }),
    ),
  );

  const form = document.querySelector("#callform");
  if (form) {
    const result = document.querySelector("#form-result");
    const request = document.querySelector("#request-text");
    const validEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.contactEmail) &&
      !config.contactEmail.endsWith(".example");
    if (validEmail)
      document.querySelector("#delivery-note").textContent =
        "We’ll prepare an email in your mail app. Review it and send when you’re ready.";
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = new FormData(form);
      const text = `Rhodo walkthrough request\n\nName: ${d.get("name")}\nEmail: ${d.get("email")}\nFirm: ${d.get("firm")}\nTeam size: ${d.get("team_size") || "Not specified"}\nDiscipline: ${d.get("discipline") || "Not specified"}\n\nCurrent challenge:\n${d.get("workflow")}`;
      request.value = text;
      result.hidden = false;
      // Show the whole request without an inner scroll (up to a point).
      request.style.height = "auto";
      request.style.height = `${Math.min(request.scrollHeight + 2, 480)}px`;
      document
        .querySelector("#form-result-title")
        ?.focus({ preventScroll: true });
      if (validEmail) {
        const a = document.createElement("a");
        a.href = `mailto:${config.contactEmail}?subject=${encodeURIComponent("Rhodo walkthrough: " + d.get("firm"))}&body=${encodeURIComponent(text)}`;
        a.click();
        document.querySelector("#result-message").textContent =
          "Your mail app should open with a draft. Review and send it there. If it does not open, copy or save the request below.";
      }
      result.scrollIntoView({
        behavior: reducedMotion.matches ? "auto" : "smooth",
        block: "nearest",
      });
    });
    const copy = document.querySelector("#copy-request");
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(request.value);
        copy.textContent = "Copied";
        const status = document.querySelector("#form-status");
        if (status) status.textContent = "Request copied to the clipboard.";
        setTimeout(() => {
          copy.textContent = "Copy request";
          if (status) status.textContent = "";
        }, 2500);
      } catch {
        request.focus();
        request.select();
        copy.textContent = "Text selected";
        const status = document.querySelector("#form-status");
        if (status)
          status.textContent =
            "The request text is selected. Copy it with your device’s copy command.";
        setTimeout(() => (copy.textContent = "Copy request"), 4000);
      }
    });
    document.querySelector("#save-request").addEventListener("click", () => {
      const url = URL.createObjectURL(
        new Blob([request.value], { type: "text/plain;charset=utf-8" }),
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "rhodo-walkthrough-request.txt";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }
})();
