# 🚀 AI Patent Drafting System

## 📌 Overview

The AI Patent Drafting System is an intelligent application that converts a user's technical innovation into a complete patent application. It automates the complex process of patent writing by using AI to analyze ideas, generate claims, and structure a formal patent document.

---

## 🎯 Problem Statement

Design an AI that creates patent applications from technical innovations by analyzing the idea, performing prior art search, generating patent claims, and producing a complete patent document with proper legal formatting.

---

## 💡 Solution

This system takes an invention idea as input and performs:

* Innovation analysis (problem, solution, features)
* Prior art comparison (simulated)
* Novelty detection
* Patent claims generation
* Full patent document creation

---

## 🧠 Features

* 🔍 Idea Analysis
* 📊 Prior Art Simulation
* ⚖️ Novelty Detection
* 📄 Patent Claims Generation
* 📝 Full Patent Document Generation
* 📐 Technical Diagram Description

---

## 🏗️ Tech Stack

* **Frontend:** Streamlit
* **Backend:** FastAPI (Python)
* **AI Model:** Google Gemini (via Google AI Studio)
* **Language:** Python

---

## 📂 Project Structure

```
patent-ai/
│── backend/
│   ├── main.py
│   ├── analyzer.py
│   ├── prior_art.py
│   ├── claims.py
│   ├── patent_generator.py
│
│── frontend/
│   ├── app.py
│
│── requirements.txt
│── README.md
```

---

## ⚙️ How It Works

1. User enters an invention idea
2. AI analyzes the idea and extracts key components
3. System performs prior art comparison
4. AI generates patent claims
5. Full patent document is created

---

## ▶️ Installation & Setup

### 1. Clone the Repository

```
git clone <your-repo-link>
cd patent-ai
```

### 2. Install Dependencies

```
pip install -r requirements.txt
```

### 3. Run Backend (FastAPI)

```
uvicorn main:app --reload
```

### 4. Run Frontend (Streamlit)

```
streamlit run app.py
```

---

## 🧪 Example Input

"Smart helmet that detects accidents and sends alerts using sensors and GPS"

---

## 📄 Output

* Innovation Breakdown
* Novelty Analysis
* Patent Claims
* Complete Patent Document

---

## 🚀 Future Enhancements

* Real-time patent database integration
* PDF export feature
* Advanced diagram generation
* User authentication system

---

## 🏆 Conclusion

This project simplifies patent drafting using AI by converting ideas into structured patent documents, reducing time, effort, and complexity.

---

## 👨‍💻 Author

Kanishka G
