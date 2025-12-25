from flask import Flask, request
import os, redis

app = Flask(__name__)
r = redis.Redis(host=os.getenv("REDIS_HOST", "localhost"), port=6379)

@app.route("/")
def index():
    return "Hello from vulnerable service"

@app.route("/ping")
def ping():
    return os.popen("ping -c 1 127.0.0.1").read()

@app.route("/eval")
def unsafe():
    cmd = request.args.get("cmd")
    return os.popen(cmd).read()  # RCE here

@app.route("/flag")
def flag():
    token = request.args.get("token")
    if token == r.get("auth_token"):
        with open("/flag.txt") as f:
            return f.read()
    return "Access denied"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000
