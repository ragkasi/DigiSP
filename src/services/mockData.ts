// Import necessary types and make sure they are used correctly
import { Mentor, Student, Match, Project, ProjectTake, Feedback, ProjectStatus, PracticeSong, TimeSlot, Day, Session, Instrument } from "@/types";

// Create mock student data
export const STUDENTS: Student[] = [
  {
    id: 1,
    name: "Emily Chen",
    instrument: "Violin",
    availability: "Weekday afternoons, Weekends",
    bio: "I've been playing violin for 2 years and want to improve my technique.",
    imageUrl: "https://randomuser.me/api/portraits/women/33.jpg",
    email: "emily.chen@example.com"
  },
  {
    id: 2,
    name: "Miguel Rodriguez",
    instrument: "Guitar",
    availability: "Weekends, Friday evenings",
    bio: "Beginner guitar player looking to learn rock and blues styles.",
    imageUrl: "https://randomuser.me/api/portraits/men/54.jpg",
    email: "miguel.rodriguez@example.com"
  },
  {
    id: 3,
    name: "Jordan Taylor",
    instrument: "Piano",
    availability: "Weekday evenings after 6pm",
    bio: "Intermediate player focusing on classical repertoire.",
    imageUrl: "https://randomuser.me/api/portraits/women/45.jpg",
    email: "jordan.taylor@example.com"
  },
  {
    id: 4,
    name: "Aiden Jackson",
    instrument: "Drums",
    availability: "Tuesday, Thursday afternoons",
    bio: "Self-taught drummer wanting to learn proper technique.",
    imageUrl: "https://randomuser.me/api/portraits/men/22.jpg",
    email: "aiden.jackson@example.com"
  },
  {
    id: 5,
    name: "Sophia Kim",
    instrument: "Flute",
    availability: "Monday, Wednesday mornings",
    bio: "Played in school band for 3 years, looking to advance my skills.",
    imageUrl: "https://randomuser.me/api/portraits/women/64.jpg",
    email: "sophia.kim@example.com"
  }
];

// Create mock mentor data
export const MENTORS: Mentor[] = [
  {
    id: 1,
    name: "Dr. Robert Chen",
    instrument: "Violin",
    availability: "Weekday evenings, Saturday mornings",
    bio: "Concert violinist with 15 years of teaching experience.",
    imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    starRating: 4.9,
    resumeLink: "https://example.com/resume/robert-chen",
    reviews: [
      { name: "Parent of Student", text: "Dr. Chen is incredibly patient and knowledgeable. My child has improved tremendously." },
      { name: "Adult Student", text: "I've tried many teachers, but Dr. Chen's approach finally made techniques click for me." },
      { name: "Former Student", text: "I studied with Dr. Chen through high school and was accepted to Juilliard with his guidance." }
    ],
    approved: true,
    pending: false
  },
  {
    id: 2,
    name: "Marcus Johnson",
    instrument: "Guitar",
    availability: "Afternoons and weekends",
    bio: "Professional guitarist with experience in jazz, blues, rock, and classical styles.",
    imageUrl: "https://randomuser.me/api/portraits/men/86.jpg",
    starRating: 4.7,
    resumeLink: "https://example.com/resume/marcus-johnson",
    reviews: [
      { name: "Teen Student", text: "Marcus makes learning guitar fun! I've learned so many cool songs." },
      { name: "Adult Learner", text: "Great teacher who adapts to your learning style and musical interests." },
      { name: "Parent", text: "My son was losing interest in music until he started with Marcus. Now he practices daily!" }
    ],
    approved: true,
    pending: false
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    instrument: "Piano",
    availability: "Weekdays 9am-3pm",
    bio: "Classically trained pianist with masters from Eastman School of Music. Specializes in beginners and intermediate students.",
    imageUrl: "https://randomuser.me/api/portraits/women/28.jpg",
    starRating: 5.0,
    resumeLink: "https://example.com/resume/elena-rodriguez",
    reviews: [
      { name: "Young Student's Parent", text: "Elena has a magical way with kids. My 5-year-old adores her lessons." },
      { name: "Adult Beginner", text: "I started piano at 40 with Elena and am amazed at how quickly I've progressed." },
      { name: "Intermediate Student", text: "Elena helped me prepare for my college auditions. I got accepted to my first choice!" }
    ],
    approved: true,
    pending: false
  },
  {
    id: 4,
    name: "David Thompson",
    instrument: "Drums",
    availability: "Evenings and weekends",
    bio: "Professional drummer with 20+ years experience touring with major acts. Now focused on teaching all levels.",
    imageUrl: "https://randomuser.me/api/portraits/men/46.jpg",
    starRating: 4.8,
    resumeLink: "https://example.com/resume/david-thompson",
    reviews: [
      { name: "Beginning Student", text: "David breaks down complex rhythms into manageable parts. Great teacher!" },
      { name: "Intermediate Drummer", text: "I've studied with several teachers, but David's approach is the most effective." },
      { name: "Advanced Student", text: "David helped me secure my first professional gig. Forever grateful!" }
    ],
    pending: true
  },
  {
    id: 5,
    name: "Michelle Park",
    instrument: "Flute",
    availability: "Weekday afternoons, Saturday mornings",
    bio: "Principal flutist with the city symphony orchestra. Patient teacher for all ages.",
    imageUrl: "https://randomuser.me/api/portraits/women/91.jpg",
    starRating: 4.9,
    resumeLink: "https://example.com/resume/michelle-park",
    reviews: [
      { name: "Young Student", text: "Ms. Park makes flute lessons fun with games and interesting music." },
      { name: "High School Student", text: "Thanks to Ms. Park, I made first chair in all-state band!" },
      { name: "Adult Student", text: "I'm returning to flute after 20 years and Michelle's teaching is inspiring." }
    ],
    approved: false,
    pending: false
  },
  {
    id: 6,
    name: "James Wilson",
    instrument: "Guitar",
    availability: "Flexible schedule",
    bio: "Folk and bluegrass guitarist with 25 years of performance and 15 years of teaching experience.",
    imageUrl: "https://randomuser.me/api/portraits/men/62.jpg",
    starRating: 4.6,
    resumeLink: "https://example.com/resume/james-wilson",
    reviews: [
      { name: "Beginner", text: "James is incredibly patient and makes learning fun." },
      { name: "Intermediate Student", text: "Since working with James, my fingerpicking has improved dramatically." },
      { name: "Parent", text: "My daughter loves her lessons with James. He keeps her motivated." }
    ],
    pending: true
  },
  {
    id: 7,
    name: "Sarah Ahmed",
    instrument: "Piano",
    availability: "Monday, Wednesday, Friday afternoons",
    bio: "Concert pianist with doctorate in piano performance. Specializes in classical and jazz.",
    imageUrl: "https://randomuser.me/api/portraits/women/37.jpg",
    starRating: 4.9,
    resumeLink: "https://example.com/resume/sarah-ahmed",
    reviews: [
      { name: "Parent", text: "Dr. Ahmed is extraordinary. My son has flourished under her guidance." },
      { name: "College Student", text: "Sarah helped me prepare for my conservatory auditions with great success." },
      { name: "Adult Student", text: "I've always wanted to play jazz piano. Sarah's approach makes it accessible." }
    ],
    approved: true,
    pending: false
  },
  {
    id: 8,
    name: "Thomas Lee",
    instrument: "Violin",
    availability: "Tuesdays, Thursdays, weekends",
    bio: "Chamber musician and orchestral player with 10 years teaching experience.",
    imageUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    starRating: 4.7,
    resumeLink: "https://example.com/resume/thomas-lee",
    reviews: [
      { name: "Young Student's Parent", text: "Thomas has a gentle approach that keeps my child engaged." },
      { name: "Teenage Student", text: "Mr. Lee helped me prepare for competitions and improve my technique." },
      { name: "Adult Beginner", text: "I never thought I could learn violin as an adult, but Thomas proved me wrong!" }
    ],
    pending: true
  }
];

// Create mock matches between mentors and students
export const MATCHES: Match[] = [
  {
    mentor: MENTORS[0], // Dr. Robert Chen (Violin)
    student: STUDENTS[0] // Emily Chen (Violin)
  },
  {
    mentor: MENTORS[1], // Marcus Johnson (Guitar)
    student: STUDENTS[1] // Miguel Rodriguez (Guitar)
  },
  {
    mentor: MENTORS[2], // Elena Rodriguez (Piano)
    student: STUDENTS[2] // Jordan Taylor (Piano)
  },
  {
    mentor: MENTORS[3], // David Thompson (Drums)
    student: STUDENTS[3] // Aiden Jackson (Drums)
  },
  {
    mentor: MENTORS[0], // Dr. Robert Chen (Violin)
    student: STUDENTS[4] // Sophia Kim (Flute) - cross-instrument mentorship
  }
];

// Practice songs for students to work on
export const PRACTICE_SONGS: PracticeSong[] = [
  {
    id: 1,
    title: "Twinkle, Twinkle, Little Star",
    composer: "Traditional",
    instrument: "Violin",
    difficulty: "Beginner",
    sheetMusicUrl: "/sheet-music/twinkle-twinkle.png",
    tempo: 80
  },
  {
    id: 2,
    title: "Minuet in G",
    composer: "J.S. Bach",
    instrument: "Piano",
    difficulty: "Beginner",
    sheetMusicUrl: "/sheet-music/twinkle-twinkle.png", // Using placeholder
    tempo: 70
  },
  {
    id: 3,
    title: "Romanza",
    composer: "Anonymous",
    instrument: "Guitar",
    difficulty: "Intermediate",
    sheetMusicUrl: "/sheet-music/twinkle-twinkle.png", // Using placeholder
    tempo: 60
  },
  {
    id: 4,
    title: "Basic Rock Beat",
    composer: "Traditional",
    instrument: "Drums",
    difficulty: "Beginner",
    sheetMusicUrl: "/sheet-music/twinkle-twinkle.png", // Using placeholder
    tempo: 90
  },
  {
    id: 5,
    title: "Greensleeves",
    composer: "Traditional",
    instrument: "Flute",
    difficulty: "Beginner",
    sheetMusicUrl: "/sheet-music/twinkle-twinkle.png", // Using placeholder
    tempo: 65
  }
];

// Mock projects data
let PROJECTS: Project[] = [
  {
    id: 1,
    title: "Twinkle, Twinkle, Little Star",
    studentId: 1, // Emily Chen
    mentorId: 1, // Dr. Robert Chen
    instrument: "Violin",
    sheetMusicUrl: "/sheet-music/twinkle-twinkle.png",
    tempo: 80,
    status: "In Progress",
    createdAt: new Date(2025, 3, 1),
    takes: [
      {
        id: 101,
        projectId: 1,
        recordedAt: new Date(2025, 3, 1),
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        feedback: [
          {
            id: 201,
            takeId: 101,
            mentorId: 1,
            measureNumber: 2,
            comment: "Watch your bow position here, it should be closer to the bridge.",
            resolved: false
          },
          {
            id: 202,
            takeId: 101,
            mentorId: 1,
            measureNumber: 5,
            comment: "Good intonation on this measure!",
            resolved: true
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Minuet in G",
    studentId: 3, // Jordan Taylor
    mentorId: 2, // Elena Rodriguez
    instrument: "Piano",
    sheetMusicUrl: "/sheet-music/twinkle-twinkle.png", // Using placeholder
    tempo: 70,
    status: "Needs Work",
    createdAt: new Date(2025, 3, 2),
    takes: [
      {
        id: 102,
        projectId: 2,
        recordedAt: new Date(2025, 3, 2),
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        feedback: [
          {
            id: 203,
            takeId: 102,
            mentorId: 2,
            measureNumber: 3,
            comment: "Try to keep a steady tempo throughout this section.",
            resolved: false
          }
        ]
      },
      {
        id: 103,
        projectId: 2,
        recordedAt: new Date(2025, 3, 3),
        videoUrl: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
        feedback: []
      }
    ],
    reflection: "I'm finding the rhythm in measures 3-4 challenging. Need to practice with metronome more."
  },
  {
    id: 3,
    title: "Romanza",
    studentId: 2, // Miguel Rodriguez
    mentorId: 1, // Marcus Johnson
    instrument: "Guitar",
    sheetMusicUrl: "/sheet-music/twinkle-twinkle.png", // Using placeholder
    tempo: 60,
    status: "Not Started",
    createdAt: new Date(2025, 3, 4),
    takes: []
  }
];

// NEW FUNCTION: Get practice songs by instrument
export const getPracticeSongsByInstrument = (instrument: Instrument): PracticeSong[] => {
  return PRACTICE_SONGS.filter(song => song.instrument === instrument);
};

// NEW FUNCTION: Create a new project
export const createProject = (data: {
  title: string;
  studentId: number;
  instrument: Instrument;
  sheetMusicUrl: string;
  tempo: number;
}): Project => {
  const newProjectId = Math.max(...PROJECTS.map(p => p.id), 0) + 1;
  
  const newProject: Project = {
    id: newProjectId,
    title: data.title,
    studentId: data.studentId,
    instrument: data.instrument,
    sheetMusicUrl: data.sheetMusicUrl,
    tempo: data.tempo,
    status: "Not Started",
    createdAt: new Date(),
    takes: []
  };
  
  PROJECTS.push(newProject);
  return newProject;
};

// NEW FUNCTION: Add a new student
export const addStudent = (data: Omit<Student, "id">): Student => {
  const newStudentId = Math.max(...STUDENTS.map(s => s.id), 0) + 1;
  
  const newStudent: Student = {
    id: newStudentId,
    ...data
  };
  
  STUDENTS.push(newStudent);
  return newStudent;
};

// NEW FUNCTION: Add a new mentor
export const addMentor = (data: Omit<Mentor, "id" | "approved" | "pending" | "reviews">): Mentor => {
  const newMentorId = Math.max(...MENTORS.map(m => m.id), 0) + 1;
  
  const newMentor: Mentor = {
    id: newMentorId,
    ...data,
    reviews: [], // Initialize with empty reviews array
    approved: false,
    pending: true
  };
  
  MENTORS.push(newMentor);
  return newMentor;
};

// NEW FUNCTION: Find mentors matching criteria
export const findMatchingMentors = (instrument: string, availability?: string): Mentor[] => {
  let matchingMentors = MENTORS.filter(m => 
    m.approved && m.instrument === instrument
  );
  
  if (availability && availability.trim() !== "") {
    // Very simple matching - just check if the mentor's availability string
    // contains any part of the student's availability string
    matchingMentors = matchingMentors.filter(m => 
      m.availability.toLowerCase().includes(availability.toLowerCase()) ||
      availability.toLowerCase().includes(m.availability.toLowerCase())
    );
  }
  
  return matchingMentors;
};

// NEW FUNCTION: Add a new match
export const addMatch = (data: Match): Match => {
  MATCHES.push(data);
  return data;
};

// NEW FUNCTION: Get projects for a student
export const getStudentProjects = (studentId: number): Project[] => {
  return PROJECTS.filter(project => project.studentId === studentId);
};

// Function to add a new project take
export const addProjectTake = (projectId: number, data: { videoUrl: string }) => {
  const project = PROJECTS.find(p => p.id === projectId);
  
  if (!project) {
    throw new Error(`Project with ID ${projectId} not found`);
  }
  
  const newTakeId = Math.max(...PROJECTS.flatMap(p => p.takes.map(t => t.id)), 0) + 1;
  
  const newTake: ProjectTake = {
    id: newTakeId,
    projectId,
    recordedAt: new Date(),
    videoUrl: data.videoUrl,
    feedback: []
  };
  
  // Update the project with the new take
  project.takes.push(newTake);
  project.status = "In Progress";
  
  return newTake;
};

// Function to add feedback to a take
export const addFeedback = (
  takeId: number, 
  projectId: number, 
  data: { takeId: number; mentorId: number; measureNumber?: number; comment: string; resolved: boolean }
) => {
  const project = PROJECTS.find(p => p.id === projectId);
  if (!project) {
    throw new Error(`Project with ID ${projectId} not found`);
  }
  
  const take = project.takes.find(t => t.id === takeId);
  if (!take) {
    throw new Error(`Take with ID ${takeId} not found in project ${projectId}`);
  }
  
  const newFeedbackId = Math.max(...PROJECTS.flatMap(p => p.takes.flatMap(t => t.feedback ? t.feedback.map(f => f.id) : [0])), 0) + 1;
  
  const newFeedback: Feedback = {
    id: newFeedbackId,
    takeId,
    mentorId: data.mentorId,
    measureNumber: data.measureNumber,
    comment: data.comment,
    resolved: false
  };
  
  // Make sure feedback array exists
  if (!take.feedback) {
    take.feedback = [];
  }
  
  take.feedback.push(newFeedback);
  return newFeedback;
};

// Function to update project status
export const updateProjectStatus = (projectId: number, status: ProjectStatus) => {
  const project = PROJECTS.find(p => p.id === projectId);
  
  if (!project) {
    throw new Error(`Project with ID ${projectId} not found`);
  }
  
  project.status = status;
  return project;
};

// Function to update project reflection
export const updateProjectReflection = (projectId: number, reflection: string) => {
  const project = PROJECTS.find(p => p.id === projectId);
  
  if (!project) {
    throw new Error(`Project with ID ${projectId} not found`);
  }
  
  project.reflection = reflection;
  return project;
};

export { PROJECTS };
