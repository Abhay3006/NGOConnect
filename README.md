# NGOConnect

NGOConnect is a full-stack web application that connects users with NGO-related services through a centralized platform for **donations, complaints, volunteer requests, and administrative analytics**.

## Features

### User Features
- User registration and login
- JWT-based authentication
- Submit complaints with optional image attachments
- View submitted complaints
- Submit donation details
- Razorpay payment/order integration
- Submit volunteer requests
- View submitted volunteer requests
- Responsive interface with light/dark theme support

### Admin Features
- Admin authentication
- View all complaints
- Update complaint status
- Delete complaints
- View all donations
- Update donation status
- Delete donations
- View and manage volunteer requests
- Update volunteer request status
- Delete volunteer requests
- View application analytics

## Tech Stack

### Frontend
- React.js
- JavaScript
- React Router
- Axios
- Chart.js
- react-chartjs-2
- Lucide React
- HTML5
- CSS3

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT authentication
- Passlib / bcrypt
- Python-Jose
- Python Multipart
- Razorpay API

### Database
- SQLite for local development
- PostgreSQL-compatible `DATABASE_URL` configuration for deployment

## Project Structure

```text
NGOConnect/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── utils/
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── package.json
│   └── .env.example
├── .gitignore
├── LICENSE
└── README.md
```

## Local Setup

### Prerequisites

- Python 3.10+
- Node.js and npm
- Git

### Backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env`:

```env
DATABASE_URL=sqlite:///./cleancall.db
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
JWT_SECRET_KEY=your_jwt_secret
```

Start the backend:

```powershell
uvicorn main:app --reload
```

API:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```powershell
cd frontend
npm install
```

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://127.0.0.1:8000
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

Start the frontend:

```powershell
npm start
```

The frontend will normally be available at:

```text
http://localhost:3000
```

## Environment Variables

### Backend

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Database connection string |
| `RAZORPAY_KEY_ID` | Razorpay API key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret |
| `JWT_SECRET_KEY` | Secret used to sign JWT tokens |

### Frontend

| Variable | Purpose |
|---|---|
| `REACT_APP_API_URL` | Local/deployed backend URL |
| `REACT_APP_RAZORPAY_KEY_ID` | Razorpay public key ID |

**Never put `RAZORPAY_KEY_SECRET` in the frontend.**

## Production Build

```powershell
cd frontend
npm run build
```

The generated `build/` directory is excluded from Git.

## API Overview

The backend provides functionality through:

- `/auth`
- `/complaints`
- `/donations`
- `/volunteers`
- `/analytics`

## Authentication

NGOConnect uses JWT-based authentication. Authenticated requests send:

```text
Authorization: Bearer <token>
```

Administrative endpoints verify the authenticated user's role before allowing protected operations.

## Donations

Donation functionality integrates Razorpay for payment order creation. Razorpay credentials should be configured through environment variables.

## File Uploads

Complaint images are stored under:

```text
backend/uploads/complaints/
```

Uploaded files are excluded from Git. Production deployments should use persistent/object storage when the hosting platform does not provide persistent local storage.

## Security Notes

- Environment files are excluded from version control.
- Database files are excluded from version control.
- Virtual environments are excluded from version control.
- Frontend dependencies and production builds are excluded from version control.
- Uploaded files are excluded from version control.
- Production deployments should use strong, unique JWT secrets.
- Production CORS should be restricted to trusted frontend origins.
- Default administrative credentials should be changed before production use.

## License

NGOConnect is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

**Abhayrajsingh Bopche**
