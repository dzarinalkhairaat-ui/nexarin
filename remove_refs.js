const fs = require('fs');

// 1. features/home/HomePage.jsx
let homePage = fs.readFileSync('features/home/HomePage.jsx', 'utf8');
homePage = homePage.replace(/import HomePortfolioPreview from "@\/features\/home\/components\/HomePortfolioPreview";\n/, '');
homePage = homePage.replace(/<ScrollReveal delay={100}>\s*<HomePortfolioPreview \/>\s*<\/ScrollReveal>/, '');
fs.writeFileSync('features/home/HomePage.jsx', homePage);

// 2. config/navigation.config.js
let navConfig = fs.readFileSync('config/navigation.config.js', 'utf8');
navConfig = navConfig.replace(/  \{ label: "Portfolio", href: "\/portfolio" \},\n/, '');
navConfig = navConfig.replace(/  \{ label: "Contact", href: "\/contact" \},\n/, '');
fs.writeFileSync('config/navigation.config.js', navConfig);

// 3. features/admin/components/AdminSidebar.jsx
let adminSidebar = fs.readFileSync('features/admin/components/AdminSidebar.jsx', 'utf8');
adminSidebar = adminSidebar.replace(/\s*\{\s*label: "Portfolio",[\s\S]*?\},/, '');
fs.writeFileSync('features/admin/components/AdminSidebar.jsx', adminSidebar);

// 4. features/admin/components/AdminTopbar.jsx
let adminTopbar = fs.readFileSync('features/admin/components/AdminTopbar.jsx', 'utf8');
adminTopbar = adminTopbar.replace(/  PortfolioIcon,\n/g, '');
adminTopbar = adminTopbar.replace(/\s*\{\s*label: "Portfolio",[\s\S]*?\},/, '');
fs.writeFileSync('features/admin/components/AdminTopbar.jsx', adminTopbar);

// 5. features/admin/admin.data.js
let adminData = fs.readFileSync('features/admin/admin.data.js', 'utf8');
adminData = adminData.replace(/\s*\{\s*title: "Kelola Portfolio"[\s\S]*?\},/, '');
adminData = adminData.replace(/\s*\{\s*label: "Portfolio"[\s\S]*?\},/, '');
fs.writeFileSync('features/admin/admin.data.js', adminData);

// 6. features/admin/modules/AdminSettingsPage.jsx
let adminSettings = fs.readFileSync('features/admin/modules/AdminSettingsPage.jsx', 'utf8');
adminSettings = adminSettings.replace(/\s*\{\s*title: "Kontak & Sosmed"[\s\S]*?\},/, '');
fs.writeFileSync('features/admin/modules/AdminSettingsPage.jsx', adminSettings);

// 7. app/sitemap.js
let sitemap = fs.readFileSync('app/sitemap.js', 'utf8');
sitemap = sitemap.replace(/import \{ getPortfolioProjects \} from "@\/features\/portfolio\/portfolio\.data";\n/, '');
sitemap = sitemap.replace(/\s*createUrl\("\/portfolio", 0\.85, "weekly"\),/, '');
sitemap = sitemap.replace(/\s*const portfolioRoutes = getPortfolioProjects\(\)[\s\S]*?\.map[\s\S]*?\);\n/, '');
sitemap = sitemap.replace(/\s*\.\.\.portfolioRoutes,/, '');
fs.writeFileSync('app/sitemap.js', sitemap);
