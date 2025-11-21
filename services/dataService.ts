
import { Grade, Student, Section, RecognitionLog, LessonProgressData, LEVEL_THRESHOLDS, Lesson, SessionSheet, SessionMark, TimeUnit, MarkingConfig, DEFAULT_MARKING_PRESETS, Badge, ReportTemplate } from '../types';

// Storage Keys
const KEYS = {
  GRADES: 'masar_grades_v2',
  SECTIONS: 'masar_sections_v2',
  STUDENTS: 'masar_students_v2',
  LOGS: 'masar_logs_v2',
  LESSONS_PROGRESS: 'masar_lessons_progress_v2',
  LESSON_DEFINITIONS: 'masar_lesson_definitions_v2',
  SESSIONS: 'masar_sessions_v2',
  TEACHER_PROFILE: 'masar_teacher_profile_v2',
  THEME: 'masar_theme_v2',
  MARKING_PRESETS: 'masar_marking_presets_v2',
  REPORT_TEMPLATES: 'masar_report_templates_v2'
};

// Initial Data - Empty state
const INITIAL_GRADES: Grade[] = [];
const INITIAL_SECTIONS: Section[] = [];
const INITIAL_STUDENTS: Student[] = [];
const INITIAL_LESSONS: Lesson[] = [];

const BADGES_DEFINITIONS: Badge[] = [
    {
        id: 'first_10',
        name: 'البداية المشرقة',
        description: 'الحصول على أول 10 نقاط',
        icon: 'star',
        color: '#FCD34D',
        condition: (s) => s.total_points >= 10
    },
    {
        id: 'points_100',
        name: 'المجتهد',
        description: 'الوصول إلى 100 نقطة',
        icon: 'medal',
        color: '#60A5FA',
        condition: (s) => s.total_points >= 100
    },
    {
        id: 'points_500',
        name: 'المتميز',
        description: 'الوصول إلى 500 نقطة',
        icon: 'trophy',
        color: '#A78BFA',
        condition: (s) => s.total_points >= 500
    },
    {
        id: 'helpfulness_50',
        name: 'قلب كبير',
        description: '50 نقطة في المساعدة',
        icon: 'heart',
        color: '#34D399',
        condition: (s) => s.helpfulness_points >= 50
    },
    {
        id: 'level_5',
        name: 'قائد صغير',
        description: 'الوصول للمستوى 5',
        icon: 'crown',
        color: '#F472B6',
        condition: (s) => s.avatar_level >= 5
    }
];

class DataService {
  private grades: Grade[];
  private sections: Section[];
  private students: Student[];
  private logs: RecognitionLog[];
  private lessonsProgress: LessonProgressData[];
  private lessonDefinitions: Lesson[];
  private sessions: SessionSheet[];
  private markingPresets: MarkingConfig[];
  private reportTemplates: ReportTemplate[];

  constructor() {
    this.grades = this.load(KEYS.GRADES, INITIAL_GRADES);
    this.sections = this.load(KEYS.SECTIONS, INITIAL_SECTIONS);
    this.students = this.load(KEYS.STUDENTS, INITIAL_STUDENTS);
    this.logs = this.load(KEYS.LOGS, []);
    this.lessonsProgress = this.load(KEYS.LESSONS_PROGRESS, []);
    this.lessonDefinitions = this.load(KEYS.LESSON_DEFINITIONS, INITIAL_LESSONS);
    this.sessions = this.load(KEYS.SESSIONS, []);
    this.markingPresets = this.load(KEYS.MARKING_PRESETS, DEFAULT_MARKING_PRESETS);
    this.reportTemplates = this.load(KEYS.REPORT_TEMPLATES, []);
  }

  private load<T>(key: string, fallback: T): T {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  }

  private save() {
    localStorage.setItem(KEYS.GRADES, JSON.stringify(this.grades));
    localStorage.setItem(KEYS.SECTIONS, JSON.stringify(this.sections));
    localStorage.setItem(KEYS.STUDENTS, JSON.stringify(this.students));
    localStorage.setItem(KEYS.LOGS, JSON.stringify(this.logs));
    localStorage.setItem(KEYS.LESSONS_PROGRESS, JSON.stringify(this.lessonsProgress));
    localStorage.setItem(KEYS.LESSON_DEFINITIONS, JSON.stringify(this.lessonDefinitions));
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(this.sessions));
    localStorage.setItem(KEYS.MARKING_PRESETS, JSON.stringify(this.markingPresets));
    localStorage.setItem(KEYS.REPORT_TEMPLATES, JSON.stringify(this.reportTemplates));
  }

  // --- Grade Management (Cascade Delete) ---
  getGrades(): Grade[] {
    return this.grades.map(g => ({
        ...g,
        sectionCount: this.sections.filter(s => s.grade_id === g.id).length,
        studentCount: this.students.filter(s => s.grade_id === g.id).length
    }));
  }

  addGrade(name: string, color: string, icon: string) {
      const newGrade: Grade = {
          id: Date.now(),
          name,
          color,
          icon,
          order_index: this.grades.length + 1,
          studentCount: 0,
          sectionCount: 0
      };
      this.grades.push(newGrade);
      this.save();
      return newGrade;
  }

  updateGrade(id: number, name: string, color: string, icon: string) {
      const grade = this.grades.find(g => g.id === id);
      if (grade) {
          grade.name = name;
          grade.color = color;
          grade.icon = icon;
          this.save();
      }
  }

  deleteGrade(id: number) {
      // 1. Identify all related data
      const relatedSectionIds = this.sections.filter(s => s.grade_id === id).map(s => s.id);
      const relatedStudentIds = this.students.filter(s => s.grade_id === id).map(s => s.id);

      // 2. Remove Session Sheets linked to these sections
      this.sessions = this.sessions.filter(s => !relatedSectionIds.includes(s.section_id));

      // 3. Remove Logs, Progress, and Marks linked to these students
      this.logs = this.logs.filter(l => !relatedStudentIds.includes(l.student_id));
      this.lessonsProgress = this.lessonsProgress.filter(lp => !relatedStudentIds.includes(lp.student_id));

      // 4. Remove Students
      this.students = this.students.filter(s => s.grade_id !== id);

      // 5. Remove Sections
      this.sections = this.sections.filter(s => s.grade_id !== id);

      // 6. Remove Grade
      this.grades = this.grades.filter(g => g.id !== id);
      
      this.save();
  }

  // --- Section Management ---
  getSections(gradeId: number): Section[] {
    return this.sections.filter(s => s.grade_id === gradeId);
  }

  getAllSections(): Section[] {
    return this.sections;
  }

  addSection(gradeId: number, name: string) {
      const newSection: Section = {
          id: Date.now(),
          name,
          grade_id: gradeId
      };
      this.sections.push(newSection);
      this.save();
      return newSection;
  }

  deleteSection(id: number) {
      // Cascade delete: Students + their data
      const relatedStudentIds = this.students.filter(s => s.section_id === id).map(s => s.id);
      
      this.logs = this.logs.filter(l => !relatedStudentIds.includes(l.student_id));
      this.lessonsProgress = this.lessonsProgress.filter(lp => !relatedStudentIds.includes(lp.student_id));
      this.sessions = this.sessions.filter(s => s.section_id !== id);
      
      this.students = this.students.filter(s => s.section_id !== id);
      this.sections = this.sections.filter(s => s.id !== id);
      this.save();
  }

  // --- Student Management (Add Student Logic) ---
  getStudentsBySection(sectionId: number): Student[] {
    return this.students.filter(s => s.section_id === sectionId);
  }
  
  getAllStudents(): Student[] {
    return this.students;
  }

  getStudent(id: number): Student | undefined {
    return this.students.find(s => s.id === id);
  }

  addStudent(name: string, gender: 'male' | 'female', sectionId: number, gradeId: number) {
      const newStudent: Student = {
          id: Date.now(),
          name,
          gender,
          section_id: sectionId,
          grade_id: gradeId,
          // Initialize with defaults as requested
          avatar_level: 1,
          total_points: 0,
          helpfulness_points: 0,
          respect_points: 0,
          teamwork_points: 0,
          excellence_points: 0
      };
      this.students.push(newStudent);
      this.save();
      return newStudent;
  }

  deleteStudent(id: number) {
      this.logs = this.logs.filter(l => l.student_id !== id);
      this.lessonsProgress = this.lessonsProgress.filter(lp => lp.student_id !== id);
      
      // Clean marks in sessions
      this.sessions.forEach(sheet => {
          if (sheet.marks) sheet.marks = sheet.marks.filter(m => m.student_id !== id);
      });

      this.students = this.students.filter(s => s.id !== id);
      this.save();
  }

  // --- Gamification Logic ---
  addPoints(studentId: number, points: number, category: 'helpfulness' | 'respect' | 'teamwork' | 'excellence' | 'lesson' | 'deduction', reason: string) {
    const student = this.students.find(s => s.id === studentId);
    if (!student) return;

    student.total_points += points;
    if (student.total_points < 0) student.total_points = 0;

    if (category !== 'lesson' && category !== 'deduction') {
      const key = `${category}_points` as keyof Student;
      if (typeof student[key] === 'number') {
        (student[key] as number) += points;
        // Optional: Prevent negative category scores
        // if ((student[key] as number) < 0) (student[key] as number) = 0;
      }
    }

    const newLevel = LEVEL_THRESHOLDS.find(l => student.total_points >= l.min && student.total_points <= l.max)?.level || student.avatar_level;
    student.avatar_level = newLevel;

    this.logs.push({
      id: Date.now(),
      student_id: studentId,
      category: category as any,
      points,
      reason,
      date: new Date().toISOString()
    });

    this.save();
    return student;
  }
  
  bulkAddPoints(sectionId: number, points: number, category: string, reason: string) {
      const students = this.getStudentsBySection(sectionId);
      students.forEach(s => this.addPoints(s.id, points, category as any, reason));
  }

  // --- Other Helpers ---
  getAllLessons(): Lesson[] { return this.lessonDefinitions; }
  getLessonInfo(id: number) { return this.lessonDefinitions.find(l => l.id === id); }
  addLessons(newLessons: any[]) { 
      const timestamp = Date.now();
      const toAdd = newLessons.map((l, i) => ({...l, id: timestamp + i}));
      this.lessonDefinitions = [...this.lessonDefinitions, ...toAdd];
      this.save();
  }
  
  getLogs(studentId: number) { return this.logs.filter(l => l.student_id === studentId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); }
  
  saveLessonProgress(data: LessonProgressData) {
    this.lessonsProgress = this.lessonsProgress.filter(l => !(l.student_id === data.student_id && l.lesson_id === data.lesson_id));
    this.lessonsProgress.push(data);
    this.addPoints(data.student_id, data.calculated_points, 'lesson', 'إتمام درس');
    this.save();
  }
  
  getStudentLessonProgress(studentId: number, lessonId: number) {
      const entries = this.lessonsProgress.filter(l => l.student_id === studentId && l.lesson_id === lessonId);
      return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  }

  calculateLevelProgress(points: number) {
    const level = LEVEL_THRESHOLDS.find(l => points >= l.min && points <= l.max);
    if (!level) return { currentLevel: 10, nextThreshold: 99999, remaining: 0, percent: 100 };
    const range = level.max - level.min;
    const current = points - level.min;
    const percent = Math.min(100, Math.max(0, (current / range) * 100));
    return { currentLevel: level.level, nextThreshold: level.max + 1, remaining: level.max + 1 - points, percent };
  }

  getStudentRank(studentId: number) {
      const student = this.students.find(s => s.id === studentId);
      if (!student) return { rank: 0, total: 0 };
      const gradeStudents = this.students.filter(s => s.grade_id === student.grade_id);
      const sorted = gradeStudents.sort((a, b) => b.total_points - a.total_points);
      return { rank: sorted.findIndex(s => s.id === studentId) + 1, total: gradeStudents.length };
  }
  
  getTopStudents(limit: number = 5, sectionId?: number | null) {
      let pool = this.students;
      if (sectionId) pool = pool.filter(s => s.section_id === sectionId);
      return [...pool].sort((a, b) => b.total_points - a.total_points).slice(0, limit);
  }
  
  getStudentBadges(studentId: number) {
      const student = this.students.find(s => s.id === studentId);
      if (!student) return [];
      return BADGES_DEFINITIONS.map(badge => ({ badge, earned: badge.condition(student) }));
  }

  // Session Sheets
  getSessionsBySection(sectionId: number) {
    return this.sessions.filter(s => s.section_id === sectionId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }
  
  getSessionSheet(id: number) { return this.sessions.find(s => s.id === id); }
  
  createSessionSheet(sectionId: number, name: string, timeUnit: TimeUnit, duration: number, startDate: string, markingConfigId: string) {
      const columns = [];
      const start = new Date(startDate);
      for (let i = 0; i < duration; i++) {
          const current = new Date(start);
          let label = `${i+1}`;
          let dateStr = '';
          if (timeUnit === 'day') { current.setDate(start.getDate() + i); dateStr = current.toLocaleDateString('ar-EG', {day:'numeric', month:'numeric'}); label = dateStr; }
          else if (timeUnit === 'week') { current.setDate(start.getDate() + (i*7)); dateStr = current.toLocaleDateString('ar-EG', {day:'numeric', month:'numeric'}); label = `أسبوع ${i+1}`; }
          else if (timeUnit === 'month') { current.setMonth(start.getMonth() + i); dateStr = current.toLocaleDateString('ar-EG', {month:'long'}); label = dateStr; }
          columns.push({ index: i, label, date: dateStr });
      }
      const newSheet: SessionSheet = { id: Date.now(), section_id: sectionId, name, time_unit: timeUnit, duration, start_date: startDate, marking_config_id: markingConfigId, columns, marks: [], created_at: new Date().toISOString() };
      this.sessions.push(newSheet);
      this.save();
      return newSheet;
  }
  
  updateSessionMark(sheetId: number, studentId: number, colIndex: number, type: any, context: string) {
      const sheet = this.sessions.find(s => s.id === sheetId);
      if (!sheet) return;
      const idx = sheet.marks.findIndex(m => m.student_id === studentId && m.column_index === colIndex && m.context === context);
      if (idx > -1) {
          if (type === null) sheet.marks.splice(idx, 1);
          else sheet.marks[idx].type = type;
      } else if (type !== null) {
          sheet.marks.push({ student_id: studentId, column_index: colIndex, type, context });
      }
      this.save();
  }

  // Configs & Templates
  getMarkingConfigs() { return this.markingPresets; }
  updateMarkingConfig(config: MarkingConfig) {
      const idx = this.markingPresets.findIndex(p => p.id === config.id);
      if (idx > -1) this.markingPresets[idx] = config;
      else this.markingPresets.push(config);
      this.save();
  }
  resetMarkingConfigs() { this.markingPresets = DEFAULT_MARKING_PRESETS; this.save(); }
  getReportTemplates() { return this.reportTemplates; }
  saveReportTemplate(t: ReportTemplate) {
      if (t.isDefault) this.reportTemplates.forEach(tmp => tmp.isDefault = false);
      const idx = this.reportTemplates.findIndex(tmp => tmp.id === t.id);
      if (idx > -1) this.reportTemplates[idx] = t;
      else this.reportTemplates.push(t);
      this.save();
  }
  deleteReportTemplate(id: string) { this.reportTemplates = this.reportTemplates.filter(t => t.id !== id); this.save(); }

  // Settings
  updateTeacherProfile(name: string, subject: string) { localStorage.setItem(KEYS.TEACHER_PROFILE, JSON.stringify({name, subject})); }
  getTeacherProfile() { const s = localStorage.getItem(KEYS.TEACHER_PROFILE); return s ? JSON.parse(s) : {name:'المعلم', subject:'عام'}; }
  setTheme(isDark: boolean) { 
      localStorage.setItem(KEYS.THEME, JSON.stringify(isDark));
      if(isDark) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark');
  }
  getTheme() { const s = localStorage.getItem(KEYS.THEME); return s ? JSON.parse(s) : false; }
  
  resetAllData() {
      Object.values(KEYS).forEach(k => localStorage.removeItem(k));
      window.location.reload();
  }
  
  getClassAveragePoints(gradeId: number) {
      const students = this.students.filter(s => s.grade_id === gradeId);
      if (!students.length) return 0;
      return Math.round(students.reduce((sum, s) => sum + s.total_points, 0) / students.length);
  }
  
  getBehaviorDistribution(sectionId: number | null) {
      const students = sectionId ? this.students.filter(s => s.section_id === sectionId) : this.students;
      const totalHelp = students.reduce((s, st) => s + st.helpfulness_points, 0);
      const totalRespect = students.reduce((s, st) => s + st.respect_points, 0);
      const totalTeam = students.reduce((s, st) => s + st.teamwork_points, 0);
      const totalExc = students.reduce((s, st) => s + st.excellence_points, 0);
      const total = totalHelp + totalRespect + totalTeam + totalExc || 1;
      return { 
          helpfulness: Math.round((totalHelp/total)*100), 
          respect: Math.round((totalRespect/total)*100), 
          teamwork: Math.round((totalTeam/total)*100), 
          excellence: Math.round((totalExc/total)*100) 
      };
  }
  
  getSectionStats(sectionId: number) {
      const section = this.sections.find(s => s.id === sectionId);
      if (!section) return null;
      const students = this.getStudentsBySection(sectionId);
      if (!students.length) return { id: sectionId, name: section.name, averagePoints: 0, studentCount: 0, distribution: { helpfulness: 0, respect: 0, teamwork: 0, excellence: 0 } };
      const avg = Math.round(students.reduce((s, st) => s + st.total_points, 0) / students.length);
      return { id: sectionId, name: section.name, averagePoints: avg, studentCount: students.length, distribution: this.getBehaviorDistribution(sectionId) };
  }
  
  getStudentStats(studentId: number) {
      const s = this.getStudent(studentId);
      if (!s) return null;
      return { id: s.id, name: s.name, totalPoints: s.total_points, level: s.avatar_level, breakdown: { helpfulness: s.helpfulness_points, respect: s.respect_points, teamwork: s.teamwork_points, excellence: s.excellence_points } };
  }
}

export const db = new DataService();
