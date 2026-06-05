# Adaptive Threshold Hybrid LSTM-Transformer — Anomaly Detection

**An interactive research web platform showcasing a novel hybrid LSTM-Transformer architecture with adaptive thresholds for multivariate time series anomaly detection in logistics networks.**

![Status](https://img.shields.io/badge/Status-Live-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)

---

## 📊 Model Performance

| Metric | Value |
|--------|-------|
| **F1 Score** | 0.90 (20% better than LSTM baseline) |
| **Precision** | 0.91 |
| **Recall** | 0.89 |
| **AUC-ROC** | 0.95 |
| **Inference Latency** | 3.2 ms/sample |
| **Model Size** | 2.3 MB |
| **Training Time** | 250 seconds on RTX 3090 |

---

## 🎯 Key Features

- **Hybrid LSTM-Transformer**: Combines sequential modeling (LSTM) with long-range dependencies (Transformer)
- **Adaptive Threshold Mechanism**: Learned per-sample decision thresholds (+5.6% F1 improvement)
- **Interactive Demo**: Upload CSV data and visualize anomaly detection in real time
- **Benchmark Comparisons**: Side-by-side evaluation against LSTM, Transformer, and classical baselines
- **Research Paper**: Full methodology available to read and download

---

## 📁 Project Structure

```
anomaly-detection/
├── app/
│   ├── page.tsx               # Home / landing page
│   ├── demo/page.tsx          # Interactive anomaly detection demo
│   ├── benchmarks/page.tsx    # Model comparison & ablation study
│   ├── research/page.tsx      # Research paper viewer + PDF download
│   ├── about/page.tsx         # About the project
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
│
├── components/
│   ├── theme-provider.tsx     # Dark/light theme
│   └── ui/                    # shadcn/ui component library
│
├── public/
│   └── research_paper_AD_Anomaly_Detection.pdf   # Downloadable research paper
│
├── lib/utils.ts               # Utility functions
├── package.json               # Dependencies
├── next.config.mjs            # Next.js config
├── tailwind.config / postcss  # Styling config
└── tsconfig.json              # TypeScript config
```

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/your-username/anomaly-detection
cd anomaly-detection

# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repo
3. Vercel auto-detects Next.js — no configuration needed
4. Click **Deploy**

---

## 📈 Benchmark Results

```
F1 Score Ranking:
1. HybridLSTMTransformer (Adaptive): 0.90 ⭐
2. TransformerAutoencoder:           0.82
3. LSTMAutoencoder:                  0.79
4. SimpleAutoencoder:                0.72
5. IsolationForest:                  0.70
```

```
Ablation Study — F1 impact if component removed:
- Adaptive Threshold:   -5.6% (0.90 → 0.85)
- Transformer Branch:   -6.7% (0.90 → 0.84)
- LSTM Branch:          -8.9% (0.90 → 0.82)
- Entire Hybrid Design: -20.0% (0.90 → 0.72)
```

---

## 📧 Contact

- **Email**: harshvardhanmagar0@gmail.com
- **GitHub Issues**: Report bugs or request features

---

## 📊 Citation

```bibtex
@article{magar2026hybrid,
  title={Adaptive Threshold Hybrid LSTM-Transformer for Multivariate Time Series Anomaly Detection in Logistics Networks},
  author={Harshvardhan Santosh Magar},
  year={2026}
}
```

---

**Last Updated**: June 2026 | **Version**: 1.0.0
