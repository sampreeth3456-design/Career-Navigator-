import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, FormEvent, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import {
  ArrowDownToLine, ArrowRight, Award, BookOpen, Check, FileText, Gauge, Lightbulb, LockKeyhole,
  Map, RefreshCw, Sparkles, Target, Trash2, Upload, WandSparkles,
} from 'lucide-react';
import { useAnalyzeCareer, useHealthCheck } from '@workspace/api-client-react';
import type { CareerAnalysis, CareerAnalysisInput } from '@workspace/api-client-react';
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import pdfWorkerUrl from 'pdfjs-dist/legacy/build/pdf.worker.mjs?url';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
const ANALYSIS_KEY = 'careerpilot-analysis-v1';
const PROGRESS_KEY = 'careerpilot-roadmap-progress-v1';
const PROFILE_KEY = 'careerpilot-profile-v1';
const DEMO_RESUME = `Aarav Nair
Computer Science undergraduate | National Institute of Technology Karnataka, Surathkal
Expected graduation: 2026 | CGPA: 8.4

PROFILE
Curious computer science student interested in building useful, accessible products with data and machine learning. Enjoys turning ambiguous problems into small, testable solutions.

EDUCATION
B.Tech Computer Science and Engineering, NITK Surathkal | 2022–2026
Relevant coursework: Data Structures, Database Systems, Probability, Operating Systems, Machine Learning

PROJECTS
CampusCart — Student marketplace web app | React, TypeScript, Node.js, PostgreSQL
Built a responsive marketplace prototype for campus essentials. Designed search and listing flows, created REST endpoints, and worked with two teammates to test with 18 students.

CoastWatch — Beach litter classification | Python, scikit-learn, OpenCV
Trained a baseline image classifier on a small curated dataset and documented precision/recall trade-offs. Presented findings at the department project showcase.

EXPERIENCE
Student Developer, NITK Innovation Centre | Jan–Apr 2024
Worked with a faculty mentor to prototype an event discovery tool. Wrote interface components, gathered feedback from student clubs, and shipped weekly improvements.

SKILLS
Python, JavaScript, TypeScript, React, SQL, Git, Figma, data structures, teamwork, user interviews

ACTIVITIES
Volunteer, Incident — annual tech fest. Peer mentor for first-year programming labs.`;

const DEMO_ANALYSIS: CareerAnalysis = {
  profileSummary: 'A product-minded CS student with a useful blend of frontend craft, early data experience, and real campus-user feedback. Your strongest next step is to deepen full-stack fundamentals and show measurable outcomes in one polished project.',
  resumeScore: 74,
  strengths: [
    'Projects show practical work across frontend, APIs, and applied machine learning.',
    'You have evidence of working with real users and iterating from feedback.',
    'Relevant coursework gives your technical foundation a clear direction.',
    'Team and campus experience adds context beyond classroom assignments.',
  ],
  improvements: [
    'Add measurable outcomes: adoption, task completion, latency, or model performance.',
    'Give each project a portfolio link and a concise description of your personal contribution.',
    'Bring SQL, testing, and deployment evidence into the top half of the resume.',
    'Turn broad interests into a clear role headline and a focused skills section.',
  ],
  detectedSkills: [
    { name: 'React & TypeScript', level: 'Intermediate' },
    { name: 'Python', level: 'Intermediate' },
    { name: 'SQL & data modelling', level: 'Beginner' },
    { name: 'Applied machine learning', level: 'Beginner' },
    { name: 'User research', level: 'Intermediate' },
  ],
  careerMatches: [
    {
      title: 'Frontend Engineer',
      matchScore: 88,
      summary: 'Your shipped interface work and React foundation make this the clearest near-term fit.',
      skillsMatched: ['React', 'TypeScript', 'Figma', 'User feedback'],
      skillsToBuild: ['Testing', 'Accessibility', 'Performance'],
    },
    {
      title: 'Product Engineer',
      matchScore: 81,
      summary: 'A strong path if you keep pairing technical range with end-to-end product ownership.',
      skillsMatched: ['React', 'REST APIs', 'Team collaboration'],
      skillsToBuild: ['System design', 'Deployment', 'Product metrics'],
    },
    {
      title: 'Applied ML Engineer',
      matchScore: 67,
      summary: 'A promising longer-term direction; strengthen statistics, model evaluation, and data pipelines.',
      skillsMatched: ['Python', 'scikit-learn', 'Probability'],
      skillsToBuild: ['Deep learning', 'MLOps', 'Experiment design'],
    },
  ],
  learningRecommendations: [
    {
      title: 'Full Stack Open: React, Node.js & TypeScript',
      provider: 'University of Helsinki',
      category: 'Engineering',
      duration: '8–10 weeks',
      url: 'https://fullstackopen.com/en/',
      reason: 'Build confidence in testing, APIs, and production-ready full-stack workflows.',
    },
    {
      title: 'SQL for Data Science',
      provider: 'University of California, Davis',
      category: 'Data',
      duration: '4 weeks',
      url: 'https://www.coursera.org/learn/sql-for-data-science',
      reason: 'Close a visible gap for product and data roles with hands-on query practice.',
    },
    {
      title: 'Build a Campus Discovery Dashboard',
      provider: 'CareerPilot project brief',
      category: 'Portfolio project',
      duration: '2 weekends',
      url: 'https://github.com/topics/react-dashboard',
      reason: 'Extend your campus product experience with searchable data and an accessible interface.',
    },
    {
      title: 'Google Machine Learning Crash Course',
      provider: 'Google',
      category: 'Machine learning',
      duration: '15 hours',
      url: 'https://developers.google.com/machine-learning/crash-course',
      reason: 'Make model evaluation and the ML workflow more concrete before choosing a specialization.',
    },
  ],
  roadmap: [
    {
      title: 'Make your story legible',
      timeframe: 'Weeks 1–2',
      description: 'Turn existing coursework and project work into clear evidence a hiring team can scan.',
      tasks: [
        { title: 'Rewrite the top third of your resume', description: 'Lead with a role-specific summary, core skills, and your strongest proof point.' },
        { title: 'Add outcomes to CampusCart', description: 'Include the 18-student test and what changed after feedback.' },
        { title: 'Publish one clean project README', description: 'Add screenshots, setup steps, architecture notes, and your individual contribution.' },
      ],
    },
    {
      title: 'Build the engineering signal',
      timeframe: 'Weeks 3–6',
      description: 'Go deeper on practical full-stack habits that show up in internship interviews and real teams.',
      tasks: [
        { title: 'Ship one tested React feature', description: 'Add keyboard-friendly flows and a small suite of meaningful tests.' },
        { title: 'Practise SQL with a real dataset', description: 'Write joins, aggregations, and explain how you would index a slow query.' },
        { title: 'Deploy a project end to end', description: 'Document environment setup and keep the live demo easy to explore.' },
      ],
    },
    {
      title: 'Turn practice into opportunity',
      timeframe: 'Weeks 7–10',
      description: 'Use your stronger portfolio to create a focused, sustainable internship search.',
      tasks: [
        { title: 'Choose a primary role and a stretch role', description: 'Use your match signals to focus applications without closing options.' },
        { title: 'Complete two project walkthroughs aloud', description: 'Practise explaining trade-offs, constraints, and what you would improve next.' },
        { title: 'Ask for two specific portfolio reviews', description: 'Use alumni, peers, or mentors to get actionable feedback before applying.' },
      ],
    },
  ],
};

type StoredProfile = { name: string; college: string; targetRole: string; interests: string[]; education: string };
const DEFAULT_PROFILE: StoredProfile = {
  name: 'Aarav Nair',
  college: 'NITK Surathkal · CSE ’26',
  targetRole: 'Frontend Engineer',
  interests: ['Product engineering', 'Frontend', 'Applied ML'],
  education: 'B.Tech Computer Science & Engineering, NITK Surathkal · 2022–2026',
};

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [storedAnalysis, setStoredAnalysis] = useState<CareerAnalysis | null>(() => readStored<CareerAnalysis | null>(ANALYSIS_KEY, null));
  const [hasRealAnalysis, setHasRealAnalysis] = useState(() => Boolean(localStorage.getItem(ANALYSIS_KEY)));
  const [profile, setProfile] = useState<StoredProfile>(() => readStored(PROFILE_KEY, DEFAULT_PROFILE));
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => readStored(PROGRESS_KEY, {}));
  const [resumeText, setResumeText] = useState(DEMO_RESUME);
  const [resumeName, setResumeName] = useState('Aarav_Nair_Resume_demo.txt');
  const [isDemoResume, setIsDemoResume] = useState(true);
  const [error, setError] = useState('');
  const [location] = useLocation();
  const fileRef = useRef<HTMLInputElement>(null);
  const analysis = storedAnalysis ?? DEMO_ANALYSIS;
  const health = useHealthCheck();
  const analyzeMutation = useAnalyzeCareer();

  useEffect(() => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);
  useEffect(() => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(completed));
  }, [completed]);
  useEffect(() => {
    if (storedAnalysis) localStorage.setItem(ANALYSIS_KEY, JSON.stringify(storedAnalysis));
  }, [storedAnalysis]);

  const taskCount = useMemo(() => analysis.roadmap.reduce((sum, phase) => sum + phase.tasks.length, 0), [analysis]);
  const doneCount = Object.values(completed).filter(Boolean).length;
  const progress = taskCount ? Math.round((doneCount / taskCount) * 100) : 0;
  const onAnalysisSuccess = (result: CareerAnalysis) => {
    setStoredAnalysis(result);
    setHasRealAnalysis(true);
    setError('');
    if (result.careerMatches[0]) {
      setProfile((p) => ({ ...p, targetRole: result.careerMatches[0].title }));
    }
  };

  const runAnalysis = (input: CareerAnalysisInput) => {
    if (input.resumeText.trim().length < 80) {
      setError('Add at least a few paragraphs of resume text. CareerPilot needs 80 characters to make a useful analysis.');
      return;
    }
    if (input.resumeText.length > 24000) {
      setError('This resume is too long to analyze. Please keep the text under 24,000 characters.');
      return;
    }
    setError('');
    analyzeMutation.mutate({ data: input }, {
      onSuccess: (result) => {
        setCompleted({});
        onAnalysisSuccess(result);
      },
      onError: () => setError('We could not reach the analysis service. Your demo profile is still here; try again in a moment.'),
    });
  };

  const acceptFile = async (file: File) => {
    setError('');
    try {
      if (file.size > 10 * 1024 * 1024) {
        setError('This file is over 10 MB. Choose a smaller resume to keep processing quick and private.');
        return;
      }
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isText = file.type.startsWith('text/') || /\.(txt|md)$/i.test(file.name);
      if (!isPdf && !isText) {
        setError('Choose a text-based PDF, .txt, or .md resume.');
        return;
      }
      let extracted = '';
      if (isPdf) {
        const document = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
        const pages: string[] = [];
        for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
          const page = await document.getPage(pageNumber);
          const content = await page.getTextContent();
          pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
        }
        extracted = pages.join('\n');
      } else {
        extracted = await file.text();
      }
      if (extracted.length > 24000) {
        setError('This resume has more than 24,000 characters. Choose a shorter version or paste a focused summary.');
        return;
      }
      extracted = extracted.replace(/\u0000/g, '').replace(/[ \t]+\n/g, '\n').trim();
      if (extracted.length < 80) {
        setError('We could not find enough readable text in that file. If this is a scanned PDF, try a text-based PDF or paste the resume text instead.');
        return;
      }
      setResumeText(extracted);
      setResumeName(file.name);
      setIsDemoResume(false);
    } catch {
      setError('This file could not be read in your browser. Try a .txt, .md, or text-based PDF file.');
    }
  };

  const toggleTask = (id: string) => setCompleted((old) => ({ ...old, [id]: !old[id] }));
  const resetDemo = () => {
    setStoredAnalysis(null);
    setHasRealAnalysis(false);
    setResumeText(DEMO_RESUME);
    setResumeName('Aarav_Nair_Resume_demo.txt');
    setIsDemoResume(true);
    setProfile(DEFAULT_PROFILE);
    setCompleted({});
    setError('');
    localStorage.removeItem(ANALYSIS_KEY);
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(PROFILE_KEY);
  };
  const clearResume = () => {
    setResumeText(DEMO_RESUME);
    setResumeName('Aarav_Nair_Resume_demo.txt');
    setIsDemoResume(true);
  };

  const pageName = location === '/analysis' ? 'Career analysis' : location === '/roadmap' ? 'Your roadmap' : location === '/learning' ? 'Learning library' : 'Your workspace';
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand" data-testid="link-brand-home">
          <span className="brand-mark">CP</span>
          <span><span className="brand-name">CareerPilot</span><span className="brand-byline">A clearer next step</span></span>
        </Link>
        <div className="nav-label">Workspace</div>
        <nav className="nav-list" aria-label="Main navigation">
          <NavLink href="/" label="Overview" icon={<Gauge />} active={location === '/'} id="overview" />
          <NavLink href="/analysis" label="Career analysis" icon={<Target />} active={location === '/analysis'} id="analysis" />
          <NavLink href="/roadmap" label="My roadmap" icon={<Map />} active={location === '/roadmap'} id="roadmap" />
          <NavLink href="/learning" label="Learning paths" icon={<BookOpen />} active={location === '/learning'} id="learning" />
        </nav>
        <div className="side-bottom">
          <div className="team-note"><strong>Built for the next step.</strong>Made by Team Eightbits<br />MIT Surathkal · Hackathon demo</div>
          <div className="side-profile">
            <span className="avatar" data-testid="text-profile-avatar">{profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</span>
            <span><span className="profile-name" data-testid="text-profile-name">{profile.name}</span><span className="profile-meta" data-testid="text-profile-college">{profile.college}</span></span>
          </div>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="crumb" data-testid="text-current-section">CAREERPILOT&nbsp; / &nbsp;{pageName.toUpperCase()}</div>
          <div className="top-status" data-testid="status-api-health">
            <span className="status-dot" style={{ background: health.data?.status === 'ok' ? '#519579' : health.isError ? '#c27b51' : '#8da292' }} />
            {health.isLoading ? 'Checking services' : health.data?.status ? 'Analysis service ready' : health.isError ? 'Demo mode · service offline' : 'Checking services'}
          </div>
        </header>
        <main className="page-content">
          <Switch>
            <Route path="/">
              <Dashboard analysis={analysis} profile={profile} progress={progress} completed={completed} hasRealAnalysis={hasRealAnalysis}
                resumeName={resumeName} isDemoResume={isDemoResume} error={error}
                isPending={analyzeMutation.isPending} onPick={() => fileRef.current?.click()}
                onToggle={toggleTask} onAnalyze={() => runAnalysis({ resumeText: resumeText || DEMO_RESUME, interests: profile.interests, targetRole: profile.targetRole, education: profile.education })}
                onRemoveResume={clearResume}
                onReset={resetDemo} />
            </Route>
            <Route path="/analysis">
              <AnalysisPage analysis={analysis} hasRealAnalysis={hasRealAnalysis} profile={profile} resumeText={resumeText}
                onResumeChange={setResumeText} onProfileChange={setProfile} error={error} isPending={analyzeMutation.isPending}
                onAnalyze={runAnalysis} onPick={() => fileRef.current?.click()} />
            </Route>
            <Route path="/roadmap">
              <RoadmapPage analysis={analysis} completed={completed} onToggle={toggleTask} progress={progress} hasRealAnalysis={hasRealAnalysis} />
            </Route>
            <Route path="/learning">
              <LearningPage analysis={analysis} hasRealAnalysis={hasRealAnalysis} />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      <input ref={fileRef} className="file-input" type="file" accept=".txt,.md,.pdf,text/plain,text/markdown,application/pdf"
        data-testid="input-resume-file" onChange={(event) => { const file = event.currentTarget.files?.[0]; if (file) void acceptFile(file); event.currentTarget.value = ''; }} />
    </div>
  );
}

function NavLink({ href, label, icon, active, id }: { href: string; label: string; icon: ReactNode; active: boolean; id: string }) {
  return <Link href={href} className={`nav-link${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined} data-testid={`link-nav-${id}`}>{icon}<span>{label}</span></Link>;
}

type SharedProps = {
  analysis: CareerAnalysis;
  hasRealAnalysis: boolean;
};

function PageHeading({ eyebrow, title, subtitle, demo = 'Demo profile' }: { eyebrow: string; title: string; subtitle: string; demo?: string | false }) {
  return <div className="page-heading fade-up">
    <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p className="page-subtitle">{subtitle}</p></div>
    {demo && <span className="demo-pill" data-testid="status-demo-data"><i />{demo}</span>}
  </div>;
}

function DemoBadge({ hasRealAnalysis }: { hasRealAnalysis: boolean }) {
  return <span className="demo-pill" data-testid="status-analysis-source"><i />{hasRealAnalysis ? 'Your analysis' : 'Demo data'}</span>;
}

type DashboardProps = SharedProps & {
  profile: StoredProfile;
  progress: number;
  completed: Record<string, boolean>;
  resumeName: string;
  isDemoResume: boolean;
  error: string;
  isPending: boolean;
  onPick: () => void;
  onToggle: (id: string) => void;
  onAnalyze: () => void;
  onReset: () => void;
  onRemoveResume: () => void;
};

function Dashboard(props: DashboardProps) {
  const { analysis, profile, progress, completed, hasRealAnalysis, resumeName, isDemoResume, error, isPending, onPick, onToggle, onAnalyze, onReset, onRemoveResume } = props;
  const primary = analysis.careerMatches[0];
  const taskItems = analysis.roadmap.flatMap((phase, phaseIndex) => phase.tasks.map((task, taskIndex) => ({ task, id: `${phaseIndex}-${taskIndex}`, phase: phase.title })));
  return <div className="fade-up">
    <PageHeading eyebrow="Your career workspace" title={`Good morning, ${profile.name.split(' ')[0]}.`} subtitle="A practical plan for turning what you know into what comes next." demo={hasRealAnalysis ? 'Your profile' : 'Demo profile'} />
    {error && <div className="error-banner" role="alert" data-testid="status-analysis-error">{error}</div>}
    <div className="grid dashboard-grid">
      <section className="panel hero-panel" data-testid="card-next-step">
        <div className="hero-copy">
          <div className="hero-tag"><Sparkles />Your next best move</div>
          <h2 className="hero-title">You’re closer to <em>{primary?.title ?? 'your next role'}</em> than you think.</h2>
          <p className="hero-desc">{primary?.summary ?? analysis.profileSummary}</p>
          <button className="button button-primary" onClick={onAnalyze} disabled={isPending} data-testid="button-run-analysis">
            {isPending ? <><span className="spinner" /> Mapping your strengths…</> : <>Refresh my career map <ArrowRight /></>}
          </button>
          <p className="upload-note">Your plan is a starting point, not a verdict. Keep it specific to you.</p>
        </div>
      </section>
      <section className="panel resume-panel" data-testid="card-resume">
        <div className="panel-head">
          <div><h2 className="panel-title">Your resume</h2><div className="panel-kicker">The signal behind your next step</div></div>
          <span className="demo-pill"><i />{isDemoResume ? 'Example' : 'Local file'}</span>
        </div>
        <div className="resume-box">
          <span className="resume-icon"><FileText /></span>
          <span style={{ minWidth: 0 }}><span className="resume-name" data-testid="text-resume-name">{resumeName}</span><span className="resume-meta">{isDemoResume ? 'Sample student profile · ready to explore' : 'Read in this browser only'}</span></span>
          <span className="resume-actions">
            {!isDemoResume && <button className="icon-button" title="Reset to demo profile" aria-label="Reset to demo profile" data-testid="button-remove-resume" onClick={onRemoveResume}><Trash2 /></button>}
            <button className="icon-button" title="Choose a resume" aria-label="Choose a resume" data-testid="button-change-resume" onClick={onPick}><RefreshCw /></button>
          </span>
        </div>
        <div className="privacy-note"><LockKeyhole />Your file stays in this browser. Extracted resume text and the career context you choose are sent to OpenAI for analysis; the original file is never uploaded or saved.</div>
      </section>
    </div>

    <div className="grid stats-grid">
      <StatCard label="Resume signal" value={`${analysis.resumeScore}`} suffix="/100" foot={analysis.resumeScore >= 75 ? 'A strong foundation to build on' : 'Room to make your strengths clearer'} icon={<Gauge />} id="resume-score" />
      <StatCard label="Role alignment" value={`${primary?.matchScore ?? 0}%`} foot={primary?.title ?? 'Add experience to see a match'} icon={<Target />} id="role-match" />
      <StatCard label="Roadmap progress" value={`${progress}%`} foot={`${Object.values(completed).filter(Boolean).length} of ${taskItems.length} actions checked off`} icon={<Award />} id="roadmap-progress" />
    </div>

    <div className="grid lower-grid section-gap">
      <section className="panel" data-testid="section-career-matches">
        <div className="panel-head"><div><h2 className="panel-title">Roles that fit your signal</h2><div className="panel-kicker">Based on skills, projects & interests</div></div><Link className="subtle-link" href="/analysis" data-testid="link-see-analysis">Full analysis <ArrowRight /></Link></div>
        {analysis.careerMatches.slice(0, 3).map((match, index) => <div className="match-card" key={match.title} data-testid={`card-career-match-${index}`}>
          <span className="match-score">{match.matchScore}%</span><span className="match-info"><span className="match-title">{match.title}</span><p className="match-summary">{match.summary}</p></span><span className="match-arrow"><ArrowRight /></span>
        </div>)}
        {!analysis.careerMatches.length && <div className="empty-note">Add resume details to see career paths shaped around your experience.</div>}
      </section>

      <section className="panel" data-testid="section-next-actions">
        <div className="panel-head"><div><h2 className="panel-title">A small step, this week</h2><div className="panel-kicker">Keep moving at your own pace</div></div><Link className="subtle-link" href="/roadmap" data-testid="link-open-roadmap">Roadmap <ArrowRight /></Link></div>
        <div className="progress-wrap"><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><span className="progress-label">{progress}%</span></div>
        <ul className="task-list">
          {taskItems.slice(0, 3).map(({ task, id, phase }) => <TaskItem key={id} task={task} id={id} phase={phase} checked={Boolean(completed[id])} onToggle={onToggle} />)}
        </ul>
      </section>
    </div>

    <div className="grid lower-grid section-gap">
      <section className="panel" data-testid="section-skill-snapshot">
        <div className="panel-head"><div><h2 className="panel-title">Skills in your story</h2><div className="panel-kicker">A snapshot, not a scorecard</div></div><Link className="subtle-link" href="/analysis" data-testid="link-skill-analysis">Explore skills <ArrowRight /></Link></div>
        {analysis.detectedSkills.slice(0, 5).map((skill, index) => <SkillRow key={skill.name} skill={skill} index={index} />)}
      </section>
      <section className="panel" data-testid="section-learning-preview">
        <div className="panel-head"><div><h2 className="panel-title">Worth your next hour</h2><div className="panel-kicker">Picked for your strongest role match</div></div><Link className="subtle-link" href="/learning" data-testid="link-all-learning">See all <ArrowRight /></Link></div>
        {analysis.learningRecommendations.slice(0, 3).map((rec, index) => <div className="recommendation" key={rec.title} data-testid={`recommendation-preview-${index}`}>
          <span className="rec-title">{rec.title}</span><span className="rec-meta">{rec.provider} · {rec.duration}</span><span className="rec-category">{rec.category}</span>
        </div>)}
      </section>
    </div>
    <div className="section-gap" style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <button className="button button-ghost" onClick={onReset} data-testid="button-reset-demo"><RefreshCw />Reset to demo profile</button>
    </div>
  </div>;
}

function StatCard({ label, value, suffix, foot, icon, id }: { label: string; value: string; suffix?: string; foot: string; icon: ReactNode; id: string }) {
  return <section className="panel stat-card" data-testid={`card-stat-${id}`}>
    <div className="stat-top"><span>{label}</span>{icon}</div><div className="stat-number" data-testid={`text-stat-${id}`}>{value}<span style={{ fontSize: 16, color: '#78827c' }}>{suffix}</span></div><div className="stat-foot">{foot}</div>
  </section>;
}

function TaskItem({ task, id, phase, checked, onToggle }: { task: { title: string; description: string }; id: string; phase: string; checked: boolean; onToggle: (id: string) => void }) {
  return <li className={`task-item${checked ? ' task-done' : ''}`} data-testid={`task-item-${id}`}>
    <button className={`task-check${checked ? ' checked' : ''}`} aria-label={`${checked ? 'Mark incomplete' : 'Mark complete'}: ${task.title}`} aria-pressed={checked} onClick={() => onToggle(id)} data-testid={`button-task-toggle-${id}`}>{checked && <Check />}</button>
    <span className="task-copy"><span className="task-title">{task.title}</span><span className="task-desc">{phase ? `${phase} · ` : ''}{task.description}</span></span>
  </li>;
}

function SkillRow({ skill, index }: { skill: CareerAnalysis['detectedSkills'][number]; index: number }) {
  const level = skill.level === 'Advanced' ? 90 : skill.level === 'Intermediate' ? 64 : 36;
  return <div className="skill-row" data-testid={`skill-row-${index}`}><span className="skill-label">{skill.name}</span><span className="skill-level"><span style={{ width: `${level}%` }} /></span><span className="skill-tier">{skill.level}</span></div>;
}

type AnalysisPageProps = SharedProps & {
  profile: StoredProfile;
  resumeText: string;
  error: string;
  isPending: boolean;
  onResumeChange: (text: string) => void;
  onProfileChange: (profile: StoredProfile) => void;
  onAnalyze: (input: CareerAnalysisInput) => void;
  onPick: () => void;
};

function AnalysisPage({ analysis, hasRealAnalysis, profile, resumeText, error, isPending, onResumeChange, onProfileChange, onAnalyze, onPick }: AnalysisPageProps) {
  const [interestDraft, setInterestDraft] = useState(profile.interests);
  const toggleInterest = (interest: string) => setInterestDraft((current) => current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest]);
  return <div>
    <PageHeading eyebrow="Read the evidence, then choose the next move" title="Career analysis" subtitle="Specific feedback on what your experience already says, and what could make it stronger." demo={false} />
    <div style={{ marginBottom: 17 }}><DemoBadge hasRealAnalysis={hasRealAnalysis} /></div>
    {error && <div className="error-banner" role="alert" data-testid="status-analysis-error">{error}</div>}
    <div className="grid page-two-col">
      <div>
        <section className="score-hero" data-testid="card-analysis-score">
          <div className="score-ring" style={{ '--score': analysis.resumeScore } as CSSProperties}><span className="score-value">{analysis.resumeScore}</span></div>
          <div className="score-copy"><div className="eyebrow" style={{ color: '#c8d86c' }}>Resume signal · out of 100</div><h2>{analysis.resumeScore >= 75 ? 'A sturdy start.' : 'A good base to sharpen.'}</h2><p>{analysis.profileSummary}</p></div>
        </section>
        <div className="analysis-lists">
          <section className="panel" data-testid="section-strengths"><div className="panel-head"><div><h2 className="panel-title">What’s working</h2><div className="panel-kicker">Keep these signals visible</div></div></div>
            <ul className="bullet-list">{analysis.strengths.map((item, index) => <li key={item} data-testid={`text-strength-${index}`}><Check />{item}</li>)}</ul>
          </section>
          <section className="panel" data-testid="section-improvements"><div className="panel-head"><div><h2 className="panel-title">Where to focus</h2><div className="panel-kicker">High-impact refinements</div></div></div>
            <ul className="bullet-list improvement-list">{analysis.improvements.map((item, index) => <li key={item} data-testid={`text-improvement-${index}`}><ArrowRight />{item}</li>)}</ul>
          </section>
        </div>
        <section className="panel section-gap" data-testid="section-detected-skills">
          <div className="panel-head"><div><h2 className="panel-title">Skills detected in your experience</h2><div className="panel-kicker">Level reflects evidence in this resume, not your potential</div></div></div>
          <div className="skill-bars">{analysis.detectedSkills.map((skill, index) => <SkillRow key={skill.name} skill={skill} index={index} />)}</div>
        </section>
        <section className="panel section-gap" data-testid="section-career-fit">
          <div className="panel-head"><div><h2 className="panel-title">Career paths to explore</h2><div className="panel-kicker">Match scores are directional, not a hiring prediction</div></div></div>
          {analysis.careerMatches.map((match, index) => <article className="career-row" key={match.title} data-testid={`career-analysis-${index}`}>
            <div className="career-row-head"><span className="career-row-title">{match.title}</span><span className="career-row-score">{match.matchScore}% match</span></div>
            <p>{match.summary}</p>
            <div className="gap-line">{match.skillsMatched.map((skill) => <span className="skill-chip" key={skill}>{skill}</span>)}</div>
            <div className="gap-line" style={{ marginTop: 4 }}>{match.skillsToBuild.map((skill) => <span className="gap-tag" key={skill}>Build · {skill}</span>)}</div>
          </article>)}
        </section>
      </div>
      <div>
        <AnalysisForm profile={profile} initialResume={resumeText} interestDraft={interestDraft} onInterestToggle={toggleInterest}
          onProfileChange={onProfileChange} onResumeChange={onResumeChange} onAnalyze={onAnalyze} onPick={onPick} isPending={isPending} />
        <section className="panel section-gap">
          <div className="panel-head"><div><h2 className="panel-title">How your data moves</h2><div className="panel-kicker">Clear boundaries, by design</div></div><LockKeyhole size={16} color="#628779" /></div>
          <ul className="bullet-list">
            <li><Check />Resume files are read locally in your browser.</li>
            <li><Check />Extracted resume text, your interests, education, and optional role are sent to OpenAI for analysis.</li>
            <li><Check />Your original file is never uploaded or saved by CareerPilot.</li>
            <li><Check />Your roadmap progress stays on this device.</li>
          </ul>
        </section>
        <section className="panel section-gap">
          <div className="panel-head"><div><h2 className="panel-title">Profile inputs</h2><div className="panel-kicker">Use context, not assumptions</div></div></div>
          <label className="field-label" htmlFor="profile-name">Your name</label>
          <input id="profile-name" className="field-input" value={profile.name} onChange={(event) => onProfileChange({ ...profile, name: event.target.value })} data-testid="input-profile-name" />
          <label className="field-label" htmlFor="education-field">Education</label>
          <input id="education-field" className="field-input" value={profile.education} onChange={(event) => onProfileChange({ ...profile, education: event.target.value })} data-testid="input-education" />
          <p className="form-hint">Stored locally for your next visit.</p>
        </section>
      </div>
    </div>
  </div>;
}

function AnalysisForm({ profile, initialResume, interestDraft, onInterestToggle, onProfileChange, onResumeChange, onAnalyze, onPick, isPending }: {
  profile: StoredProfile; initialResume: string; interestDraft: string[]; onInterestToggle: (interest: string) => void;
  onProfileChange: (profile: StoredProfile) => void; onResumeChange: (text: string) => void; onAnalyze: (input: CareerAnalysisInput) => void;
  onPick: () => void; isPending: boolean;
}) {
  const [draft, setDraft] = useState(initialResume);
  useEffect(() => setDraft(initialResume), [initialResume]);
  const interests = ['Frontend', 'Product engineering', 'Applied ML', 'Data science', 'UX research', 'Cloud'];
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onResumeChange(draft);
    onProfileChange({ ...profile, interests: interestDraft });
    onAnalyze({ resumeText: draft, interests: interestDraft, targetRole: profile.targetRole, education: profile.education });
  };
  return <section className="panel" data-testid="card-analysis-inputs">
    <div className="panel-head"><div><h2 className="panel-title">Make this yours</h2><div className="panel-kicker">A little context makes the map more useful</div></div><WandSparkles size={17} color="#638477" /></div>
    <form className="analysis-form" onSubmit={submit}>
      <div><label className="field-label" htmlFor="resume-text">Resume text</label>
        <textarea id="resume-text" className="field-area" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Paste your resume text here…" data-testid="input-resume-text" />
        <div className="form-hint">At least 80 characters. Your file stays local; only this extracted text is sent for AI analysis.</div>
        <button type="button" className="subtle-link" style={{ marginTop: 8, border: 0, background: 'none', padding: 0, cursor: 'pointer' }} onClick={onPick} data-testid="button-upload-from-analysis"><Upload />Choose a resume file</button>
      </div>
      <div><label className="field-label" htmlFor="target-role">Role you’re curious about</label>
        <input id="target-role" className="field-input" value={profile.targetRole} onChange={(event) => onProfileChange({ ...profile, targetRole: event.target.value })} placeholder="e.g. Frontend Engineer" data-testid="input-target-role" /></div>
      <div><span className="field-label">What are you interested in?</span>
        <div className="interest-row">{interests.map((interest) => <button type="button" className={`interest-choice${interestDraft.includes(interest) ? ' selected' : ''}`} key={interest} aria-pressed={interestDraft.includes(interest)} onClick={() => onInterestToggle(interest)} data-testid={`button-interest-${interest.toLowerCase().replaceAll(' ', '-')}`}>{interest}</button>)}</div>
      </div>
      <button className="button button-primary" type="submit" disabled={isPending} data-testid="button-submit-analysis">
        {isPending ? <><span className="spinner" />Finding the signal…</> : <>Build my career map <ArrowRight /></>}
      </button>
    </form>
  </section>;
}

function RoadmapPage({ analysis, completed, onToggle, progress, hasRealAnalysis }: SharedProps & {
  completed: Record<string, boolean>; onToggle: (id: string) => void; progress: number;
}) {
  const count = analysis.roadmap.reduce((sum, phase) => sum + phase.tasks.length, 0);
  const done = Object.values(completed).filter(Boolean).length;
  return <div>
    <PageHeading eyebrow="A path you can actually fit into a semester" title="Your roadmap" subtitle="Small, evidence-building steps from where you are now to the role you want to explore." demo={hasRealAnalysis ? 'Your plan' : 'Demo plan'} />
    <div style={{ display: 'flex', gap: 9, margin: '-10px 0 17px', flexWrap: 'wrap' }}><DemoBadge hasRealAnalysis={hasRealAnalysis} /><span className="demo-pill" data-testid="text-roadmap-total"><i />{count} practical steps</span></div>
    <div className="roadmap-intro" data-testid="card-roadmap-progress"><Award /><div style={{ flex: 1 }}><strong>{progress === 100 ? 'You’ve made it through your current plan.' : 'Momentum comes from the next small action.'}</strong><span>{done} of {count} steps complete. Your progress is saved on this device.</span></div><span className="progress-label">{progress}%</span></div>
    <div className="progress-wrap" style={{ marginBottom: 24 }}><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><span className="progress-label">{progress}%</span></div>
    {analysis.roadmap.map((phase, phaseIndex) => {
      const phaseDone = phase.tasks.filter((_, taskIndex) => Boolean(completed[`${phaseIndex}-${taskIndex}`])).length;
      return <section className="phase-card" key={phase.title} data-testid={`card-roadmap-phase-${phaseIndex}`}>
        <div className="phase-head"><div><div className="phase-time">{phase.timeframe}</div><h2 className="phase-title">{phase.title}</h2><p className="phase-desc">{phase.description}</p></div><span className="phase-count">{phaseDone}/{phase.tasks.length} COMPLETE</span></div>
        <ul className="task-list phase-tasks">{phase.tasks.map((task, taskIndex) => {
          const id = `${phaseIndex}-${taskIndex}`;
          return <TaskItem key={id} task={task} id={id} phase="" checked={Boolean(completed[id])} onToggle={onToggle} />;
        })}</ul>
      </section>;
    })}
    {!analysis.roadmap.length && <div className="empty-note" data-testid="empty-roadmap">Run a career analysis to build a roadmap around your goals.</div>}
  </div>;
}

function LearningPage({ analysis, hasRealAnalysis }: SharedProps) {
  return <div>
    <PageHeading eyebrow="Learn with a reason, not just a playlist" title="Learning library" subtitle="A short list of courses and project ideas selected to help close the gaps in your strongest career matches." demo={hasRealAnalysis ? 'Your recommendations' : 'Demo recommendations'} />
    <div style={{ display: 'flex', gap: 9, margin: '-10px 0 20px', flexWrap: 'wrap' }}>
      <DemoBadge hasRealAnalysis={hasRealAnalysis} />
      <span className="demo-pill"><i style={{ background: '#739587' }} />Picked for {analysis.careerMatches[0]?.title ?? 'your next role'}</span>
    </div>
    <div className="grid learning-grid">
      {analysis.learningRecommendations.map((rec, index) => <article className="panel learning-card" key={rec.title} data-testid={`card-learning-${index}`}>
        <div className="learning-card-top"><span className="learning-cat">{rec.category}</span><span className="learning-duration">{rec.duration}</span></div>
        <h2>{rec.title}</h2><p>{rec.reason}</p>
        <div className="learning-foot"><span className="provider">{rec.provider}</span><a className="subtle-link" href={rec.url} target="_blank" rel="noreferrer" data-testid={`link-learning-resource-${index}`}>Explore resource <ArrowDownToLine /></a></div>
      </article>)}
    </div>
    {!analysis.learningRecommendations.length && <div className="empty-note" data-testid="empty-learning">Run an analysis to find courses and projects tailored to your skill gaps.</div>}
    <section className="panel section-gap" style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#e5ebd3', borderColor: '#d7dfbd' }} data-testid="learning-note">
      <Lightbulb color="#5f806e" size={20} />
      <div><div className="panel-title" style={{ marginBottom: 4 }}>One useful thing beats five saved tabs.</div><div className="task-desc">Pick a resource, make one visible project artifact, and add the result back to your portfolio.</div></div>
    </section>
  </div>;
}

function Root() {
  return <QueryClientProvider client={queryClient}><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><App /></WouterRouter></QueryClientProvider>;
}

export default Root;
