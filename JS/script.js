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

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', loadProjects);