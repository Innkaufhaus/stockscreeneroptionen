# Stock Screener POC

A proof of concept for a stock screening application powered by Polygon.io data.

## Project Structure

```
stock-screener/
├── backend/           # FastAPI backend
├── frontend/         # React frontend
└── docker/           # Docker configuration
```

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- Docker
- Polygon.io API key

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Polygon.io API key
   ```

5. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Development

### Backend API Documentation
Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Environment Variables
Required environment variables:
- `POLYGON_API_KEY`: Your Polygon.io API key
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: For JWT token generation
- `ENVIRONMENT`: development/production

## Deployment
This POC is configured for deployment on Render.com.

### Render.com Services
1. Web Service (Backend)
2. PostgreSQL Database
3. Static Site (Frontend)

## License
MIT 