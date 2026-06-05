'use client';

import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center font-mono text-sm font-bold">
              AD
            </div>
            <span className="font-bold hidden sm:inline">About</span>
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">Home</Link>
            <Link href="/demo" className="text-sm text-muted-foreground hover:text-foreground transition">Demo</Link>
            <Link href="/benchmarks" className="text-sm text-muted-foreground hover:text-foreground transition">Benchmarks</Link>
            <Link href="/research" className="text-sm text-muted-foreground hover:text-foreground transition">Paper</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-4 pt-8">
          <h1 className="text-5xl font-bold text-foreground">About This Project</h1>
          <p className="text-lg text-muted-foreground">
            A journey through research, engineering, and innovation in time series anomaly detection
          </p>
          <div className="flex items-center gap-3 pt-4">
            <span className="text-sm text-muted-foreground">By</span>
            <span className="font-semibold text-foreground">Harshvardhan Santosh Magar</span>
            <a 
              href="https://github.com/Harshvardhan-M/AD_Anomaly_Detection" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline transition"
            >
              GitHub Repository
            </a>
          </div>
        </div>

        {/* Timeline */}
        <Card className="p-8 bg-card border border-border/50">
          <h2 className="text-2xl font-bold text-foreground mb-8">Project Timeline</h2>
          <div className="space-y-6">
            {[
              {
                week: 'Week 1',
                title: 'Problem Research & Literature Review',
                description: 'Investigated time series anomaly detection challenges across e-commerce, IoT, and security domains. Reviewed 20+ papers on autoencoders, attention mechanisms, and threshold learning.',
              },
              {
                week: 'Week 2',
                title: 'Architecture Design & Synthetic Data',
                description: 'Designed hybrid LSTM-Transformer autoencoder with adaptive threshold network. Generated 100K-timestep synthetic dataset with 3 realistic anomaly types and comprehensive baselines.',
              },
              {
                week: 'Week 3',
                title: 'Training, Evaluation & Ablation Studies',
                description: 'Trained models on GPU, ran comprehensive benchmarks (Precision/Recall/F1/AUC-ROC), proved 5.6% improvement from adaptive thresholds via ablation study.',
              },
              {
                week: 'Week 4',
                title: 'Web Platform & Research Paper',
                description: 'Built professional web app with interactive demo, real-time inference, and benchmarks dashboard. Wrote arXiv-ready research paper with methodology and results.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 pb-6 border-b border-border last:border-b-0">
                <div className="flex-shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                    <span className="text-sm font-semibold text-primary">{item.week}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tech Stack */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Technology Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-2xl">🧠</span> Machine Learning
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• PyTorch - Deep learning framework</li>
                <li>• LSTM & Transformer layers - Neural architectures</li>
                <li>• Scikit-learn - Baseline models & metrics</li>
                <li>• NumPy/Pandas - Data processing</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-2xl">🌐</span> Web Development
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Next.js 16 - React framework</li>
                <li>• TensorFlow.js - Browser inference</li>
                <li>• Recharts - Data visualizations</li>
                <li>• Tailwind CSS - Styling</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-2xl">☁️</span> Infrastructure
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Google Colab - Model training</li>
                <li>• Vercel - Web deployment</li>
                <li>• GitHub - Version control</li>
                <li>• jsPDF - PDF export</li>
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-2xl">🔍</span> Research
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• LaTeX - Paper formatting</li>
                <li>• KaTeX - Equation rendering</li>
                <li>• Statistical analysis - Ablation studies</li>
                <li>• Matplotlib - Publication figures</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Key Learnings */}
        <Card className="p-8 bg-primary/10 border border-primary/20">
          <h2 className="text-2xl font-bold text-foreground mb-6">Key Technical Insights</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground mb-2">1. Hybrid Architectures Balance Multiple Objectives</h3>
              <p className="text-sm text-muted-foreground">
                Combining LSTM (local patterns) with Transformers (global context) outperforms either alone. This teaches the importance of architectural diversity—no single model dominates all problem dimensions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">2. Context-Aware Learning Beats Fixed Heuristics</h3>
              <p className="text-sm text-muted-foreground">
                Learning per-timestep thresholds instead of using fixed values improved F1 by 5.6%. This demonstrates that domain-specific learning (even simple neural networks) can outperform hand-crafted rules in production systems.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">3. Ablation Studies Are Non-Negotiable</h3>
              <p className="text-sm text-muted-foreground">
                Rigorously removing each component (LSTM, Transformer, adaptive thresholds) proved their individual contributions. This scientific rigor is essential for publication and demonstrates true understanding.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">4. Reproducibility Requires Discipline</h3>
              <p className="text-sm text-muted-foreground">
                Fixed random seeds, documented hyperparameters, and multiple runs with error bars ensure results are trustworthy. This is why production systems demand careful engineering, not just model architecture.
              </p>
            </div>
          </div>
        </Card>

        {/* Try It Yourself */}
        <Card className="p-8 border border-accent/20 bg-accent/5">
          <h2 className="text-2xl font-bold text-foreground mb-4">Try It Yourself</h2>
          <p className="text-muted-foreground mb-6">
            All code is open source and fully reproducible. Train the model yourself in Google Colab—no GPU required (though recommended for speed).
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://colab.research.google.com/drive/your-notebook-id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
            >
              <span>📓</span> Open in Google Colab
            </a>
            <a
              href="https://github.com/Harshvardhan-M/AD_Anomaly_Detection"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-card transition-colors"
            >
              <span>💻</span> View on GitHub
            </a>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4 pt-8">
          <p className="text-muted-foreground">Ready to explore the model?</p>
          <Link href="/demo">
            <Button size="lg" className="gap-2">
              Go to Interactive Demo <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 px-6 py-12 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Project</h3>
              <div className="space-y-2">
                <Link href="/demo" className="block text-sm text-muted-foreground hover:text-primary transition">
                  Interactive Demo
                </Link>
                <Link href="/benchmarks" className="block text-sm text-muted-foreground hover:text-primary transition">
                  Benchmarks
                </Link>
                <Link href="/research" className="block text-sm text-muted-foreground hover:text-primary transition">
                  Research Paper
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <div className="space-y-2">
                <span className="block text-sm text-muted-foreground opacity-40 cursor-default">
                  Training Notebook
                </span>
                <a href="https://github.com/Harshvardhan-M/AD_Anomaly_Detection" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary transition">
                  GitHub Repository
                </a>
                <span className="block text-sm text-muted-foreground opacity-40 cursor-default">
                  arXiv Paper
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Learn More</h3>
              <div className="space-y-2">
                <a href="https://en.wikipedia.org/wiki/Anomaly_detection" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary transition">
                  Time Series Anomaly Detection
                </a>
                <a href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary transition">
                  LSTM-Transformer Hybrids
                </a>
                <Link href="/research" className="block text-sm text-muted-foreground hover:text-primary transition">
                  Adaptive Thresholds
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>Created by Harshvardhan Santosh Magar • Built with Next.js 16, React 19, and TailwindCSS v4</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
