# 📄 Interview Report Generator

A modern, fast, and intuitive web platform designed to streamline the generation of structured Interview Report documents. Built with **Next.js**, **React Hook Form**, and **Tailwind CSS**, it replaces manual Word document editing with a beautiful step-by-step wizard, ensuring consistency, minimizing human error, and generating perfectly formatted `.docx` reports.

---

## ✨ Features

- **Intuitive Multi-Step Wizard:** Breaks down complex interview forms into manageable, logical steps (Context, Candidate Info, Qualifications, Competencies, Recommendation).
- **Smart Formatting:** The generated `.docx` report perfectly matches the required corporate template structure.
- **Dynamic Ratings Grid:** Effortlessly select competency ratings (L, A, G, VG, O) which are automatically mapped to precise checkmarks (`X`) in the final document.
- **Digital Signatures:** Integrated drawing canvas allowing interviewers to physically sign the report before generation.
- **Stylized Outputs:** Injected data is beautifully highlighted in **bold, blue, and centered** text within the Word document for easy review.
- **Local SQLite Database:** Automatically persists interview records using Prisma for auditing and tracking.

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Shadcn UI
- **State Management:** React Hook Form, Zod validation
- **Backend API:** Next.js Route Handlers
- **Document Generation:** `docxtemplater`, `docx-templates`, Python (`python-docx`) for smart template AST parsing
- **Database:** Prisma ORM with SQLite

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.x) for template parsing

### 1. Installation

Clone the repository and install dependencies inside the `platform` folder:

```bash
git clone https://github.com/msoms-ai/InterviewReportGenerator.git
cd InterviewReportGenerator/platform
npm install
```

### 2. Database Setup

Initialize the SQLite database using Prisma:

```bash
npx prisma generate
npx prisma db push
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Project Structure

- `/platform` - Contains the Next.js application.
  - `/src/components/Wizard.tsx` - The core multi-step form logic.
  - `/src/components/steps/` - Individual UI steps for the wizard.
  - `/src/app/api/generate/route.ts` - Backend endpoint that compiles the form data into the Word document.
  - `/public/template.docx` - The compiled AST-ready Word template.
- `/prepare_template_smart.py` - Custom Python script used to inject advanced styling and layout anchors into the raw `.docx` template without corrupting the XML.
- `Updated Interview Report Form.docx` - The original reference document.

---

## 🎨 Modifying the Template

If you need to update the base Word document:
1. Edit the original `Updated Interview Report Form.docx` file.
2. Run the smart parser script:
   ```bash
   cd platform
   python prepare_template_smart.py
   ```
3. This script will safely rewrite the file into `public/template.docx` with properly nested `+++` variables, stripped empty paragraphs, and applied formatting.

---

## 🤝 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
