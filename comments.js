// Dual-mode Comments System (Local Storage Fallback & Giscus Production)

// Giscus configuration. Set enabled: true and fill in your details once deployed to GitHub!
const GISCUS_CONFIG = {
    enabled: true, 
    repo: "Linsir143/Linsir143.github.io",
    repoId: "R_kgDOS3zhQQ",
    category: "Announcements",
    categoryId: "DIC_kwDOS3zhQc4C-93W",
    mapping: "pathname",
    strict: "0",
    reactionsEnabled: "1",
    emitMetadata: "0",
    inputPosition: "top",
    lang: "zh-CN"
};

// Local storage comments helper
const LocalComments = {
    getComments(postId) {
        const key = `comments_${postId}`;
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (e) {
            return [];
        }
    },

    saveComment(postId, comment) {
        const key = `comments_${postId}`;
        const comments = this.getComments(postId);
        comments.push(comment);
        localStorage.setItem(key, JSON.stringify(comments));
    },

    deleteComment(postId, index) {
        const key = `comments_${postId}`;
        const comments = this.getComments(postId);
        comments.splice(index, 1);
        localStorage.setItem(key, JSON.stringify(comments));
    },

    getAvatarLetter(name) {
        return name ? name.trim().charAt(0).toUpperCase() : '匿';
    },

    formatDate(dateStr) {
        const d = new Date(dateStr);
        return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    }
};

// Initialize comment section for a post
function initCommentsSection(containerId, postId, currentTheme) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ""; // Clear loader

    if (GISCUS_CONFIG.enabled) {
        // Render Giscus comment system
        renderGiscus(container, postId, currentTheme);
    } else {
        // Render Local Storage fallback comment system
        renderLocalComments(container, postId);
    }
}

// Render Giscus comments
function renderGiscus(container, postId, theme) {
    const giscusWrapper = document.createElement("div");
    giscusWrapper.className = "giscus";
    container.appendChild(giscusWrapper);

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", GISCUS_CONFIG.repo);
    script.setAttribute("data-repo-id", GISCUS_CONFIG.repoId);
    script.setAttribute("data-category", GISCUS_CONFIG.category);
    script.setAttribute("data-category-id", GISCUS_CONFIG.categoryId);
    script.setAttribute("data-mapping", GISCUS_CONFIG.mapping);
    script.setAttribute("data-strict", GISCUS_CONFIG.strict);
    script.setAttribute("data-reactions-enabled", GISCUS_CONFIG.reactionsEnabled);
    script.setAttribute("data-emit-metadata", GISCUS_CONFIG.emitMetadata);
    script.setAttribute("data-input-position", GISCUS_CONFIG.inputPosition);
    script.setAttribute("data-theme", theme === "dark" ? "transparent_dark" : "light");
    script.setAttribute("data-lang", GISCUS_CONFIG.lang);
    script.setAttribute("crossorigin", "anonymous");
    script.async = true;

    container.appendChild(script);
}

// Render local comments
function renderLocalComments(container, postId) {
    // 1. Comments Title
    const title = document.createElement("h3");
    title.className = "comments-title";
    title.innerHTML = `<i class="fa-solid fa-comments"></i> 评论区`;
    container.appendChild(title);

    // 2. Comments List Container
    const listContainer = document.createElement("div");
    listContainer.className = "comments-list";
    container.appendChild(listContainer);

    // Render list
    const updateList = () => {
        const comments = LocalComments.getComments(postId);
        if (comments.length === 0) {
            listContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem 0; font-size: 0.95rem;">暂无评论，快来发表你的见解吧！</div>`;
            return;
        }

        listContainer.innerHTML = comments.map((c, index) => `
            <div class="comment-card" style="position: relative; display: flex; gap: 1rem; margin-bottom: 1rem; align-items: flex-start;">
                <div class="comment-avatar">${LocalComments.getAvatarLetter(c.author)}</div>
                <div class="comment-content" style="flex-grow: 1;">
                    <div class="comment-header" style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span class="comment-author" style="font-weight: 600; font-size: 0.95rem; color: var(--text-color);">${escapeHtml(c.author)}</span>
                            <span class="comment-date" style="font-size: 0.8rem; color: var(--text-muted); margin-left: 0.5rem;">${LocalComments.formatDate(c.date)}</span>
                        </div>
                        <button class="comment-delete-btn" data-index="${index}" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.3rem;" title="删除评论">
                            <i class="fa-solid fa-trash"></i> 删除
                        </button>
                    </div>
                    <div class="comment-body" style="margin-top: 0.4rem; font-size: 0.95rem; line-height: 1.5; color: var(--text-color);">${escapeHtml(c.text).replace(/\n/g, '<br>')}</div>
                </div>
            </div>
        `).join("");

        listContainer.querySelectorAll(".comment-delete-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const index = parseInt(btn.getAttribute("data-index"));
                if (confirm("确认删除这条评论吗？")) {
                    LocalComments.deleteComment(postId, index);
                    updateList();
                    if (typeof window.updateMomentsPageCommentsCount === "function") {
                        window.updateMomentsPageCommentsCount(postId);
                    }
                }
            });
        });
    };

    updateList();

    // 3. Comment Form
    const form = document.createElement("form");
    form.className = "comment-form";
    form.innerHTML = `
        <div style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.2rem;"><i class="fa-solid fa-pen-to-square"></i> 发表评论</div>
        <div class="comment-inputs">
            <input type="text" id="comment-nickname" class="comment-input" placeholder="您的昵称 *" required autocomplete="off">
            <input type="email" id="comment-email" class="comment-input" placeholder="电子邮箱 (可选，仅用于展示或联系)" autocomplete="off">
        </div>
        <textarea id="comment-message" class="comment-textarea" placeholder="写下您的评论... *" required></textarea>
        <button type="submit" class="btn btn-primary" style="align-self: flex-start; padding: 0.6rem 1.5rem;"><i class="fa-solid fa-paper-plane"></i> 提交评论</button>
    `;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const authorInput = document.getElementById("comment-nickname");
        const messageInput = document.getElementById("comment-message");
        
        const author = authorInput.value.trim();
        const text = messageInput.value.trim();

        if (author && text) {
            const newComment = {
                author: author,
                text: text,
                date: new Date().toISOString()
            };
            LocalComments.saveComment(postId, newComment);
            messageInput.value = "";
            updateList();
            if (typeof window.updateMomentsPageCommentsCount === "function") {
                window.updateMomentsPageCommentsCount(postId);
            }
        }
    });

    container.appendChild(form);
}

// Utility function to escape HTML to prevent XSS
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
