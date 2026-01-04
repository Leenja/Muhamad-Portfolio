// Identity management and administrator guidance
if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
        if (!user) {
            window.netlifyIdentity.on("login", () => {
                document.location.href = "/admin/";
            });
        }
    });
}

// Bringing and showcasing projects
async function loadProjects() {
    const portfolio = document.getElementById('portfolio');
    const apiUrl = "https://api.github.com/repos/Leenja/Muhamad-Portfolio/contents/content/projects";
    
    portfolio.innerHTML = '<p style="text-align:center; width:100%;">...Loading designs</p>';

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Folder not found");

        const files = await response.json();
        portfolio.innerHTML = '';

        for (let file of files) {
            if (file.name.endsWith('.md')) {
                const contentRes = await fetch(file.download_url);
                const text = await contentRes.text();
                
                // Data extraction using Regex
                const title = text.match(/title:\s*["']?(.*?)["']?(\r?\n|$)/)?.[1] || "Project";
                let image = text.match(/image:\s*["']?(.*?)["']?(\r?\n|$)/)?.[1] || "";

                // Image path cleaning
                if (image.startsWith('/')) image = image.substring(1);

                const card = `
                    <div class="project-card">
                        <img src="${image}" alt="${title}" onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'">
                        <div class="project-info">
                            <h3>${title}</h3>
                        </div>
                    </div>
                `;
                portfolio.innerHTML += card;
            }
        }
    } catch (e) {
        console.error("Fetch Error:", e);
        portfolio.innerHTML = '<p style="text-align:center; width:100%;">No Projects to show.</p>';
    }
}

async function loadAbout() {
    const titleEl = document.getElementById('about-title');
    const textEl = document.getElementById('about-text');
    
    const url = "https://raw.githubusercontent.com/Leenja/Muhamad-Portfolio/main/content/about.md";

    try {
        const response = await fetch(url);
        const text = await response.text();

        const titleMatch = text.match(/title:\s*["']?(.*?)["']?(\r?\n|$)/);
        const descMatch = text.match(/description:\s*(?:["']([\s\S]*?)["']|([\s\S]*?))(?:\r?\n\w+:|$)/);

        if (titleMatch) titleEl.innerText = titleMatch[1];
        if (descMatch) {
            let description = descMatch[1] || descMatch[2];
            textEl.innerText = description.trim();
        }
    } catch (e) {
        console.error("Error loading about section:", e);
        titleEl.innerText = "About Me";
        textEl.innerText = "Add text from dashboard.";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    loadAbout();
});

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', loadProjects);