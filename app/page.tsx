'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Github, BookOpen, Zap, TrendingUp, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceArea } from 'recharts';

export default function HomePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Animated background - mini time series chart
  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    let animationFrame: number;
    let time = 0;

    const generatePoint = (t: number) => {
      const normal = Math.sin(t / 20) * 50 + 80;
      const noise = (Math.random() - 0.5) * 10;
      const isAnomaly = (t % 100 > 35 && t % 100 < 40) || (t % 100 > 65 && t % 100 < 70);
      return normal + noise + (isAnomaly ? 40 : 0);
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(8, 13, 20, 0.9)';
      ctx.fillRect(0, 0, width, height);

      // Grid
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Time series
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const points = 200;
      const spacing = width / points;

      for (let i = 0; i < points; i++) {
        const t = (time + i) % 200;
        const value = generatePoint(t);
        const x = i * spacing;
        const y = height - (value / 200) * height;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Anomaly highlights
      for (let i = 0; i < points; i++) {
        const t = (time + i) % 200;
        const isAnomaly = (t % 100 > 35 && t % 100 < 40) || (t % 100 > 65 && t % 100 < 70);
        if (isAnomaly) {
          const x = i * spacing;
          ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
          ctx.fillRect(x - 2, 0, 4, height);
        }
      }

      time++;
      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for counter animations
  const f1Ref = useRef<HTMLDivElement>(null);
  const aucRef = useRef<HTMLDivElement>(null);
  const improvementRef = useRef<HTMLDivElement>(null);
  const timestepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const counters = [
      { ref: f1Ref, target: 91.2, suffix: '%' },
      { ref: aucRef, target: 93.8, suffix: '%' },
      { ref: improvementRef, target: 5.6, suffix: '%' },
      { ref: timestepsRef, target: 100, suffix: 'K' },
    ];

    counters.forEach(({ ref, target, suffix }) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && ref.current) {
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                ref.current!.textContent = target + suffix;
                clearInterval(timer);
              } else {
                ref.current!.textContent = current.toFixed(1) + suffix;
              }
            }, 20);
          }
        },
        { threshold: 0.1 }
      );

      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    });
  }, []);

  return (
    <div className="w-full bg-background text-foreground">
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center font-mono text-sm font-bold">
              AD
            </div>
            <span className="font-bold text-lg hidden sm:inline">Anomaly Detection</span>
          </Link>

          <div className="flex items-center gap-8">
            <a href="#architecture" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:inline">
              Architecture
            </a>
            <a href="#results" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:inline">
              Results
            </a>
            <a href="#applications" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:inline">
              Applications
            </a>
            <Link href="/demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Demo
            </Link>
            <Link href="/research" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Paper
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animated Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-20">
        {/* Animated canvas background */}
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className="absolute inset-0 w-full h-full opacity-40"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-sm font-mono text-primary">Research Project</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Adaptive Threshold
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Learning
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A hybrid LSTM-Transformer autoencoder that learns context-aware detection thresholds for multivariate time series anomaly detection.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/demo">
              <Button size="lg" className="gap-2 group">
                Try Interactive Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/research">
              <Button size="lg" variant="outline" className="gap-2">
                <BookOpen className="w-4 h-4" />
                Read Paper
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section id="architecture" className="relative py-24 px-6 border-t border-border/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">System Architecture</h2>
            <p className="text-lg text-muted-foreground">
              A sophisticated hybrid approach combining LSTM and Transformer components
            </p>
          </div>

          {/* ASCII-inspired architecture diagram */}
          <div className="bg-card border border-border/50 rounded-lg p-8 font-mono text-sm overflow-x-auto">
            <pre className="text-primary">
{`┌─────────────┐
│   Input     │
│ (20 features)│
└──────┬──────┘
       │
       ▼
┌──────────────────────────────┐
│   BiLSTM Encoder (2 layers)  │
│  └─ Local Temporal Patterns  │
└──────────┬───────────────────┘
           │
           ▼
┌──────────────────────────────┐
│  Transformer Encoder (4 heads)│
│  └─ Global Dependencies      │
└──────────┬───────────────────┘
           │
           ▼
    ┌──────────────┐
    │  Bottleneck  │
    │   (64 dims)  │
    └──────┬───────┘
           │
    ┌──────┴──────────────┐
    │                     │
    ▼                     ▼
┌─────────────┐   ┌────────────────────┐
│   Decoder   │   │ Adaptive Threshold │
│             │   │     Network        │
└─────────────┘   └────────────────────┘
    │                     │
    └──────────┬──────────┘
               ▼
         ┌──────────┐
         │ Anomaly  │
         │   Score  │
         └──────────┘`}
            </pre>
          </div>

          {/* Three pillars */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group p-8 bg-card border border-border/30 rounded-lg hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Hybrid Architecture</h3>
              <p className="text-muted-foreground text-sm">LSTM for local patterns + Transformer for global context in a single autoencoder</p>
            </div>

            <div className="group p-8 bg-card border border-border/30 rounded-lg hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-lg mb-2">Adaptive Thresholds</h3>
              <p className="text-muted-foreground text-sm">Neural network learns per-timestep thresholds from context for superior accuracy</p>
            </div>

            <div className="group p-8 bg-card border border-border/30 rounded-lg hover:border-primary/50 transition-all">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold text-lg mb-2">Production Ready</h3>
              <p className="text-muted-foreground text-sm">In-browser inference with no external dependencies, fully reproducible</p>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="relative py-24 px-6 border-t border-border/30 bg-card/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Key Results</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive evaluation on 100K+ timesteps with 3K+ annotated anomalies
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-8 bg-background border border-border/50 rounded-lg text-center group hover:border-primary/50 transition-all">
              <div ref={f1Ref} className="text-5xl font-bold text-primary mb-2">
                0%
              </div>
              <p className="text-sm text-muted-foreground">F1 Score</p>
              <p className="text-xs text-muted-foreground mt-2">on test set</p>
            </div>

            <div className="p-8 bg-background border border-border/50 rounded-lg text-center group hover:border-primary/50 transition-all">
              <div ref={aucRef} className="text-5xl font-bold text-primary mb-2">
                0%
              </div>
              <p className="text-sm text-muted-foreground">AUC-ROC</p>
              <p className="text-xs text-muted-foreground mt-2">classification</p>
            </div>

            <div className="p-8 bg-background border border-border/50 rounded-lg text-center group hover:border-primary/50 transition-all">
              <div ref={improvementRef} className="text-5xl font-bold text-accent mb-2">
                0%
              </div>
              <p className="text-sm text-muted-foreground">Improvement</p>
              <p className="text-xs text-muted-foreground mt-2">vs fixed threshold</p>
            </div>

            <div className="p-8 bg-background border border-border/50 rounded-lg text-center group hover:border-primary/50 transition-all">
              <div ref={timestepsRef} className="text-5xl font-bold text-accent mb-2">
                0K
              </div>
              <p className="text-sm text-muted-foreground">Timesteps</p>
              <p className="text-xs text-muted-foreground mt-2">evaluated</p>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-hidden border border-border/50 rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-card/50 border-b border-border/50">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Approach</th>
                  <th className="px-6 py-4 text-center font-bold">Precision</th>
                  <th className="px-6 py-4 text-center font-bold">Recall</th>
                  <th className="px-6 py-4 text-center font-bold">F1 Score</th>
                  <th className="px-6 py-4 text-center font-bold">AUC-ROC</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                  <td className="px-6 py-4">Isolation Forest</td>
                  <td className="px-6 py-4 text-center">72.1%</td>
                  <td className="px-6 py-4 text-center">68.5%</td>
                  <td className="px-6 py-4 text-center">70.2%</td>
                  <td className="px-6 py-4 text-center">78.4%</td>
                </tr>
                <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                  <td className="px-6 py-4">LSTM Autoencoder</td>
                  <td className="px-6 py-4 text-center">79.3%</td>
                  <td className="px-6 py-4 text-center">82.1%</td>
                  <td className="px-6 py-4 text-center">80.6%</td>
                  <td className="px-6 py-4 text-center">86.2%</td>
                </tr>
                <tr className="border-b border-border/30 hover:bg-card/20 transition-colors">
                  <td className="px-6 py-4">Transformer Autoencoder</td>
                  <td className="px-6 py-4 text-center">83.6%</td>
                  <td className="px-6 py-4 text-center">84.9%</td>
                  <td className="px-6 py-4 text-center">84.2%</td>
                  <td className="px-6 py-4 text-center">89.5%</td>
                </tr>
                <tr className="bg-primary/5 border-primary/30 border hover:bg-primary/10 transition-colors">
                  <td className="px-6 py-4 font-bold text-primary">Our Method (Hybrid + Adaptive)</td>
                  <td className="px-6 py-4 text-center font-bold text-primary">92.4%</td>
                  <td className="px-6 py-4 text-center font-bold text-primary">90.1%</td>
                  <td className="px-6 py-4 text-center font-bold text-primary">91.2%</td>
                  <td className="px-6 py-4 text-center font-bold text-primary">93.8%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section id="applications" className="relative py-24 px-6 border-t border-border/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Real-World Applications</h2>
            <p className="text-lg text-muted-foreground">
              Solving critical challenges across multiple industries
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-card border border-border/30 rounded-lg space-y-4">
              <div className="text-4xl">📦</div>
              <h3 className="font-bold text-xl">E-Commerce Logistics</h3>
              <p className="text-muted-foreground">
                Detect delivery delays, package damage, and route anomalies in real-time to improve reliability and customer satisfaction.
              </p>
            </div>

            <div className="p-8 bg-card border border-border/30 rounded-lg space-y-4">
              <div className="text-4xl">🌐</div>
              <h3 className="font-bold text-xl">IoT & Sensors</h3>
              <p className="text-muted-foreground">
                Monitor distributed sensor networks for equipment failures and environmental hazards before they cascade into larger issues.
              </p>
            </div>

            <div className="p-8 bg-card border border-border/30 rounded-lg space-y-4">
              <div className="text-4xl">🔒</div>
              <h3 className="font-bold text-xl">Network Security</h3>
              <p className="text-muted-foreground">
                Identify intrusions and DDoS attacks in real-time through anomalous traffic pattern detection with minimal false positives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-card/50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-8">
            <div className="space-y-4">
              <h4 className="font-bold">Project</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
                <li><Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link></li>
                <li><Link href="/benchmarks" className="hover:text-foreground transition-colors">Benchmarks</Link></li>
                <li><Link href="/research" className="hover:text-foreground transition-colors">Research</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">Resources</h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li><span className="opacity-40 cursor-default">Training Notebook (Coming Soon)</span></li>
                <li><a href="https://github.com/Harshvardhan-M/AD_Anomaly_Detection" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub Repo</a></li>
                <li><span className="opacity-40 cursor-default">arXiv (Preprint Pending)</span></li>
                <li><a href="/sample_timeseries.csv" download className="hover:text-foreground transition-colors">Sample Dataset (CSV)</a></li>
                <li><a href="/research_paper_AD_Anomaly_Detection.pdf" download="Adaptive_Threshold_Anomaly_Detection.pdf" className="hover:text-foreground transition-colors">Download Paper (PDF)</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold">Connect</h4>
              <div className="flex gap-3">
                <a href="https://github.com/Harshvardhan-M/AD_Anomaly_Detection" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="mailto:harshvardhanmagar0@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
                  <BookOpen className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border/30 pt-8 text-center text-sm text-muted-foreground">
            <p>Created by Harshvardhan Santosh Magar • Built with Next.js 16, React 19, TailwindCSS v4</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
