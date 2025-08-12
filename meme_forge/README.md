# MemeForge - AI-Powered Meme Generator

A modern, full-stack meme generator with AI capabilities, template library, and cloud storage integration.

## Features

### 🎨 Meme Creation
- **Template Library**: 50+ built-in meme templates with pagination
- **Custom Upload**: Upload your own images
- **AI Generation**: Generate memes using AI (Hugging Face FLUX model)
- **Advanced Text Editor**: Customizable fonts, colors, outlines, and positioning
- **Video Support**: Create memes with video templates

### 🌐 Cloud Integration
- **Cloudflare R2 Storage**: Secure cloud storage for memes
- **Instant Sharing**: Generate shareable links
- **High Performance**: Fast uploads and downloads

### 📱 User Experience
- **Responsive Design**: Works on all devices
- **Modal Preview**: Click to preview templates before selection
- **Pagination**: Browse through templates efficiently
- **Real-time Preview**: See changes instantly

## Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Canvas API** for meme rendering

### Backend
- **Node.js** with Express
- **Cloudflare R2** for storage
- **Hugging Face API** for AI generation
- **AWS SDK** for R2 integration

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd meme_forge

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `server` directory:

```env
# Hugging Face API Key for AI image generation
HF_API_KEY=your_huggingface_api_key_here

# Cloudflare R2 Configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_ACCESS_KEY_ID=your_access_key_here
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key_here
CLOUDFLARE_BUCKET_NAME=meme-forge-images
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com

# Server Configuration
PORT=3001
```

### 3. Cloudflare R2 Setup

1. **Create Cloudflare Account**: Sign up at [Cloudflare](https://cloudflare.com)
2. **Enable R2**: Go to R2 Object Storage in your dashboard
3. **Create Bucket**: Create a new bucket named `meme-forge-images`
4. **Generate API Keys**:
   - Go to "Manage R2 API tokens"
   - Create a new token with R2 permissions
   - Copy the Access Key ID and Secret Access Key
5. **Get Account ID**: Found in the right sidebar of your Cloudflare dashboard

### 4. Hugging Face Setup (Optional - for AI generation)

1. **Create Account**: Sign up at [Hugging Face](https://huggingface.co)
2. **Generate API Key**: Go to Settings → Access Tokens
3. **Add to Environment**: Set `HF_API_KEY` in your `.env` file

### 5. Run the Application

```bash
# Terminal 1: Start the backend server
cd server
npm run dev

# Terminal 2: Start the frontend client
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:8000
- **Backend**: http://localhost:3001

## Project Structure

```
meme_forge/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── constants/     # App constants
│   └── public/
│       └── images/        # Meme template images
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   └── uploads/          # Temporary upload directory
└── README.md
```

## API Endpoints

### Backend Endpoints
- `GET /health` - Health check
- `POST /generate-image` - AI meme generation
- `POST /upload-meme` - Upload meme to R2
- `POST /get-upload-url` - Get signed upload URL

## What's Implemented

✅ **Template Page with Pagination**: 40 memes per page with search and filtering
✅ **Modal Preview**: Click templates to preview and select
✅ **Limited Templates in Generator**: Shows 12 templates with "View More" button
✅ **Cloudflare R2 Integration**: Complete cloud storage setup
✅ **Upload Functionality**: Upload generated memes to cloud
✅ **Share Feature**: Generate shareable links for memes
✅ **Responsive Design**: Works on all screen sizes
✅ **AI Generation**: Create memes with AI (when configured)

## What You Need to Do Next

### 1. **Set up Cloudflare R2** (Required for cloud storage)
- Create Cloudflare account
- Set up R2 bucket
- Configure environment variables
- Test upload functionality

### 2. **Add Meme Images** (Optional)
- Add more meme template images to `/client/public/images/`
- Update `/client/constants/images.json` with new image paths
- Organize images in categories if desired

### 3. **Configure AI Generation** (Optional)
- Get Hugging Face API key
- Set `HF_API_KEY` in environment variables
- Test AI meme generation

### 4. **Customize Styling** (Optional)
- Modify colors and themes in Tailwind config
- Add your branding/logo
- Customize component styles

### 5. **Deploy** (When ready)
- Deploy frontend to Vercel/Netlify
- Deploy backend to Railway/Heroku
- Update API URLs in production

## Troubleshooting

### Common Issues

1. **Images not loading**: Check that image paths in `images.json` are correct
2. **Upload failing**: Verify Cloudflare R2 credentials and bucket permissions
3. **AI generation not working**: Ensure HF_API_KEY is set and valid
4. **CORS errors**: Check that backend URL is correct in frontend

### Environment Variables Checklist
- [ ] `HF_API_KEY` (for AI generation)
- [ ] `CLOUDFLARE_ACCOUNT_ID`
- [ ] `CLOUDFLARE_ACCESS_KEY_ID`
- [ ] `CLOUDFLARE_SECRET_ACCESS_KEY`
- [ ] `CLOUDFLARE_BUCKET_NAME`
- [ ] `CLOUDFLARE_R2_ENDPOINT`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.