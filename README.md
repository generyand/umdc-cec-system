# UM Digos College Community Extension Center Management System (UMDC-CECMS)

The UM Digos College Community Extension Center Management System (UMDC-CECMS) is a comprehensive web-based platform designed to streamline the management and execution of community extension programs. This system serves as a central hub for planning, implementing, monitoring, and evaluating community outreach initiatives undertaken by the UM Digos College.

## Purpose

UMDC-CECMS empowers faculty members, staff, and administrators to efficiently manage extension programs while maintaining transparency and accountability in community engagement activities. The system facilitates data-driven decision-making through robust analytics and reporting capabilities.

## Core Functionalities

- **Program Management**: Streamlined creation and monitoring of extension programs
- **Resource Optimization**: Efficient allocation and tracking of resources
- **Impact Assessment**: Comprehensive monitoring and evaluation tools
- **Reporting System**: Automated generation of detailed reports and analytics
- **Collaboration Tools**: Enhanced communication between stakeholders
- **Document Management**: Centralized storage for program documentation

## Key Benefits

- **Enhanced Efficiency**: Automates administrative tasks and streamlines workflows
- **Data-Driven Insights**: Real-time analytics for better decision-making
- **Improved Accountability**: Transparent tracking of program outcomes
- **Simplified Compliance**: Ensures adherence to institutional and regulatory requirements
- **Sustainable Impact**: Better monitoring of long-term community development initiatives

## 🚀 Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Shadcn UI
- Vite
- Zustand (State Management)
- TanStack React Query (Server State Management)
- Axios (HTTP Client)
- React Router DOM

### Backend

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- [Supabase](https://supabase.com) (Authentication, Storage, and Real-time Database)

### Backend Dependencies

- **Security**

  - `helmet` (Security headers)
  - `bcryptjs` (Password hashing)
  - `jsonwebtoken` (JWT authentication)
  - `express-rate-limit` (Rate limiting)
  - `cors` (Cross-Origin Resource Sharing)

- **Database**

  - `@prisma/client` (Prisma ORM)
  - `pg` (PostgreSQL driver)

- **Validation & Types**

  - `zod` (Schema validation)
  - `typescript` (Type safety)

- **Development Tools**
  - `tsx` (TypeScript execution)
  - `nodemon` (Development server)
  - `dotenv` (Environment variables)
  - `source-map-support` (Source map support for stack traces)

## 🌟 Features

- **Authentication & Authorization**

  - Role-based access control (Admin, Focal Person, etc.)
  - Secure login and session management

- **Dashboard & Analytics**

  - Visual representation of extension activities
  - Program impact metrics
  - Real-time statistics

- **Program Management**

  - Create and manage extension programs
  - Track program status and progress
  - Resource allocation and monitoring

- **Reporting System**
  - Generate comprehensive reports
  - Export data in various formats
  - Track key performance indicators

## 🛠️ Installation

1. Clone the repository
   ```bash
   git clone https://github.com/generyand/umdc-cec-system.git
   cd umdc-cec-system
   ```

2. Install dependencies
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the environment variables with your configuration

4. Set up the database
   ```bash
   # Navigate to backend directory
   cd backend

   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev
   ```

5. Start the development servers
   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend server (from frontend directory)
   npm run dev
   ```

6. Access the application
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

## Environment Variables

### Backend (.env)
```env
# Environment
NODE_ENV=production
PORT=3000
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Supabase Configuration (Required)
# Get these values from your Supabase project settings
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Connect to Supabase via connection pooling
DATABASE_URL=""

# Direct connection to the database. Used for migrations
DIRECT_URL=""

```

### Frontend (.env)
```env
# API Configuration
VITE_API_URL=http://localhost:3000
```

> **Note**: This project uses Supabase for authentication, storage, and real-time database features. You'll need to create a Supabase project and configure it before running the application. Visit [Supabase](https://supabase.com) to create your project and get the required configuration values.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- University of Mindanao Digos College for the opportunity to develop this system
- All contributors and stakeholders involved in the project

## 📧 Contact

For any queries or support, please contact:

- Project Maintainer: [Gene Ryan](mailto:generyan.dep@gmail.com), [Vincent Ace Rivera](augusto08rivera12@gmail.com), [Asnari Pacalna](asnaripacalna@gmail.com)
- University of Mindanao Digos College CEC: [umdigoscec@umindanao.edu.ph](mailto:umdigoscec@umindanao.edu.ph)
