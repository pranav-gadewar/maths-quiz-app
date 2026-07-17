backend/
├── src/
│   ├── config/
│   │   └── db.ts                 # MongoDB connection
│   │
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── quizController.ts
│   │   └── studentController.ts
│   │
│   ├── middleware/
│   │   ├── authMiddleware.ts
│   │   └── errorMiddleware.ts
│   │
│   ├── models/
│   │   ├── Admin.ts
│   │   ├── Student.ts
│   │   └── Quiz.ts
│   │
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── quizRoutes.ts
│   │   └── studentRoutes.ts
│   │
│   ├── types/                    # Custom TypeScript types/interfaces
│   │   ├── quiz.d.ts
│   │   └── student.d.ts
│   │
│   ├── utils/
│   │   └── generateToken.ts       # JWT token generation
│   │
│   ├── app.ts                     # Express app setup
│   └── server.ts                  # Server entry point
│
├── uploads/                        # Local storage (optional for profile images)
│   └── profile_images/
│
├── package.json
├── tsconfig.json
└── .env

frontend/
├── public/                         # Static assets: images, icons, fonts
│
├── src/
│   ├── app/                        # Everything goes here
│   │   ├── components/
│   │   │   ├── common/             # Buttons, inputs, modals
│   │   │   ├── layout/             # Navbar/Footer and Layout wrapper
│   │   │   │   ├── Layout.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Footer.tsx
│   │   │   └── quiz/               # Quiz-specific components
│   │   │
│   │   ├── context/                # React Context API for global state
│   │   │   ├── authContext.tsx
│   │   │   └── quizContext.tsx
│   │   │
│   │   ├── pages/                  # Your routes
│   │   │   ├── admin/              # Admin dashboard pages
│   │   │   │   ├── dashboard.tsx
│   │   │   │   ├── addQuiz.tsx
│   │   │   │   └── manageStudents.tsx
│   │   │   │
│   │   │   ├── student/            # Student dashboard pages
│   │   │   │   ├── dashboard.tsx
│   │   │   │   ├── profile.tsx
│   │   │   │   ├── quizHistory.tsx
│   │   │   │   └── takeQuiz/[quizId].tsx
│   │   │   │
│   │   │   ├── auth/               # Login & register pages
│   │   │   │   ├── login.tsx
│   │   │   │   └── register.tsx
│   │   │   │
│   │   │   └── index.tsx           # Landing/Home page
│   │   │
│   │   ├── services/               # API calls (axios/fetch)
│   │   │   ├── authService.ts
│   │   │   ├── quizService.ts
│   │   │   └── studentService.ts
│   │   │
│   │   ├── styles/                 # Global & component styles
│   │   │   └── globals.css
│   │   │
│   │   ├── types/                  # TypeScript interfaces
│   │   │   ├── quiz.d.ts
│   │   │   └── student.d.ts
│   │   │
│   │   └── utils/                  # Helper functions
│   │       └── formatDate.ts
│   │
├── package.json
├── tsconfig.json
└── .env.local


Next.js + Supabase Project Structure:
src/
├── app/
│   ├── (public)/                  # Publicly accessible pages
│   │   ├── page.tsx               # Landing Page (includes Navbar + Dashboard + Footer)
│   │   ├── dashboard/page.tsx     # Common Dashboard (pre-login, optional separate page)
│   │   └── about/page.tsx         # Optional extra page
│   │
│   ├── (auth)/                    # Authentication
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (student)/                 # Student pages (protected)
│   │   ├── dashboard/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── quiz/[quizId]/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (admin)/                   # Admin pages (protected)
│   │   ├── dashboard/page.tsx
│   │   ├── add-quiz/page.tsx
│   │   ├── manage-students/page.tsx
│   │   └── layout.tsx
│   │
│   ├── api/                       # Serverless backend
│   │   ├── quizzes/route.ts
│   │   ├── auth/route.ts
│   │   └── students/route.ts
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── Navbar.tsx                 # Shared Navbar for all pages
│   ├── Footer.tsx                 # Shared Footer for all pages
│   ├── Dashboard.tsx              # Common dashboard component for pre-login users
│   └── RoleGuard.tsx              # Protects admin/student routes
│
├── lib/
│   ├── supabaseClient.ts          # Supabase client instance
│   ├── getUserRole.ts             # Utility to get user role from Supabase
│   └── types.ts                   # TS types/interfaces
│
├── services/
│   ├── authService.ts
│   ├── quizService.ts
│   └── studentService.ts
│
└── .env.local
