import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { teachersAPI, studentsAPI, timetableAPI, attendanceAPI } from '../services/api';
import { Teacher, Student, TimetableEntry, AttendanceRecord } from '../types';

const TeacherPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('timetable');
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [selectedClass, setSelectedClass] = useState('10');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMap, setAttendanceMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTeacherData();
  }, []);

  useEffect(() => {
    if (activeTab === 'students' || activeTab === 'attendance') {
      loadStudents();
    }
  }, [selectedClass, activeTab]);

  const loadTeacherData = async () => {
    try {
      const teacherRes = await teachersAPI.getMe();
      setTeacher(teacherRes.data);

      const timetableRes = await timetableAPI.getAll({ teacher_id: teacherRes.data.id });
      setTimetable(timetableRes.data);
    } catch (err) {
      console.error('Error loading teacher data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await studentsAPI.getAll({ class: selectedClass });
      setStudents(res.data);

      // Initialize attendance map
      const map: Record<number, string> = {};
      res.data.forEach((s: Student) => { map[s.user_id] = 'present'; });
      setAttendanceMap(map);
    } catch (err) {
      console.error('Error loading students:', err);
    }
  };

  const handleMarkAttendance = async () => {
    setSaving(true);
    setMessage('');
    try {
      const records = Object.entries(attendanceMap).map(([userId, status]) => ({
        user_id: parseInt(userId),
        role: 'student',
        date: attendanceDate,
        status,
      }));

      await attendanceAPI.bulkMark(records);
      setMessage('Attendance marked successfully!');
    } catch (err) {
      setMessage('Error marking attendance. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPersonalAttendance = async (status: string) => {
    setSaving(true);
    setMessage('');
    try {
      await attendanceAPI.mark({
        user_id: user?.id,
        role: 'teacher',
        date: attendanceDate,
        status,
      });
      setMessage(`Personal attendance marked as ${status}!`);
    } catch (err) {
      setMessage('Error marking attendance.');
    } finally {
      setSaving(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const tabs = [
    { key: 'timetable', label: 'Timetable', icon: '📅' },
    { key: 'students', label: 'Students', icon: '👨‍🎓' },
    { key: 'attendance', label: 'Attendance', icon: '📋' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <span className="text-2xl font-display font-bold text-emerald-300">
                {user?.name?.charAt(0) || 'T'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">{user?.name}</h1>
              <p className="text-navy-300 font-body text-sm">
                {teacher?.subject} Teacher | Attendance: {teacher?.attendance}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-navy-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-lg font-body font-semibold text-sm whitespace-nowrap transition-all
                  ${activeTab === tab.key ? 'tab-active' : 'tab-inactive'}`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded-xl font-body text-sm ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
            {message}
          </div>
        )}

        {/* Timetable */}
        {activeTab === 'timetable' && (
          <div>
            <h2 className="text-2xl font-display font-bold text-navy-900 mb-6">My Timetable</h2>
            <div className="card overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-navy-50">
                    <th className="text-left p-4 font-body font-semibold text-navy-700 text-sm">Time</th>
                    {days.map((day) => (
                      <th key={day} className="text-left p-4 font-body font-semibold text-navy-700 text-sm">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from(new Set(timetable.map((t) => t.time))).sort().map((time) => (
                    <tr key={time} className="border-t border-navy-100">
                      <td className="p-4 font-mono text-sm text-navy-600 whitespace-nowrap">{time}</td>
                      {days.map((day) => {
                        const entry = timetable.find((t) => t.time === time && t.day === day);
                        return (
                          <td key={day} className="p-4">
                            {entry ? (
                              <div className="bg-primary-50 rounded-lg p-2">
                                <p className="font-body font-semibold text-navy-900 text-sm">{entry.subject}</p>
                                <p className="text-navy-400 text-xs font-body">Class {entry.class}</p>
                              </div>
                            ) : (
                              <span className="text-navy-300 text-sm">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Students */}
        {activeTab === 'students' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-display font-bold text-navy-900">Students List</h2>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="input-field w-auto"
              >
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
            </div>

            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-navy-50">
                    <th className="text-left p-4 font-body font-semibold text-navy-700 text-sm">Roll No</th>
                    <th className="text-left p-4 font-body font-semibold text-navy-700 text-sm">Name</th>
                    <th className="text-left p-4 font-body font-semibold text-navy-700 text-sm">Section</th>
                    <th className="text-left p-4 font-body font-semibold text-navy-700 text-sm">Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-t border-navy-100 hover:bg-navy-50/50">
                      <td className="p-4 font-mono text-sm text-navy-600">{s.roll_no}</td>
                      <td className="p-4 font-body font-semibold text-navy-900 text-sm">{s.name}</td>
                      <td className="p-4 font-body text-sm text-navy-600">{s.section}</td>
                      <td className="p-4">
                        <span className={`font-body font-semibold text-sm
                          ${s.attendance >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {s.attendance}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Attendance */}
        {activeTab === 'attendance' && (
          <div>
            <h2 className="text-2xl font-display font-bold text-navy-900 mb-6">Mark Attendance</h2>

            {/* Personal attendance */}
            <div className="card p-6 mb-8">
              <h3 className="font-display font-semibold text-navy-900 mb-4">My Attendance</h3>
              <div className="flex flex-wrap items-center gap-4">
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="input-field w-auto"
                />
                <button onClick={() => handleMarkPersonalAttendance('present')} className="btn-primary text-sm py-2">
                  Mark Present
                </button>
                <button onClick={() => handleMarkPersonalAttendance('absent')} className="btn-outline text-sm py-2 border-red-300 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600">
                  Mark Absent
                </button>
              </div>
            </div>

            {/* Student attendance */}
            <div className="card p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h3 className="font-display font-semibold text-navy-900">Student Attendance — Class {selectedClass}</h3>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="input-field w-auto"
                >
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                </select>
              </div>

              <div className="space-y-3 mb-6">
                {students.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-navy-50/50">
                    <div>
                      <p className="font-body font-semibold text-navy-900 text-sm">{s.name}</p>
                      <p className="text-navy-400 text-xs font-body">Roll: {s.roll_no} | Section {s.section}</p>
                    </div>
                    <select
                      value={attendanceMap[s.user_id] || 'present'}
                      onChange={(e) => setAttendanceMap((prev) => ({ ...prev, [s.user_id]: e.target.value }))}
                      className={`px-3 py-1.5 rounded-lg text-sm font-body font-semibold border
                        ${attendanceMap[s.user_id] === 'present' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                          attendanceMap[s.user_id] === 'absent' ? 'bg-red-50 border-red-200 text-red-700' :
                          'bg-amber-50 border-amber-200 text-amber-700'}`}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </div>
                ))}
              </div>

              <button
                onClick={handleMarkAttendance}
                disabled={saving}
                className="btn-primary disabled:opacity-60"
              >
                {saving ? 'Saving...' : 'Submit Attendance'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherPortal;
