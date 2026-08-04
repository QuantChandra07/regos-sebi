# backend/queue/worker.py
from rq import Worker, Queue
from backend.queue.redis_conn import redis_conn

listen = ["default"]

if __name__ == "__main__":
    queues = [Queue(name, connection=redis_conn) for name in listen]
    worker = Worker(queues, connection=redis_conn)
    worker.work()