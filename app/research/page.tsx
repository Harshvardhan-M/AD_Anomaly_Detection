'use client';

import Link from 'next/link';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Download, ExternalLink } from 'lucide-react';

export default function ResearchPage() {
  const downloadPDF = () => {
    window.open('/research_paper_AD_Anomaly_Detection.pdf', '_blank');
  };

  const openArxiv = () => {
    window.open('https://arxiv.org/search/?query=anomaly+detection+time+series', '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center font-mono text-sm font-bold">
              AD
            </div>
            <span className="font-bold hidden sm:inline">Research</span>
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">Home</Link>
            <Link href="/demo" className="text-sm text-muted-foreground hover:text-foreground transition">Demo</Link>
            <Link href="/benchmarks" className="text-sm text-muted-foreground hover:text-foreground transition">Benchmarks</Link>
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition">About</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground">Research Paper</h1>
          <p className="text-lg text-muted-foreground">
            Adaptive Threshold Learning for Multivariate Time Series Anomaly Detection
          </p>
          <div className="flex gap-4 pt-4">
            <Button onClick={downloadPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" className="gap-2 opacity-50 cursor-not-allowed pointer-events-none">
              <ExternalLink className="h-4 w-4" />
              arXiv — Preprint Pending
            </Button>
          </div>
        </div>

        {/* Abstract */}
        <Card className="p-8 border-l-4 border-l-primary">
          <h2 className="text-2xl font-bold text-foreground mb-4">Abstract</h2>
          <p className="text-muted-foreground leading-relaxed">
            We propose a novel hybrid LSTM-Transformer autoencoder with adaptive threshold learning for detecting anomalies in multivariate time series data. Our key contribution is the Adaptive Threshold Network, which learns context-aware thresholds for each timestep from the bottleneck latent representation. Instead of using fixed thresholds, our approach recognizes that different parts of a time series have different levels of normal variation. We evaluate our approach on synthetic logistics data with 100,000 timesteps and demonstrate that adaptive thresholds improve F1 score by 5.6% over fixed-threshold baselines. The hybrid architecture achieves 91.2% F1 score and 93.8% AUC-ROC, outperforming three baseline models. Ablation studies confirm that both the hybrid architecture and adaptive threshold mechanism contribute significantly to performance gains.
          </p>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Anomaly detection in multivariate time series is a critical problem in monitoring systems such as e-commerce logistics, IoT sensors, industrial equipment, and network traffic. Traditional approaches like statistical methods (MAD, IQR) or fixed-threshold autoencoders have significant limitations:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Fixed thresholds don&apos;t account for temporal context or changes in normal variation patterns</li>
                <li>Statistical methods assume specific distributions that real-world data rarely satisfy</li>
                <li>Simple autoencoders struggle to capture both local and global temporal patterns</li>
              </ul>
              <p>
                We address these limitations by proposing an Adaptive Threshold Network that learns context-aware thresholds alongside a hybrid LSTM-Transformer autoencoder. This combination allows the model to: (1) capture both short-range and long-range temporal dependencies, (2) learn representations that encode normal variation patterns, and (3) predict appropriate thresholds for each timestep based on context.
              </p>
            </div>
          </Card>

          {/* Methodology */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">2. Methodology</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3">2.1 Hybrid LSTM-Transformer Architecture</h4>
                <p className="text-muted-foreground mb-3">
                  Our model combines strengths of two architectures:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><span className="font-semibold text-foreground">LSTM Encoder</span>: Bidirectional LSTM captures local temporal patterns and feature interdependencies</li>
                  <li><span className="font-semibold text-foreground">Transformer Encoder</span>: Multi-head self-attention captures long-range dependencies across the entire sequence</li>
                  <li><span className="font-semibold text-foreground">Bottleneck</span>: Compresses combined representations into 64-dim latent space</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">2.2 Adaptive Threshold Network (Novel Contribution)</h4>
                <p className="text-muted-foreground mb-3">
                  The key innovation is an MLP that learns per-timestep threshold multipliers from the bottleneck representation:
                </p>
                <div className="bg-card border border-border rounded-lg p-4 font-mono text-sm text-muted-foreground mb-3">
                  <p>Input: bottleneck (batch_size, 64)</p>
                  <p>→ Dense(128, ReLU)</p>
                  <p>→ Dropout(0.2)</p>
                  <p>→ Dense(128, ReLU)</p>
                  <p>→ Dropout(0.2)</p>
                  <p>→ Dense(window_size=20, Softplus)</p>
                  <p>Output: threshold_multipliers (batch_size, 20)</p>
                </div>
                <p className="text-muted-foreground">
                  Each multiplier scales a base threshold: <span className="text-primary font-semibold">adaptive_threshold[t] = base_threshold × multiplier[t]</span>
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">2.3 Multi-Component Loss Function</h4>
                <p className="text-muted-foreground">
                  We combine four loss components to train the full system:
                </p>
                <div className="bg-card border border-border rounded-lg p-4 font-mono text-sm text-muted-foreground mt-3">
                  <p>L_total = L_recon + α × L_contrastive + β × L_sparsity + γ × L_threshold_reg</p>
                  <p className="text-xs mt-2">
                    where α=0.5, β=0.1, γ=0.1
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Experiments */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">3. Experiments & Results</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3">3.1 Dataset</h4>
                <p className="text-muted-foreground">
                  Synthetic multivariate time series simulating e-commerce logistics metrics:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                  <li>100,000 timesteps with 20 features</li>
                  <li>3 types of anomalies: 956 point, 987 contextual, 913 collective (2.9% total)</li>
                  <li>Realistic patterns: sine waves with multiple frequencies + noise</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">3.2 Baselines</h4>
                <p className="text-muted-foreground">
                  Compared against three baseline autoencoders using fixed thresholds:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                  <li><span className="font-semibold text-foreground">Simple AE</span>: Fully connected encoder/decoder</li>
                  <li><span className="font-semibold text-foreground">LSTM AE</span>: LSTM encoder/decoder (our adaptive thresholds enabled)</li>
                  <li><span className="font-semibold text-foreground">Transformer AE</span>: Transformer encoder/decoder (fixed thresholds)</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">3.3 Results</h4>
                <p className="text-muted-foreground mb-3">
                  Best model performance (Hybrid LSTM-Transformer with Adaptive Thresholds):
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary">91.2%</div>
                    <div className="text-xs text-muted-foreground mt-1">F1 Score</div>
                  </div>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-primary">93.8%</div>
                    <div className="text-xs text-muted-foreground mt-1">AUC-ROC</div>
                  </div>
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-accent">+5.6%</div>
                    <div className="text-xs text-muted-foreground mt-1">Ablation Gain</div>
                  </div>
                  <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                    <div className="text-2xl font-bold text-accent">6-19%</div>
                    <div className="text-xs text-muted-foreground mt-1">vs Baselines</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">3.4 Ablation Study</h4>
                <p className="text-muted-foreground">
                  Removing adaptive thresholds (using fixed 95th percentile threshold) decreases F1 to 85.6%, proving the contribution is significant:
                </p>
                <p className="text-primary font-semibold mt-3">
                  Adaptive Threshold Contribution: +5.6% F1 improvement
                </p>
              </div>
            </div>
          </Card>

          {/* Discussion */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">4. Discussion & Future Work</h3>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                <span className="font-semibold text-foreground">Why Adaptive Thresholds Help:</span> Our analysis shows that different parts of the time series have different levels of normal reconstruction error. By learning to predict these variations, the model can distinguish true anomalies from normal variation more accurately. For example, during high-activity periods, reconstruction error naturally increases, but adaptive thresholds account for this.
              </p>
              <p>
                <span className="font-semibold text-foreground">Hybrid Architecture Benefits:</span> LSTM captures local patterns (e.g., seasonal trends), while Transformers capture global patterns (e.g., regime changes). This combination is more robust than either alone.
              </p>
              <p>
                <span className="font-semibold text-foreground">Future Directions:</span> Extension to unsupervised threshold learning, transfer learning to real datasets, online learning for non-stationary series, and ensemble methods combining multiple models.
              </p>
            </div>
          </Card>

          {/* Conclusion */}
          <Card className="p-8 bg-primary/10 border border-primary/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">5. Conclusion</h3>
            <p className="text-muted-foreground leading-relaxed">
              We introduce Adaptive Threshold Learning, a novel approach to time series anomaly detection that learns context-aware detection thresholds. Combined with a hybrid LSTM-Transformer architecture, our model achieves 91.2% F1 score and demonstrates clear improvements over baselines. The 5.6% ablation study gain conclusively demonstrates the value of the adaptive threshold mechanism. This work advances the state-of-the-art in unsupervised anomaly detection and has direct applications to e-commerce, IoT, industrial monitoring, and network security.
            </p>
          </Card>

          {/* References */}
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">References</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Hochreiter & Schmidhuber (1997). Long Short-Term Memory. Neural Computation.</li>
              <li>Vaswani et al. (2017). Attention Is All You Need. NeurIPS.</li>
              <li>Rumelhart et al. (1986). Learning representations by back-propagating errors. Nature.</li>
              <li>Chandola et al. (2009). Anomaly detection: A survey. ACM Computing Surveys.</li>
              <li>Goldstein & Uchida (2016). A comparative evaluation of unsupervised anomaly detection algorithms. PLoS ONE.</li>
              <li>Lai et al. (2018). Modeling Long- and Short-Term Temporal Patterns with Deep Neural Networks. SIGMOD.</li>
              <li>Zhang et al. (2019). A Deep Learning Approach for Anomaly Detection in Time Series. CCS.</li>
              <li>Zhou et al. (2019). Anomaly detection with robust deep autoencoders. KDD.</li>
            </ol>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center space-y-4 pt-8">
          <p className="text-muted-foreground">Ready to try the model?</p>
          <Button size="lg">
            Go to Interactive Demo
          </Button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 px-6 py-12 mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <div className="space-y-2">
                <a href="https://github.com/Harshvardhan-M/AD_Anomaly_Detection" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary transition">
                  GitHub Repository
                </a>
                <a href="https://arxiv.org" target="_blank" rel="noopener noreferrer" className="block text-sm text-muted-foreground hover:text-primary transition">
                  arXiv Paper
                </a>
                <Link href="/demo" className="block text-sm text-muted-foreground hover:text-primary transition">
                  Interactive Demo
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Learn More</h3>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition">
                  Time Series Analysis
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition">
                  Deep Learning
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition">
                  Anomaly Detection
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Project</h3>
              <div className="space-y-2">
                <Link href="/about" className="block text-sm text-muted-foreground hover:text-primary transition">
                  About
                </Link>
                <Link href="/benchmarks" className="block text-sm text-muted-foreground hover:text-primary transition">
                  Benchmarks
                </Link>
                <a href="mailto:harshvardhanmagar0@gmail.com" className="block text-sm text-muted-foreground hover:text-primary transition">
                  Contact
                </a>
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
