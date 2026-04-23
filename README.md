# 🧠 Intelligence Query Engine API

A backend service built for **Insighta Labs** using **Express.js** that enables advanced querying of demographic profile data through filtering, sorting, pagination, and natural language input.

---

## 🚀 Live API

**Base URL:**  
https://hng14-task2-taupe.vercel.app/

---

## 🛠️ Tech Stack

- Node.js
- Express.js
- Database (PostgreSQL / MySQL / etc.)
- ORM / Query Builder (optional)

---

## 📌 Overview

This API transforms a static dataset into a powerful query engine. It allows clients (marketing teams, analysts, product teams) to:

- Filter profiles using multiple conditions
- Sort results dynamically
- Paginate large datasets efficiently
- Query data using plain English

---

## 🗃️ Database Schema

The `profiles` table follows this exact structure:

| Field               | Type       | Description                       |
| ------------------- | ---------- | --------------------------------- |
| id                  | UUID v7    | Primary key                       |
| name                | VARCHAR    | Unique full name                  |
| gender              | VARCHAR    | male / female                     |
| gender_probability  | FLOAT      | Confidence score                  |
| age                 | INT        | Exact age                         |
| age_group           | VARCHAR    | child / teenager / adult / senior |
| country_id          | VARCHAR(2) | ISO country code                  |
| country_name        | VARCHAR    | Full country name                 |
| country_probability | FLOAT      | Confidence score                  |
| created_at          | TIMESTAMP  | UTC ISO 8601                      |

---

## 🌱 Data Seeding

- Seeded with **2026 profiles**
- Idempotent seeding (no duplicates)
- Duplicate prevention:
  - Unique constraint on `name`
  - Upsert / ignore on conflict logic

---

## 📡 API Endpoints

### 1️⃣ Get All Profiles

- Get /api/profiles

#### 🔍 Query Parameters

**Filters (combinable):**

- `gender`
- `age_group`
- `country_id`
- `min_age`, `max_age`
- `min_gender_probability`
- `min_country_probability`

**Sorting:**

- `sort_by` → `age | created_at | gender_probability`
- `order` → `asc | desc`

**Pagination:**

- `page` (default: 1)
- `limit` (default: 10, max: 50)

#### ✅ Example

- /api/profiles?gender=male&country_id=NG&min_age=25&sort_by=age&order=desc&page=1&limit=10

---

### 2️⃣ Natural Language Search (Core Feature)

- GET /api/profiles/search?q=<query>

#### 🧠 Example

- /api/profiles/search?q=young males from nigeria

---

## 🧠 Natural Language Parsing Approach

This API uses a **rule-based parser** (no AI or LLMs) to convert plain English queries into structured filters.

---

### 🔑 Supported Keywords & Mapping

#### Gender

| Keyword         | Output        |
| --------------- | ------------- |
| male, males     | gender=male   |
| female, females | gender=female |

---

#### Age Rules

| Phrase  | Mapping                |
| ------- | ---------------------- |
| young   | min_age=16, max_age=24 |
| above X | min_age=X              |
| below X | max_age=X              |
| under X | max_age=X              |
| over X  | min_age=X              |

---

#### Age Groups

| Keyword  | Mapping            |
| -------- | ------------------ |
| child    | age_group=child    |
| teenager | age_group=teenager |
| adult    | age_group=adult    |
| senior   | age_group=senior   |

---

#### Country Mapping

- Matches `country_name` (case-insensitive)
- Converts to ISO `country_id`

**Examples:**

- "nigeria" → country_id=NG
- "kenya" → country_id=KE

---

## ⚙️ Parsing Logic

1. Normalize query (lowercase, remove punctuation)
2. Tokenize input
3. Extract:
   - Gender
   - Age conditions
   - Age group
   - Country
4. Combine filters using **AND logic**
5. If no valid filters → return error

---

## 🧪 Example Query Mappings

| Query                              | Result                                      |
| ---------------------------------- | ------------------------------------------- |
| young males                        | gender=male, min_age=16, max_age=24         |
| females above 30                   | gender=female, min_age=30                   |
| people from angola                 | country_id=AO                               |
| adult males from kenya             | gender=male, age_group=adult, country_id=KE |
| male and female teenagers above 17 | age_group=teenager, min_age=17              |

---

## ⚠️ Limitations

### ❌ Not Supported

- Complex logical expressions (OR conditions)
- Synonyms (e.g. “guys”, “ladies”)
- Misspellings
- Multiple countries in one query
- Implicit meanings (e.g. “older people”)
- Comparative phrases (e.g. “younger than average”)

---

### ⚠️ Edge Cases

- Conflicting filters may return empty results
- Unknown queries return:

```json
{
  "status": "error",
  "message": "Unable to interpret query"
}

❌ Error Handling

| Status Code | Description                |
| ----------- | -------------------------- |
| 400         | Missing or empty parameter |
| 422         | Invalid parameter type     |
| 404         | Not found                  |
| 500 / 502   | Server error               |

{
  "status": "error",
  "message": "<error message>"
}

## 🛠️ Setup & Installation

# Clone the repository
git clone https://github.com/your-username/your-repo.git

# Navigate into the project
cd your-repo

# Install dependencies
npm install

# Run migrations (if applicable)
npm run migrate


# Start development server
npm run dev
```
