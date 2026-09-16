import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  CheckCircle2,
  Send,
  MessageSquare,
  Sparkles,
  Lightbulb,
  ShieldCheck,
  DollarSign,
  Truck,
  Wrench,
  Quote,
} from 'lucide-react';
import { JUST_MEL_DETAIL_PROFILE } from '../data/defects';

interface DetailerInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveInterviewFeedback: (answers: Record<string, string>) => void;
}

export const DetailerInterviewModal: React.FC<DetailerInterviewModalProps> = ({
  isOpen,
  onClose,
  onSaveInterviewFeedback,
}) => {
  const profile = JUST_MEL_DETAIL_PROFILE;

  const [answers, setAnswers] = useState<Record<string, string>>({
    primaryStruggle: 'Clients underestimate how deep stains or scratches are and expect a quick surface wash to solve heavy clearcoat wear or deep carpet neglect.',
    businessModel: '100% Mobile detailing rig serving Aiken, SC & surrounding communities with onboard water, pressure wash & generator.',
    coreServices: 'Paint correction, buffing/polishing, steam sanitizing, deep upholstery shampoo extraction, front bumper debugging, deep rim cleaning, headliner & door jamb steam cleaning.',
    philosophyApproach: 'Educate clients that their vehicle is a necessity requiring preventive maintenance: "Spend a little on prevention today, or spend a lot more on correction later."',
    waiversNeeded: 'Pre-existing scratch waiver, delicate headliner fabric/glue moisture limitation, clearcoat thickness safety limit.',
    subscriptionsOffered: 'Yes, bi-weekly and monthly mobile maintenance subscriptions to keep client vehicles in pristine condition.',
  });

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const interviewQuestions = [
    {
      id: 'primaryStruggle',
      title: 'What is the #1 struggle you face with detailing clients?',
      icon: <HelpCircle className="w-5 h-5 text-blue-500" />,
      options: [
        'Clients underestimate stain/scratch severity and expect magic from a basic quick wash',
        'Clients discover pre-existing scratches after a wash and try to blame the detailer',
        'Wasting time driving out only to find unexpected heavy pet hair, vomit, or bio-hazard',
        'Struggling to give accurate price estimates over text without seeing the car first',
        'Educating clients on the difference between a wax and a 2-stage paint correction',
      ],
    },
    {
      id: 'businessModel',
      title: 'How do you operate JustMelDetail mobile service in Aiken, SC?',
      icon: <Truck className="w-5 h-5 text-indigo-500" />,
      options: [
        '100% Mobile detailing rig serving Aiken, SC & surrounding communities with onboard water, pressure wash & generator',
        'Fixed detailing studio bay with specialized LED correction lighting',
        'Hybrid mobile maintenance wash + studio drop-off for multi-day ceramic & correction',
      ],
    },
    {
      id: 'coreServices',
      title: 'Which signature detailing treatments are most frequently requested?',
      icon: <Wrench className="w-5 h-5 text-amber-500" />,
      options: [
        'Paint correction, buffing, and multi-stage rotary polishing',
        'Deep upholstery shampoo extraction, steam sanitizing & deodorizing',
        'Front bumper bug removal, deep alloy rim cleaning & tire shine',
        'Headliner, dashboard, cupholders & door jambs steam cleaned',
        'Complete bumper-to-bumper vehicle restoration',
      ],
    },
    {
      id: 'philosophyApproach',
      title: 'How do you educate clients on the value of regular maintenance?',
      icon: <Quote className="w-5 h-5 text-blue-500" />,
      options: [
        '"Spend a little on prevention today, or spend a lot more on correction later."',
        'A professional detail identifies problem areas, restores neglect, and prevents future wear.',
        'Vehicles are essential daily necessities that perform better when properly preserved.',
        'Transparent pre-service walkaround and digital damage inspection sheet.',
      ],
    },
    {
      id: 'waiversNeeded',
      title: 'Which pre-service disclaimers are most critical for your liability?',
      icon: <ShieldCheck className="w-5 h-5 text-rose-500" />,
      options: [
        'Pre-existing rock chips & door dings documented before touching paint',
        'Delicate headliner fabric limitation (cannot saturate with water or glue melts)',
        'Burn-through / thin clearcoat warning on older or repainted panels',
        'Permanent dye transfer (ink/denim) stain removal limitation',
      ],
    },
    {
      id: 'subscriptionsOffered',
      title: 'How do you structure subscriptions and ongoing appointments?',
      icon: <DollarSign className="w-5 h-5 text-emerald-500" />,
      options: [
        'VIP bi-weekly mobile maintenance wash with UV protectant top-up',
        'Monthly comprehensive interior/exterior upkeep program',
        'One-off on-demand appointments booked as needed via phone/text',
      ],
    },
  ];

  const currentQ = interviewQuestions[activeStep];

  const handleSelectOption = (opt: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: opt }));
  };

  const handleCustomChange = (val: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
  };

  const handleSubmit = () => {
    onSaveInterviewFeedback(answers);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">
                  JustMelDetail Strategy & Workflow Interview
                </h2>
                <span className="text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-1.5 py-0.5 rounded">
                  Aiken, SC
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Tailored for Jamel Tyler's mobile detailing business & client intake
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {!isSubmitted ? (
            <>
              {/* Progress dots */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  Question {activeStep + 1} of {interviewQuestions.length}
                </span>
                <div className="flex items-center gap-1.5">
                  {interviewQuestions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        idx === activeStep
                          ? 'bg-indigo-600 ring-2 ring-indigo-200'
                          : idx < activeStep
                          ? 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Question Card */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                    {currentQ.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">
                      {currentQ.title}
                    </h3>
                  </div>
                </div>

                {/* Multiple choice options */}
                <div className="space-y-2">
                  {currentQ.options.map((opt) => {
                    const isSelected = answers[currentQ.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/70 font-semibold text-indigo-950 ring-1 ring-indigo-500'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom or specific note */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                    Or customize Jamel's answer in your own words:
                  </label>
                  <textarea
                    rows={2}
                    value={answers[currentQ.id] || ''}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 outline-hidden bg-slate-50/50 resize-none"
                    placeholder="Type custom details here..."
                  />
                </div>
              </div>

              {/* Step Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  disabled={activeStep === 0}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 disabled:opacity-30 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Previous
                </button>

                {activeStep < interviewQuestions.length - 1 ? (
                  <button
                    onClick={() => setActiveStep((prev) => prev + 1)}
                    className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xs transition-colors"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save & Apply To JustMelDetail Simulator</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                JustMelDetail Profile & Intake Rules Updated!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                The simulator has been synchronized with Jamel Tyler's mobile detailing operations in Aiken, SC, including pre-service condition liability, package pricing, and customer prevention guidance.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                Return to Simulator
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
