export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'new' | 'read' | 'replied';
}

class ContactStorage {
  private storageKey = 'contact_submissions';

  // Get all submissions
  getSubmissions(): ContactSubmission[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading contact submissions:', error);
      return [];
    }
  }

  // Add new submission
  addSubmission(submission: Omit<ContactSubmission, 'id' | 'timestamp' | 'status'>): ContactSubmission {
    const newSubmission: ContactSubmission = {
      ...submission,
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    const submissions = this.getSubmissions();
    submissions.unshift(newSubmission); // Add to beginning
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(submissions));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('contact_submissions_updated'));
      }
    } catch (error) {
      console.error('Error saving contact submission:', error);
    }

    return newSubmission;
  }

  // Update submission status
  updateSubmissionStatus(id: string, status: ContactSubmission['status']): void {
    const submissions = this.getSubmissions();
    const submission = submissions.find(s => s.id === id);
    
    if (submission) {
      submission.status = status;
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(submissions));
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('contact_submissions_updated'));
        }
      } catch (error) {
        console.error('Error updating submission status:', error);
      }
    }
  }

  // Delete submission
  deleteSubmission(id: string): void {
    const submissions = this.getSubmissions();
    const filtered = submissions.filter(s => s.id !== id);
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('contact_submissions_updated'));
      }
    } catch (error) {
      console.error('Error deleting submission:', error);
    }
  }

  // Get submission count by status
  getSubmissionCounts() {
    const submissions = this.getSubmissions();
    return {
      total: submissions.length,
      new: submissions.filter(s => s.status === 'new').length,
      read: submissions.filter(s => s.status === 'read').length,
      replied: submissions.filter(s => s.status === 'replied').length
    };
  }

  // Get recent submissions (last 10)
  getRecentSubmissions(count: number = 10): ContactSubmission[] {
    return this.getSubmissions().slice(0, count);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const contactStorage = new ContactStorage();