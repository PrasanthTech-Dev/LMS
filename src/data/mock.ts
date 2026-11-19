import { cover } from '@/utils/cover'
import type { Chapter, Course, Enrollment, Material, Notification, Plan, QuizQuestion, Review, User } from '@/types'

export const categories = [
  'Web Development',
  'Data Science',
  'UI/UX Design',
  'Mobile Development',
  'Cloud & DevOps',
  'Cybersecurity',
  'Business',
  'Artificial Intelligence',
]


const mkChapters = (prefix: string, titles: string[][]): Chapter[] =>
  titles.map((lessons, ci) => ({
    id: `${prefix}-c${ci + 1}`,
    title: ['Getting Started', 'Core Concepts', 'Hands-on Practice', 'Advanced Techniques', 'Final Project'][ci] ?? `Chapter ${ci + 1}`,
    lessons: lessons.map((t, li) => {
      const type: Chapter['lessons'][number]['type'] =
        t.startsWith('Quiz') ? 'quiz' : t.startsWith('Assignment') ? 'assignment' : t.startsWith('Read') ? 'reading' : 'video'
      return {
        id: `${prefix}-c${ci + 1}-l${li + 1}`,
        title: t,
        type,
        duration: type === 'quiz' ? 10 : type === 'assignment' ? 30 : 6 + ((ci * 3 + li * 5) % 14),
        preview: ci === 0 && li < 2,
      }
    }),
  }))

const materials: Material[] = [
  { id: 'm1', name: 'Course Slides.pdf', size: '4.2 MB', type: 'PDF' },
  { id: 'm2', name: 'Starter Project Files.zip', size: '12.8 MB', type: 'ZIP' },
  { id: 'm3', name: 'Cheat Sheet.pdf', size: '820 KB', type: 'PDF' },
  { id: 'm4', name: 'Practice Workbook.docx', size: '1.6 MB', type: 'DOCX' },
]

const reviews = (seed: number): Review[] => [
  { id: `r${seed}1`, user: 'Aarav Mehta', rating: 5, comment: 'Clear explanations and very practical projects. Exactly what I needed to get job-ready.', date: '2026-10-02' },
  { id: `r${seed}2`, user: 'Priya Nair', rating: 5, comment: 'The pace is perfect and the instructor genuinely cares. The assignments reinforce every concept.', date: '2026-09-18' },
  { id: `r${seed}3`, user: 'Daniel Okafor', rating: 4, comment: 'Excellent content overall. I would love a few more advanced exercises in the last chapter.', date: '2026-08-27' },
  { id: `r${seed}4`, user: 'Meera Krishnan', rating: 5, comment: 'Best course on the topic I have taken. Downloadable resources are a great bonus.', date: '2026-08-04' },
]

const base = (
  id: string,
  o: Partial<Course> & Pick<Course, 'title' | 'subtitle' | 'category' | 'level' | 'price' | 'originalPrice' | 'instructorId' | 'instructorName'>,
): Course => ({
  id,
  description:
    'A comprehensive, project-driven course that takes you from fundamentals to production-ready skills. Learn with concise video lessons, real-world assignments, quizzes, and downloadable resources designed by industry practitioners.',
  thumbnail: cover(o.tags?.[0] ?? o.category, o.category),
  rating: 4.7,
  reviewCount: 1280,
  students: 8420,
  duration: 24,
  language: 'English',
  updatedAt: '2026-10-15',
  tags: [],
  outcomes: [
    'Build real-world projects from scratch',
    'Apply industry best practices and patterns',
    'Understand core concepts with confidence',
    'Prepare for interviews and professional work',
    'Debug, test and ship production-quality work',
    'Earn a verifiable certificate of completion',
  ],
  requirements: ['A computer with internet access', 'Basic familiarity with programming concepts', 'Curiosity and willingness to practice'],
  chapters: mkChapters(id, [
    ['Welcome & course overview', 'Setting up your environment', 'Read: Course roadmap', 'Quiz: Foundations check'],
    ['Understanding the fundamentals', 'Working with data and state', 'Patterns you will use daily', 'Read: Common pitfalls', 'Quiz: Core concepts'],
    ['Build: Feature walkthrough', 'Build: Handling edge cases', 'Optimizing performance', 'Assignment: Build a mini project'],
    ['Architecture and scaling', 'Testing and quality', 'Deployment workflow', 'Quiz: Advanced review'],
    ['Project planning', 'Implementation sprint', 'Review and polish', 'Assignment: Capstone submission'],
  ]),
  materials,
  reviews: reviews(Number(id.replace(/\D/g, '')) || 1),
  status: 'published',
  ...o,
})

export const courses: Course[] = [
  base('c1', {
    title: 'Complete React & TypeScript Masterclass',
    subtitle: 'Build scalable production apps with React 19, TypeScript, Redux Toolkit and Vite.',
    category: 'Web Development', level: 'Intermediate', price: 49, originalPrice: 99,
    instructorId: 'i1', instructorName: 'Rahul Verma', rating: 4.9, reviewCount: 3421, students: 18240, duration: 36,
    tags: ['React', 'TypeScript', 'Redux'], bestseller: true,
    thumbnail: '/course-react.jpg',
  }),
  base('c2', {
    title: 'Data Science with Python: Zero to Hero',
    subtitle: 'Pandas, NumPy, visualisation and machine learning with real datasets.',
    category: 'Data Science', level: 'Beginner', price: 39, originalPrice: 79,
    instructorId: 'i2', instructorName: 'Dr. Ananya Rao', rating: 4.8, reviewCount: 5210, students: 26540, duration: 42,
    tags: ['Python', 'Pandas', 'ML'], bestseller: true,
    thumbnail: '/course-python.jpg',
  }),
  base('c3', {
    title: 'UI/UX Design Foundations in Figma',
    subtitle: 'Design research, wireframes, design systems and high-fidelity prototypes.',
    category: 'UI/UX Design', level: 'Beginner', price: 29, originalPrice: 69,
    instructorId: 'i3', instructorName: 'Sofia Martinez', rating: 4.7, reviewCount: 2190, students: 11320, duration: 21,
    tags: ['Figma', 'Design Systems', 'Prototyping'],
    thumbnail: '/course-uiux.jpg',
  }),
  base('c4', {
    title: 'Node.js & Express API Bootcamp',
    subtitle: 'Design secure REST APIs with authentication, validation and testing.',
    category: 'Web Development', level: 'Intermediate', price: 34, originalPrice: 74,
    instructorId: 'i1', instructorName: 'Rahul Verma', rating: 4.6, reviewCount: 1820, students: 9410, duration: 28,
    tags: ['Node.js', 'Express', 'REST'],
    thumbnail: '/course-nodejs.jpg',
  }),
  base('c5', {
    title: 'AWS Cloud Practitioner to Solutions Architect',
    subtitle: 'Master core AWS services, networking, security and cost optimisation.',
    category: 'Cloud & DevOps', level: 'Intermediate', price: 59, originalPrice: 109,
    instructorId: 'i4', instructorName: 'Karthik Subramanian', rating: 4.8, reviewCount: 4020, students: 15320, duration: 48,
    tags: ['AWS', 'Cloud', 'DevOps'], bestseller: true,
    thumbnail: '/course-aws.jpg',
  }),
  base('c6', {
    title: 'Flutter & Dart: Build Mobile Apps',
    subtitle: 'Create beautiful cross-platform iOS and Android apps with one codebase.',
    category: 'Mobile Development', level: 'Beginner', price: 34, originalPrice: 69,
    instructorId: 'i5', instructorName: 'Neha Kapoor', rating: 4.5, reviewCount: 1560, students: 7210, duration: 32,
    tags: ['Flutter', 'Dart', 'Mobile'],
    thumbnail: '/course-flutter.jpg',
  }),
  base('c7', {
    title: 'Ethical Hacking & Cybersecurity Essentials',
    subtitle: 'Learn penetration testing, threat modelling and defensive security.',
    category: 'Cybersecurity', level: 'Advanced', price: 64, originalPrice: 119,
    instructorId: 'i4', instructorName: 'Karthik Subramanian', rating: 4.7, reviewCount: 2740, students: 8960, duration: 38,
    tags: ['Security', 'Pentesting', 'Networking'],
    thumbnail: '/course-security.jpg',
  }),
  base('c8', {
    title: 'Generative AI & Prompt Engineering',
    subtitle: 'Build LLM-powered applications, agents and retrieval pipelines.',
    category: 'Artificial Intelligence', level: 'Intermediate', price: 44, originalPrice: 89,
    instructorId: 'i2', instructorName: 'Dr. Ananya Rao', rating: 4.9, reviewCount: 3890, students: 21410, duration: 26,
    tags: ['LLM', 'AI', 'Python'], bestseller: true,
    thumbnail: '/course-ai.jpg',
  }),
  base('c9', {
    title: 'Product Management & Business Strategy',
    subtitle: 'Frameworks for roadmaps, prioritisation, metrics and stakeholder alignment.',
    category: 'Business', level: 'Beginner', price: 24, originalPrice: 54,
    instructorId: 'i3', instructorName: 'Sofia Martinez', rating: 4.8, reviewCount: 1420, students: 8310, duration: 15,
    tags: ['Product', 'Strategy', 'Business'], status: 'published',
    thumbnail: '/course-product.jpg',
  }),
  base('c10', {
    title: 'Advanced CSS, Tailwind & Animation',
    subtitle: 'Craft pixel-perfect responsive interfaces with modern CSS and motion.',
    category: 'Web Development', level: 'Advanced', price: 27, originalPrice: 64,
    instructorId: 'i1', instructorName: 'Rahul Verma', rating: 4.8, reviewCount: 1430, students: 6820, duration: 18,
    tags: ['CSS', 'Tailwind', 'Animation'], status: 'published',
    thumbnail: '/course-css.jpg',
  }),
  base('c11', {
    title: 'Digital Marketing Masterclass: Ads, SEO & Social Media',
    subtitle: 'Master Google Ads, Meta advertising, SEO strategies, email automation and content marketing.',
    category: 'Business', level: 'Beginner', price: 39, originalPrice: 79,
    instructorId: 'i3', instructorName: 'Sofia Martinez', rating: 4.9, reviewCount: 3240, students: 16450, duration: 22,
    tags: ['Marketing', 'SEO', 'Business'], bestseller: true, status: 'published',
    thumbnail: '/course-marketing.jpg',
  }),
  base('c12', {
    title: 'Growth Marketing & Conversion Rate Optimisation',
    subtitle: 'Data-driven customer acquisition, funnel optimisation, viral loops, A/B testing and retention.',
    category: 'Business', level: 'Intermediate', price: 34, originalPrice: 69,
    instructorId: 'i3', instructorName: 'Sofia Martinez', rating: 4.7, reviewCount: 1820, students: 9740, duration: 19,
    tags: ['Growth', 'Marketing', 'Analytics'], status: 'published',
    thumbnail: '/course-growth.jpg',
  }),
]

export const users: User[] = [
  { id: 's1', name: 'Prasanth', email: 'student@edulearn.dev', role: 'student', joinedAt: '2026-06-12', bio: 'Frontend developer passionate about building polished interfaces.', phone: '+91 98765 43210', location: 'Chennai, India', status: 'active' },
  { id: 's2', name: 'Aarav Mehta', email: 'aarav@example.com', role: 'student', joinedAt: '2026-05-20', status: 'active' },
  { id: 's3', name: 'Priya Nair', email: 'priya@example.com', role: 'student', joinedAt: '2026-07-03', status: 'active' },
  { id: 's4', name: 'Daniel Okafor', email: 'daniel@example.com', role: 'student', joinedAt: '2026-07-19', status: 'suspended' },
  { id: 's5', name: 'Meera Krishnan', email: 'meera@example.com', role: 'student', joinedAt: '2026-08-11', status: 'active' },
  { id: 's6', name: 'Liam Carter', email: 'liam@example.com', role: 'student', joinedAt: '2026-09-02', status: 'active' },
  { id: 's7', name: 'Ishita Sharma', email: 'ishita@example.com', role: 'student', joinedAt: '2026-09-25', status: 'active' },
  { id: 's8', name: 'Noah Williams', email: 'noah@example.com', role: 'student', joinedAt: '2026-10-08', status: 'active' },
  { id: 'i1', name: 'Rahul Verma', email: 'instructor@edulearn.dev', role: 'instructor', joinedAt: '2025-11-02', bio: 'Senior engineer and educator with 10+ years in web development.', status: 'active' },
  { id: 'i2', name: 'Dr. Ananya Rao', email: 'ananya@edulearn.dev', role: 'instructor', joinedAt: '2025-12-14', status: 'active' },
  { id: 'i3', name: 'Sofia Martinez', email: 'sofia@edulearn.dev', role: 'instructor', joinedAt: '2026-01-09', status: 'active' },
  { id: 'i4', name: 'Karthik Subramanian', email: 'karthik@edulearn.dev', role: 'instructor', joinedAt: '2026-02-21', status: 'active' },
  { id: 'i5', name: 'Neha Kapoor', email: 'neha@edulearn.dev', role: 'instructor', joinedAt: '2026-03-30', status: 'suspended' },
  { id: 'a1', name: 'Admin User', email: 'admin@edulearn.dev', role: 'admin', joinedAt: '2025-01-01', status: 'active' },
]

export const demoCredentials = {
  student: { email: 'student@edulearn.dev', password: 'Student@123' },
  instructor: { email: 'instructor@edulearn.dev', password: 'Instructor@123' },
  admin: { email: 'admin@edulearn.dev', password: 'Admin@123' },
}

export const seedEnrollments: Enrollment[] = [
  { id: 'e1', courseId: 'c1', userId: 's1', enrolledAt: '2026-09-01', completedLessons: ['c1-c1-l1', 'c1-c1-l2', 'c1-c1-l3', 'c1-c1-l4', 'c1-c2-l1', 'c1-c2-l2'] },
  { id: 'e2', courseId: 'c3', userId: 's1', enrolledAt: '2026-08-10', completedLessons: ['c3-c1-l1', 'c3-c1-l2'] },
  {
    id: 'e3', courseId: 'c8', userId: 's1', enrolledAt: '2026-06-20', completedAt: '2026-08-02',
    completedLessons: courses.find((c) => c.id === 'c8')!.chapters.flatMap((ch) => ch.lessons.map((l) => l.id)),
  },
]

export const seedNotifications: Notification[] = [
  { id: 'n1', title: 'Certificate ready', message: 'Your certificate for Generative AI & Prompt Engineering is ready to download.', type: 'success', read: false, createdAt: '2026-11-15T09:30:00' },
  { id: 'n2', title: 'New lesson added', message: 'Rahul Verma added new lessons to Complete React & TypeScript Masterclass.', type: 'info', read: false, createdAt: '2026-11-14T16:10:00' },
  { id: 'n3', title: 'Assignment due soon', message: 'Mini project in UI/UX Design Foundations is due in 2 days.', type: 'warning', read: false, createdAt: '2026-11-13T11:45:00' },
  { id: 'n4', title: 'Quiz graded: 96%', message: 'Great job! You scored 96% in the advanced React state management quiz.', type: 'success', read: false, createdAt: '2026-11-12T14:20:00' },
  { id: 'n5', title: 'Live Q&A tomorrow', message: 'Join the live interactive Q&A session with industry mentors at 5 PM.', type: 'info', read: false, createdAt: '2026-11-11T10:00:00' },
  { id: 'n6', title: 'Course update available', message: 'New chapters on Tailwind CSS v4 and Framer Motion have been added.', type: 'info', read: false, createdAt: '2026-11-10T08:15:00' },
  { id: 'n7', title: 'Feedback received', message: 'An instructor reviewed your capstone repository and left 3 comments.', type: 'info', read: false, createdAt: '2026-11-09T18:40:00' },
  { id: 'n8', title: 'Weekly study streak', message: 'You reached a 7-day learning streak! Keep up the great momentum.', type: 'success', read: false, createdAt: '2026-11-08T12:00:00' },
  { id: 'n9', title: 'New discussion reply', message: 'Priya replied to your thread in Full-Stack Web Development community.', type: 'info', read: false, createdAt: '2026-11-07T15:30:00' },
  { id: 'n10', title: 'Welcome to EduLearn', message: 'Explore 1,000+ courses and start learning today.', type: 'info', read: false, createdAt: '2026-11-06T10:00:00' },
]

export const plans: Plan[] = [
  { id: 'p1', name: 'Free', price: 0, period: 'forever', features: ['Access to free previews', 'Community support', 'Basic progress tracking'] },
  { id: 'p2', name: 'Pro', price: 15, period: 'month', highlight: true, features: ['Unlimited course access', 'Downloadable resources', 'Certificates of completion', 'Priority support', 'Offline-ready materials'] },
  { id: 'p3', name: 'Teams', price: 49, period: 'month', features: ['Everything in Pro', 'Up to 10 learners', 'Team analytics dashboard', 'Admin controls', 'Custom learning paths'] },
]

export const quizBank: QuizQuestion[] = [
  { id: 'q1', question: 'Which hook is used to manage local component state in React?', options: ['useEffect', 'useState', 'useMemo', 'useRef'], answer: 1 },
  { id: 'q2', question: 'What does TypeScript add to JavaScript?', options: ['A new runtime', 'Static type checking', 'A virtual DOM', 'Server rendering'], answer: 1 },
  { id: 'q3', question: 'In Redux Toolkit, which function creates a slice of state?', options: ['createStore', 'createAction', 'createSlice', 'combineReducers'], answer: 2 },
  { id: 'q4', question: 'Which HTTP method is conventionally used to update an existing resource fully?', options: ['GET', 'POST', 'PUT', 'DELETE'], answer: 2 },
  { id: 'q5', question: 'What is the purpose of a React key prop in lists?', options: ['Styling elements', 'Identifying items between renders', 'Encrypting data', 'Lazy loading'], answer: 1 },
]

// ---- Admin analytics ----
export const monthlyRevenue = [
  { month: 'Jun', revenue: 38000, enrollments: 320 },
  { month: 'Jul', revenue: 46000, enrollments: 402 },
  { month: 'Aug', revenue: 52000, enrollments: 455 },
  { month: 'Sep', revenue: 64000, enrollments: 560 },
  { month: 'Oct', revenue: 79000, enrollments: 702 },
  { month: 'Nov', revenue: 71000, enrollments: 618 },
]

export const weeklyActivity = [
  { day: 'Mon', hours: 3.2 },
  { day: 'Tue', hours: 4.1 },
  { day: 'Wed', hours: 2.6 },
  { day: 'Thu', hours: 5.0 },
  { day: 'Fri', hours: 3.8 },
  { day: 'Sat', hours: 6.4 },
  { day: 'Sun', hours: 4.9 },
]

export const enrollmentRows = [
  { id: 'en1', student: 'Aarav Mehta', course: 'Complete React & TypeScript Masterclass', date: '2026-11-14', amount: 49, status: 'Paid' },
  { id: 'en2', student: 'Priya Nair', course: 'Data Science with Python: Zero to Hero', date: '2026-11-13', amount: 39, status: 'Paid' },
  { id: 'en3', student: 'Liam Carter', course: 'AWS Cloud Practitioner to Solutions Architect', date: '2026-11-12', amount: 59, status: 'Pending' },
  { id: 'en4', student: 'Ishita Sharma', course: 'Generative AI & Prompt Engineering', date: '2026-11-11', amount: 44, status: 'Paid' },
  { id: 'en5', student: 'Noah Williams', course: 'UI/UX Design Foundations in Figma', date: '2026-11-10', amount: 29, status: 'Refunded' },
  { id: 'en6', student: 'Meera Krishnan', course: 'Node.js & Express API Bootcamp', date: '2026-11-09', amount: 34, status: 'Paid' },
  { id: 'en7', student: 'Daniel Okafor', course: 'Ethical Hacking & Cybersecurity Essentials', date: '2026-11-08', amount: 64, status: 'Paid' },
]
