# 🧪 AI-Powered Test Case Generator

A web app that generates **positive and negative test cases** from a natural language functionality description using the **Hugging Face Transformers API**.

Built with **Next.js 14** and **Tailwind CSS**, it helps developers and QA engineers save time by generating structured test cases and exporting them as CSV.

---

## ✨ Features

* 🧠 Generate AI-based test cases using a natural prompt
* ✅ Positive and ❌ Negative test case options
* 🔢 Adjustable test case count
* 📋 Structured output with `id`, `type`, `case`, `expected`
* 💾 Export all test cases to CSV
* 🖼️ Clean and responsive UI

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/test-case-generator.git
cd test-case-generator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Hugging Face Token

Create a `.env.local` file and add your Hugging Face API key:

```
HF_TOKEN=your_hugging_face_api_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🧪 Test Case Format

The generated output is structured as:

```json
[
  {
    "id": "TC0001",
    "type": "Positive",
    "case": "valid test case for input",
    "expected": "Login successful"
  },
  {
    "id": "TC0002",
    "type": "Negative",
    "case": "invalid test case for input",
    "expected": "Display 'invalid credentials' error"
  }
]
```

---

## 📁 Project Structure

```
/pages
  └── api
      └── generate   
              └──route.js # API route for test case generation
/app
  └── page.js           # UI component for input/output
```

---

## 📦 Built With

* [Next.js 15](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Hugging Face Transformers](https://huggingface.co/)

---

## 🛠️ How It Works

1. User enters a functionality description
2. Chooses the number of test cases and types (positive/negative)
3. App calls Hugging Face's LLM to generate cases
4. Results are displayed in a structured format
5. User can export test cases as a CSV file

---

## 📃 License

MIT License. Feel free to use and modify.

---

## 👨‍💻 Author

Made with ❤️ by LahiruZam
