const fs = require('fs');
const path = require('path');

const files = [
  'src/components/layout/Navbar.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/shared/FloatingButtons.tsx',
  'src/components/layout/AdminSidebar.tsx',
  'src/components/layout/AdminHeader.tsx',
  'src/pages/public/Home.tsx',
  'src/pages/public/About.tsx',
  'src/pages/public/Properties.tsx',
  'src/pages/public/PropertyDetail.tsx',
  'src/pages/public/Gallery.tsx',
  'src/pages/public/Testimonials.tsx',
  'src/pages/public/Contact.tsx',
  'src/pages/admin/Overview.tsx',
  'src/pages/admin/Properties.tsx',
  'src/pages/admin/Gallery.tsx',
  'src/pages/admin/Testimonials.tsx',
  'src/pages/admin/Leads.tsx',
  'src/pages/admin/Analytics.tsx',
  'src/pages/admin/Settings.tsx'
];

files.forEach(file => {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const name = path.basename(file, '.tsx');
  fs.writeFileSync(file, `export default function ${name}() { return <div className="p-8">${name} Page</div>; }`);
});

const mainContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
fs.writeFileSync('src/main.tsx', mainContent);
console.log('Done');
