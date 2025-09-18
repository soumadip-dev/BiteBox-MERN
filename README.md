<h1 align="center">
  BiteBox 🍔
</h1>

<p align="center">
  A full-stack MERN food delivery application with real-time order tracking, Razorpay payments, Firebase OAuth, Brevo mail service, and a modern UI for customers and admins.
</p>

<table align="center">
  <tr>
    <th>Login Page</th>
    <th>Register Page</th>
  </tr>
  <tr>
    <td align="center">
      <img src="./client/public/loginPage_ss.png" alt="Login Page">
    </td>
    <td align="center">
      <img src="./client/public/registerPage_ss.png" alt="Register Page">
    </td>
  </tr>
</table>

## 🌟 Features (Current)

- 👤 User registration and login
- 🔑 JWT and Firebase OAuth authentication
- 🛡 Protected backend routes
- 💻 Frontend auth flow (signup, login, logout)
- ☁️ Image upload via Cloudinary and Multer
- 📬 Automated mail service using Brevo Studio

## ⚙️ Tech Stack

- **🎨 Frontend**: React, Tailwind CSS, React Router, Redux
- **🛠 Backend**: Node.js, Express.js, Multer
- **🗄 Database**: MongoDB, Mongoose
- **☁️ Cloud Storage**: Cloudinary
- **🔐 Auth**: JWT, Firebase OAuth
- **📧 Mail Service**: Brevo Studio

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/soumadip-dev/BiteBox-MERN.git
cd BiteBox-MERN
```

### 2. Backend Setup

```bash
cd server
pnpm install
```

Create a `.env` file in the `server` directory with:

```env
PORT=<YOUR_PORT_NUMBER>
MONGO_URI=<YOUR_MONGO_URI>
BACKEND_URL=<YOUR_BACKEND_URL>
FRONTEND_URL=<YOUR_FRONTEND_URL>
NODE_ENV=<YOUR_NODE_ENV>
JWT_SECRET=<YOUR_JWT_SECRET>
JWT_EXPIRES_IN=<YOUR_JWT_EXPIRES_IN>
BREVO_HOST=<YOUR_BREVO_HOST>
BREVO_PORT=<YOUR_BREVO_PORT>
BREVO_USERNAME=<YOUR_BREVO_USERNAME>
BREVO_PASSWORD=<YOUR_BREVO_PASSWORD>
BREVO_SENDEREMAIL=<YOUR_BREVO_SENDEREMAIL>
COMPANY_NAME=<YOUR_COMPANY_NAME>
GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
GOOGLE_CLIENT_SECRET=<YOUR_GOOGLE_CLIENT_SECRET>
GITHUB_CLIENT_ID=<YOUR_GITHUB_CLIENT_ID>
GITHUB_CLIENT_SECRET=<YOUR_GITHUB_CLIENT_SECRET>
CLOUDINARY_CLOUD_NAME=<YOUR_CLOUDINARY_CLOUD_NAME>
CLOUDINARY_API_KEY=<YOUR_CLOUDINARY_API_KEY>
CLOUDINARY_API_SECRET=<YOUR_CLOUDINARY_API_SECRET>
```

### 3. Frontend Setup

```bash
cd ../client
pnpm install
```

Create a `.env` file in the `client` directory with:

```env
VITE_BACKEND_URL=<YOUR_BACKEND_URL>
VITE_FIREBASE_API_KEY=<YOUR_FIREBASE_API_KEY>
VITE_FIREBASE_AUTH_DOMAIN=<YOUR_FIREBASE_AUTH_DOMAIN>
VITE_FIREBASE_PROJECT_ID=<YOUR_FIREBASE_PROJECT_ID>
VITE_FIREBASE_STORAGE_BUCKET=<YOUR_FIREBASE_STORAGE_BUCKET>
VITE_FIREBASE_MESSAGING_SENDER_ID=<YOUR_FIREBASE_MESSAGING_SENDER_ID>
VITE_FIREBASE_APP_ID=<YOUR_FIREBASE_APP_ID>
VITE_GEOAPI_KEY=<YOUR_GEOAPI_KEY>
```

### 4. Run the Application 🚀

- **Backend (Terminal 1)**:

```bash
cd server
pnpm run dev
```

- **Frontend (Terminal 2)**:

```bash
cd ../client
pnpm run dev
```
