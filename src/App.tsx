/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Edit3, 
  Save, 
  Plus, 
  Trash2, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Linkedin, 
  Github 
} from 'lucide-react';

interface CVData {
  name: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  experience: {
    id: string;
    company: string;
    role: string;
    period: string;
    description: string;
  }[];
  skills: string[];
  certifications: string[];
  education: {
    id: string;
    school: string;
    degree: string;
    period: string;
  }[];
  languages: string[];
}

const DEFAULT_DATA: CVData = {
  name: "ALEXANDER RIVERA",
  title: "Senior Full Stack Developer",
  email: "alex.rivera@example.com",
  phone: "+1 (555) 000-1234",
  website: "alexrivera.dev",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/alexrivera",
  github: "github.com/arivera",
  summary: "Results-oriented Full Stack Developer with over 8 years of experience in building scalable web applications. Expert in React, Node.js, and Cloud Architecture. Proven track record of leading cross-functional teams and delivering high-impact software solutions that drive business growth.",
  experience: [
    {
      id: '1',
      company: "TechFlow Solutions",
      role: "Senior Software Engineer",
      period: "Jan 2021 - Present",
      description: "Led the migration of a legacy monolithic architecture to a microservices-based system using AWS and Kubernetes. Improved system performance by 40% and reduced deployment time by 60% through CI/CD optimization."
    },
    {
      id: '2',
      company: "Innovate Digital",
      role: "Full Stack Developer",
      period: "Mar 2018 - Dec 2020",
      description: "Developed and maintained multiple client-facing web applications using React and Express. Implemented real-time data visualization dashboards that served over 50,000 monthly active users."
    }
  ],
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Docker", "GraphQL", "Tailwind CSS"],
  certifications: ["AWS Certified Solutions Architect", "Google Professional Cloud Developer"],
  education: [
    {
      id: '1',
      school: "Stanford University",
      degree: "B.S. in Computer Science",
      period: "2014 - 2018"
    }
  ],
  languages: ["English (Native)", "Spanish (Professional)", "German (Elementary)"]
};

export default function App() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [data, setData] = useState<CVData>(DEFAULT_DATA);
  const cvRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cv_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved CV data", e);
      }
    }
  }, []);

  const saveToLocal = (newData: CVData) => {
    setData(newData);
    localStorage.setItem('cv_data', JSON.stringify(newData));
  };

  const handlePrint = () => {
    window.print();
  };

  const updateField = (field: keyof CVData, value: string) => {
    saveToLocal({ ...data, [field]: value });
  };

  const updateExperience = (id: string, field: string, value: string) => {
    const newExp = data.experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    saveToLocal({ ...data, experience: newExp });
  };

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      company: "New Company",
      role: "New Role",
      period: "Period",
      description: "Description of your achievements..."
    };
    saveToLocal({ ...data, experience: [...data.experience, newExp] });
  };

  const removeExperience = (id: string) => {
    saveToLocal({ ...data, experience: data.experience.filter(e => e.id !== id) });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    const newEdu = data.education.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    saveToLocal({ ...data, education: newEdu });
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      school: "University Name",
      degree: "Degree Name",
      period: "Year - Year"
    };
    saveToLocal({ ...data, education: [...data.education, newEdu] });
  };

  const removeEducation = (id: string) => {
    saveToLocal({ ...data, education: data.education.filter(e => e.id !== id) });
  };

  const updateList = (field: 'skills' | 'certifications' | 'languages', index: number, value: string) => {
    const newList = [...data[field]];
    newList[index] = value;
    saveToLocal({ ...data, [field]: newList });
  };

  const addToList = (field: 'skills' | 'certifications' | 'languages') => {
    saveToLocal({ ...data, [field]: [...data[field], "New Item"] });
  };

  const removeFromList = (field: 'skills' | 'certifications' | 'languages', index: number) => {
    saveToLocal({ ...data, [field]: data[field].filter((_, i) => i !== index) });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Inter',sans-serif] text-slate-900 print:bg-white print:p-0">
      {/* Admin Controls - Hidden in Print */}
      <div className="fixed top-4 right-4 flex gap-2 print:hidden z-50">
        <button 
          onClick={() => setIsEditMode(!isEditMode)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all ${
            isEditMode ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100'
          }`}
        >
          {isEditMode ? <Save size={18} /> : <Edit3 size={18} />}
          <span className="font-medium">{isEditMode ? 'Save Changes' : 'Edit Mode'}</span>
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-full shadow-lg hover:bg-slate-100 transition-all"
        >
          <Download size={18} />
          <span className="font-medium">Download PDF</span>
        </button>
      </div>

      <main className="max-w-4xl mx-auto py-12 px-8 bg-white shadow-xl my-8 print:shadow-none print:my-0 print:max-w-full print:p-0">
        <div ref={cvRef}>
          {/* Header */}
          <header className="border-b-4 border-blue-600 pb-8 mb-8">
            <h1 
              contentEditable={isEditMode}
              onBlur={(e) => updateField('name', e.currentTarget.textContent || '')}
              className={`text-5xl font-extrabold tracking-tight mb-2 outline-none ${isEditMode ? 'bg-blue-50 ring-2 ring-blue-200 rounded' : ''}`}
            >
              {data.name}
            </h1>
            <h2 
              contentEditable={isEditMode}
              onBlur={(e) => updateField('title', e.currentTarget.textContent || '')}
              className={`text-2xl text-blue-600 font-semibold mb-6 outline-none ${isEditMode ? 'bg-blue-50 ring-2 ring-blue-200 rounded' : ''}`}
            >
              {data.title}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8 text-slate-600 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-blue-500" />
                <span contentEditable={isEditMode} onBlur={(e) => updateField('email', e.currentTarget.textContent || '')}>{data.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-blue-500" />
                <span contentEditable={isEditMode} onBlur={(e) => updateField('phone', e.currentTarget.textContent || '')}>{data.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-blue-500" />
                <span contentEditable={isEditMode} onBlur={(e) => updateField('website', e.currentTarget.textContent || '')}>{data.website}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-blue-500" />
                <span contentEditable={isEditMode} onBlur={(e) => updateField('location', e.currentTarget.textContent || '')}>{data.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Linkedin size={14} className="text-blue-500" />
                <span contentEditable={isEditMode} onBlur={(e) => updateField('linkedin', e.currentTarget.textContent || '')}>{data.linkedin}</span>
              </div>
              <div className="flex items-center gap-2">
                <Github size={14} className="text-blue-500" />
                <span contentEditable={isEditMode} onBlur={(e) => updateField('github', e.currentTarget.textContent || '')}>{data.github}</span>
              </div>
            </div>
          </header>

          {/* Professional Summary */}
          <section className="mb-10">
            <h3 className="text-xl font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-2 mb-4">Professional Summary</h3>
            <p 
              contentEditable={isEditMode}
              onBlur={(e) => updateField('summary', e.currentTarget.textContent || '')}
              className={`text-slate-700 leading-relaxed outline-none ${isEditMode ? 'bg-blue-50 ring-2 ring-blue-200 rounded p-2' : ''}`}
            >
              {data.summary}
            </p>
          </section>

          {/* Work Experience */}
          <section className="mb-10">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-6">
              <h3 className="text-xl font-bold uppercase tracking-wider text-slate-800">Work Experience</h3>
              {isEditMode && (
                <button onClick={addExperience} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-bold">
                  <Plus size={16} /> Add Experience
                </button>
              )}
            </div>
            
            <div className="space-y-8">
              {data.experience.map((exp) => (
                <div key={exp.id} className="relative group">
                  {isEditMode && (
                    <button 
                      onClick={() => removeExperience(exp.id)}
                      className="absolute -left-8 top-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <div className="flex justify-between items-start mb-1">
                    <h4 
                      contentEditable={isEditMode}
                      onBlur={(e) => updateExperience(exp.id, 'company', e.currentTarget.textContent || '')}
                      className="text-lg font-bold text-slate-800 outline-none"
                    >
                      {exp.company}
                    </h4>
                    <span 
                      contentEditable={isEditMode}
                      onBlur={(e) => updateExperience(exp.id, 'period', e.currentTarget.textContent || '')}
                      className="text-sm font-semibold text-slate-500 italic outline-none"
                    >
                      {exp.period}
                    </span>
                  </div>
                  <div 
                    contentEditable={isEditMode}
                    onBlur={(e) => updateExperience(exp.id, 'role', e.currentTarget.textContent || '')}
                    className="text-blue-600 font-semibold mb-2 outline-none"
                  >
                    {exp.role}
                  </div>
                  <p 
                    contentEditable={isEditMode}
                    onBlur={(e) => updateExperience(exp.id, 'description', e.currentTarget.textContent || '')}
                    className={`text-slate-700 leading-relaxed outline-none whitespace-pre-wrap ${isEditMode ? 'bg-blue-50 ring-2 ring-blue-200 rounded p-2' : ''}`}
                  >
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
            <section>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-4">
                <h3 className="text-xl font-bold uppercase tracking-wider text-slate-800">Skills</h3>
                {isEditMode && (
                  <button onClick={() => addToList('skills')} className="text-blue-600 hover:text-blue-800">
                    <Plus size={16} />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, index) => (
                  <div key={index} className="group relative">
                    <span 
                      contentEditable={isEditMode}
                      onBlur={(e) => updateList('skills', index, e.currentTarget.textContent || '')}
                      className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded text-sm font-medium outline-none"
                    >
                      {skill}
                    </span>
                    {isEditMode && (
                      <button 
                        onClick={() => removeFromList('skills', index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-4">
                <h3 className="text-xl font-bold uppercase tracking-wider text-slate-800">Certifications</h3>
                {isEditMode && (
                  <button onClick={() => addToList('certifications')} className="text-blue-600 hover:text-blue-800">
                    <Plus size={16} />
                  </button>
                )}
              </div>
              <ul className="space-y-2">
                {data.certifications.map((cert, index) => (
                  <li key={index} className="group flex items-center gap-2 text-slate-700 text-sm">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                    <span 
                      contentEditable={isEditMode}
                      onBlur={(e) => updateList('certifications', index, e.currentTarget.textContent || '')}
                      className="outline-none flex-grow"
                    >
                      {cert}
                    </span>
                    {isEditMode && (
                      <button onClick={() => removeFromList('certifications', index)} className="text-red-500 opacity-0 group-hover:opacity-100">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Education */}
          <section className="mb-10">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2 mb-4">
              <h3 className="text-xl font-bold uppercase tracking-wider text-slate-800">Education</h3>
              {isEditMode && (
                <button onClick={addEducation} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-bold">
                  <Plus size={16} /> Add Education
                </button>
              )}
            </div>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id} className="group relative">
                  {isEditMode && (
                    <button 
                      onClick={() => removeEducation(edu.id)}
                      className="absolute -left-8 top-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 
                        contentEditable={isEditMode}
                        onBlur={(e) => updateEducation(edu.id, 'school', e.currentTarget.textContent || '')}
                        className="font-bold text-slate-800 outline-none"
                      >
                        {edu.school}
                      </h4>
                      <div 
                        contentEditable={isEditMode}
                        onBlur={(e) => updateEducation(edu.id, 'degree', e.currentTarget.textContent || '')}
                        className="text-slate-600 text-sm outline-none"
                      >
                        {edu.degree}
                      </div>
                    </div>
                    <span 
                      contentEditable={isEditMode}
                      onBlur={(e) => updateEducation(edu.id, 'period', e.currentTarget.textContent || '')}
                      className="text-sm font-semibold text-slate-500 italic outline-none"
                    >
                      {edu.period}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Footer / Languages */}
          <footer className="border-t border-slate-200 pt-6 mt-12">
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-slate-500 text-sm font-medium">
              {data.languages.map((lang, index) => (
                <div key={index} className="group flex items-center gap-2">
                  <span 
                    contentEditable={isEditMode}
                    onBlur={(e) => updateList('languages', index, e.currentTarget.textContent || '')}
                    className="outline-none"
                  >
                    {lang}
                  </span>
                  {isEditMode && (
                    <button onClick={() => removeFromList('languages', index)} className="text-red-400 opacity-0 group-hover:opacity-100">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
              {isEditMode && (
                <button onClick={() => addToList('languages')} className="text-blue-500">
                  <Plus size={14} />
                </button>
              )}
            </div>
          </footer>
        </div>
      </main>

      <style>{`
        @media print {
          @page {
            margin: 2cm;
          }
          body {
            background-color: white !important;
          }
          main {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            max-width: none !important;
          }
          .fixed {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
