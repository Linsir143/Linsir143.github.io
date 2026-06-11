// Γ's Mathematics Blog SPA App Logic

// Global state
let blogPosts = [];
let activeFilters = {
    search: '',
    category: '',
    subcategory: ''
};
let localMoments = [];

function preprocessMarkdown(markdownText) {
    if (!markdownText) return '';
    // Process Cherry Markdown color syntax: !!#ff3333 猜测：!! -> <span style="color: #ff3333">猜测：</span>
    return markdownText.replace(/!!#([0-9a-fA-F]{6})\s*([\s\S]*?)!!/g, (match, color, content) => {
        return `<span style="color: #${color}">${content}</span>`;
    });
}

// Custom Markdown + KaTeX parser (prevents markdown parsers from mangling equations)
function parseMarkdownWithMath(markdownText) {
    let preprocessed = preprocessMarkdown(markdownText);
    
    const codeBlocks = [];
    const inlineCodes = [];
    const mathBlocks = [];
    const mathInlines = [];

    // 1. Temporarily extract fenced code blocks (``` ... ```)
    let parsedText = preprocessed.replace(/```([\s\S]*?)```/g, (match) => {
        codeBlocks.push(match);
        return `@@CODE_BLOCK_${codeBlocks.length - 1}@@`;
    });

    // 2. Temporarily extract inline code (` ... `)
    parsedText = parsedText.replace(/`([^`]+)`/g, (match) => {
        inlineCodes.push(match);
        return `@@INLINE_CODE_${inlineCodes.length - 1}@@`;
    });

    // 3. Extract block math $$ ... $$ from the remaining text
    parsedText = parsedText.replace(/\$\$([\s\S]*?)\$\$/g, (match, equation) => {
        mathBlocks.push(equation.trim());
        return `@@MATH_BLOCK_${mathBlocks.length - 1}@@`;
    });

    // 4. Extract inline math $ ... $ from the remaining text (ignoring escaped \$)
    parsedText = parsedText.replace(/(?<!\\)\$((?:\\\$|[^\$])+?)(?<!\\)\$/g, (match, equation) => {
        mathInlines.push(equation.trim());
        return `@@MATH_INLINE_${mathInlines.length - 1}@@`;
    });

    // 5. Pre-parse <details> tags and markdown inside them since marked ignores them
    // Stop matching if an explicit </details> is found, or if another <details> starts, or if a major Markdown header (e.g. \n# or \n##) is encountered.
    parsedText = parsedText.replace(/<details>([\s\S]*?)(?:<\/details>|(?=\n#{1,6}\s)|(?=<details>)|$)/gi, (match, inner) => {
        let summaryMatch = inner.match(/<summary>([\s\S]*?)<\/summary>/);
        let summaryHtml = '';
        let restOfContent = inner;
        if (summaryMatch) {
            let summaryInner = summaryMatch[1];
            let summaryParsed = summaryInner
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code>$1</code>');
            summaryHtml = `<summary>${summaryParsed}</summary>`;
            restOfContent = inner.replace(summaryMatch[0], '');
        }
        
        let bodyHtml = marked.parse(restOfContent);
        return `<details>${summaryHtml}${bodyHtml}</details>`;
    });

    // 6. Restore code blocks and inline codes before markdown parsing so marked can parse them
    parsedText = parsedText.replace(/@@CODE_BLOCK_(\d+)@@/g, (match, index) => {
        return codeBlocks[parseInt(index)];
    });
    parsedText = parsedText.replace(/@@INLINE_CODE_(\d+)@@/g, (match, index) => {
        return inlineCodes[parseInt(index)];
    });

    // 7. Compile Markdown using marked
    let htmlContent = marked.parse(parsedText);

    // 8. Restore block math and render with KaTeX
    htmlContent = htmlContent.replace(/@@MATH_BLOCK_(\d+)@@/g, (match, index) => {
        const equation = mathBlocks[parseInt(index)];
        try {
            return `<div class="math-block">${katex.renderToString(equation, { displayMode: true, throwOnError: false })}</div>`;
        } catch (e) {
            console.error("KaTeX block render error:", e);
            return `<div class="math-block error">${escapeHtml(equation)}</div>`;
        }
    });

    // 9. Restore inline math and render with KaTeX
    htmlContent = htmlContent.replace(/@@MATH_INLINE_(\d+)@@/g, (match, index) => {
        const equation = mathInlines[parseInt(index)];
        try {
            return `<span class="math-inline">${katex.renderToString(equation, { displayMode: false, throwOnError: false })}</span>`;
        } catch (e) {
            console.error("KaTeX inline render error:", e);
            return `<span class="math-inline error">${escapeHtml(equation)}</span>`;
        }
    });

    return htmlContent;
}

// Helpers
// Post-process code blocks for syntax highlighting and copy buttons
function postProcessCodeBlocks() {
    // 1. Highlight all code blocks inside <pre><code> if hljs is available
    if (typeof hljs !== 'undefined') {
        // Register custom math/Wolfram language highlighter if not exists
        if (!hljs.getLanguage('math')) {
            hljs.registerLanguage('math', function(hljs) {
                return {
                    name: 'Math',
                    aliases: ['mathematica', 'wl', 'mma', 'math'],
                    contains: [
                        {
                            className: 'comment',
                            begin: '\\(\\*',
                            end: '\\*\\)'
                        },
                        {
                            className: 'number',
                            begin: '\\b\\d+(\\.\\d+)?\\b',
                            relevance: 0
                        },
                        {
                            className: 'keyword',
                            begin: '\\b(Sin|Cos|Tan|Log|Exp|Sqrt|Plot|Sum|Product|Integrate|Limit|D|Solve|Reduce|Simplify|FullSimplify|Expand|Factor)\\b',
                            relevance: 5
                        },
                        {
                            className: 'variable',
                            begin: '\\b[a-zA-Z]\\b',
                            relevance: 0
                        },
                        {
                            className: 'operator',
                            begin: '[+\\-*/^=<>!&|]',
                            relevance: 0
                        },
                        {
                            className: 'punctuation',
                            begin: '[(){}\\[\\]]',
                            relevance: 0
                        }
                    ]
                };
            });
        }

        document.querySelectorAll('pre code').forEach((block) => {
            if (!block.dataset.highlighted) {
                // If a code block has no specific language class, or is plaintext, default to 'math'
                let hasLanguage = false;
                block.classList.forEach((cls) => {
                    if (cls.startsWith('language-') && cls !== 'language-plaintext') {
                        hasLanguage = true;
                    }
                });

                if (!hasLanguage) {
                    block.classList.remove('language-plaintext');
                    block.classList.add('language-math');
                }

                hljs.highlightElement(block);
                block.dataset.highlighted = 'true';
            }
        });
    } else {
        console.warn("Highlight.js (hljs) is not loaded; skipping syntax highlighting.");
    }

    // 2. Add copy buttons to all <pre> elements (independent of hljs!)
    document.querySelectorAll('pre').forEach((pre) => {
        if (pre.querySelector('.code-copy-btn')) return;

        const btn = document.createElement('button');
        btn.className = 'code-copy-btn';
        btn.setAttribute('aria-label', '复制代码');
        btn.innerHTML = '<i class="fa-regular fa-copy"></i> 复制';

        btn.addEventListener('click', async () => {
            const codeEl = pre.querySelector('code');
            const textToCopy = codeEl ? codeEl.textContent : pre.textContent;
            try {
                await navigator.clipboard.writeText(textToCopy);
                btn.innerHTML = '<i class="fa-solid fa-check"></i> 已复制';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.innerHTML = '<i class="fa-regular fa-copy"></i> 复制';
                    btn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });

        pre.appendChild(btn);
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderTextWithMath(text) {
    if (!text) return '';
    // Replace inline math $ ... $ with KaTeX
    return text.replace(/(?<!\\)\$((?:\\\$|[^\$])+?)(?<!\\)\$/g, (match, equation) => {
        try {
            return katex.renderToString(equation.trim(), { displayMode: false, throwOnError: false });
        } catch (e) {
            console.error("Title KaTeX render error:", e);
            return match;
        }
    });
}

function getTheme() {
    return document.body.classList.contains("light-mode") ? "light" : "dark";
}

// Theme Switching Logic
function initTheme() {
    const savedTheme = localStorage.getItem("theme") || "dark";
    if (savedTheme === "light") {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
    } else {
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-mode");
    }

    const toggleBtn = document.getElementById("theme-toggle");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const isLight = document.body.classList.contains("light-mode");
            if (isLight) {
                document.body.classList.remove("light-mode");
                document.body.classList.add("dark-mode");
                localStorage.setItem("theme", "dark");
            } else {
                document.body.classList.remove("dark-mode");
                document.body.classList.add("light-mode");
                localStorage.setItem("theme", "light");
            }
            updateGiscusTheme();
        });
    }
}

function updateGiscusTheme() {
    const theme = getTheme();
    const giscusFrame = document.querySelector('iframe.giscus-frame');
    if (giscusFrame) {
        const giscusTheme = theme === "dark" ? "transparent_dark" : "light";
        giscusFrame.contentWindow.postMessage(
            { giscus: { setConfig: { theme: giscusTheme } } },
            'https://giscus.app'
        );
    }
}

// Router Logic
const routes = {
    "": renderHome,
    "articles": renderArticlesList,
    "moments": renderMoments,
    "article": renderArticleDetail,
    "about": renderAbout
};

async function handleRouting() {
    const hash = window.location.hash.slice(1) || "/";
    const pathParts = hash.split("/").filter(Boolean);
    const primaryRoute = pathParts[0] || "";
    
    // Update active nav link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        const routeAttr = link.getAttribute("data-route");
        if (routeAttr === primaryRoute) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    // Close mobile menu if open
    const navMenu = document.getElementById("nav-menu");
    if (navMenu && navMenu.classList.contains("active")) {
        navMenu.classList.remove("active");
    }

    // Call page renderer
    const renderer = routes[primaryRoute];
    if (renderer) {
        await renderer(pathParts.slice(1));
    } else {
        document.getElementById("app").innerHTML = `
            <div style="text-align: center; padding: 5rem 0;">
                <h1 style="font-family: var(--font-heading); font-size: 3rem; margin-bottom: 1rem;">404</h1>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">您寻找的页面走丢了...</p>
                <a href="#/" class="btn btn-primary"><i class="fa-solid fa-house"></i> 返回首页</a>
            </div>
        `;
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
}

// Fetch posts list
async function loadPosts() {
    if (blogPosts.length > 0) return blogPosts;
    
    const app = document.getElementById("app");
    try {
        const response = await fetch("posts.json");
        if (!response.ok) throw new Error("加载文章列表失败");
        blogPosts = await response.json();
        // Sort by date descending
        blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
        return blogPosts;
    } catch (e) {
        console.error("Error loading posts:", e);
        app.innerHTML = `
            <div style="text-align: center; padding: 5rem 0; color: #ef4444;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; margin-bottom: 1.5rem;"></i>
                <p style="font-size: 1.15rem; font-weight: 600;">获取文章数据失败，请检查文件是否存在。</p>
            </div>
        `;
        return [];
    }
}

// Page Renderers

// 1. Home Page
async function renderHome() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="page-loader">
            <div class="spinner"></div>
            <p>加载中，感受数学的奥秘...</p>
        </div>
    `;
    
    const posts = await loadPosts();
    if (posts.length === 0) return;

    // Filter recent 3 posts
    const recentPosts = posts.slice(0, 3);
    
    app.innerHTML = `
        <!-- Hero Section -->
        <section class="hero-section">
            <div class="hero-text">
                <h1 class="hero-title" style="font-size: 2.8rem; margin-bottom: 1rem;">Γ 的个人网站</h1>
                <p class="hero-desc">
                    记录一些关于数学的个人见解。
                </p>
                <div class="hero-buttons">
                    <a href="#/articles" class="btn btn-primary"><i class="fa-solid fa-book-open"></i> 浏览内容</a>
                    <a href="#/about" class="btn btn-secondary"><i class="fa-solid fa-user"></i> 关于作者</a>
                </div>
            </div>
            <div class="hero-math-art">
                <div class="math-formula-sphere"></div>
            </div>
        </section>

        <!-- Recent Posts Section -->
        <section class="recent-posts-section">
            <h2 class="section-title"><i class="fa-solid fa-clock"></i> 最近更新</h2>
            <div class="posts-grid">
                ${recentPosts.map(p => `
                    <a href="#/article/${p.id}" class="post-card">
                        <div class="post-meta">
                            <span><i class="fa-solid fa-calendar-days"></i> ${p.date}</span>
                            <span><i class="fa-solid fa-folder"></i> ${p.category}</span>
                        </div>
                        <h3 class="post-title">${renderTextWithMath(escapeHtml(p.title))}</h3>
                        <p class="post-desc">${escapeHtml(p.summary)}</p>
                        <div class="post-tags">
                            ${p.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
                        </div>
                    </a>
                `).join("")}
            </div>
            <div style="text-align: center; margin-top: 2rem;">
                <a href="#/articles" class="btn btn-secondary"><i class="fa-solid fa-angles-right"></i> 查看全部文章</a>
            </div>
        </section>
    `;
}

// 2. Articles List Page
async function renderArticlesList() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="page-loader">
            <div class="spinner"></div>
            <p>加载中，获取内容列表...</p>
        </div>
    `;

    const posts = await loadPosts();
    if (posts.length === 0) return;

    const categories = [...new Set(posts.map(p => p.category))].filter(Boolean);

    app.innerHTML = `
        <h2 class="section-title" style="margin-bottom: 1rem;"><i class="fa-solid fa-book-open"></i> 内容列表</h2>
        
        <!-- Category Tabs -->
        <div class="category-tabs" id="category-tabs" style="margin-bottom: 2rem;">
            <span class="category-tab active" data-category="">全部</span>
            ${categories.map(cat => `
                <span class="category-tab" data-category="${escapeHtml(cat)}">${escapeHtml(cat)}</span>
            `).join("")}
        </div>

        <div class="content-layout">
            <!-- Subcategory Sidebar -->
            <div class="subcategory-sidebar" id="subcategory-sidebar" style="display: none;">
                <!-- Rendered dynamically -->
            </div>
            
            <div class="articles-main">
                <!-- Search Box -->
                <div class="search-box" style="margin-bottom: 1.5rem;">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="search-input" class="search-input" placeholder="搜索标题、内容或标签..." value="${activeFilters.search}">
                </div>

                <!-- Posts Grid -->
                <div class="posts-grid" id="filtered-posts-grid">
                    <!-- Filtered posts rendered dynamically -->
                </div>
            </div>
        </div>
    `;

    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", (e) => {
        activeFilters.search = e.target.value.toLowerCase();
        updateFilteredPosts(posts);
    });

    const categoryTabs = document.getElementById("category-tabs");
    categoryTabs.querySelectorAll(".category-tab").forEach(tab => {
        tab.addEventListener("click", () => {
            categoryTabs.querySelector(".category-tab.active").classList.remove("active");
            tab.classList.add("active");
            
            activeFilters.category = tab.getAttribute("data-category");
            activeFilters.subcategory = ''; // Reset subcategory
            
            // Re-render list and subcategory sidebar
            updateFilteredPosts(posts, true);
        });
    });

    // Initial render
    updateFilteredPosts(posts, true);
}

// Filter and render posts grid
function updateFilteredPosts(posts, rebuildSubcategories = false) {
    const grid = document.getElementById("filtered-posts-grid");
    if (!grid) return;

    // Filter posts
    const filtered = posts.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(activeFilters.search) || 
                              p.summary.toLowerCase().includes(activeFilters.search) ||
                              p.tags.some(t => t.toLowerCase().includes(activeFilters.search));
        
        const matchesCategory = activeFilters.category === '' || p.category === activeFilters.category;
        const matchesSub = activeFilters.subcategory === '' || p.subcategory === activeFilters.subcategory;
        
        return matchesSearch && matchesCategory && matchesSub;
    });

    // Rebuild subcategory sidebar if requested
    if (rebuildSubcategories) {
        const sidebar = document.getElementById("subcategory-sidebar");
        if (sidebar) {
            if (activeFilters.category) {
                // Find all subcategories for this category
                const subcats = [...new Set(posts.filter(p => p.category === activeFilters.category).map(p => p.subcategory))].filter(Boolean);
                
                if (subcats.length > 0) {
                    sidebar.style.display = "flex";
                    sidebar.innerHTML = `
                        <div style="font-weight: 700; font-size: 0.9rem; padding: 0.5rem 1rem; color: var(--text-color); border-bottom: 1px solid var(--border-color); margin-bottom: 0.5rem;">分类目录</div>
                        <span class="subcategory-item ${activeFilters.subcategory === '' ? 'active' : ''}" data-sub="">全部子类</span>
                        ${subcats.map(sub => `
                            <span class="subcategory-item ${activeFilters.subcategory === sub ? 'active' : ''}" data-sub="${escapeHtml(sub)}">${escapeHtml(sub)}</span>
                        `).join("")}
                    `;
                    
                    // Add click listeners to subcategory items
                    sidebar.querySelectorAll(".subcategory-item").forEach(item => {
                        item.addEventListener("click", () => {
                            const activeItem = sidebar.querySelector(".subcategory-item.active");
                            if (activeItem) activeItem.classList.remove("active");
                            item.classList.add("active");
                            
                            activeFilters.subcategory = item.getAttribute("data-sub");
                            updateFilteredPosts(posts, false);
                        });
                    });
                } else {
                    sidebar.style.display = "none";
                }
            } else {
                sidebar.style.display = "none";
            }
        }
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0; color: var(--text-muted);">
                <i class="fa-solid fa-folder-open" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <p>未找到符合条件的内容。</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(p => `
        <a href="#/article/${p.id}" class="post-card">
            <div class="post-meta">
                <span><i class="fa-solid fa-calendar-days"></i> ${p.date}</span>
                <span><i class="fa-solid fa-folder"></i> ${p.category} ${p.subcategory ? `/ ${p.subcategory}` : ''}</span>
            </div>
            <h3 class="post-title">${renderTextWithMath(escapeHtml(p.title))}</h3>
            <p class="post-desc">${escapeHtml(p.summary)}</p>
            <div class="post-tags">
                ${p.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
            </div>
        </a>
    `).join("");
}

// 3. Article Detail Page
async function renderArticleDetail(params) {
    const postId = params[0];
    const app = document.getElementById("app");
    
    app.innerHTML = `
        <div class="page-loader">
            <div class="spinner"></div>
            <p>加载中，正在渲染数学公式...</p>
        </div>
    `;

    const posts = await loadPosts();
    const post = posts.find(p => p.id === postId);

    if (!post) {
        app.innerHTML = `
            <div style="text-align: center; padding: 5rem 0;">
                <h1 style="font-family: var(--font-heading); font-size: 3rem; margin-bottom: 1rem;">文章未找到</h1>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">您寻找的文章不存在或已被移除。</p>
                <a href="#/articles" class="btn btn-primary"><i class="fa-solid fa-book-open"></i> 返回文章列表</a>
            </div>
        `;
        return;
    }

    try {
        // Fetch markdown content
        const response = await fetch(post.filePath);
        if (!response.ok) throw new Error("获取文章内容失败");
        const markdown = await response.text();

        // Custom parser to handle Markdown + KaTeX safely
        const htmlContent = parseMarkdownWithMath(markdown);

        app.innerHTML = `
            <article class="article-container">
                <!-- Header -->
                <div class="article-header">
                    <h1 class="article-title">${renderTextWithMath(escapeHtml(post.title))}</h1>
                    <div class="article-meta">
                        <span><i class="fa-solid fa-calendar-days"></i> 发布于 ${post.date}</span>
                        <span><i class="fa-solid fa-folder"></i> 分类: ${post.category}</span>
                        <span><i class="fa-solid fa-tags"></i> 标签: ${post.tags.map(t => `<span class="tag" style="margin: 0 2px;">${escapeHtml(t)}</span>`).join("")}</span>
                    </div>
                </div>

                <!-- Rendered Markdown + Math Content -->
                <div class="markdown-body">
                    ${htmlContent}
                </div>

                <!-- Comments Section -->
                <div class="comments-section" id="comments-container">
                    <!-- Loaded dynamically via comments.js -->
                </div>
            </article>
        `;

        postProcessCodeBlocks();

        // Initialize Comments (defined in comments.js)
        initCommentsSection("comments-container", postId, getTheme());

    } catch (e) {
        console.error("Error loading article detail:", e);
        app.innerHTML = `
            <div style="text-align: center; padding: 5rem 0; color: #ef4444;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; margin-bottom: 1.5rem;"></i>
                <p style="font-size: 1.15rem; font-weight: 600;">加载文章内容出错。</p>
                <a href="#/articles" class="btn btn-secondary" style="margin-top: 1rem;"><i class="fa-solid fa-book-open"></i> 返回文章列表</a>
            </div>
        `;
    }
}

// 4. About Page
function renderAbout() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="about-container">
            <!-- Profile Column -->
            <div class="about-profile">
                <div class="profile-avatar">Γ</div>
                <h3 class="profile-name">Γ</h3>
                <p class="profile-title">数学爱好者 / 不等式研究者</p>
                <div class="profile-socials">
                    <a href="https://github.com" target="_blank" class="social-link" title="GitHub"><i class="fa-brands fa-github"></i></a>
                    <a href="mailto:contact@example.com" class="social-link" title="邮箱"><i class="fa-solid fa-envelope"></i></a>
                </div>
            </div>

            <!-- Bio Column -->
            <div class="about-bio">
                <h2>关于作者</h2>
                <p>
                    你好！我是 Γ。我是一名狂热的数学爱好者，平时热衷于研究各类代数不等式与高等几何命题。
                </p>
                <p>
                    这个小站是我用来整理与记录数学题目的个人角落。这里的文章主要围绕着不等式定理（如 Cauchy-Schwarz 不等式、AM-GM 不等式、Holder 不等式）的推广、具有精妙配方技巧的对称实数不等式以及各种 n 元代数问题。
                </p>
                <p>
                    所有的内容都是主要以 Markdown 语法撰写，并经过了定制化数学解析器的处理，使得复杂的多行公式和行内数学表达式都可以通过 KaTeX 以接近 LaTeX 排版水准的高画质在浏览器中瞬间呈献。
                </p>
                
                <h3 style="font-family: var(--font-heading); font-size: 1.4rem; margin: 2rem 0 1rem;">主要研究兴趣</h3>
                <div class="interest-list">
                    <div class="interest-item"><i class="fa-solid fa-square-root-variable"></i> 实数代数不等式</div>
                    <div class="interest-item"><i class="fa-solid fa-infinity"></i> 对称/轮换式配方</div>
                    <div class="interest-item"><i class="fa-solid fa-calculator"></i> n 元代数推广</div>
                    <div class="interest-item"><i class="fa-solid fa-bezier-curve"></i> 约束极值问题</div>
                </div>
            </div>
        </div>
    `;
}

// 5. Moments Feed Page
async function renderMoments() {
    const app = document.getElementById("app");
    app.innerHTML = `
        <div class="page-loader">
            <div class="spinner"></div>
            <p>加载中，获取微言动态...</p>
        </div>
    `;

    const moments = await loadMoments();

    app.innerHTML = `
        <div class="moments-container">
            <h2 class="section-title" style="margin-bottom: 1rem;"><i class="fa-solid fa-hashtag"></i> 动态</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem; font-size: 0.95rem;">
                记录一些数学之外的瞬间、简短的想法或解题实况。
            </p>

            <!-- Publisher Editor -->
            <div class="moment-publisher-card">
                <div style="font-weight: 700; font-size: 1.1rem; margin-bottom: 1rem; color: var(--text-color);">
                    <i class="fa-solid fa-pen-nib"></i> 发布新动态
                </div>
                <textarea id="moment-text-input" class="moment-textarea" placeholder="写下你的想法... (支持 LaTeX 公式，例如 $x^2 + y^2 \\ge 2xy$)" required></textarea>
                <div class="moment-publisher-actions" style="margin-top: 1rem; display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
                    <input type="text" id="moment-image-input" class="moment-image-input" placeholder="添加图片路径 (可选，如 posts/images/xxx.png)">
                    <button id="submit-moment-btn" class="btn btn-primary" style="padding: 0.5rem 1.2rem;"><i class="fa-solid fa-paper-plane"></i> 发布</button>
                </div>
            </div>

            <!-- Moments List Feed -->
            <div class="moments-feed" id="moments-feed-list">
                <!-- Rendered dynamically -->
            </div>
        </div>
    `;

    const feedList = document.getElementById("moments-feed-list");

    // Global helper for toggling comments drawer
    window.toggleComments = function(momentId) {
        const wrapper = document.getElementById(`comments-wrapper-${momentId}`);
        const preview = document.getElementById(`comments-preview-${momentId}`);
        if (!wrapper) return;
        
        if (wrapper.style.display === "none") {
            wrapper.style.display = "block";
            if (preview) preview.style.display = "none";
            initCommentsSection(`comments-container-${momentId}`, `moment_${momentId}`, getTheme());
        } else {
            wrapper.style.display = "none";
            if (preview) preview.style.display = "block";
        }
    };

    // Global helper for deleting moment
    window.deleteMomentById = function(momentId) {
        if (confirm("确认删除这条动态吗？")) {
            if (momentId.startsWith("moment_local_")) {
                const saved = localStorage.getItem("gamma_moments");
                if (saved) {
                    try {
                        let localOnly = JSON.parse(saved);
                        localOnly = localOnly.filter(m => m.id !== momentId);
                        localStorage.setItem("gamma_moments", JSON.stringify(localOnly));
                    } catch (e) {}
                }
            } else {
                let deleted = [];
                const savedDeleted = localStorage.getItem("gamma_deleted_moments");
                if (savedDeleted) {
                    try {
                        deleted = JSON.parse(savedDeleted);
                    } catch (e) {}
                }
                if (!deleted.includes(momentId)) {
                    deleted.push(momentId);
                    localStorage.setItem("gamma_deleted_moments", JSON.stringify(deleted));
                }
            }
            localMoments = []; // Clear cache
            // Reload and refresh
            renderMoments();
        }
    };

    // Global callback from comments.js to update counts and previews
    window.updateMomentsPageCommentsCount = function(postId) {
        if (!postId.startsWith("moment_")) return;
        const momentId = postId.replace("moment_", "");
        
        const comments = typeof LocalComments !== 'undefined' ? LocalComments.getComments(postId) : [];
        const count = comments.length;
        
        // Update button text
        const btn = document.querySelector(`.btn-toggle-comments[data-moment-id="${momentId}"]`);
        if (btn) {
            btn.innerHTML = count > 0 
                ? `<i class="fa-solid fa-comments"></i> 评论回复 (${count})`
                : `<i class="fa-solid fa-comment-medical"></i> 添加评论`;
        }
        
        // Update preview container
        const previewContainer = document.getElementById(`comments-preview-${momentId}`);
        if (previewContainer) {
            if (count === 0) {
                previewContainer.remove();
            } else {
                const previewComments = comments.slice(0, 2);
                let innerHtml = previewComments.map((c, idx) => `
                    <div class="comment-preview-item" style="font-size: 0.9rem; margin-bottom: ${idx < previewComments.length - 1 ? '0.4rem' : '0'}; display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="flex-grow: 1;">
                            <strong style="color: var(--primary-color);">${escapeHtml(c.author)}:</strong> 
                            <span style="color: var(--text-color);">${escapeHtml(c.text)}</span>
                        </div>
                        <span style="color: var(--text-muted); font-size: 0.8rem; flex-shrink: 0; margin-left: 0.5rem;">${LocalComments.formatDate(c.date).split(' ')[0]}</span>
                    </div>
                `).join("");
                
                if (count > 2) {
                    innerHtml += `
                        <div style="font-size: 0.85rem; color: var(--primary-color); margin-top: 0.4rem; cursor: pointer; font-weight: 600;" class="btn-view-all-comments-link" data-moment-id="${momentId}">
                            查看全部 ${count} 条评论...
                        </div>
                    `;
                }
                previewContainer.innerHTML = innerHtml;
                
                // Re-bind click
                const link = previewContainer.querySelector(".btn-view-all-comments-link");
                if (link) {
                    link.addEventListener("click", () => {
                        window.toggleComments(momentId);
                    });
                }
            }
        } else if (count > 0) {
            // Create preview box
            const footer = document.querySelector(`#moment-${momentId} .moment-footer`);
            if (footer) {
                const previewBox = document.createElement("div");
                previewBox.className = "moment-comments-preview-box";
                previewBox.id = `comments-preview-${momentId}`;
                previewBox.style.cssText = "margin-top: 0.8rem; background: rgba(0,0,0,0.02); border-radius: 6px; padding: 0.6rem 0.8rem; border-left: 3px solid var(--primary-color);";
                
                const previewComments = comments.slice(0, 2);
                let innerHtml = previewComments.map((c, idx) => `
                    <div class="comment-preview-item" style="font-size: 0.9rem; margin-bottom: ${idx < previewComments.length - 1 ? '0.4rem' : '0'}; display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="flex-grow: 1;">
                            <strong style="color: var(--primary-color);">${escapeHtml(c.author)}:</strong> 
                            <span style="color: var(--text-color);">${escapeHtml(c.text)}</span>
                        </div>
                        <span style="color: var(--text-muted); font-size: 0.8rem; flex-shrink: 0; margin-left: 0.5rem;">${LocalComments.formatDate(c.date).split(' ')[0]}</span>
                    </div>
                `).join("");
                
                if (count > 2) {
                    innerHtml += `
                        <div style="font-size: 0.85rem; color: var(--primary-color); margin-top: 0.4rem; cursor: pointer; font-weight: 600;" class="btn-view-all-comments-link" data-moment-id="${momentId}">
                            查看全部 ${count} 条评论...
                        </div>
                    `;
                }
                previewBox.innerHTML = innerHtml;
                
                const btnContainer = footer.firstElementChild;
                btnContainer.insertAdjacentElement('afterend', previewBox);
                
                const link = previewBox.querySelector(".btn-view-all-comments-link");
                if (link) {
                    link.addEventListener("click", () => {
                        window.toggleComments(momentId);
                    });
                }
            }
        }
    };

    const renderFeed = () => {
        if (moments.length === 0) {
            feedList.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 4rem 0;">暂无动态内容。</div>`;
            return;
        }

        feedList.innerHTML = moments.map(m => {
            const parsedText = parseMarkdownWithMath(m.text);
            const imageHtml = m.images && m.images.length > 0 
                ? `<div class="moment-images-grid">
                     ${m.images.map(img => `<img src="${escapeHtml(img)}" class="moment-image-item" alt="moment image" onclick="window.open('${escapeHtml(img)}')">`).join("")}
                   </div>`
                : '';

            const momentComments = typeof LocalComments !== 'undefined' ? LocalComments.getComments(`moment_${m.id}`) : [];
            const commentsCount = momentComments.length;

            let previewHtml = '';
            if (commentsCount > 0) {
                const previewComments = momentComments.slice(0, 2);
                previewHtml = `
                    <div class="moment-comments-preview-box" id="comments-preview-${m.id}" style="margin-top: 0.8rem; background: rgba(99, 102, 241, 0.03); border-radius: 6px; padding: 0.6rem 0.8rem; border-left: 3px solid var(--primary-color);">
                        ${previewComments.map((c, idx) => `
                            <div class="comment-preview-item" style="font-size: 0.9rem; margin-bottom: ${idx < previewComments.length - 1 ? '0.4rem' : '0'}; display: flex; justify-content: space-between; align-items: flex-start;">
                                <div style="flex-grow: 1;">
                                    <strong style="color: var(--primary-color);">${escapeHtml(c.author)}:</strong> 
                                    <span style="color: var(--text-color);">${escapeHtml(c.text)}</span>
                                </div>
                                <span style="color: var(--text-muted); font-size: 0.8rem; flex-shrink: 0; margin-left: 0.5rem;">${LocalComments.formatDate(c.date).split(' ')[0]}</span>
                            </div>
                        `).join("")}
                        ${commentsCount > 2 ? `
                            <div style="font-size: 0.85rem; color: var(--primary-color); margin-top: 0.4rem; cursor: pointer; font-weight: 600;" class="btn-view-all-comments-link" data-moment-id="${m.id}">
                                查看全部 ${commentsCount} 条评论...
                            </div>
                        ` : ''}
                    </div>
                `;
            }

            const buttonText = commentsCount > 0 
                ? `<i class="fa-solid fa-comments"></i> 评论回复 (${commentsCount})`
                : `<i class="fa-solid fa-comment-medical"></i> 添加评论`;

            return `
                <div class="moment-card" id="moment-${m.id}">
                    <div class="moment-header">
                        <div class="moment-avatar">Γ</div>
                        <div class="moment-author-info">
                            <div class="moment-author-name">Γ</div>
                            <div class="moment-date"><i class="fa-solid fa-clock"></i> ${m.date}</div>
                        </div>
                    </div>
                    <div class="moment-body markdown-body">
                        ${parsedText}
                        ${imageHtml}
                    </div>
                    <div class="moment-footer" style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.8rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                            <button class="btn-toggle-comments" data-moment-id="${m.id}" onclick="window.toggleComments('${m.id}')" style="background: none; border: none; color: var(--primary-color); cursor: pointer; font-weight: 600; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.4rem;">
                                ${buttonText}
                            </button>
                            <button class="btn-delete-moment" onclick="window.deleteMomentById('${m.id}')" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.3rem;" title="删除此条动态">
                                <i class="fa-solid fa-trash"></i> 删除
                            </button>
                        </div>
                        ${previewHtml}
                        <div class="moment-comments-wrapper" id="comments-wrapper-${m.id}" style="display: none; margin-top: 1rem; background-color: rgba(99, 102, 241, 0.02); border-radius: 8px; padding: 1rem; border: 1px solid var(--border-color);">
                            <div id="comments-container-${m.id}"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join("");

        postProcessCodeBlocks();

        // Register link clicks for view all comments links
        feedList.querySelectorAll(".btn-view-all-comments-link").forEach(link => {
            link.addEventListener("click", () => {
                const momentId = link.getAttribute("data-moment-id");
                window.toggleComments(momentId);
            });
        });
    };

    renderFeed();

    // Publish handler
    const submitBtn = document.getElementById("submit-moment-btn");
    submitBtn.addEventListener("click", () => {
        const textInput = document.getElementById("moment-text-input");
        const imageInput = document.getElementById("moment-image-input");
        const text = textInput.value.trim();
        const image = imageInput.value.trim();

        if (text) {
            const imagesArray = image ? [image] : [];
            saveMoment(text, imagesArray);
            
            // Clear inputs
            textInput.value = "";
            imageInput.value = "";
            
            // Refresh feed
            renderFeed();
        }
    });
}

// Load moments cache
async function loadMoments() {
    if (localMoments.length > 0) return localMoments;

    const saved = localStorage.getItem("gamma_moments");
    let storedMoments = [];
    if (saved) {
        try {
            storedMoments = JSON.parse(saved);
        } catch (e) {}
    }

    let deletedSeedIds = new Set();
    const savedDeleted = localStorage.getItem("gamma_deleted_moments");
    if (savedDeleted) {
        try {
            deletedSeedIds = new Set(JSON.parse(savedDeleted));
        } catch (e) {}
    }

    try {
        const response = await fetch("moments.json");
        if (response.ok) {
            const seedMoments = await response.json();
            const seenIds = new Set(storedMoments.map(m => m.id));
            const merged = [...storedMoments];
            for (const m of seedMoments) {
                if (!seenIds.has(m.id) && !deletedSeedIds.has(m.id)) {
                    merged.push(m);
                }
            }
            // Date sorting descending
            merged.sort((a, b) => new Date(b.date) - new Date(a.date));
            localMoments = merged;
            return localMoments;
        }
    } catch (e) {
        console.error("Error loading moments:", e);
    }

    localMoments = storedMoments;
    return localMoments;
}

// Save moments cache
function saveMoment(text, images = []) {
    const newMoment = {
        id: `moment_local_${Date.now()}`,
        date: formatDateTime(new Date()),
        text: text,
        images: images
    };

    localMoments.unshift(newMoment);
    const localOnly = localMoments.filter(m => m.id.startsWith("moment_local_"));
    localStorage.setItem("gamma_moments", JSON.stringify(localOnly));
}

function formatDateTime(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// Hamburger menu toggle for mobile devices
function initMobileMenu() {
    const btn = document.getElementById("mobile-menu-toggle");
    const menu = document.getElementById("nav-menu");
    if (btn && menu) {
        btn.addEventListener("click", () => {
            menu.classList.toggle("active");
            
            // Transform icon
            const icon = btn.querySelector("i");
            if (menu.classList.contains("active")) {
                icon.className = "fa-solid fa-xmark";
                menu.style.display = "flex";
                menu.style.flexDirection = "column";
                menu.style.position = "absolute";
                menu.style.top = "100%";
                menu.style.left = "0";
                menu.style.width = "100%";
                menu.style.backgroundColor = "var(--surface-solid)";
                menu.style.padding = "1rem 2rem";
                menu.style.borderBottom = "1px solid var(--border-color)";
                menu.style.gap = "1rem";
            } else {
                icon.className = "fa-solid fa-bars";
                menu.style.display = "";
            }
        });
    }
}

// Bootstrapping App
window.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileMenu();
    handleRouting();
});

window.addEventListener("hashchange", handleRouting);
