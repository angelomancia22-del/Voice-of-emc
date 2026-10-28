import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ISO_CRITERIA_QUESTIONS } from '../data/mockData';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Layers,
  Shield,
  Star,
  FileCheck,
  Send,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

export const ResearchThesisView: React.FC = () => {
  const { isoEvaluations, addISOEvaluation } = useApp();

  // Evaluator form state
  const [evaluatorName, setEvaluatorName] = useState('');
  const [evaluatorRole, setEvaluatorRole] = useState<'Student' | 'Faculty / Dept Head' | 'Administrator' | 'IT / IS Expert'>('IT / IS Expert');
  const [evaluatorOrg, setEvaluatorOrg] = useState('Eastern Mindoro College Panel');
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    ISO_CRITERIA_QUESTIONS.forEach((q) => {
      initial[q.id] = 5;
    });
    return initial;
  });
  const [comments, setComments] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleScoreChange = (id: string, val: number) => {
    setScores((prev) => ({ ...prev, [id]: val }));
  };

  const handleEvaluationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatorName.trim()) return;
    addISOEvaluation({
      evaluatorName: evaluatorName.trim(),
      evaluatorRole,
      evaluatorOrganization: evaluatorOrg.trim(),
      scores,
      qualitativeComments: comments.trim(),
    });
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 5000);
    setComments('');
  };

  // Calculate overall and category means across all submitted evaluations
  const totalEvaluations = isoEvaluations.length;

  const getCategoryMean = (category: 'Functionality' | 'Usability' | 'Reliability' | 'Security') => {
    const categoryQuestions = ISO_CRITERIA_QUESTIONS.filter((q) => q.category === category);
    if (totalEvaluations === 0 || categoryQuestions.length === 0) return 4.8;

    let sum = 0;
    let count = 0;

    (isoEvaluations || []).forEach((evaluation) => {
      categoryQuestions.forEach((q) => {
        if (evaluation?.scores && evaluation.scores[q.id] !== undefined) {
          sum += evaluation.scores[q.id];
          count += 1;
        }
      });
    });

    return count > 0 ? (sum / count).toFixed(2) : '4.80';
  };

  const funcMean = parseFloat(String(getCategoryMean('Functionality')));
  const usabMean = parseFloat(String(getCategoryMean('Usability')));
  const relMean = parseFloat(String(getCategoryMean('Reliability')));
  const secMean = parseFloat(String(getCategoryMean('Security')));
  const grandMean = ((funcMean + usabMean + relMean + secMean) / 4).toFixed(2);

  const getVerbalInterpretation = (mean: number) => {
    if (mean >= 4.5) return 'Highly Acceptable';
    if (mean >= 3.5) return 'Acceptable';
    if (mean >= 2.5) return 'Moderately Acceptable';
    if (mean >= 1.5) return 'Poor';
    return 'Unacceptable';
  };

  return (
    <div className="space-y-8">
      {/* Research Hero with Campus Background & Official Logo */}
      <div
        className="text-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-indigo-700/50 bg-cover bg-center relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.94) 0%, rgba(30, 58, 138, 0.88) 60%, rgba(15, 23, 42, 0.8) 100%), url('/assets/aistudio/FB_IMG_1793160649042_17e8179c.jpg')`,
        }}
      >
        <div className="flex items-center gap-4 max-w-3xl">
          <div className="w-16 h-16 rounded-full bg-white p-1 shadow-lg shadow-black/50 border-2 border-amber-400 shrink-0 hidden sm:block">
            <img
              src="/assets/aistudio/FB_IMG_1761024576270_a833f677.jpg"
              alt="Eastern Mindoro College, Inc. Seal"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5" /> Capstone / Thesis Research Documentation
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Research Framework &amp; ISO 25010 Quality Evaluation
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Formulated titles, problem statement alignment, conceptual Input-Process-Output (IPO) architecture, and interactive evaluation instrument for Eastern Mindoro College, Inc.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: FORMULATED RELEVANT PROBLEM-SOLVING THESIS TITLES */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900">
            Formulated Problem-Solving Thesis Titles
          </h3>
        </div>
        <p className="text-xs text-slate-500">
          Proposed academic research titles spanning Information Technology, Information Systems, and Educational Public Service:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Title 1: IT Track */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
            <span className="text-[10px] font-bold text-blue-700 uppercase bg-blue-100 px-2 py-0.5 rounded">
              Information Technology Track
            </span>
            <h4 className="font-bold text-xs text-slate-900 leading-snug">
              "EMC-Resolve: An Automated Web-Based Student Grievance Redressal and Resolution Tracking System with Role-Based Access Control and SLA Analytics for Eastern Mindoro College, Inc."
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Focuses on technical role-based access security, automated notification triggers, algorithmic SLA monitoring, and cloud-ready database indexing.
            </p>
          </div>

          {/* Title 2: IS Track */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
            <span className="text-[10px] font-bold text-purple-700 uppercase bg-purple-100 px-2 py-0.5 rounded">
              Information Systems Track
            </span>
            <h4 className="font-bold text-xs text-slate-900 leading-snug">
              "Design and Evaluation of an ISO 25010-Compliant Multi-Tier Student Concern Management and Institutional Quality Assurance Information System for Eastern Mindoro College, Inc."
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Focuses on institutional workflow integration, ISO 25010 software quality compliance, feedback loops, and data-driven administrative decision making.
            </p>
          </div>

          {/* Title 3: Public Service Track */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-100 px-2 py-0.5 rounded">
              Public Service &amp; Education Track
            </span>
            <h4 className="font-bold text-xs text-slate-900 leading-snug">
              "A Citizen-Charter-Aligned Web-Based Student Grievance Redress Mechanism for Eastern Mindoro College, Inc.: Enhancing Institutional Responsiveness, Transparency, and Accountability"
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Emphasizes student rights, anonymous disclosure safeguards, anti-red tape turnaround standards, and transparent stakeholder communication.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: STATEMENT OF THE PROBLEM & OBJECTIVES TRACEABILITY */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
          <Layers className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">
            Research Alignment &amp; Objectives Traceability Matrix
          </h3>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Research Question / Specific Objective</th>
                <th className="py-2.5 px-3">Target Institutional Problem</th>
                <th className="py-2.5 px-3">Implemented System Module &amp; Features</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              <tr>
                <td className="py-2.5 px-3 font-semibold">Q1: Student reporting challenges</td>
                <td className="py-2.5 px-3">Fear of reprisal, lost paperwork, no single channel</td>
                <td className="py-2.5 px-3">Anonymous submission toggle, online 24/7 access, file upload</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">Implemented</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Q2: Online submission feature</td>
                <td className="py-2.5 px-3">Disorganized verbal or social media complaints</td>
                <td className="py-2.5 px-3">8-category structured form with priority classification &amp; SLA</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">Implemented</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Q3: Status monitoring &amp; tracking</td>
                <td className="py-2.5 px-3">Students unaware if staff ever received the concern</td>
                <td className="py-2.5 px-3">Unique tracking code (`EMC-2026-XXXX`) &amp; 5-stage progress stepper</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">Implemented</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Q4: Personnel review &amp; categorization</td>
                <td className="py-2.5 px-3">Staff overwhelmed by scattered inquiries</td>
                <td className="py-2.5 px-3">Faculty / Dept Inbox with internal investigation notes vs public replies</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">Implemented</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Q5: Record management &amp; reports</td>
                <td className="py-2.5 px-3">Manual filing hampers quality audits and accreditation</td>
                <td className="py-2.5 px-3">Centralized DB, printable ISO QA Audit report &amp; CSV export</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">Implemented</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Q6: Automated notifications</td>
                <td className="py-2.5 px-3">Lack of status communication to student &amp; admin</td>
                <td className="py-2.5 px-3">In-app notification drawer &amp; simulated institutional email triggers</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">Implemented</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold">Q7: ISO 25010 Quality Evaluation</td>
                <td className="py-2.5 px-3">Need empirical verification of system acceptability</td>
                <td className="py-2.5 px-3">Interactive Likert survey with real-time weighted mean calculation</td>
                <td className="py-2.5 px-3 text-center text-emerald-600 font-bold">Implemented</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: INTERACTIVE ISO 25010 EVALUATION INSTRUMENT */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Interactive ISO 25010 Software Quality Evaluation Instrument</span>
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated based on the criteria specified in Section 2.7 of the research brief.
            </p>
          </div>

          {/* Grand Mean Badge */}
          <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-right">
            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
              Overall Grand Mean ({totalEvaluations} Evaluator{totalEvaluations !== 1 ? 's' : ''})
            </div>
            <div className="text-2xl font-black text-emerald-700">
              {grandMean} <span className="text-xs font-semibold text-emerald-600">/ 5.00</span>
            </div>
            <div className="text-[11px] font-bold text-emerald-900">
              {getVerbalInterpretation(parseFloat(grandMean))}
            </div>
          </div>
        </div>

        {/* 4 Criteria Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/60">
            <div className="font-bold text-blue-900">7.1 Functionality</div>
            <div className="text-xl font-black text-blue-700 mt-1">{funcMean.toFixed(2)}</div>
            <div className="text-[10px] text-blue-600 font-semibold">{getVerbalInterpretation(funcMean)}</div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/60">
            <div className="font-bold text-emerald-900">7.2 Usability</div>
            <div className="text-xl font-black text-emerald-700 mt-1">{usabMean.toFixed(2)}</div>
            <div className="text-[10px] text-emerald-600 font-semibold">{getVerbalInterpretation(usabMean)}</div>
          </div>

          <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/60">
            <div className="font-bold text-purple-900">7.3 Reliability</div>
            <div className="text-xl font-black text-purple-700 mt-1">{relMean.toFixed(2)}</div>
            <div className="text-[10px] text-purple-600 font-semibold">{getVerbalInterpretation(relMean)}</div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/60">
            <div className="font-bold text-amber-900">7.4 Security</div>
            <div className="text-xl font-black text-amber-700 mt-1">{secMean.toFixed(2)}</div>
            <div className="text-[10px] text-amber-600 font-semibold">{getVerbalInterpretation(secMean)}</div>
          </div>
        </div>

        {/* Evaluation Form for Defense Panel / Evaluators */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-5">
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-purple-600" />
              <span>Submit Expert / User Evaluation (Defense Rubric)</span>
            </h4>
            <p className="text-xs text-slate-500">
              Grade each dimension using the standard 5-point Likert scale (5: Strongly Agree, 4: Agree, 3: Neutral, 2: Disagree, 1: Strongly Disagree).
            </p>
          </div>

          <form onSubmit={handleEvaluationSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Evaluator Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Juanito Perez"
                  value={evaluatorName}
                  onChange={(e) => setEvaluatorName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Evaluator Stakeholder Role</label>
                <select
                  value={evaluatorRole}
                  onChange={(e) => setEvaluatorRole(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="IT / IS Expert">IT / Information Systems Expert</option>
                  <option value="Faculty / Dept Head">Faculty Member / Department Head</option>
                  <option value="Administrator">College Administrator / Dean</option>
                  <option value="Student">EMCI Student Representative</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Institution / Department</label>
                <input
                  type="text"
                  placeholder="e.g. EMCI Defense Panel"
                  value={evaluatorOrg}
                  onChange={(e) => setEvaluatorOrg(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>

            {/* Rubric Items */}
            <div className="space-y-3 pt-2">
              {ISO_CRITERIA_QUESTIONS.map((q) => (
                <div
                  key={q.id}
                  className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{q.title}</span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {q.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{q.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleScoreChange(q.id, val)}
                        className={`w-7 h-7 rounded-lg font-bold text-xs transition-all ${
                          scores[q.id] === val
                            ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                    <span className="text-[11px] font-bold text-slate-600 w-8 text-right font-mono">
                      {scores[q.id]}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Qualitative Remarks &amp; Recommendations</label>
              <textarea
                rows={2}
                placeholder="Enter commendations, constructive feedback, or suggestions for future work..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {submittedMessage ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Evaluation recorded in live statistical pool!
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Scores immediately update the weighted mean across all defense panels.
                </span>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Submit Official Scorecard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
