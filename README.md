# Trello Clone – Frontend Assignment

A simplified Trello-like board application built as a frontend technical assignment.  
The focus of this project is clean architecture, correct functionality, and readable code.

---

## ✨ Features

- Single predefined board with editable title
- Create, edit, delete, and reorder lists
- Create, edit, and move cards between lists
- Drag & drop support for both lists and cards
- Card comments managed through a dedicated modal
- Client-side data persistence using localStorage
- Responsive layout for desktop and basic mobile usage

---

## 🧱 Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **SCSS** (variables, mixins, partials – no Tailwind)
- **Zustand** for state management
- **@dnd-kit** for drag & drop
- **localStorage** for persistence

---

## 📂 Project Structure

```text
src/
  app/            # Next.js app router
  components/     # Reusable UI components
  store/          # Global state (Zustand)
  hooks/          # Custom hooks
  styles/         # SCSS globals, variables, mixins
  types/          # Shared TypeScript types

---

## ⚙️ Getting Started

Install dependencies :

npm install
^.^
Run the development server :

npm run dev

---

## 🗃️ Data Management

- All data is handled entirely on the client side
- No backend or external APIs are used
- Board state is persisted in localStorage
- State is centralized to keep UI components simple and focused

---

## 🧠 Architectural Notes

- Clear separation between UI and business logic
- Centralized state as a single source of truth
- Strong TypeScript typing for board, lists, cards, and comments
- Drag & drop logic kept independent from presentation
- Code structure designed to remain maintainable and extensible

---

## 🎯 Scope & Intent

This project intentionally prioritizes:

- Correct behavior over visual polish
- Clean, readable code over complex abstractions
- Practical architectural decisions over over-engineering
- Advanced animations, backend integration, and authentication are intentionally out of scope.

---

 ## 👤 Author

Developed by NEEMA ARIMI (K-C-G)
```
