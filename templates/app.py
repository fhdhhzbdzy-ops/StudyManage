from flask import Flask, render_template, request, redirect
import json
import os

app = Flask(__name__)

TASK_FILE = "tasks.json"


# ==================== ĐỌC NHIỆM VỤ ====================

def load_tasks():
    if not os.path.exists(TASK_FILE):
        return []

    try:
        with open(TASK_FILE, "r", encoding="utf-8") as file:
            tasks = json.load(file)

        # Bổ sung trạng thái cho nhiệm vụ cũ
        for task in tasks:
            if "completed" not in task:
                task["completed"] = False

        return tasks

    except (json.JSONDecodeError, FileNotFoundError):
        return []


# ==================== LƯU NHIỆM VỤ ====================

def save_tasks(tasks):
    with open(TASK_FILE, "w", encoding="utf-8") as file:
        json.dump(
            tasks,
            file,
            ensure_ascii=False,
            indent=4
        )


# ==================== TRANG CHÍNH ====================

@app.route("/")
def home():
    tasks = load_tasks()

    return render_template(
        "index.html",
        tasks=tasks
    )


# ==================== THÊM NHIỆM VỤ ====================

@app.route("/add_task", methods=["POST"])
def add_task():

    task_name = request.form.get("task")
    subject = request.form.get("subject")
    due_date = request.form.get("due_date")

    if task_name:

        tasks = load_tasks()

        tasks.append({
            "name": task_name,
            "subject": subject,
            "due_date": due_date,
            "completed": False
        })

        save_tasks(tasks)

    return redirect("/")


# ==================== XEM BÀI TẬP ====================

@app.route("/assignments")
def assignments():

    tasks = load_tasks()

    return render_template(
        "assignments.html",
        tasks=tasks
    )


# ==================== HOÀN THÀNH NHIỆM VỤ ====================

@app.route("/complete_task/<int:task_id>")
def complete_task(task_id):

    tasks = load_tasks()

    if 0 <= task_id < len(tasks):

        tasks[task_id]["completed"] = not tasks[task_id]["completed"]

        save_tasks(tasks)

    return redirect("/")


# ==================== XÓA NHIỆM VỤ ====================

@app.route("/delete_task/<int:task_id>")
def delete_task(task_id):

    tasks = load_tasks()

    if 0 <= task_id < len(tasks):

        tasks.pop(task_id)

        save_tasks(tasks)

    return redirect("/")


# ==================== THOÁT ====================

@app.route("/exit")
def exit_app():

    return """
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <title>Study Manage</title>
    </head>

    <body style="
        font-family: Arial;
        text-align: center;
        padding-top: 100px;
    ">

        <h1>👋 Đã thoát Study Manage</h1>

        <p>Bạn có thể đóng tab này.</p>

        <br>

        <a href="/">
            Quay lại Study Manage
        </a>

    </body>
    </html>
    """
# ==================== CHẠY ỨNG DỤNG ====================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
