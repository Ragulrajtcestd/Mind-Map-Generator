# Mind Map Generator

An AI-powered application that converts **Tamil or English text** into clear and structured **mind maps**.  
Designed to help students learn, revise, and understand concepts faster.

## What this app does

- Converts paragraphs into **mind maps**
- Supports **Tamil & English**
- Uses AI to extract key concepts
- Saves generated mind maps
- Works on **Web & Android (APK)**

## Built With

- **Frontend:** React, TypeScript, Vite
- **Backend:** Flask (Python)
- **AI:** OpenRouter (LLaMA-based model)
- **Auth & DB:** Supabase
- **Mobile:** Capacitor (Android)

## How it works

1. User enters a paragraph
2. AI extracts important keywords
3. Keywords are shown as a **mind map**
4. User can save and revisit mind maps

## Backend API

- `GET /health` → Check server status
- `POST /extract_keywords` → Generate mind map

## Authentication

- Email & password login
- Secure user sessions using Supabase

## Deployment

- Backend hosted on **Render**
- Mobile app distributed as **APK**
- Internet connection required

Built for learning and exploration.
