from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import logging
import sys
import os
import time
from concurrent.futures import ThreadPoolExecutor
from transformers import AutoTokenizer, AutoModelForCausalLM, logging as transformers_logging
import sqlite3
from huggingface_hub import login
from functools import lru_cache
import warnings

#TODO: ai history
# Suppress warnings and set transformers logging to ERROR level
warnings.filterwarnings("ignore")
transformers_logging.set_verbosity_error()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["https://your-domain.com", "https://api.your-domain.com"]}})

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for model and tokenizer
global_tokenizer = None
global_model = None

# Determine the device
if torch.cuda.is_available():
    device = torch.device("cuda")
    logger.info(f"CUDA is available. Using GPU: {torch.cuda.get_device_name(0)}")
elif torch.backends.mps.is_available():
    device = torch.device("mps")
    logger.info("Using M-series GPU cores via Metal")
else:
    device = torch.device("cpu")
    logger.info("Using CPU.")

# Determine the number of workers based on available CPU cores
num_workers = os.cpu_count() or 1
logger.info(f"Number of workers: {num_workers}")

# Create a thread pool for parallel processing
executor = ThreadPoolExecutor(max_workers=num_workers)

# Lazy loading for the model and tokenizer
@lru_cache(maxsize=None)
def get_model_and_tokenizer():
    global global_tokenizer, global_model
    if global_tokenizer is None or global_model is None:
        huggingface_token = os.environ.get('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')
        if huggingface_token:
            login(token=huggingface_token)
        else:
            logger.warning("HUGGINGFACE_TOKEN not set. You may encounter issues accessing the model.")

        model_id = "meta-llama/Meta-Llama-3.1-8B-Instruct"
        global_tokenizer = AutoTokenizer.from_pretrained(model_id)
        global_model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype=torch.float16, device_map="auto")
        
        # Set the pad_token to the eos_token
        global_tokenizer.pad_token = global_tokenizer.eos_token
        global_model.config.pad_token_id = global_model.config.eos_token_id
    
    return global_tokenizer, global_model

# Initialize SQLite database for conversation history
def init_db():
    conn = sqlite3.connect('conversations.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS conversations
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                  conversation_id TEXT,
                  role TEXT,
                  content TEXT,
                  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

init_db()

@app.before_request
def log_request_info():
    app.logger.info('Headers: %s', request.headers)
    app.logger.info('Body: %s', request.get_data())

@app.route('/', methods=['GET'])
def health_check():
    return 'OK', 200

@app.route('/chat', methods=['POST'])
def chat():
    start_time = time.time()
    try:
        data = request.json
        conversation_id = data.get('conversation_id')
        user_message = data.get('message')

        logger.info(f"Received request for conversation_id: {conversation_id}")
        logger.info(f"User message: {user_message}")

        if not conversation_id or not user_message:
            return jsonify({'error': 'Missing conversation_id or message'}), 400

        tokenizer, model = get_model_and_tokenizer()

        # Prepare prompt for the model
        prompt = "You are a helpful AI assistant. Respond to the user's message with a single, brief, and clear answer. Do not include any additional questions or user messages in your response.\n\n"
        prompt += f"User: {user_message}\nAssistant:"

        logger.info(f"Prepared prompt: {prompt}")

        # Generate response using the model
        inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=512).to(device)
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=50,
                do_sample=True,
                temperature=0.7,
                top_p=0.95,
                no_repeat_ngram_size=3,
                num_return_sequences=1,
                eos_token_id=tokenizer.eos_token_id,
                pad_token_id=tokenizer.pad_token_id,
            )

        full_response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        logger.info(f"Full model response: {full_response}")
        
        # Extract only the assistant's response, stopping at any "User:" or newline
        ai_response = full_response.split('Assistant:')[-1].split('User:')[0].split('\n')[0].strip()
        
        logger.info(f"Extracted AI response: {ai_response}")

        # Store the new messages in the database
        conn = sqlite3.connect('conversations.db')
        c = conn.cursor()
        c.execute("INSERT INTO conversations (conversation_id, role, content) VALUES (?, ?, ?)",
                  (conversation_id, "user", user_message))
        c.execute("INSERT INTO conversations (conversation_id, role, content) VALUES (?, ?, ?)",
                  (conversation_id, "assistant", ai_response))
        conn.commit()
        conn.close()

        return jsonify({
            'response': ai_response,
            'conversation_id': conversation_id
        })

    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        return jsonify({'error': 'Error processing chat request'}), 500
    finally:
        logger.info(f"Total request time: {time.time() - start_time:.2f} seconds")

@app.route('/conversation/<conversation_id>', methods=['GET'])
def get_conversation(conversation_id):
    try:
        conn = sqlite3.connect('conversations.db')
        c = conn.cursor()
        c.execute("SELECT role, content FROM conversations WHERE conversation_id = ? ORDER BY timestamp", (conversation_id,))
        history = c.fetchall()
        conn.close()

        return jsonify({
            'conversation_id': conversation_id,
            'messages': [{'role': role, 'content': content} for role, content in history]
        })

    except Exception as e:
        logger.error(f"Error retrieving conversation: {str(e)}")
        return jsonify({'error': 'Error retrieving conversation'}), 500

@app.route('/clear_conversation/<conversation_id>', methods=['POST'])
def clear_conversation(conversation_id):
    try:
        conn = sqlite3.connect('conversations.db')
        c = conn.cursor()
        c.execute("DELETE FROM conversations WHERE conversation_id = ?", (conversation_id,))
        conn.commit()
        conn.close()
        return jsonify({'message': f'Conversation {conversation_id} cleared successfully'}), 200
    except Exception as e:
        logger.error(f"Error clearing conversation: {str(e)}")
        return jsonify({'error': 'Error clearing conversation'}), 500

app.debug = False

def run_dev_server():
    app.run(host='0.0.0.0', debug=True, port=6000)

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
        'bind': '0.0.0.0:6000',
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