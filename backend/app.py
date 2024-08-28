from flask import Flask, request, send_file
from flask_cors import CORS
import io
import torch
import logging
import sys
import os
from concurrent.futures import ThreadPoolExecutor

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://your-domain.com", "https://api.your-domain.com"]}})

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if torch.cuda.is_available():
    device = torch.device("cuda")
    logger.info(f"CUDA is available. Using GPU: {torch.cuda.get_device_name(0)}")
    logger.info(f"CUDA version: {torch.version.cuda}")
    logger.info(f"PyTorch CUDA version: {torch.version.cuda}")
    logger.info(f"Number of GPUs: {torch.cuda.device_count()}")
else:
    device = torch.device("cpu")
    logger.info("CUDA is not available. Using CPU.")

# Determine the number of workers based on available CPU cores
num_workers = os.cpu_count() or 1
logger.info(f"Number of workers: {num_workers}")

# Create a thread pool for parallel processing
executor = ThreadPoolExecutor(max_workers=num_workers)

@app.before_request
def log_request_info():
    app.logger.info('Headers: %s', request.headers)
    app.logger.info('Body: %s', request.get_data())

@app.route('/', methods=['GET'])
def health_check():
    return 'OK', 200

@app.route('/', methods=['POST'])
def process_request():
    try:
        # TODO: Add your custom model and processing logic here
        # This is where you would handle file uploads, process them, and return results
        
        return 'Processing successful', 200
    
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return 'Error processing request', 500

app.debug = False

def run_dev_server():
    app.run(host='0.0.0.0', debug=True, port=5000)

def run_gunicorn_server(workers=4):
    import gunicorn.app.base

    class StandaloneApplication(gunicorn.app.base.BaseApplication):
        def __init__(self, app, options=None):
            self.options = options or {}
            self.application = app
            super().__init__()

        def load_config(self):
            for key, value in self.options.items():
                if key in self.cfg.settings and value is not None:
                    self.cfg.set(key.lower(), value)

        def load(self):
            return self.application

    options = {
        'bind': '0.0.0.0:5000',
        'workers': workers,
        'worker_class': 'gevent'
    }
    StandaloneApplication(app, options).run()

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Run the Flask app')
    parser.add_argument('--mode', choices=['dev', 'local', 'production'], default='dev',
                        help='Run mode: dev (default), local (Gunicorn), or production')
    args = parser.parse_args()

    if sys.platform.startswith('win'):
        # On Windows, always use the development server
        logger.info("Running on Windows. Using development server.")
        run_dev_server()
    else:
        if args.mode == 'dev':
            run_dev_server()
        elif args.mode in ['local', 'production']:
            workers = 4 if args.mode == 'local' else os.cpu_count() * 2 + 1
            run_gunicorn_server(workers)