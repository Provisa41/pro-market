FROM python:3.12-slim
WORKDIR /app
COPY bot/requirements.txt bot/
RUN pip install --no-cache-dir -r bot/requirements.txt
COPY bot/ bot/
WORKDIR /app/bot
EXPOSE 8080
CMD ["python", "main.py"]
