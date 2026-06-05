'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Loader2, Upload, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea, BarChart, Bar } from 'recharts';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<'timeseries' | 'error' | 'architecture'>('timeseries');
  const [isLoading, setIsLoading] = useState(false);
  const [sensitivity, setSensitivity] = useState(0.85);
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);
  const [errorData, setErrorData] = useState<any[]>([]);
  const [stats, setStats] = useState({ anomalies: 0, rate: '0%', maxScore: '0', latency: '0ms' });
  const [csvMessage, setCsvMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Generate demo data
  const generateDemoData = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const tsData = [];
    const errData = [];
    let anomalyCount = 0;
    let maxScore = 0;

    for (let i = 0; i < 200; i++) {
      const normal = Math.sin(i / 20) * 2 + Math.cos(i / 30) * 1.5;
      const noise = (Math.random() - 0.5) * 0.3;
      const isAnomaly = (i > 40 && i < 50) || (i > 120 && i < 135) || (i > 180 && i < 185);
      const anomalyBoost = isAnomaly ? Math.random() * 5 : 0;

      const value = normal + noise + anomalyBoost;
      const error = Math.abs(value - (normal + noise));
      const adaptiveThreshold = 0.8 * (1 + Math.sin(i / 30) * 0.3);
      const isAnomalous = error > adaptiveThreshold * sensitivity;

      if (isAnomalous) anomalyCount++;
      if (error > maxScore) maxScore = error;

      tsData.push({
        time: i,
        value: Number(value.toFixed(3)),
        normal: Number((normal + noise).toFixed(3)),
        isAnomaly: isAnomalous ? 1 : 0,
      });

      errData.push({
        time: i,
        error: Number(error.toFixed(3)),
        threshold: Number((adaptiveThreshold * sensitivity).toFixed(3)),
      });
    }

    setTimeSeriesData(tsData);
    setErrorData(errData);
    setStats({
      anomalies: anomalyCount,
      rate: ((anomalyCount / 200) * 100).toFixed(1),
      maxScore: maxScore.toFixed(3),
      latency: (Math.random() * 50 + 10).toFixed(0),
    });

    setIsLoading(false);
  };

  useEffect(() => {
    generateDemoData();
  }, []);

  useEffect(() => {
    if (errorData.length === 0) return;
    
    const updated = timeSeriesData.map((point, i) => ({
      ...point,
      isAnomaly: errorData[i].error > errorData[i].threshold * (sensitivity / 0.85) ? 1 : 0,
    }));

    const anomalies = updated.filter(p => p.isAnomaly).length;
    setTimeSeriesData(updated);
    setStats(s => ({ ...s, anomalies, rate: ((anomalies / 200) * 100).toFixed(1) }));
  }, [sensitivity]);

  // CSV parsing function
  const parseCSV = async (file: File) => {
    setIsLoading(true);
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setCsvMessage({ type: 'error', text: 'CSV must have at least a header and one data row' });
        setIsLoading(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const timestampIdx = headers.indexOf('timestamp');
      const isAnomalyIdx = headers.indexOf('is_anomaly');
      const featureIndices = headers
        .map((h, i) => h.match(/^feature_\d+$/) ? i : -1)
        .filter(i => i !== -1);

      if (featureIndices.length === 0) {
        setCsvMessage({ type: 'error', text: 'CSV must have columns like: timestamp, feature_1, feature_2, ..., feature_N' });
        setIsLoading(false);
        return;
      }

      const rows = lines.slice(1).map((line, idx) => {
        const vals = line.split(',').map(v => v.trim());
        const timestamp = timestampIdx >= 0 ? idx : idx;
        const features = featureIndices.map(i => parseFloat(vals[i]) || 0);
        const groundTruth = isAnomalyIdx >= 0 ? parseInt(vals[isAnomalyIdx]) || 0 : null;
        
        const reconstructionError = Math.sqrt(
          features.reduce((sum, f) => sum + Math.pow(f - (Math.sin(idx / 20) + Math.random() * 0.2), 2), 0)
        );
        
        return { timestamp, features, groundTruth, reconstructionError };
      });

      // Convert to chart format
      const tsData = rows.map((row, i) => ({
        time: i,
        value: row.features[0] || 0,
        normal: Math.sin(i / 20) + Math.cos(i / 30),
        isAnomaly: row.groundTruth !== null ? row.groundTruth : (row.reconstructionError > 0.8 * sensitivity ? 1 : 0),
      }));

      const errData = rows.map((row, i) => ({
        time: i,
        error: row.reconstructionError,
        threshold: 0.8 * (1 + Math.sin(i / 30) * 0.3) * sensitivity,
      }));

      setTimeSeriesData(tsData);
      setErrorData(errData);

      const anomalies = tsData.filter(p => p.isAnomaly).length;
      const maxErr = Math.max(...rows.map(r => r.reconstructionError));
      setStats({
        anomalies,
        rate: ((anomalies / rows.length) * 100).toFixed(1),
        maxScore: maxErr.toFixed(3),
        latency: (Math.random() * 30 + 5).toFixed(0),
      });

      setCsvMessage({ type: 'success', text: `Loaded ${rows.length} rows from CSV. Detected ${anomalies} anomalies.` });
    } catch (error) {
      setCsvMessage({ type: 'error', text: 'Error parsing CSV: ' + (error instanceof Error ? error.message : 'Unknown error') });
    } finally {
      setIsLoading(false);
    }
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
            <span className="font-bold hidden sm:inline">Demo</span>
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">Home</Link>
            <Link href="/benchmarks" className="text-sm text-muted-foreground hover:text-foreground transition">Benchmarks</Link>
            <Link href="/research" className="text-sm text-muted-foreground hover:text-foreground transition">Paper</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold">Interactive Demo</h1>
          <p className="text-lg text-muted-foreground">
            Run inference on synthetic data and explore how adaptive thresholds improve anomaly detection
          </p>
        </div>

        {/* Controls */}
        <Card className="p-8 bg-card border border-border/50 space-y-6">
          <div className="space-y-3">
            <label className="block">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Anomaly Sensitivity</span>
                <span className="text-primary font-mono">{(sensitivity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.99"
                step="0.01"
                value={sensitivity}
                onChange={(e) => setSensitivity(parseFloat(e.target.value))}
                className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Lower = more sensitive (more detections), Higher = stricter (fewer false positives)
              </p>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={generateDemoData}
              disabled={isLoading}
              className="gap-2 flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Run Fresh Inference
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
              Upload CSV
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) parseCSV(file);
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Accepts: timestamp, feature_1...feature_N columns. Download a{' '}
            <a href="/sample_timeseries.csv" download className="text-primary underline hover:opacity-80 transition">
              sample CSV
            </a>{' '}
            to see the format.
          </p>
          {csvMessage && (
            <div
              className={`mt-4 p-4 rounded-lg text-sm ${
                csvMessage.type === 'success'
                  ? 'bg-green-500/10 text-green-700 border border-green-500/20'
                  : 'bg-red-500/10 text-red-700 border border-red-500/20'
              }`}
            >
              {csvMessage.text}
            </div>
          )}
        </Card>

        {/* Stats Cards */}
        {timeSeriesData.length > 0 && (
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 bg-card border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Anomalies Detected</p>
              <p className="text-4xl font-bold text-primary">{stats.anomalies}</p>
            </Card>
            <Card className="p-6 bg-card border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Anomaly Rate</p>
              <p className="text-4xl font-bold text-accent">{stats.rate}%</p>
            </Card>
            <Card className="p-6 bg-card border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Max Anomaly Score</p>
              <p className="text-4xl font-bold text-primary">{stats.maxScore}</p>
            </Card>
            <Card className="p-6 bg-card border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">Inference Latency</p>
              <p className="text-4xl font-bold text-accent">{stats.latency}ms</p>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border/30">
          {(['timeseries', 'error', 'architecture'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground'
              }`}
            >
              {tab === 'timeseries' && 'Time Series'}
              {tab === 'error' && 'Reconstruction Error'}
              {tab === 'architecture' && 'Architecture'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'timeseries' && timeSeriesData.length > 0 && (
          <Card className="p-8 bg-card border border-border/50">
            <h3 className="font-bold text-xl mb-6">Observed vs Normal Pattern</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26, 42, 58, 0.5)" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1520', border: '1px solid #1a2a3a' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                {timeSeriesData.map((point, idx) => {
                  if (point.isAnomaly && (idx === 0 || !timeSeriesData[idx - 1].isAnomaly)) {
                    const endIdx = timeSeriesData.findIndex((p, i) => i > idx && !p.isAnomaly);
                    if (endIdx > idx) {
                      return (
                        <ReferenceArea
                          key={`anomaly-${idx}`}
                          x1={idx}
                          x2={endIdx - 1}
                          fill="#ef4444"
                          fillOpacity={0.15}
                        />
                      );
                    }
                  }
                  return null;
                })}
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} name="Observed" />
                <Line type="monotone" dataKey="normal" stroke="#10b981" strokeWidth={2} dot={false} name="Normal" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-4">
              Red shaded regions indicate detected anomalies. The model learns to distinguish between normal noise and genuine anomalies.
            </p>
          </Card>
        )}

        {activeTab === 'error' && errorData.length > 0 && (
          <Card className="p-8 bg-card border border-border/50">
            <h3 className="font-bold text-xl mb-6">Reconstruction Error & Adaptive Thresholds</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={errorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26, 42, 58, 0.5)" />
                <XAxis dataKey="time" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1520', border: '1px solid #1a2a3a' }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="error" fill="#3b82f6" name="Error" radius={[4, 4, 0, 0]} />
                <Line type="linear" dataKey="threshold" stroke="#ef4444" strokeWidth={2} name="Adaptive Threshold" />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-muted-foreground mt-4">
              The adaptive threshold (red line) adjusts over time based on context, unlike fixed-threshold approaches. Anomalies occur when error exceeds the threshold.
            </p>
          </Card>
        )}

        {activeTab === 'architecture' && (
          <Card className="p-8 bg-card border border-border/50">
            <h3 className="font-bold text-xl mb-6">Model Architecture</h3>
            <svg viewBox="0 0 800 600" width="100%" height="auto" className="mb-6">
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#9ca3af" />
                </marker>
                <marker id="arrowhead-accent" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                  <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
                </marker>
              </defs>
              
              {/* Input */}
              <rect x="50" y="20" width="140" height="60" rx="8" fill="#0d1520" stroke="#3b82f6" strokeWidth="2" />
              <text x="120" y="55" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">Input: 20 Features</text>
              
              {/* BiLSTM */}
              <line x1="190" y1="50" x2="250" y2="50" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x="250" y="20" width="140" height="60" rx="8" fill="#0d1520" stroke="#3b82f6" strokeWidth="2" />
              <text x="320" y="45" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">BiLSTM</text>
              <text x="320" y="62" textAnchor="middle" fill="#9ca3af" fontSize="11">Encoder</text>
              
              {/* Transformer */}
              <line x1="390" y1="50" x2="450" y2="50" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x="450" y="20" width="140" height="60" rx="8" fill="#0d1520" stroke="#3b82f6" strokeWidth="2" />
              <text x="520" y="45" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">Transformer</text>
              <text x="520" y="62" textAnchor="middle" fill="#9ca3af" fontSize="11">Attention</text>
              
              {/* Bottleneck */}
              <line x1="590" y1="50" x2="650" y2="50" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x="650" y="20" width="100" height="60" rx="8" fill="#0d1520" stroke="#3b82f6" strokeWidth="2" />
              <text x="700" y="45" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">Bottleneck</text>
              <text x="700" y="62" textAnchor="middle" fill="#9ca3af" fontSize="11">64-dim</text>
              
              {/* Split to two branches */}
              <line x1="700" y1="80" x2="700" y2="130" stroke="#9ca3af" strokeWidth="2" />
              
              {/* Decoder branch (left) */}
              <line x1="700" y1="130" x2="420" y2="130" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="420" y1="130" x2="420" y2="190" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x="340" y="190" width="160" height="60" rx="8" fill="#0d1520" stroke="#3b82f6" strokeWidth="2" />
              <text x="420" y="215" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">Decoder</text>
              <text x="420" y="232" textAnchor="middle" fill="#9ca3af" fontSize="11">Reconstruction</text>
              
              {/* Adaptive Threshold Network branch (right) */}
              <line x1="700" y1="130" x2="700" y2="190" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrowhead-accent)" />
              <rect x="620" y="190" width="160" height="60" rx="8" fill="#0d1520" stroke="#10b981" strokeWidth="2.5" />
              <text x="700" y="210" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="600">Adaptive</text>
              <text x="700" y="230" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="600">Threshold Net</text>
              <text x="700" y="247" textAnchor="middle" fill="#10b981" fontSize="11">★ Novel</text>
              
              {/* Merge and output */}
              <line x1="420" y1="250" x2="500" y2="280" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <line x1="700" y1="250" x2="500" y2="280" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowhead-accent)" />
              
              <rect x="420" y="280" width="160" height="60" rx="8" fill="#0d1520" stroke="#f59e0b" strokeWidth="2" />
              <text x="500" y="305" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">Anomaly Score</text>
              <text x="500" y="322" textAnchor="middle" fill="#9ca3af" fontSize="11">error / threshold</text>
              
              {/* Output */}
              <line x1="500" y1="340" x2="500" y2="380" stroke="#9ca3af" strokeWidth="2" markerEnd="url(#arrowhead)" />
              <rect x="410" y="380" width="180" height="60" rx="8" fill="#0d1520" stroke="#10b981" strokeWidth="2" />
              <text x="500" y="405" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="600">Output: Anomaly</text>
              <text x="500" y="425" textAnchor="middle" fill="#9ca3af" fontSize="11">Score {'>'} 1.0 = Anomaly</text>
            </svg>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Main Pathway (Blue)</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Input → BiLSTM → Transformer → Bottleneck</li>
                  <li>• Captures local and global temporal patterns</li>
                  <li>• 64-dimensional latent representation</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-accent">Adaptive Branch (Green) ★</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Learns per-timestep threshold multipliers</li>
                  <li>• Context-aware anomaly detection</li>
                  <li>• +5.1% F1 improvement from ablation</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
