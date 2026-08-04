// Lesson content index - re-exports all modules
// This file is populated as agents complete writing each module

export interface LessonContent {
  objectives: string[];
  keyTerms: { term: string; definition: string }[];
  content: string;
}

export type ModuleLessons = Record<number, LessonContent>;

// Combined lesson content for all modules
export function getLessonContent(moduleNum: number, lessonNum: number): LessonContent | null {
  try {
    // Dynamic import based on module number
    switch (moduleNum) {
      case 1: {
        const { module1Lessons } = require('./module1');
        return module1Lessons[lessonNum] || null;
      }
      case 2: {
        const { module2Lessons } = require('./module2');
        return module2Lessons[lessonNum] || null;
      }
      case 3: {
        const { module3Lessons } = require('./module3');
        return module3Lessons[lessonNum] || null;
      }
      case 4: {
        const { module4Lessons } = require('./module4');
        return module4Lessons[lessonNum] || null;
      }
      case 5: {
        const { module5Lessons } = require('./module5');
        return module5Lessons[lessonNum] || null;
      }
      case 6: {
        const { module6Lessons } = require('./module6');
        return module6Lessons[lessonNum] || null;
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
}
