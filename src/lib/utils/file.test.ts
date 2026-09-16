import { describe, it, expect } from 'vitest';
import { generateOutputFilename, formatFileSize } from './file';
import { validateVideoFile, validateTrimRange } from './validation';

describe('file utils', () => {
  describe('generateOutputFilename', () => {
    it('appends -trimmed to original filename', () => {
      expect(generateOutputFilename('sample.mp4')).toBe('sample-trimmed.mp4');
      expect(generateOutputFilename('my.video.clip.webm')).toBe('my.video.clip-trimmed.webm');
      expect(generateOutputFilename('noextension')).toBe('noextension-trimmed.mp4');
    });

    it('handles empty filename', () => {
      expect(generateOutputFilename('', 'mp4')).toBe('trimmed-video.mp4');
    });
  });

  describe('formatFileSize', () => {
    it('formats bytes into human readable format', () => {
      expect(formatFileSize(500)).toBe('500.00 B');
      expect(formatFileSize(1024)).toBe('1.00 KB');
      expect(formatFileSize(1048576 * 5.5)).toBe('5.50 MB');
    });
  });

  describe('validateVideoFile', () => {
    it('validates supported video files', () => {
      const file = new File(['dummy content'], 'video.mp4', { type: 'video/mp4' });
      expect(validateVideoFile(file).valid).toBe(true);
    });

    it('rejects unsupported files', () => {
      const file = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });
      const result = validateVideoFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Unsupported file format');
    });

    it('rejects empty files', () => {
      const file = new File([], 'empty.mp4', { type: 'video/mp4' });
      const result = validateVideoFile(file);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty');
    });
  });

  describe('validateTrimRange', () => {
    it('validates correct trim range', () => {
      expect(validateTrimRange(2, 10, 30).valid).toBe(true);
    });

    it('rejects start >= end', () => {
      expect(validateTrimRange(10, 5, 30).valid).toBe(false);
      expect(validateTrimRange(10, 10, 30).valid).toBe(false);
    });

    it('rejects clips shorter than minimum duration', () => {
      expect(validateTrimRange(5, 5.2, 30, 0.5).valid).toBe(false);
    });
  });
});
