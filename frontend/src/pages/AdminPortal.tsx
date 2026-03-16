import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentsAPI, teachersAPI, marksAPI, timetableAPI, attendanceAPI } from '../services/api';
import { Student, Teacher, Mark, TimetableEntry, ExamType } from '../types';

const examLabels: Record<ExamType, string> = {
  unit1: 'Unit 1', unit2: 'Unit 2', midterm: 'Midterm', final: 'Final',
};

const AdminPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedClass, setSelectedClass] = useState('10');
  const [selectedExam, setSelectedExam] = useState<ExamType>('unit1');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'student' | 'teacher' | 'mark' | 'timetable'>('student');
  const [editData, setEditData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    if (activeTab === 'students') loadStudents();
    if (activeTab === 'teachers') loadTeachers();
  }, [selectedClass, activeTab]);

  const loadAllData = async () => {
    try {
      await Promise.all([loadStudents(), loadTeachers()]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    const res = await studentsAPI.getAll({ class: selectedClass });
    setStudents(res.data);
  };

  const loadTeachers = async () => {
    const res = await teachersAPI.getAll();
    setTeachers(res.data);
  };

  const loadMarks = async (studentId: number) => {
    const res = await marksAPI.getAll({ student_id: studentId, exam_type: selectedExam });
    setMarks(res.data);
  };

  const loadTimetable = async () => {
    const res = await timetableAPI.getAll({ class: selectedClass });
    setTimetable(res.data);
  };

  const openModal = (type: typeof modalType, data?: any) => {
    setModalType(type);
    setEditData(data || null);
    setFormData(data ? { ...data } : {});
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      switch (modalType) {
        case 'student':
          if (editData?.id) {
            await studentsAPI.update(editData.id, formData);
          } else {
            await studentsAPI.create(formData);
          }
          await loadStudents();
          break;
        case 'teacher':
          if (editData?.id) {
            await teachersAPI.update(editData.id, formData);
          } else {
            await teachersAPI.create(formData);
          }
          await loadTeachers();
          break;
        case 'mark':
          await marksAPI.create(formData);
          if (selectedStudentId) await loadMarks(selectedStudentId);
          break;
        case 'timetable':
          if (editData?.id) {
            await timetableAPI.update(editData.id, formData);
          } else {
            await timetableAPI.create(formData);
          }
          await loadTimetable();
          break;
      }
      setShowModal(false);
      setMessage('Saved successfully!');
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Error saving data.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      switch (type) {
        case 'student': await studentsAPI.delete(id); await loadStudents(); break;
        case 'teacher': await teachersAPI.delete(id); await loadTeachers(); break;
        case 'mark': await marksAPI.delete(id); if (selectedStudentId) await loadMarks(selectedStudentId); break;
        case 'timetable': await timetableAPI.delete(id); await loadTimetable(); break;
      }
      setMessage('Deleted successfully.');
    } catch (err) {
      setMessage('Error deleting record.');
    }
  };

  const tabs = [
    { key: 'students', label: 'Students', icon: '👨‍🎓' },
    { key: 'teachers', label: 'Teachers', icon: '👩‍🏫' },
    { key: 'marks', label: 'Marks', icon: '📝' },
    { key: 'timetable', label: 'Timetable', icon: '📅' },
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
      {/* Header */}
      <div className="bg-navy-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <span className="text-2xl font-display font-bold text-amber-300">A</span>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white">{user?.name}</h1>
              <p className="text-navy-300 font-body text-sm">Administrator Panel</p>
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
                onClick={() => { setActiveTab(tab.key); if (tab.key === 'timetable') loadTimetable(); }}
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
            <button onClick={() => setMessage('')} className="ml-3 underline text-xs">Dismiss</button>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-display font-bold text-navy-900">Students Management</h2>
              <div className="flex gap-3">
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="input-field w-auto">
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                </select>
                <button onClick={() => openModal('student')} className="btn-primary text-sm">+ Add Student</button>
              </div>
            </div>

            <div className="card overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-navy-50">
                    {['Roll No', 'Name', 'Section', 'Attendance', 'Fees', 'Actions'].map((h) => (
                      <th key={h} className="text-left p-4 font-body font-semibold text-navy-700 text-sm">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-t border-navy-100 hover:bg-navy-50/50">
                      <td className="p-4 font-mono text-sm">{s.roll_no}</td>
                      <td className="p-4 font-body font-semibold text-navy-900 text-sm">{s.name}</td>
                      <td className="p-4 font-body text-sm">{s.section}</td>
                      <td className="p-4 font-body font-semibold text-sm">
                        <span className={s.attendance >= 75 ? 'text-emerald-600' : 'text-red-600'}>{s.attendance}%</span>
                      </td>
                      <td className="p-4 font-body text-sm">₹{s.fees?.toLocaleString()}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => openModal('student', s)} className="text-blue-600 hover:text-blue-800 text-sm font-body font-semibold">Edit</button>
                          <button onClick={() => handleDelete('student', s.id)} className="text-red-600 hover:text-red-800 text-sm font-body font-semibold">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Teachers Tab */}
        {activeTab === 'teachers' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-display font-bold text-navy-900">Teachers Management</h2>
              <button onClick={() => openModal('teacher')} className="btn-primary text-sm">+ Add Teacher</button>
            </div>

            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-navy-50">
                    {['ID', 'Name', 'Subject', 'Attendance', 'Actions'].map((h) => (
                      <th key={h} className="text-left p-4 font-body font-semibold text-navy-700 text-sm">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t) => (
                    <tr key={t.id} className="border-t border-navy-100 hover:bg-navy-50/50">
                      <td className="p-4 font-mono text-sm">{t.id}</td>
                      <td className="p-4 font-body font-semibold text-navy-900 text-sm">{t.name}</td>
                      <td className="p-4 font-body text-sm">{t.subject}</td>
                      <td className="p-4 font-body font-semibold text-sm">
                        <span className={t.attendance >= 75 ? 'text-emerald-600' : 'text-red-600'}>{t.attendance}%</span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => openModal('teacher', t)} className="text-blue-600 hover:text-blue-800 text-sm font-body font-semibold">Edit</button>
                          <button onClick={() => handleDelete('teacher', t.id)} className="text-red-600 hover:text-red-800 text-sm font-body font-semibold">Delete</button>
                        </div>
                      </td>
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
              <h2 className="text-2xl font-display font-bold text-navy-900">Marks Management</h2>
              <div className="flex gap-3 flex-wrap">
                <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); }} className="input-field w-auto">
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                </select>
                <select
                  value={selectedStudentId || ''}
                  onChange={(e) => {
                    const id = parseInt(e.target.value);
                    setSelectedStudentId(id);
                    loadMarks(id);
                  }}
                  className="input-field w-auto"
                >
                  <option value="">Select Student</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.roll_no})</option>
                  ))}
                </select>
                <select value={selectedExam} onChange={(e) => { setSelectedExam(e.target.value as ExamType); if (selectedStudentId) loadMarks(selectedStudentId); }} className="input-field w-auto">
                  {(Object.keys(examLabels) as ExamType[]).map((k) => (
                    <option key={k} value={k}>{examLabels[k]}</option>
                  ))}
                </select>
                <button onClick={() => openModal('mark', { student_id: selectedStudentId, exam_type: selectedExam })} className="btn-primary text-sm" disabled={!selectedStudentId}>
                  + Add Mark
                </button>
              </div>
            </div>

            {selectedStudentId ? (
              <div className="card overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-navy-50">
                      {['Subject', 'Marks', 'Exam', 'Actions'].map((h) => (
                        <th key={h} className="text-left p-4 font-body font-semibold text-navy-700 text-sm">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {marks.map((m) => (
                      <tr key={m.id} className="border-t border-navy-100">
                        <td className="p-4 font-body font-semibold text-sm">{m.subject}</td>
                        <td className="p-4">
                          <span className={`font-display font-bold text-lg
                            ${m.marks >= 90 ? 'text-emerald-600' : m.marks >= 70 ? 'text-blue-600' : m.marks >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                            {m.marks}
                          </span>
                        </td>
                        <td className="p-4 font-body text-sm">{examLabels[m.exam_type]}</td>
                        <td className="p-4">
                          <button onClick={() => handleDelete('mark', m.id)} className="text-red-600 hover:text-red-800 text-sm font-body font-semibold">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {marks.length === 0 && (
                  <div className="text-center py-8 text-navy-400 font-body">No marks found for selected filters.</div>
                )}
              </div>
            ) : (
              <div className="card p-12 text-center text-navy-400 font-body">Select a student to view/manage marks.</div>
            )}
          </div>
        )}

        {/* Timetable Tab */}
        {activeTab === 'timetable' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-display font-bold text-navy-900">Timetable — Class {selectedClass}</h2>
              <div className="flex gap-3">
                <select value={selectedClass} onChange={(e) => { setSelectedClass(e.target.value); loadTimetable(); }} className="input-field w-auto">
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                </select>
                <button onClick={() => openModal('timetable', { class: selectedClass })} className="btn-primary text-sm">+ Add Entry</button>
              </div>
            </div>

            <div className="card overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-navy-50">
                    {['Day', 'Time', 'Subject', 'Teacher', 'Actions'].map((h) => (
                      <th key={h} className="text-left p-4 font-body font-semibold text-navy-700 text-sm">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timetable.map((t) => (
                    <tr key={t.id} className="border-t border-navy-100">
                      <td className="p-4 font-body font-semibold text-sm">{t.day}</td>
                      <td className="p-4 font-mono text-sm">{t.time}</td>
                      <td className="p-4 font-body text-sm">{t.subject}</td>
                      <td className="p-4 font-body text-sm">{t.teacher_name || `ID: ${t.teacher_id}`}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => openModal('timetable', t)} className="text-blue-600 text-sm font-body font-semibold">Edit</button>
                          <button onClick={() => handleDelete('timetable', t.id)} className="text-red-600 text-sm font-body font-semibold">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div>
            <h2 className="text-2xl font-display font-bold text-navy-900 mb-6">Attendance Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card p-6">
                <h3 className="font-display font-semibold text-navy-900 mb-4">Student Attendance — Class {selectedClass}</h3>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="input-field w-auto mb-4">
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                </select>
                <div className="space-y-2">
                  {students.map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-navy-50/50">
                      <div>
                        <p className="font-body font-semibold text-sm text-navy-900">{s.name}</p>
                        <p className="text-navy-400 text-xs font-body">Roll: {s.roll_no}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-navy-200 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${s.attendance >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${s.attendance}%` }} />
                        </div>
                        <span className={`font-body font-semibold text-sm w-10 text-right
                          ${s.attendance >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {s.attendance}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card p-6">
                <h3 className="font-display font-semibold text-navy-900 mb-4">Teacher Attendance</h3>
                <div className="space-y-2">
                  {teachers.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3 rounded-lg bg-navy-50/50">
                      <div>
                        <p className="font-body font-semibold text-sm text-navy-900">{t.name}</p>
                        <p className="text-navy-400 text-xs font-body">{t.subject}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-navy-200 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${t.attendance >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${t.attendance}%` }} />
                        </div>
                        <span className={`font-body font-semibold text-sm w-10 text-right
                          ${t.attendance >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {t.attendance}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-navy-100">
              <h3 className="text-xl font-display font-bold text-navy-900">
                {editData?.id ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </h3>
            </div>

            <div className="p-6 space-y-4">
              {modalType === 'student' && (
                <>
                  <input placeholder="Name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" />
                  <input placeholder="Class (e.g. 10)" value={formData.class || ''} onChange={(e) => setFormData({ ...formData, class: e.target.value })} className="input-field" />
                  <input placeholder="Section (e.g. A)" value={formData.section || ''} onChange={(e) => setFormData({ ...formData, section: e.target.value })} className="input-field" />
                  <input placeholder="Roll No" value={formData.roll_no || ''} onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })} className="input-field" />
                  <input placeholder="Fees" type="number" value={formData.fees || ''} onChange={(e) => setFormData({ ...formData, fees: parseFloat(e.target.value) })} className="input-field" />
                </>
              )}

              {modalType === 'teacher' && (
                <>
                  <input placeholder="Name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" />
                  <input placeholder="Subject" value={formData.subject || ''} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="input-field" />
                </>
              )}

              {modalType === 'mark' && (
                <>
                  <input placeholder="Subject" value={formData.subject || ''} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="input-field" />
                  <select value={formData.exam_type || 'unit1'} onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })} className="input-field">
                    {(Object.keys(examLabels) as ExamType[]).map((k) => (
                      <option key={k} value={k}>{examLabels[k]}</option>
                    ))}
                  </select>
                  <input placeholder="Marks (0-100)" type="number" min="0" max="100" value={formData.marks || ''} onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })} className="input-field" />
                </>
              )}

              {modalType === 'timetable' && (
                <>
                  <input placeholder="Class" value={formData.class || ''} onChange={(e) => setFormData({ ...formData, class: e.target.value })} className="input-field" />
                  <input placeholder="Subject" value={formData.subject || ''} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="input-field" />
                  <select value={formData.teacher_id || ''} onChange={(e) => setFormData({ ...formData, teacher_id: parseInt(e.target.value) })} className="input-field">
                    <option value="">Select Teacher</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} — {t.subject}</option>
                    ))}
                  </select>
                  <select value={formData.day || ''} onChange={(e) => setFormData({ ...formData, day: e.target.value })} className="input-field">
                    <option value="">Select Day</option>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <input placeholder="Time (e.g. 09:00 - 09:45)" value={formData.time || ''} onChange={(e) => setFormData({ ...formData, time: e.target.value })} className="input-field" />
                </>
              )}
            </div>

            <div className="p-6 border-t border-navy-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="btn-outline text-sm py-2">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 disabled:opacity-60">
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
