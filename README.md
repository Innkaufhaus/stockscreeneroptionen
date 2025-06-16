# Stock Screener Options Tool

A modern web application for screening stocks and options, built with FastAPI and React.

## Features

- 🔍 Real-time stock screening across multiple markets (Stocks, ETFs, Indices)
- 📊 Advanced options analysis and visualization
- 👤 User authentication and subscription management
- 💾 Save and manage custom screening criteria
- 📱 Responsive design for desktop and mobile
- 🔒 Secure API endpoints with JWT authentication
- 📈 Integration with Polygon.io for market data

## Tech Stack

### Backend
- FastAPI (Python web framework)
- PostgreSQL (Database)
- SQLAlchemy (ORM)
- Pydantic (Data validation)
- JWT (Authentication)
- Polygon.io API (Market data)

### Frontend
- React with TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- React Query (Data fetching)
- React Router (Routing)
- Zustand (State management)

## Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 13+
- Docker and Docker Compose (for containerized deployment)

## Getting Started

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Innkaufhaus/stockscreeneroptionen.git
   cd stockscreeneroptionen
   ```

2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```

4. Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/stockscreener
   SECRET_KEY=your-secret-key
   POLYGON_API_KEY=your-polygon-api-key
   ```

5. Start the development servers:

   Backend:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

   Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

### Docker Setup

1. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

2. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Project Structure

```
stockscreeneroptionen/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       └── api.py
│   │   ├── core/
│   │   ├── db/
│   │   ├── models/
│   │   └── schemas/
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml
```

## API Documentation

The API documentation is available at `/docs` when running the backend server. It provides:
- Interactive API documentation
- Request/response examples
- Authentication requirements
- Schema definitions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security

- All API endpoints are protected with JWT authentication
- Passwords are hashed using bcrypt
- CORS is configured for security
- Environment variables are used for sensitive data

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- [Polygon.io](https://polygon.io/) for market data
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling 