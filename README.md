# 🎵 Music Band Collaboration Portal (BandSync)

A modern, full-stack web application designed for musicians and bands to connect, form groups, coordinate rehearsals, post community updates, and collaborate on musical projects.

Built with **React (Vite)**, **Express.js (Node.js)**, **MongoDB Atlas (Mongoose)**, and **JWT Authentication**.

---

## 🌟 Key Features

1. **Musician Discovery & Matchmaking**
   - Search musicians by name, instrument, or city.
   - Filter by musical genre (Rock, Jazz, Blues, Metal, Synthwave, etc.) and experience level (Beginner to Professional).
   - View detailed artist profiles with instrument badges and bio.

2. **Band Management & Rosters**
   - Create and found a new band with custom descriptions, genres, and recruitment needs.
   - Add band members with designated roles (Leader, Guitarist, Drummer, etc.).
   - Join existing bands and post band-wide announcements.
   - Creator-only permissions for editing and deleting bands.

3. **Rehearsal Scheduling System**
   - Schedule in-person studio practices or online jam sessions (e.g., Discord).
   - Specify date, time, studio location, and setlist preparation notes.
   - RSVP system for members (*Attending*, *Tentative*, *Can't Go*).
   - Filter rehearsals by band.

4. **Community Jam Feed**
   - Create community posts categorized by *Gear & Tips*, *Looking for Band*, *Jam Session*, *Songwriting*, etc.
   - Like / unlike posts with real-time counters (prevents duplicate likes per user in MongoDB).
   - Comment threads with timestamps and author profiles.

5. **Collaboration Request Workflow**
   - Send collaboration proposals with custom project types (e.g. *Jam Session*, *Band Audition*, *Songwriting*).
   - Separate tabs for **Received Requests** and **Sent Requests**.
   - Accept or decline incoming proposals (secured on backend: only the intended recipient can accept/reject).
   - Built-in duplicate request prevention.

6. **Authentication & Profile Security**
   - Password hashing using `bcryptjs` with salt rounds.
   - Stateless session management with JSON Web Tokens (JWT).
   - Authorization middleware verifying tokens on protected API routes.
   - Profile editing restricted strictly to the authenticated account owner.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios, Lucide React Icons |
| **Styling** | Custom Responsive CSS3, Dark Music Theme (Charcoal, Deep Violet, Neon Cyan) |
| **Backend** | Node.js, Express.js (REST API, ES Modules) |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Security** | JWT (jsonwebtoken), bcryptjs, CORS |

---

## 📁 Project Folder Structure

```text
music-band-portal/
├── src/
│   ├── components/
│   │   ├── Alert.jsx               # Dismissible alert banners
│   │   ├── EmptyState.jsx          # Friendly empty state illustrations
│   │   ├── Footer.jsx              # Application footer with tech stack
│   │   ├── LoadingSpinner.jsx      # Animated equalizer music loader
│   │   ├── Modal.jsx               # Accessible dialog modal
│   │   ├── Navbar.jsx              # Navigation with mobile drawer & notifications
│   │   └── ProtectedRoute.jsx      # Auth check & login redirect guard
│   ├── context/
│   │   └── AuthContext.jsx         # User state & JWT token management
│   ├── pages/
│   │   ├── BandDetailsPage.jsx     # Band roster, announcements & rehearsal scheduler
│   │   ├── BandsPage.jsx           # Band directory with genre filters & creation modal
│   │   ├── CollaborationRequestsPage.jsx # Received/Sent requests management
│   │   ├── CommunityPage.jsx       # Feed, post creator, likes, and comment threads
│   │   ├── DashboardPage.jsx       # User dashboard, quick band creation, stats
│   │   ├── DiscoverMusiciansPage.jsx # Musician directory with search and filters
│   │   ├── LandingPage.jsx         # Hero, 3-step guide, featured artists & bands
│   │   ├── LoginPage.jsx           # User login with demo credentials helper
│   │   ├── MusicianProfilePage.jsx # Full musician profile & profile editor
│   │   ├── NotFoundPage.jsx        # 404 Music-themed error page
│   │   ├── RegisterPage.jsx        # Multi-field musician onboarding form
│   │   └── RehearsalsPage.jsx      # Rehearsal calendar, RSVP, and scheduler
│   ├── services/
│   │   └── api.js                  # Axios instance with JWT request interceptors
│   ├── App.jsx                     # Route definitions
│   ├── main.jsx                    # React DOM entry
│   └── index.css                   # Theme variables, glass cards, and responsive styles
├── server/
│   ├── config/
│   │   └── db.js                   # Mongoose Atlas connection handler
│   ├── controllers/
│   │   ├── authController.js       # Register, login, get current user
│   │   ├── bandController.js       # Band CRUD, join/leave, announcements
│   │   ├── collaborationController.js # Send, accept, decline requests
│   │   ├── postController.js       # Posts, likes, comments
│   │   ├── rehearsalController.js  # Scheduling, RSVP, cancel
│   │   └── userController.js       # Musician search, profile, profile edit
│   ├── middleware/
│   │   └── auth.js                 # JWT verification middleware
│   ├── models/
│   │   ├── Band.js                 # Band Mongoose Schema
│   │   ├── CollaborationRequest.js # Collaboration Request Mongoose Schema
│   │   ├── Post.js                 # Community Post Mongoose Schema
│   │   ├── Rehearsal.js            # Rehearsal Mongoose Schema
│   │   └── User.js                 # User & Musician Profile Mongoose Schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bandRoutes.js
│   │   ├── collaborationRoutes.js
│   │   ├── postRoutes.js
│   │   ├── rehearsalRoutes.js
│   │   └── userRoutes.js
│   ├── index.js                    # Express server entry point
│   ├── seed.js                     # Safe database seeder for realistic sample data
│   ├── .env.example                # Example environment configuration
│   └── package.json                # Server dependencies
├── package.json                    # Root & frontend scripts & dependencies
├── vite.config.js                  # Vite configuration with /api backend proxy
├── .gitignore
└── README.md
```

---

## 📋 Prerequisites

Make sure you have installed on your computer:
- **Node.js** (v18.0.0 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)
- A free **MongoDB Atlas** account (or local MongoDB)

Check your installed versions in Windows PowerShell:
```powershell
node -v
npm -v
```

---

## 🚀 Step-by-Step Setup Instructions

### Step 1: Set Up MongoDB Atlas (Free Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up or log in.
2. Click **Create a Deployment** and select the **M0 Free Shared Tier**.
3. Under **Security Quickstart**:
   - Create a Database User with a **Username** and **Password** (e.g. `banduser` and `MyPassword123`). *Write these down!*
4. Under **Network Access**:
   - Click **Add IP Address** and choose **Allow Access from Anywhere** (`0.0.0.0/0`). Click **Confirm**.
5. Go to **Databases** > click **Connect** on your cluster:
   - Select **Drivers** (Node.js).
   - Copy the connection string. It looks like:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
     ```
6. Replace `<username>` and `<password>` with your database user credentials. Add the database name `music_band_portal` before the `?`:
   ```text
   mongodb+srv://banduser:MyPassword123@cluster0.abcde.mongodb.net/music_band_portal?retryWrites=true&w=majority
   ```
   *(Note: If your password contains special characters like `@`, `#`, or `$`, URL-encode them: e.g. `@` becomes `%40`)*.

---

### Step 2: Configure Backend Environment Variables

1. Open the file `server/.env` (or copy `server/.env.example` to `server/.env`).
2. Paste your MongoDB connection string and a random secret:

```env
PORT=5000
MONGODB_URI=mongodb+srv://banduser:MyPassword123@cluster0.abcde.mongodb.net/music_band_portal?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_music_band_portal_2026_secure
FRONTEND_URL=http://localhost:5173
```

---

### Step 3: (Optional) Seed Sample Musicians and Bands

To populate the database with realistic musicians (guitarists, drummers, vocalists), bands (*Neon Velocity*, *Midnight Velvet*), upcoming rehearsals, and community posts:

Open PowerShell in the `music-band-portal` folder:
```powershell
npm run seed
```

> **Pre-configured Seed Accounts:**
> - `elena@bandportal.dev` | Password: `password123` *(Lead Guitarist)*
> - `marcus@bandportal.dev` | Password: `password123` *(Drummer)*
> - `maya@bandportal.dev` | Password: `password123` *(Synthesizer)*
> - `julian@bandportal.dev` | Password: `password123` *(Bassist)*
> - `chloe@bandportal.dev` | Password: `password123` *(Vocalist)*

---

### Step 4: Run the Application

You can run both Frontend and Backend concurrently with a single command, or in two separate PowerShell terminals.

#### Option A: Run Both in One Terminal (Recommended)
In the `music-band-portal` folder:
```powershell
npm run dev:all
```

#### Option B: Run in Separate Terminals

**Terminal 1 (Backend API):**
```powershell
cd music-band-portal
npm run server
```
*Backend will start on `http://localhost:5000`*

**Terminal 2 (Frontend React App):**
```powershell
cd music-band-portal
npm run dev
```
*Frontend will be available at `http://localhost:5173`*

Open **http://localhost:5173** in your web browser!

---

## 📡 Backend API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create user profile and generate JWT token
- `POST /api/auth/login` - Verify credentials and return JWT token
- `GET /api/auth/me` - *(Protected)* Return currently authenticated user

### Musicians & Profiles (`/api/users`)
- `GET /api/users` - Search musicians by name/instrument, filter by genre & experience
- `GET /api/users/:id` - Fetch musician profile with their affiliated bands
- `PUT /api/users/profile` - *(Protected)* Update logged-in user's profile

### Bands (`/api/bands`)
- `GET /api/bands` - List all bands (supports search & genre query)
- `GET /api/bands/:id` - Band details, roster, rehearsals, and announcements
- `POST /api/bands` - *(Protected)* Create a new band (creator becomes Leader)
- `PUT /api/bands/:id` - *(Protected)* Edit band (creator only)
- `DELETE /api/bands/:id` - *(Protected)* Delete band and its rehearsals (creator only)
- `POST /api/bands/:id/join` - *(Protected)* Join a band roster
- `POST /api/bands/:id/leave` - *(Protected)* Leave a band roster
- `POST /api/bands/:id/announcements` - *(Protected)* Post band announcement (members only)

### Rehearsals (`/api/rehearsals`)
- `GET /api/rehearsals` - List upcoming rehearsals (supports `?bandId=`)
- `GET /api/rehearsals/my` - *(Protected)* List rehearsals for user's bands
- `POST /api/rehearsals` - *(Protected)* Schedule a rehearsal (band members only)
- `PUT /api/rehearsals/:id` - *(Protected)* Edit rehearsal (creator or band leader)
- `DELETE /api/rehearsals/:id` - *(Protected)* Cancel rehearsal (creator or band leader)
- `POST /api/rehearsals/:id/rsvp` - *(Protected)* Update RSVP (*attending*, *tentative*, *declined*)

### Community Feed (`/api/posts`)
- `GET /api/posts` - List posts (supports category filter & search)
- `POST /api/posts` - *(Protected)* Create a new community post
- `POST /api/posts/:id/like` - *(Protected)* Toggle like/unlike (prevents duplicate likes)
- `POST /api/posts/:id/comment` - *(Protected)* Add comment to post
- `DELETE /api/posts/:id` - *(Protected)* Delete post (author only)

### Collaboration Requests (`/api/collaborations`)
- `POST /api/collaborations` - *(Protected)* Send request (prevents duplicate pending requests)
- `GET /api/collaborations/received` - *(Protected)* List received requests
- `GET /api/collaborations/sent` - *(Protected)* List sent requests
- `PUT /api/collaborations/:id/status` - *(Protected)* Accept or decline (recipient only)

---

## 🔒 Security Best Practices Implemented

1. **Password Hashing**: Passwords are never stored in plain text. Hashed using `bcryptjs` with 10 salt rounds.
2. **JWT Authorization**: Requests to protected routes send `Authorization: Bearer <token>`. The backend verifies signature and user existence before executing handlers.
3. **Password Redaction**: `passwordHash` is excluded from user models via `.select('-passwordHash')` and `.toJSON()` transforms.
4. **Strict Authorization Checks**:
   - Only a band creator can edit or delete a band.
   - Only band members can schedule rehearsals or post band announcements.
   - Only the intended recipient can accept or decline a collaboration request.
   - Only the author can delete their community post.
   - Users cannot edit another user's profile.
5. **No Secrets in Source Code**: Secrets (`MONGODB_URI`, `JWT_SECRET`) reside in `.env` and `.env` is listed in `.gitignore`.

---

## ❓ Troubleshooting Common Errors

### 1. `MongooseServerSelectionError: Could not connect to any servers in your MongoDB Atlas cluster`
- **Cause**: Network IP is not whitelisted in MongoDB Atlas.
- **Fix**: Go to MongoDB Atlas > **Network Access** > Click **Add IP Address** > Select **Allow Access from Anywhere** (`0.0.0.0/0`) > Confirm.

### 2. `Authentication Failed` (bad auth: authentication failed)
- **Cause**: Incorrect database username or password in `MONGODB_URI`.
- **Fix**: Check your Database Users in Atlas under **Database Access**. Ensure special characters in your password are URL-encoded (e.g., `#` becomes `%23`, `@` becomes `%40`).

### 3. `Port 5000 is already in use`
- **Cause**: Another process is using port 5000.
- **Fix**: Change `PORT=5001` in `server/.env` and update the proxy in `vite.config.js` to `http://localhost:5001`.

---

## 🎓 College Demonstration Guide

When presenting this project to faculty or examiners, demonstrate the following flows:

1. **Guest Browsing**: Open the landing page, discover musicians, and filter by genre (*Rock*, *Jazz*, etc.).
2. **Registration / Login**: Register a new musician or log in using the seed account (`elena@bandportal.dev` / `password123`).
3. **Form a Band**: Create a band like *"Neon Eclipse"*, select genres, and list open instrument slots.
4. **Musician Collaboration**: Browse to another musician's profile and send a collaboration proposal.
5. **Rehearsal Scheduling**: Schedule a rehearsal for your band, review the date/location, and demonstrate the RSVP buttons (*Attending* / *Maybe* / *Can't Go*).
6. **Community Interaction**: Post an update in the Community Jam Feed, click the Heart button to like it, and leave a comment.
7. **Security Verification**: Try to edit someone else's profile or delete another user's post to show that unauthorized actions are blocked by the backend API.
