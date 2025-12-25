
FROM python:3.11-slim

WORKDIR /app
COPY app.py requirements.txt ./
COPY readme.txt ./
RUN pip install -r requirements.txt

CMD ["python", "main.py"] 
