import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentsAPI, marksAPI, timetableAPI, attendanceAPI } from '../services/api';
import { Student, Mark, TimetableEntry, AttendanceRecord, ExamType } from '../types';

const examLabels: Record<ExamType, string> = {
  unit1: 'Unit 1',
  unit2: 'Unit 2',
  midterm: 'Midterm',
  final: 'Final',
};

const StudentPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('timetable');
  const [student, setStudent] = useState<Student | null>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedExam, setSelectedExam] = useState<ExamType>('unit1');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      const studentRes = await studentsAPI.getMe();
      setStudent(studentRes.data);

      const [marksRes, timetableRes, attendanceRes] = await Promise.all([
        marksAPI.getAll({ student_id: studentRes.data.id }),
        timetableAPI.getAll({ class: studentRes.data.class }),
        attendanceAPI.getAll({ student_id: studentRes.data.id }),
      ]);

      setMarks(marksRes.data);
      setTimetable(timetableRes.data);
      setAttendance(attendanceRes.data);
    } catch (err) {
      console.error('Error loading student data:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMarks = marks.filter((m) => m.exam_type === selectedExam);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const tabs = [
    { key: 'timetable', label: 'Timetable', icon: '📅' },
    { key: 'marks', label: 'Marks', icon: '📝' },
    { key: 'attendance', label: 'Attendance', icon: '📋' },
    { key: 'exams', label: 'Exams', icon: '🎯' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-navy-500 font-body">Loading your portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Portal Header */}
      <div className="bg-navy-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
              <span className="text-2xl font-display font-bold text-primary-300">
                {user?.name?.charAt(0) || 'S'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">{user?.name}</h1>
              <p className="text-navy-300 font-body text-sm">
                Class {student?.class} - Section {student?.section} | Roll No: {student?.roll_no}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Timetable Tab */}
        {activeTab === 'timetable' && (
          <div>
            <h2 className="text-2xl font-display font-bold text-navy-900 mb-6">Weekly Timetable</h2>
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
                  {Array.from(new Set(timetable.map((t) => t.time))).map((time) => (
                    <tr key={time} className="border-t border-navy-100">
                      <td className="p-4 font-mono text-sm text-navy-600 whitespace-nowrap">{time}</td>
                      {days.map((day) => {
                        const entry = timetable.find((t) => t.time === time && t.day === day);
                        return (
                          <td key={day} className="p-4">
                            {entry ? (
                              <div>
                                <p className="font-body font-semibold text-navy-900 text-sm">{entry.subject}</p>
                                <p className="text-navy-400 text-xs font-body">{entry.teacher_name}</p>
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

        {/* Marks Tab */}
        {activeTab === 'marks' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-display font-bold text-navy-900">Academic Marks</h2>
              <div className="flex gap-2">
                {(Object.keys(examLabels) as ExamType[]).map((exam) => (
                  <button
                    key={exam}
                    onClick={() => setSelectedExam(exam)}
                    className={`px-4 py-2 rounded-lg font-body font-semibold text-sm transition-all
                      ${selectedExam === exam ? 'tab-active' : 'tab-inactive'}`}
                  >
                    {examLabels[exam]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMarks.map((mark) => (
                <div key={mark.id} className="card p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-body font-semibold text-navy-900">{mark.subject}</h3>
                    <span className={`text-2xl font-display font-bold
                      ${mark.marks >= 90 ? 'text-emerald-600' : mark.marks >= 70 ? 'text-blue-600' : mark.marks >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                      {mark.marks}
                    </span>
                  </div>
                  <div className="w-full bg-navy-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500
                        ${mark.marks >= 90 ? 'bg-emerald-500' : mark.marks >= 70 ? 'bg-blue-500' : mark.marks >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${mark.marks}%` }}
                    />
                  </div>
                  <p className="text-navy-400 text-xs font-body mt-2">Out of 100</p>
                </div>
              ))}
            </div>

            {filteredMarks.length === 0 && (
              <div className="text-center py-12 text-navy-400 font-body">
                No marks available for {examLabels[selectedExam]}.
              </div>
            )}
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div>
            <h2 className="text-2xl font-display font-bold text-navy-900 mb-6">Attendance Record</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="card p-6 text-center">
                <p className="text-3xl font-display font-bold text-emerald-600">{student?.attendance || 0}%</p>
                <p className="text-navy-500 font-body text-sm mt-1">Overall Attendance</p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-3xl font-display font-bold text-blue-600">
                  {attendance.filter((a) => a.status === 'present').length}
                </p>
                <p className="text-navy-500 font-body text-sm mt-1">Days Present</p>
              </div>
              <div className="card p-6 text-center">
                <p className="text-3xl font-display font-bold text-red-500">
                  {attendance.filter((a) => a.status === 'absent').length}
                </p>
                <p className="text-navy-500 font-body text-sm mt-1">Days Absent</p>
              </div>
            </div>

            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-navy-50">
                    <th className="text-left p-4 font-body font-semibold text-navy-700 text-sm">Date</th>
                    <th className="text-left p-4 font-body font-semibold text-navy-700 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.slice(0, 20).map((record) => (
                    <tr key={record.id} className="border-t border-navy-100">
                      <td className="p-4 font-body text-sm text-navy-700">
                        {new Date(record.date).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-body font-semibold
                          ${record.status === 'present' ? 'bg-emerald-100 text-emerald-700' :
                            record.status === 'absent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Exams Tab */}
        {activeTab === 'exams' && (
          <div>
            <h2 className="text-2xl font-display font-bold text-navy-900 mb-6">Exam Schedule</h2>
            <div className="space-y-4">
              {[
                { name: 'Unit Test 1', date: 'July 15 - July 22, 2026', status: 'Completed' },
                { name: 'Unit Test 2', date: 'Sept 10 - Sept 17, 2026', status: 'Completed' },
                { name: 'Midterm Examination', date: 'Nov 5 - Nov 15, 2026', status: 'Upcoming' },
                { name: 'Final Examination', date: 'Feb 20 - Mar 5, 2027', status: 'Upcoming' },
              ].map((exam, i) => (
                <div key={i} className="card p-6 flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-navy-900">{exam.name}</h3>
                    <p className="text-navy-500 font-body text-sm mt-1">{exam.date}</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-body font-semibold
                    ${exam.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                    {exam.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;
