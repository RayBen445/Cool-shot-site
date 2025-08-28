# Cool Shot Systems - Modern Business Website

A modern, responsive website for Cool Shot Systems built with React, TypeScript, and Tailwind CSS. Features custom software development services, AI-powered solutions, and a professional business presence.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, TypeScript, and Vite
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **AI Integration**: AI-powered chat assistant and image generation
- **Performance Optimized**: Fast loading with optimized builds
- **SEO Ready**: Proper meta tags and semantic HTML
- **Professional UI**: Modern design with smooth animations

## 📁 Project Structure

```
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── lib/            # Utilities and configurations
│   │   └── hooks/          # Custom React hooks
├── server/                 # Express backend (optional)
├── shared/                 # Shared types and schemas
└── dist/                   # Build output
```

## 🛠️ Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## 🚀 Deployment

### Deploying to Vercel (Recommended)

This project is optimized for Vercel deployment:

1. **Quick Deploy**: 
   - Fork this repository
   - Import it to Vercel from your GitHub account
   - Vercel will automatically detect the configuration

2. **Manual Deploy**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

3. **Configuration**: 
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

### Deploying to Other Platforms

**Netlify**:
- Build command: `npm run build`
- Publish directory: `dist/public`

**Static Hosting**:
- Run `npm run build`
- Upload the `dist/public` folder contents

## 🎨 Customization

### Colors & Branding
- Update CSS variables in `client/src/index.css`
- Modify Tailwind config in `tailwind.config.ts`
- Replace logo in `client/public/images/logo.jpg`

### Content
- Update company information in components
- Modify services and portfolio items
- Customize contact information and social links

## 🧪 Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI components
- **Routing**: Wouter (lightweight React router)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Animations**: Tailwind CSS animations

## 📝 Common Issues & Solutions

### "Code" Showing on Deployment
This usually happens when:
- Build command is incorrect (should be `npm run build`)
- Output directory is wrong (should be `dist/public`)
- SPA routing isn't configured properly (check `vercel.json`)

### Asset Loading Issues
- Ensure all assets use relative paths
- Check that images are in `client/public/images/`
- Verify build output includes all necessary files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 📞 Support

For technical support or customizations, contact Heritage Oladoye:
- Email: oladoyeheritage445@gmail.com
- LinkedIn: [Heritage Oladoye](https://www.linkedin.com/in/heritage-oladoye-962a28341)
- GitHub: [RayBen445](https://github.com/RayBen445)

---

© 2024 Cool Shot Systems. All rights reserved.