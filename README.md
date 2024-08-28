# ai-app-template

A template for building AI apps. Flask & Gunicorn backend with a Nextjs frontend.

## Getting Started

### Clone the repository

```bash
git clone https://github.com/chalabi2/ai-app-template.git
```

---

### Frontend

Nextjs app with shadcn/ui, queries the backend for image processing.

#### Dependencies

- Node.js
- npm

#### Development

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

#### Deployment

## The frontend is deployed to vercel. Be sure to add the environment variables to the vercel project and double check your auth sources redirects are set correctly.

### Backend

Flask app with a pipeline from Huggingface.

#### Dependencies

- Python
- pip

#### Development

```bash
cd backend
python -m venv venv
venv\Scripts\activate ## or on mac source venv/bin/activate
pip install -qr https://huggingface.co/briaai/RMBG-1.4/resolve/main/requirements.txt
pip install -r requirements.txt
flask run
```

#### Deployment

We containerize the python server with docker and use Traefik to reverse proxy the Akash deployment to our domain. Within the [backend](./backend) directory you will find a `deploy.yml` file for deploying the container to akash. Be sure to change the image to your own docker hub account. The dockerfile and various other deployment related files can be found in the [backend](./backend) as well.

---
