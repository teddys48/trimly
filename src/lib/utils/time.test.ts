import { describe, it, expect } from 'vitest';
import { formatTime, parseTime, clamp } from './time';

describe('time utils', () => {
  describe('formatTime', () => {
    it('formats seconds without millis', () => {
      expect(formatTime(65, false)).toBe('01:05');
      expect(formatTime(3665, false)).toBe('01:01:05');
      expect(formatTime(0, false)).toBe('00:00');
    });

    it('formats seconds with millis', () => {
      expect(formatTime(65.45, true)).toBe('01:05.45');
      expect(formatTime(0.5, true)).toBe('00:00.50');
      expect(formatTime(3600, true)).toBe('01:00:00.00');
    });

    it('handles negative or invalid values gracefully', () => {
      expect(formatTime(-5, true)).toBe('00:00.00');
      expect(formatTime(NaN, false)).toBe('00:00');
    });
  });

  describe('parseTime', () => {
    it('parses SS or S.s format', () => {
      expect(parseTime('45')).toBe(45);
      expect(parseTime('45.5')).toBe(45.5);
    });

    it('parses MM:SS format', () => {
      expect(parseTime('01:30')).toBe(90);
      expect(parseTime('02:05.5')).toBe(125.5);
    });

    it('parses HH:MM:SS format', () => {
      expect(parseTime('01:00:00')).toBe(3600);
      expect(parseTime('01:01:05.25')).toBe(3665.25);
    });

    it('returns null for invalid strings', () => {
      expect(parseTime('invalid')).toBeNull();
      expect(parseTime('-10')).toBeNull();
      expect(parseTime('01:70:00')).toBeNull();
    });
  });

  describe('clamp', () => {
    it('clamps values correctly', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });
});
