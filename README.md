## 🚀 Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Create `.env` file** (copy from `.env.example`):
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   Ensure `REACT_APP_API_URL=http://localhost:3000`

3. **Make sure backend is running** on port 3000.

4. **Start the frontend:**
   \`\`\`bash
   npm start
   \`\`\`

Runs at `http://localhost:3001`.

## 🔐 Authentication Flow

- **Signup** → `POST /auth/signup` → stores JWT in localStorage
- **Login** → `POST /auth/login` → stores JWT in localStorage
- **Protected Routes** → JWT sent as `Authorization: Bearer <token>`
- **Logout** → Removes JWT from localStorage

Users can only see their own notes (filtered by `userId` on the backend).