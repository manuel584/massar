
export interface Grade {
  id: number;
  name: string;
  color: string;
  icon: string;
  order_index: number;
  studentCount: number;
  sectionCount: number;
}

export interface Section {
  id: number;
  name: string;
  grade_id: number;
}

export interface Student {
  id: number;
  name: string;
  gender: 'male' | 'female';
  section_id: number;
  grade_id: number;
  avatar_level: number;
  total_points: number;
  helpfulness_points: number;
  respect_points: number;
  teamwork_points: number;
  excellence_points: number;
}

export interface Lesson {
  id: number;
  unit_name: string;
  lesson_number: number;
  lesson_name: string;
}

export type ReviewStatus = 'yes' | 'no';
export type PerformanceLevel = 'excellent' | 'very_good' | 'good' | 'acceptable' | 'weak';
export type StarRating = 1 | 2 | 3 | 4 | 5;

export interface LessonProgressData {
  id: number;
  student_id: number;
  lesson_id: number;
  
  // Reviews (Optional now)
  review_1?: boolean;
  review_2?: boolean;
  review_3?: boolean;
  
  // Recitation (Optional now)
  recitation_listening?: PerformanceLevel;
  recitation_meaning?: PerformanceLevel;
  recitation_memorization?: PerformanceLevel;
  
  // Homework (Optional now)
  homework_completion?: boolean;
  homework_quality?: PerformanceLevel;
  
  // Performance (15 pts) - Kept for gamification
  participation: StarRating;
  comprehension: StarRating;
  excellence: StarRating;
  
  notes: string;
  calculated_points: number;
  date: string;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: 'medal' | 'crown' | 'star' | 'trophy' | 'heart';
    color: string;
    condition: (student: Student) => boolean;
}

export type RecognitionCategory = 'helpfulness' | 'respect' | 'teamwork' | 'excellence';

export interface RecognitionLog {
  id: number;
  student_id: number;
  category: RecognitionCategory | 'deduction';
  points: number;
  reason: string;
  date: string;
}

// --- Session Sheet Types ---

export type MarkType = string; // Changed from union to string to allow custom types
export type TimeUnit = 'day' | 'week' | 'month';

export interface MarkDefinition {
  type: MarkType;
  label: string;
  symbol: string;
  color: string;
  weight: number; // 1 for present, 0 for absent, 0.5 for late
}

export interface MarkingConfig {
  id: string;
  name: string;
  marks: MarkDefinition[];
  max_score: number; // For calculating totals
}

export interface SessionMark {
  student_id: number;
  column_index: number;
  type: MarkType;
  context: string; // Critical for distinguishing marks between tabs (attendance vs homework)
  value?: number; // For score based sheets later
}

export interface SessionColumn {
  index: number;
  label: string;
  date?: string;
  notes?: string;
}

export interface SessionSheet {
  id: number;
  section_id: number;
  name: string;
  time_unit: TimeUnit;
  duration: number;
  start_date: string;
  marking_config_id: string;
  columns: SessionColumn[];
  marks: SessionMark[];
  created_at: string;
}

export interface ReportTemplate {
    id: string;
    name: string;
    config: {
        showEngagement: boolean;
        showNotes: boolean;
        showPoints: boolean;
    };
    isDefault: boolean;
}

// --- Constants & Helpers ---

export const PERFORMANCE_SCORES: Record<PerformanceLevel, number> = {
  excellent: 5,
  very_good: 4,
  good: 3,
  acceptable: 2,
  weak: 1
};

export const LEVEL_THRESHOLDS = [
  { level: 1, min: 0, max: 50 },
  { level: 2, min: 51, max: 150 },
  { level: 3, min: 151, max: 300 },
  { level: 4, min: 301, max: 500 },
  { level: 5, min: 501, max: 750 },
  { level: 6, min: 751, max: 1050 },
  { level: 7, min: 1051, max: 1400 },
  { level: 8, min: 1401, max: 1800 },
  { level: 9, min: 1801, max: 2250 },
  { level: 10, min: 2251, max: 99999 },
];

// Default presets (used for initialization)
export const DEFAULT_MARKING_PRESETS: MarkingConfig[] = [
  {
    id: 'attendance',
    name: 'حضور وغياب قياسي',
    max_score: 1,
    marks: [
      { type: 'present', label: 'حاضر', symbol: '✓', color: '#10B981', weight: 1 },
      { type: 'absent', label: 'غائب', symbol: '✗', color: '#EF4444', weight: 0 },
      { type: 'late', label: 'متأخر', symbol: '⏰', color: '#F59E0B', weight: 0.5 },
      { type: 'excused', label: 'معذور', symbol: '📝', color: '#3B82F6', weight: 0 },
    ]
  },
  {
    id: 'homework',
    name: 'متابعة الواجبات',
    max_score: 1,
    marks: [
      { type: 'hw_done', label: 'تم الحل', symbol: '⭐', color: '#10B981', weight: 1 },
      { type: 'hw_late', label: 'حل ناقص', symbol: '⚠️', color: '#F59E0B', weight: 0.5 },
      { type: 'hw_miss', label: 'لم يحل', symbol: '❌', color: '#EF4444', weight: 0 },
    ]
  }
];
